from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session

from backend.app.models import CaseReview, CaseNote


VALID_STATUSES = {"OPEN", "IN_REVIEW", "CLEARED", "REJECTED"}
VALID_DECISIONS = {"MATCH", "PARTIAL_MATCH", "NO_MATCH"}
VALID_RISK = {"HIGH", "MEDIUM", "LOW"}

CLOSED_STATUSES = {"CLEARED", "REJECTED"}

ALLOWED_TRANSITIONS = {
    "OPEN": {"IN_REVIEW"},
    "IN_REVIEW": {"CLEARED", "REJECTED"},
    "CLEARED": set(),   # locked
    "REJECTED": set(),  # locked
}


def get_or_create_review(db: Session, case_id: int) -> CaseReview:
    r = db.query(CaseReview).filter(CaseReview.case_id == case_id).one_or_none()
    if r is None:
        r = CaseReview(case_id=case_id, status="OPEN")
        db.add(r)
        db.flush()
    return r


def _validate_status(status: str) -> str:
    status = (status or "").strip().upper()
    if status not in VALID_STATUSES:
        raise ValueError(f"Invalid status '{status}'. Allowed: {sorted(VALID_STATUSES)}")
    return status


def _validate_decision(decision: str) -> str:
    d = (decision or "").strip().upper()
    if d not in VALID_DECISIONS:
        raise ValueError(f"Invalid final_decision '{d}'. Allowed: {sorted(VALID_DECISIONS)}")
    return d


def _validate_risk(risk: str) -> str:
    rl = (risk or "").strip().upper()
    if rl not in VALID_RISK:
        raise ValueError(f"Invalid final_risk_level '{rl}'. Allowed: {sorted(VALID_RISK)}")
    return rl


def set_status(db: Session, case_id: int, status: str, reviewed_by: Optional[str] = None) -> CaseReview:
    new_status = _validate_status(status)

    r = get_or_create_review(db, case_id)
    current = (r.status or "OPEN").upper()

    
    if current in CLOSED_STATUSES:
        raise ValueError(f"Case is already closed ({current}). Status cannot be changed.")

   
    if new_status == current:
        
        if reviewed_by:
            r.reviewed_by = reviewed_by
            r.updated_at = datetime.utcnow()
            db.add(r)
            db.flush()
        return r

    allowed = ALLOWED_TRANSITIONS.get(current, set())
    if new_status not in allowed:
        raise ValueError(f"Invalid transition: {current} -> {new_status}. Allowed: {sorted(allowed)}")

   
    if new_status == "IN_REVIEW" and not (reviewed_by or r.reviewed_by):
        raise ValueError("reviewed_by is required when moving a case to IN_REVIEW.")

    r.status = new_status
    r.reviewed_by = reviewed_by or r.reviewed_by
    r.reviewed_at = datetime.utcnow()
    r.updated_at = datetime.utcnow()

    db.add(r)
    db.flush()
    return r


def set_final_decision(
    db: Session,
    case_id: int,
    final_decision: str,
    final_risk_level: str,
    reason: Optional[str] = None,
    reviewed_by: Optional[str] = None,
) -> CaseReview:
    d = _validate_decision(final_decision)
    rl = _validate_risk(final_risk_level)

    r = get_or_create_review(db, case_id)
    current = (r.status or "OPEN").upper()

    
    if current == "OPEN":
        raise ValueError("Cannot set final decision while status is OPEN. Move to IN_REVIEW first.")
    if current in CLOSED_STATUSES:
        raise ValueError(f"Case is already closed ({current}). Final decision cannot be changed.")
    if current != "IN_REVIEW":
        raise ValueError(f"Cannot set final decision unless status is IN_REVIEW (current={current}).")

 
    effective_reviewer = reviewed_by or r.reviewed_by
    if not effective_reviewer:
        raise ValueError("reviewed_by is required to set a final decision.")

   
    if d in {"MATCH", "PARTIAL_MATCH"}:
        r.status = "REJECTED"
    else:  
        r.status = "CLEARED"

    r.final_decision = d
    r.final_risk_level = rl
    r.reason = reason
    r.reviewed_by = effective_reviewer
    r.reviewed_at = datetime.utcnow()
    r.updated_at = datetime.utcnow()

    db.add(r)
    db.flush()
    return r


def add_note(db: Session, case_id: int, note: str, author: Optional[str] = None) -> CaseNote:
    
    get_or_create_review(db, case_id)

    n = CaseNote(case_id=case_id, note=note, author=author)
    db.add(n)
    db.flush()
    return n


def list_notes(db: Session, case_id: int, limit: int = 50) -> List[CaseNote]:
    return (
        db.query(CaseNote)
        .filter(CaseNote.case_id == case_id)
        .order_by(CaseNote.id.desc())
        .limit(limit)
        .all()
    )