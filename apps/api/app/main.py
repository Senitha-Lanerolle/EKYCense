from fastapi import FastAPI
from pydantic import BaseModel
from rapidfuzz import fuzz

app = FastAPI(title="EKYCense API", version="0.1.0")

class FuzzyReq(BaseModel):
    name_a: str
    name_b: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/match/fuzzy")
def match_fuzzy(req: FuzzyReq):
    return {
        "token_sort_ratio": fuzz.token_sort_ratio(req.name_a, req.name_b),
        "token_set_ratio": fuzz.token_set_ratio(req.name_a, req.name_b),
    }
