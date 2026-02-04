from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field

class CaseOut(BaseModel):
    id: int
    full_name: str
    country: Optional[str] = None
    decision: str
    risk_level: str
    created_at: datetime

class CaseDetailOut(CaseOut):
    request_json: dict[str, Any] = Field(default_factory=dict)
    response_json: dict[str, Any] = Field(default_factory=dict)
