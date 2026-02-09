"""Main CLI interface for the todo application."""

from ..application.task_service import TaskService
from .console_renderer import ConsoleRenderer
from .input_handler import InputHandler
from .command_router import CommandRouter


class CLI:
    """Main command-line interface for the todo application.

    Manages the application lifecycle and main loop.
    """

    def __init__(self, task_service: TaskService) -> None:
        """Initialize CLI with task service.

        Args:
            task_service: Service for task operations
        """
        self._service = task_service
        self._renderer = ConsoleRenderer()
        self._input = InputHandler()
        self._router = CommandRouter(
            task_service=self._service,
            renderer=self._renderer,
            input_handler=self._input
        )
        self._running = True

    def run(self) -> None:
        """Start the CLI application main loop."""
        self._renderer.render_welcome()

        while self._running:
            self._renderer.render_menu()
            choice = self._input.get_menu_choice()

            # Route command returns False when user wants to exit
            self._running = self._router.route_command(choice)

        self._shutdown()

    def _shutdown(self) -> None:
        """Clean shutdown of the application."""
        self._renderer.clear_screen()
        print("\n" + "=" * 60)
        print(" " * 15 + "Thank you for using Todo App!")
        print("=" * 60)
        print("\nAll tasks have been cleared from memory.")
        print("Goodbye!\n")
