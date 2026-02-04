from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.routes_verify import router as verify_router
from backend.app.api.v1.routes_cases import router as cases_router
from backend.app.api.v1.routes_review import router as review_router
from backend.app.core.config import settings
from backend.app.db import init_db

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    # During development and containerized local testing, allow all origins.
    # For production you can tighten this to your real domains.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def health():
    return {"app": settings.APP_NAME, "status": "ok"}

app.include_router(verify_router, prefix="/api/v1")
app.include_router(cases_router, prefix="/api/v1")
app.include_router(review_router, prefix="/api/v1")