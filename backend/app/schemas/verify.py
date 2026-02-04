from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class VerifyRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    country: Optional[str] = None
    top_k: int = Field(5, ge=1, le=50)   



class CandidateHit(BaseModel):
    person_id: str
    matched_name: str
    dataset: str | None = None
    lexical_similarity: float
    semantic_similarity: float
    fuzzy_score: float
    decision: str  

class VerifyResponse(BaseModel):
    query: Dict[str, Any]
    decision: str
    risk_level: str
    top_hits: List[CandidateHit]
    explanation: Dict[str, Any]
