from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy import String, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from backend.app.db import Base

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class VerificationCase(Base):
    __tablename__ = "verification_cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)

    decision: Mapped[str] = mapped_column(String(32), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(16), nullable=False)

    request_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    response_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship


class CaseReview(Base):
    __tablename__ = "case_review"

    case_id = Column(Integer, ForeignKey("verification_cases.id"), primary_key=True)

   
    status = Column(String(32), nullable=False, default="OPEN")

    
    final_decision = Column(String(32), nullable=True)   
    final_risk_level = Column(String(16), nullable=True) 
    reason = Column(Text, nullable=True)

    reviewed_by = Column(String(120), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    case = relationship("VerificationCase", backref="review", uselist=False)


class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("verification_cases.id"), nullable=False)

    note = Column(Text, nullable=False)
    author = Column(String(120), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    case = relationship("VerificationCase", backref="notes")
