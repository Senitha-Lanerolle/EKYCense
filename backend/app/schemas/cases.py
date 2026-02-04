from __future__ import annotations

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CaseOut(BaseModel):
    id: int
    full_name: str
    country: Optional[str] = None
    decision: str
    risk_level: str
    created_at: datetime

    
    review_status: str
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    final_decision: Optional[str] = None
    final_risk_level: Optional[str] = None


class CaseDetailOut(CaseOut):
    request_json: dict
    response_json: dict