from __future__ import annotations

import os
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


def _project_root() -> Path:
    
    return Path(__file__).resolve().parents[2]


DEFAULT_DB_PATH = _project_root() / "data" / "ekyc.sqlite3"
DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)

DB_URL = os.getenv("DATABASE_URL") or f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}

engine = create_engine(DB_URL, future=True, echo=False, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    
    import backend.app.models  

    Base.metadata.create_all(bind=engine)


@contextmanager
def db_session() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
