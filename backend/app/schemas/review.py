from __future__ import annotations

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from backend.app.schemas.cases import CaseDetailOut



class SetStatusIn(BaseModel):
    status: str
    reviewed_by: Optional[str] = None


class FinalDecisionIn(BaseModel):
    final_decision: str
    final_risk_level: str
    reason: Optional[str] = None
    reviewed_by: Optional[str] = None


class AddNoteIn(BaseModel):
    note: str
    author: Optional[str] = None


class CaseReviewOut(BaseModel):
    case_id: int
    status: str
    final_decision: Optional[str] = None
    final_risk_level: Optional[str] = None
    reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    updated_at: datetime


class CaseNoteOut(BaseModel):
    id: int
    case_id: int
    note: str
    author: Optional[str] = None
    created_at: datetime

class CaseTimelineOut(BaseModel):
    case: CaseDetailOut
    review: Optional[CaseReviewOut] = None
    notes: list[CaseNoteOut] = Field(default_factory=list)