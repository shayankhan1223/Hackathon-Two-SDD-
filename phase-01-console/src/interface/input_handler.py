"""User input handling and validation."""

from typing import Optional, Tuple


class InputHandler:
    """Handles user input with validation and parsing."""

    @staticmethod
    def get_menu_choice() -> str:
        """Get and validate menu choice from user.

        Returns:
            User's menu choice as string
        """
        choice = input("\nEnter your choice (1-6): ").strip()
        return choice

    @staticmethod
    def get_task_title() -> str:
        """Get task title from user.

        Returns:
            Task title entered by user
        """
        title = input("\nEnter task title: ").strip()
        return title

    @staticmethod
    def get_task_description() -> str:
        """Get task description from user (optional).

        Returns:
            Task description or empty string
        """
        print("\nEnter task description (press Enter to skip):")
        description = input().strip()
        return description

    @staticmethod
    def get_task_id() -> str:
        """Get task ID from user.

        Returns:
            Task ID entered by user
        """
        task_id = input("\nEnter task ID: ").strip()
        return task_id

    @staticmethod
    def get_task_updates() -> Tuple[Optional[str], Optional[str]]:
        """Get task title and/or description updates from user.

        Returns:
            Tuple of (title, description), where either can be None if not updating
        """
        print("\nLeave blank to keep current value")

        title_input = input("New title (or press Enter to skip): ").strip()
        title = title_input if title_input else None

        desc_input = input("New description (or press Enter to skip): ").strip()
        description = desc_input if desc_input else None

        return title, description

    @staticmethod
    def confirm_action(action: str) -> bool:
        """Ask user to confirm an action.

        Args:
            action: Description of the action to confirm

        Returns:
            True if user confirms, False otherwise
        """
        response = input(f"\nAre you sure you want to {action}? (y/n): ").strip().lower()
        return response == 'y' or response == 'yes'

    @staticmethod
    def wait_for_enter() -> None:
        """Wait for user to press Enter to continue."""
        input("\nPress Enter to continue...")

    @staticmethod
    def get_string(prompt: str) -> str:
        """Get generic string input from user.

        Args:
            prompt: Prompt to display

        Returns:
            User's input as string
        """
        return input(f"\n{prompt}: ").strip()
