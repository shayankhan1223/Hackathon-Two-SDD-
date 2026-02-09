"""Command routing and orchestration for CLI."""

from typing import Optional

from ..application.task_service import TaskService
from ..application.exceptions import TaskNotFoundError, InvalidTaskDataError
from .console_renderer import ConsoleRenderer
from .input_handler import InputHandler


class CommandRouter:
    """Routes user commands to appropriate service methods.

    Handles command execution, exception catching, and response rendering.
    """

    def __init__(
        self,
        task_service: TaskService,
        renderer: ConsoleRenderer,
        input_handler: InputHandler
    ) -> None:
        """Initialize router with dependencies.

        Args:
            task_service: Service for task operations
            renderer: Console output renderer
            input_handler: User input handler
        """
        self._service = task_service
        self._renderer = renderer
        self._input = input_handler

    def handle_add_task(self) -> None:
        """Handle add task command."""
        try:
            self._renderer.clear_screen()
            print("\n" + "=" * 60)
            print("ADD NEW TASK")
            print("=" * 60)

            title = self._input.get_task_title()
            if not title:
                self._renderer.render_error("Title cannot be empty")
                return

            description = self._input.get_task_description()

            task = self._service.create_task(title=title, description=description)
            self._renderer.render_task_created(task)

        except InvalidTaskDataError as e:
            self._renderer.render_error(str(e))
        except Exception as e:
            self._renderer.render_error(f"Unexpected error: {str(e)}")

    def handle_view_tasks(self) -> None:
        """Handle view all tasks command."""
        try:
            self._renderer.clear_screen()
            tasks = self._service.list_tasks()
            self._renderer.render_task_list(tasks)

        except Exception as e:
            self._renderer.render_error(f"Unexpected error: {str(e)}")

    def handle_complete_task(self) -> None:
        """Handle complete/uncomplete task command."""
        try:
            self._renderer.clear_screen()
            print("\n" + "=" * 60)
            print("TOGGLE TASK COMPLETION")
            print("=" * 60)

            # Show current tasks
            tasks = self._service.list_tasks()
            if not tasks:
                self._renderer.render_info("No tasks available")
                return

            self._renderer.render_task_list(tasks)

            task_id = self._input.get_task_id()
            if not task_id:
                self._renderer.render_error("Task ID cannot be empty")
                return

            task = self._service.complete_task(task_id)
            self._renderer.render_task_completed(task)

        except TaskNotFoundError as e:
            self._renderer.render_error(str(e))
        except InvalidTaskDataError as e:
            self._renderer.render_error(str(e))
        except Exception as e:
            self._renderer.render_error(f"Unexpected error: {str(e)}")

    def handle_update_task(self) -> None:
        """Handle update task command."""
        try:
            self._renderer.clear_screen()
            print("\n" + "=" * 60)
            print("UPDATE TASK")
            print("=" * 60)

            # Show current tasks
            tasks = self._service.list_tasks()
            if not tasks:
                self._renderer.render_info("No tasks available")
                return

            self._renderer.render_task_list(tasks)

            task_id = self._input.get_task_id()
            if not task_id:
                self._renderer.render_error("Task ID cannot be empty")
                return

            # Show current task details
            current_task = self._service.get_task(task_id)
            self._renderer.render_task_detail(current_task)

            # Get updates
            title, description = self._input.get_task_updates()

            if title is None and description is None:
                self._renderer.render_info("No changes made")
                return

            updated_task = self._service.update_task(
                task_id=task_id,
                title=title,
                description=description
            )
            self._renderer.render_task_updated(updated_task)

        except TaskNotFoundError as e:
            self._renderer.render_error(str(e))
        except InvalidTaskDataError as e:
            self._renderer.render_error(str(e))
        except Exception as e:
            self._renderer.render_error(f"Unexpected error: {str(e)}")

    def handle_delete_task(self) -> None:
        """Handle delete task command."""
        try:
            self._renderer.clear_screen()
            print("\n" + "=" * 60)
            print("DELETE TASK")
            print("=" * 60)

            # Show current tasks
            tasks = self._service.list_tasks()
            if not tasks:
                self._renderer.render_info("No tasks available")
                return

            self._renderer.render_task_list(tasks)

            task_id = self._input.get_task_id()
            if not task_id:
                self._renderer.render_error("Task ID cannot be empty")
                return

            # Get task title before deleting (for confirmation message)
            task = self._service.get_task(task_id)

            # Confirm deletion
            if self._input.confirm_action(f"delete task '{task.title}'"):
                self._service.delete_task(task_id)
                self._renderer.render_task_deleted(task.title)
            else:
                self._renderer.render_info("Deletion cancelled")

        except TaskNotFoundError as e:
            self._renderer.render_error(str(e))
        except InvalidTaskDataError as e:
            self._renderer.render_error(str(e))
        except Exception as e:
            self._renderer.render_error(f"Unexpected error: {str(e)}")

    def route_command(self, choice: str) -> bool:
        """Route command choice to appropriate handler.

        Args:
            choice: User's menu choice

        Returns:
            False if user wants to exit, True otherwise
        """
        if choice == "1":
            self.handle_add_task()
        elif choice == "2":
            self.handle_view_tasks()
        elif choice == "3":
            self.handle_complete_task()
        elif choice == "4":
            self.handle_update_task()
        elif choice == "5":
            self.handle_delete_task()
        elif choice == "6":
            return False
        else:
            self._renderer.render_error("Invalid choice. Please enter 1-6.")

        self._input.wait_for_enter()
        return True
