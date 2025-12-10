from app.state.cbt_state import CBTState


def drafting_agent(state: CBTState) -> CBTState:
    """Generate or revise a CBT exercise draft based on user_intent."""
    prev_draft = state.get("draft", "")

    new_draft = f"""CBT Exercise for: {state['user_intent']}

1. Psychoeducation:
   - Explain what this problem is and how thoughts, feelings, and behaviors are connected.

2. Thought Monitoring:
   - Ask the user to write down triggering situations, automatic thoughts, feelings, and behaviors.

3. Cognitive Restructuring:
   - Identify cognitive distortions.
   - Generate more balanced alternative thoughts.

4. Behavioral Experiment / Exposure:
   - Create a graded list of tasks from easiest to hardest.
   - Practice exposures with SUDS ratings before/after.

5. Coping Skills:
   - Introduce breathing/relaxation, grounding, or problem-solving steps.

6. Reflection:
   - Review what was learned and plan next steps."""

    state.setdefault("previous_drafts", [])
    if prev_draft:
        state["previous_drafts"].append(prev_draft)

    state["draft"] = new_draft
    state["status"] = "drafting"
    return state
