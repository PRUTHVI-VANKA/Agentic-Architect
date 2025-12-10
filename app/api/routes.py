from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict

from app.graph.workflow import start_session

router = APIRouter()


class StartRequest(BaseModel):
    intent: str


@router.post("/start")
def start_protocol(payload: StartRequest) -> Dict[str, Any]:
    """
    Start a new CBT protocol generation session.
    Runs the multi-agent workflow until it pauses for human review.
    """
    session_id, state = start_session(payload.intent)
    return {
        "session_id": session_id,
        "state": state,
    }
