"""Application entry point for console todo app."""

from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
from src.application.task_service import TaskService
from src.interface.cli import CLI


def main() -> None:
    """Initialize and start the todo application.

    Sets up dependency injection:
    Repository -> Service -> CLI
    """
    # Create repository (in-memory storage)
    repository = InMemoryTaskRepository()

    # Create service with repository
    service = TaskService(repository=repository)

    # Create and run CLI
    cli = CLI(task_service=service)
    cli.run()


if __name__ == "__main__":
    main()
