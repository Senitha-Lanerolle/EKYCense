from __future__ import annotations

from typing import Any, Optional

from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from backend.app.models import VerificationCase

def create_case(
    db: Session,
    *,
    full_name: str,
    country: Optional[str],
    decision: str,
    risk_level: str,
    request_json: dict[str, Any],
    response_json: dict[str, Any],
) -> VerificationCase:
    row = VerificationCase(
        full_name=full_name,
        country=country,
        decision=decision,
        risk_level=risk_level,
        request_json=request_json,
        response_json=response_json,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def list_cases(
    db: Session,
    *,
    limit: int = 50,
    offset: int = 0,
    q: Optional[str] = None,
) -> list[VerificationCase]:
    stmt = select(VerificationCase).order_by(desc(VerificationCase.id)).limit(limit).offset(offset)
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(VerificationCase.full_name.ilike(like))
    return list(db.execute(stmt).scalars().all())

def get_case(db: Session, case_id: int) -> Optional[VerificationCase]:
    stmt = select(VerificationCase).where(VerificationCase.id == case_id)
    return db.execute(stmt).scalars().first()
