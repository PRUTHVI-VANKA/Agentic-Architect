from app.state.cbt_state import CBTState


UNSAFE_KEYWORDS = ["kill", "suicide", "self-harm", "hurt myself", "end my life"]


def safety_agent(state: CBTState) -> CBTState:
    """Flag obviously unsafe language in draft."""
    draft = state.get("draft", "").lower()
    flags = state.get("safety_flags", [])

    for word in UNSAFE_KEYWORDS:
        if word in draft:
            flags.append(f"Potential unsafe content: '{word}'")

    state["safety_flags"] = flags
    return state
