from uuid import uuid4
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver

from app.state.cbt_state import CBTState
from app.agents.drafting_agent import drafting_agent
from app.agents.safety_agent import safety_agent
from app.agents.critic_agent import critic_agent
from app.agents.supervisor_agent import supervisor_agent


def build_graph():
    graph = StateGraph(CBTState)

    # Nodes
    graph.add_node("draft", drafting_agent)
    graph.add_node("safety", safety_agent)
    graph.add_node("critic", critic_agent)
    graph.add_node("supervisor", supervisor_agent)

    # Entry point
    graph.set_entry_point("draft")

    # Edges
    graph.add_edge("draft", "safety")
    graph.add_edge("safety", "critic")
    graph.add_edge("critic", "supervisor")

    # Conditional transitions based on supervisor output
    graph.add_conditional_edges(
        "supervisor",
        lambda state, result: result,
        {
            "revise": "draft",
            "pause_for_human": END,
        },
    )

    # SQLite checkpointer for persistence
    checkpointer = SqliteSaver("checkpoints.db")
    return graph.compile(checkpointer=checkpointer)


# Singleton compiled graph (so we don't rebuild every request)
compiled_graph = build_graph()


def start_session(intent: str):
    """Run the graph until the supervisor pauses for human review."""
    thread_id = f"session-{uuid4().hex}"

    initial_state: CBTState = {
        "user_intent": intent,
        "draft": "",
        "previous_drafts": [],
        "safety_flags": [],
        "clinical_notes": [],
        "empathy_score": 0.0,
        "iteration": 0,
        "status": "drafting",
    }

    final_state = compiled_graph.invoke(
        initial_state,
        config={"configurable": {"thread_id": thread_id}},
    )

    return thread_id, final_state
