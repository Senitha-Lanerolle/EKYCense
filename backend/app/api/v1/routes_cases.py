from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from backend.app.db import db_session
from backend.app.models import CaseReview
from backend.app.repositories.case_repo import list_cases, get_case
from backend.app.schemas.cases import CaseOut, CaseDetailOut

router = APIRouter(tags=["cases"])


@router.get("/cases", response_model=list[CaseOut])
def api_list_cases(limit: int = 50):
    limit = max(1, min(limit, 500))

    with db_session() as db:
        rows = list_cases(db, limit=limit)

        case_ids = [r.id for r in rows]
        review_map: dict[int, dict] = {}

        
        if case_ids:
            stmt = (
                select(
                    CaseReview.case_id,
                    CaseReview.status,
                    CaseReview.reviewed_by,
                    CaseReview.reviewed_at,
                    CaseReview.final_decision,
                    CaseReview.final_risk_level,
                )
                .where(CaseReview.case_id.in_(case_ids))
            )

            for cid, st, rb, ra, fd, frl in db.execute(stmt).all():
                review_map[int(cid)] = {
                    "review_status": str(st) if st else "OPEN",
                    "reviewed_by": rb,
                    "reviewed_at": ra,
                    "final_decision": fd,
                    "final_risk_level": frl,
                }

        out: list[CaseOut] = []
        for r in rows:
            meta = review_map.get(r.id, {})
            out.append(
                CaseOut(
                    id=r.id,
                    full_name=r.full_name,
                    country=r.country,
                    decision=r.decision,
                    risk_level=r.risk_level,
                    created_at=r.created_at,
                    review_status=meta.get("review_status", "OPEN"),
                    reviewed_by=meta.get("reviewed_by"),
                    reviewed_at=meta.get("reviewed_at"),
                    final_decision=meta.get("final_decision"),
                    final_risk_level=meta.get("final_risk_level"),
                )
            )

        return out


@router.get("/cases/{case_id}", response_model=CaseDetailOut)
def api_get_case(case_id: int):
    with db_session() as db:
        r = get_case(db, case_id=case_id)
        if not r:
            raise HTTPException(status_code=404, detail="Case not found")

        
        review_row = db.query(CaseReview).filter(CaseReview.case_id == case_id).one_or_none()

        if review_row:
            review_status = review_row.status or "OPEN"
            reviewed_by = review_row.reviewed_by
            reviewed_at = review_row.reviewed_at
            final_decision = review_row.final_decision
            final_risk_level = review_row.final_risk_level
        else:
            review_status = "OPEN"
            reviewed_by = None
            reviewed_at = None
            final_decision = None
            final_risk_level = None

        return CaseDetailOut(
            id=r.id,
            full_name=r.full_name,
            country=r.country,
            decision=r.decision,
            risk_level=r.risk_level,
            created_at=r.created_at,
            review_status=str(review_status),
            reviewed_by=reviewed_by,
            reviewed_at=reviewed_at,
            final_decision=final_decision,
            final_risk_level=final_risk_level,
            request_json=r.request_json,
            response_json=r.response_json,
        )