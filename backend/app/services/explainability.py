from typing import Dict, Any, List

def build_explanation(
    decision: str,
    risk_level: str,
    matches: List[Dict[str, Any]],
) -> Dict[str, Any]:
    top = matches[0] if matches else None

    if decision == "MATCH":
        summary = "Strong match found against a watchlist entry. Manual compliance review required."
        action = "Reject onboarding unless compliance clears this as a false positive."
    elif decision == "PARTIAL_MATCH":
        summary = "Potential match detected (partial similarity). Human review is required."
        action = "Mark IN_REVIEW and verify supporting details (DOB, document number, address)."
    else:
        summary = "No meaningful matches found in screening datasets."
        action = "Proceed with standard onboarding checks."

    signals = []
    if top:
        signals = [
            {
                "name": "Matched name",
                "value": top.get("matched_name"),
                "reason": f"Found in dataset: {top.get('dataset')}"
            },
            {
                "name": "Lexical similarity",
                "value": round(float(top.get("lexical_similarity", 0)), 3),
                "reason": "Spelling variation / token overlap"
            },
            {
                "name": "Semantic similarity",
                "value": round(float(top.get("semantic_similarity", 0)), 3),
                "reason": "Cross-lingual embedding similarity"
            },
            {
                "name": "Fuzzy score",
                "value": round(float(top.get("fuzzy_score", 0)), 3),
                "reason": "Combined fuzzy reasoning output"
            },
        ]

    return {
        "summary": summary,
        "risk_level": risk_level,
        "top_match": {
            "matched_name": top.get("matched_name") if top else None,
            "dataset": top.get("dataset") if top else None,
        },
        "signals": signals,
        "recommended_action": action,
    }