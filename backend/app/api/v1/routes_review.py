from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from backend.app.schemas.cases import CaseDetailOut 

from backend.app.db import db_session
from backend.app.repositories.case_repo import get_case
from backend.app.repositories.review_repo import (
    get_or_create_review,
    set_status,
    set_final_decision,
    add_note,
    list_notes,
)
from backend.app.schemas.review import (
    SetStatusIn,
    FinalDecisionIn,
    AddNoteIn,
    CaseReviewOut,
    CaseNoteOut,
    CaseTimelineOut,
)

router = APIRouter(tags=["cases-review"])


def _to_review_out(obj) -> CaseReviewOut:
    
    if hasattr(CaseReviewOut, "model_validate"):
        return CaseReviewOut.model_validate(obj, from_attributes=True)
    
    return CaseReviewOut.from_orm(obj)


def _to_note_out(obj) -> CaseNoteOut:
    if hasattr(CaseNoteOut, "model_validate"):
        return CaseNoteOut.model_validate(obj, from_attributes=True)
    return CaseNoteOut.from_orm(obj)

def _dump(model: Any) -> Any:
    
    if hasattr(model, "model_dump"):
        return model.model_dump()
    
    if hasattr(model, "dict"):
        return model.dict()
    return model


def _ensure_case_exists(db, case_id: int):
    c = get_case(db, case_id=case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    return c


@router.get("/cases/{case_id}/review", response_model=CaseReviewOut)
def api_get_review(case_id: int):
    with db_session() as db:
        _ensure_case_exists(db, case_id)
        r = get_or_create_review(db, case_id)
        db.commit()
        db.refresh(r)
        return _to_review_out(r)


@router.patch("/cases/{case_id}/status", response_model=CaseReviewOut)
def api_set_status(case_id: int, payload: SetStatusIn):
    try:
        with db_session() as db:
            _ensure_case_exists(db, case_id)
            r = set_status(db, case_id, payload.status, reviewed_by=payload.reviewed_by)
            db.commit()
            db.refresh(r)
            return _to_review_out(r)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cases/{case_id}/final-decision", response_model=CaseReviewOut)
def api_set_final_decision(case_id: int, payload: FinalDecisionIn):
    try:
        with db_session() as db:
            _ensure_case_exists(db, case_id)
            r = set_final_decision(
                db,
                case_id,
                payload.final_decision,
                payload.final_risk_level,
                reason=payload.reason,
                reviewed_by=payload.reviewed_by,
            )
            db.commit()
            db.refresh(r)
            return _to_review_out(r)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cases/{case_id}/notes", response_model=list[CaseNoteOut])
def api_list_notes(case_id: int, limit: int = 50):
    with db_session() as db:
        _ensure_case_exists(db, case_id)
        notes = list_notes(db, case_id, limit=limit)
        return [_to_note_out(n) for n in notes]


@router.post("/cases/{case_id}/notes", response_model=CaseNoteOut)
def api_add_note(case_id: int, payload: AddNoteIn):
    with db_session() as db:
        _ensure_case_exists(db, case_id)
        n = add_note(db, case_id, payload.note, author=payload.author)
        db.commit()
        db.refresh(n)
        return _to_note_out(n)

@router.get("/cases/{case_id}/timeline", response_model=CaseTimelineOut)
def api_case_timeline(case_id: int, limit: int = 50):
    """
    Dashboard-friendly endpoint:
    - case (full detail)
    - review (status/decision)
    - notes (latest first)
    """
    limit = max(1, min(limit, 200))

    with db_session() as db:
        c = _ensure_case_exists(db, case_id)

        
        r = get_or_create_review(db, case_id)
        db.commit()
        db.refresh(r)

        notes = list_notes(db, case_id, limit=limit)

        case_out = CaseDetailOut(
            id=c.id,
            full_name=c.full_name,
            country=c.country,
            decision=c.decision,
            risk_level=c.risk_level,
            created_at=c.created_at,
            review_status=r.status,  
            reviewed_by=r.reviewed_by,
            reviewed_at=r.reviewed_at,
            final_decision=r.final_decision,
            final_risk_level=r.final_risk_level,
            request_json=c.request_json,
            response_json=c.response_json,
        )

        review_out = _to_review_out(r)
        notes_out = [_to_note_out(n) for n in notes]

        return CaseTimelineOut(
            case=case_out,
            review=review_out,
            notes=notes_out,
        )