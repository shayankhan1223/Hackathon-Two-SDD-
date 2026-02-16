"""ChatKit-compatible chat endpoint using OpenAI Agents SDK with OpenRouter.

Since the `chatkit` Python package may not be available, this module implements
a simplified chat endpoint that processes messages through the AI agent.
"""

import json
import uuid
from datetime import datetime

from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel, RunConfig, Runner
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.agent.client_tools import apply_filter, highlight_task, navigate_calendar
from src.agent.instructions import build_system_prompt
from src.agent.tools import (
    AgentContext,
    add_task,
    analytics_query,
    bulk_add_tasks,
    bulk_update_tasks,
    complete_task,
    delete_task,
    list_tasks,
    reschedule_task,
    update_task,
)
from src.api.deps import get_current_user, get_session
from src.config import settings
from src.models.chat_message import ChatMessage, MessageRole
from src.models.user import User

router = APIRouter(tags=["Chat"])

# OpenRouter via OpenAI-compatible endpoint
_openrouter_client = AsyncOpenAI(
    api_key=settings.openrouter_api_key,
    base_url="https://openrouter.ai/api/v1",
)

CHAT_MODEL = OpenAIChatCompletionsModel(
    model="openrouter/free",
    openai_client=_openrouter_client,
)

CHAT_RUN_CONFIG = RunConfig(
    model=CHAT_MODEL,
    model_provider=_openrouter_client,
    tracing_disabled=True,
)


def create_todo_agent():
    """Create a TodoBot agent with current date context."""
    current_date = None  # Will be set to current date when the agent is created
    return Agent[AgentContext](
        name="TodoBot",
        model=CHAT_MODEL,
        instructions=build_system_prompt(current_date),
        tools=[
            add_task,
            update_task,
            delete_task,
            list_tasks,
            complete_task,
            reschedule_task,
            bulk_add_tasks,
            bulk_update_tasks,
            analytics_query,
            navigate_calendar,
            apply_filter,
            highlight_task,
        ],
    )


class ChatRequest(BaseModel):
    message: str
    thread_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    thread_id: str


@router.post("/api/chat")
async def chat(
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Process a chat message through the AI agent."""
    thread_id = body.thread_id or str(uuid.uuid4())

    # Save user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        role=MessageRole.user,
        content=body.message,
    )
    session.add(user_msg)
    await session.commit()

    # Load conversation history (last 50 messages)
    from sqlmodel import select

    history_result = await session.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(50)
    )
    history = list(reversed(history_result.scalars().all()))

    # Build message history for the agent
    messages = []
    for msg in history:
        messages.append({
            "role": msg.role.value,
            "content": msg.content,
        })

    # Create agent context with current date context
    context = AgentContext(user_id=current_user.id, session=session)

    # Create agent with current date context
    current_date_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    agent = Agent[AgentContext](
        name="TodoBot",
        model=CHAT_MODEL,
        instructions=build_system_prompt(current_date_str),
        tools=[
            add_task,
            update_task,
            delete_task,
            list_tasks,
            complete_task,
            reschedule_task,
            bulk_add_tasks,
            bulk_update_tasks,
            analytics_query,
            navigate_calendar,
            apply_filter,
            highlight_task,
        ],
    )

    # Run agent
    result = await Runner.run(
        agent,
        input=messages,
        context=context,
        run_config=CHAT_RUN_CONFIG,
    )

    # Extract response text
    response_text = result.final_output or "I processed your request."

    # Save assistant message
    assistant_msg = ChatMessage(
        user_id=current_user.id,
        role=MessageRole.assistant,
        content=response_text,
    )
    session.add(assistant_msg)
    await session.commit()

    return {"response": response_text, "thread_id": thread_id}


@router.get("/api/chat/history")
async def get_chat_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get chat history for the current user."""
    from sqlmodel import select

    result = await session.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
    )
    messages = list(reversed(result.scalars().all()))
    return {
        "messages": [
            {
                "id": str(m.id),
                "role": m.role.value,
                "content": m.content,
                "created_at": m.created_at.isoformat(),
            }
            for m in messages
        ]
    }
