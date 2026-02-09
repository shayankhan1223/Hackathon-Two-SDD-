"""Console output formatting and rendering."""

from typing import List
from ..domain.task import Task


class ConsoleRenderer:
    """Formats and displays output to the console."""

    @staticmethod
    def render_welcome() -> None:
        """Display welcome message and instructions."""
        print("\n" + "=" * 60)
        print(" " * 15 + "CONSOLE TODO APPLICATION")
        print("=" * 60)
        print("\nManage your tasks with simple console commands.")
        print("All data is stored in memory and will be lost when you exit.\n")

    @staticmethod
    def render_menu() -> None:
        """Display main menu options."""
        print("\n" + "-" * 60)
        print("MAIN MENU")
        print("-" * 60)
        print("1. Add new task")
        print("2. View all tasks")
        print("3. Complete/uncomplete task")
        print("4. Update task")
        print("5. Delete task")
        print("6. Exit")
        print("-" * 60)

    @staticmethod
    def render_task_list(tasks: List[Task]) -> None:
        """Display list of tasks with status indicators.

        Args:
            tasks: List of tasks to display
        """
        if not tasks:
            print("\nNo tasks found. Add your first task to get started!")
            return

        print("\n" + "=" * 80)
        print(f"{'STATUS':<10} {'ID':<38} {'TITLE':<30}")
        print("=" * 80)

        for task in tasks:
            status = "● DONE" if task.completed else "○ TODO"
            # Truncate title if too long
            title = task.title[:27] + "..." if len(task.title) > 30 else task.title
            print(f"{status:<10} {str(task.id):<38} {title:<30}")

        print("=" * 80)
        print(f"Total tasks: {len(tasks)}")

    @staticmethod
    def render_task_detail(task: Task) -> None:
        """Display detailed view of a single task.

        Args:
            task: Task to display
        """
        status = "COMPLETED" if task.completed else "INCOMPLETE"

        print("\n" + "=" * 60)
        print("TASK DETAILS")
        print("=" * 60)
        print(f"ID:          {task.id}")
        print(f"Title:       {task.title}")
        print(f"Description: {task.description if task.description else '(none)'}")
        print(f"Status:      {status}")
        print("=" * 60)

    @staticmethod
    def render_success(message: str) -> None:
        """Display success message.

        Args:
            message: Success message to display
        """
        print(f"\n✓ {message}")

    @staticmethod
    def render_error(message: str) -> None:
        """Display error message.

        Args:
            message: Error message to display
        """
        print(f"\n✗ ERROR: {message}")

    @staticmethod
    def render_info(message: str) -> None:
        """Display informational message.

        Args:
            message: Info message to display
        """
        print(f"\nℹ {message}")

    @staticmethod
    def render_task_created(task: Task) -> None:
        """Display confirmation for task creation.

        Args:
            task: Newly created task
        """
        print("\n" + "=" * 60)
        print("✓ TASK CREATED SUCCESSFULLY")
        print("=" * 60)
        print(f"ID:          {task.id}")
        print(f"Title:       {task.title}")
        print(f"Description: {task.description if task.description else '(none)'}")
        print("=" * 60)

    @staticmethod
    def render_task_updated(task: Task) -> None:
        """Display confirmation for task update.

        Args:
            task: Updated task
        """
        print("\n✓ Task updated successfully!")
        ConsoleRenderer.render_task_detail(task)

    @staticmethod
    def render_task_completed(task: Task) -> None:
        """Display confirmation for task completion toggle.

        Args:
            task: Task with updated completion status
        """
        status = "completed" if task.completed else "marked as incomplete"
        print(f"\n✓ Task '{task.title}' has been {status}!")

    @staticmethod
    def render_task_deleted(title: str) -> None:
        """Display confirmation for task deletion.

        Args:
            title: Title of deleted task
        """
        print(f"\n✓ Task '{title}' has been deleted successfully!")

    @staticmethod
    def clear_screen() -> None:
        """Clear the console screen (platform-independent)."""
        print("\n" * 2)
