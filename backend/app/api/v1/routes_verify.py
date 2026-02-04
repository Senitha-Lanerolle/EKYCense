from typing import Any

from fastapi import APIRouter
from backend.app.schemas.verify import VerifyRequest, VerifyResponse
from backend.app.services.verify_service import verify_name

router = APIRouter(tags=["verification"])

def build_explanation(full_name: str, country: str, decision: str, risk_level: str, matches: list[dict]) -> dict:
    """
    Human-readable explanation for analysts / audit trail.
    Returned as a dict so the API response can be extended without breaking clients.
    """
    count = len(matches or [])
    top = matches[0] if count else None

    def fmt_pct(x: Any) -> str:
        try:
            return f"{float(x) * 100:.0f}%"
        except Exception:
            return "N/A"

    
    signals: dict[str, Any] = {
        "decision": decision,
        "risk_level": risk_level,
        "match_count": count,
        "country": country,
    }

    if decision == "NO_MATCH":
        summary = (
            f"No watchlist matches found for '{full_name}' ({country}). "
            f"Decision: NO_MATCH. Risk: {risk_level}. "
            "You may proceed with standard onboarding checks."
        )
        return {
            "summary": summary,
            "recommended_action": "Proceed with onboarding",
            "signals": signals,
            "top_match": None,
        }

    if not top:
        summary = (
            f"Potential match detected for '{full_name}' ({country}). "
            f"Decision: {decision}. Risk: {risk_level}. "
            "Manual review recommended."
        )
        return {
            "summary": summary,
            "recommended_action": "Manual review",
            "signals": signals,
            "top_match": None,
        }

    
    matched_name = top.get("matched_name") or top.get("name") or "Unknown"
    dataset = top.get("dataset") or top.get("source") or "Unknown dataset"
    lex = top.get("lexical_similarity")
    sem = top.get("semantic_similarity")
    fuzzy = top.get("fuzzy_score") or top.get("fuzzy")

    top_match = {
        "matched_name": matched_name,
        "dataset": dataset,
        "lexical_similarity": lex,
        "semantic_similarity": sem,
        "fuzzy_score": fuzzy,
        "lexical_pct": fmt_pct(lex),
        "semantic_pct": fmt_pct(sem),
        "fuzzy_pct": fmt_pct(fuzzy),
    }

    summary = (
        f"Potential watchlist match for '{full_name}' ({country}). "
        f"Decision: {decision}. Risk: {risk_level}. "
        f"Top match: '{matched_name}' from {dataset}. "
        f"Scores — lexical: {fmt_pct(lex)}, semantic: {fmt_pct(sem)}, fuzzy: {fmt_pct(fuzzy)}. "
        f"Total matches returned: {count}. "
        "Recommended action: Analyst review and confirm true/false positive."
    )

    return {
        "summary": summary,
        "recommended_action": "Analyst review",
        "signals": signals,
        "top_match": top_match,
    }

@router.post("/verify-name", response_model=VerifyResponse)
def verify_endpoint(payload: VerifyRequest):
    result: Any = verify_name(payload)

    
    if isinstance(result, dict):
        data: dict[str, Any] = dict(result)
    elif hasattr(result, "model_dump"):
        
        data = result.model_dump()
    elif hasattr(result, "dict"):
        
        data = result.dict()
    else:
        
        data = {"result": result}

    
    raw_matches = data.get("matches") or []
    matches: list[dict] = []
    if isinstance(raw_matches, list):
        for m in raw_matches:
            if isinstance(m, dict):
                matches.append(m)
            elif hasattr(m, "model_dump"):
                matches.append(m.model_dump())
            elif hasattr(m, "dict"):
                matches.append(m.dict())
            else:
                
                matches.append({"value": str(m)})

    data["matches"] = matches

    decision = str(data.get("decision") or "NO_MATCH")
    risk_level = str(data.get("risk_level") or "LOW")

    explanation: dict[str, Any] = build_explanation(
        payload.full_name,
        payload.country,
        decision,
        risk_level,
        matches,
    )

    
    data["explanation"] = explanation


    if isinstance(data.get("response_json"), dict):
        data["response_json"]["explanation"] = explanation

    return data
