from app.state.cbt_state import CBTState


def critic_agent(state: CBTState) -> CBTState:
    """Very simple heuristic critic for tone/structure."""
    notes = state.get("clinical_notes", [])

    # Super-basic heuristic: if we have clear steps, assume okay empathy/structure
    draft = state.get("draft", "")
    has_steps = "1." in draft and "2." in draft

    if has_steps:
        notes.append("Structure: Clear, step-based CBT exercise.")
        notes.append("Tone: Neutral-supportive, could be made more personalized in future.")
        state["empathy_score"] = 0.8
    else:
        notes.append("Structure: Needs clearer steps.")
        state["empathy_score"] = 0.5

    state["clinical_notes"] = notes
    return state
