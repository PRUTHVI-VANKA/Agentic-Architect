from typing import List, TypedDict


class CBTState(TypedDict, total=False):
    user_intent: str
    draft: str
    previous_drafts: List[str]
    safety_flags: List[str]
    clinical_notes: List[str]
    empathy_score: float
    iteration: int
    status: str  # "drafting" | "paused" | "final"
