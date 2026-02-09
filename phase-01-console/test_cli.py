#!/usr/bin/env python3
"""Test CLI components."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
from src.application.task_service import TaskService
from src.interface.console_renderer import ConsoleRenderer
from src.interface.input_handler import InputHandler
from src.interface.command_router import CommandRouter


def test_cli_components():
    """Test that CLI components can be instantiated."""
    print("Testing CLI components...")

    # Setup
    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)
    renderer = ConsoleRenderer()
    input_handler = InputHandler()
    router = CommandRouter(
        task_service=service,
        renderer=renderer,
        input_handler=input_handler
    )

    # Test renderer
    print("\nTesting ConsoleRenderer...")
    renderer.render_welcome()
    renderer.render_menu()

    # Create a test task
    task = service.create_task(title="Test Task", description="For CLI testing")
    renderer.render_task_created(task)

    # Test task list rendering
    tasks = service.list_tasks()
    renderer.render_task_list(tasks)

    # Test messages
    renderer.render_success("Operation successful")
    renderer.render_error("Test error message")
    renderer.render_info("Test info message")

    print("\n✓ CLI components work correctly")


if __name__ == "__main__":
    test_cli_components()
