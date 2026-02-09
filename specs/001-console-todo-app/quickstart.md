# Quickstart: Console Todo Application

**Feature**: Console Todo Application
**Phase**: I (Console)
**Date**: 2026-02-09

## Overview

This is a simple in-memory console-based todo application built with Python 3.13+. All data is stored in memory and lost when the application exits.

## Prerequisites

- Python 3.13 or higher
- `uv` package manager (install from [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv))

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
git checkout 001-console-todo-app
```

### 2. Navigate to Phase I directory

```bash
cd phase-01-console
```

### 3. Install dependencies

```bash
uv sync
```

This will:
- Create a virtual environment
- Install development dependencies (pytest, pytest-cov)
- Set up the project for execution

## Running the Application

### Start the application

```bash
uv run python src/main.py
```

### Using the application

You will see a menu with options:

```
=== Todo Application ===
1. Add Task
2. View All Tasks
3. Update Task
4. Complete Task
5. Delete Task
6. Exit

Choose an option:
```

**Available Operations**:

1. **Add Task**: Create a new task with title and optional description
2. **View All Tasks**: Display all tasks with their status
3. **Update Task**: Modify an existing task's title or description
4. **Complete Task**: Toggle a task's completion status
5. **Delete Task**: Remove a task permanently
6. **Exit**: Close the application (all data will be lost)

## Usage Examples

### Adding a task

```
Choose an option: 1
Enter task title: Buy groceries
Enter task description (optional): Milk, eggs, bread

✓ Task created successfully!
ID: 550e8400-e29b-41d4-a716-446655440000
```

### Viewing tasks

```
Choose an option: 2

=== Your Tasks ===
ID: 550e8400-e29b-41d4-a716-446655440000
Title: Buy groceries
Description: Milk, eggs, bread
Status: ○ Incomplete
```

### Completing a task

```
Choose an option: 4
Enter task ID: 550e8400-e29b-41d4-a716-446655440000

✓ Task marked as complete!
```

### Updating a task

```
Choose an option: 3
Enter task ID: 550e8400-e29b-41d4-a716-446655440000
Enter new title (press Enter to keep current):
Enter new description (press Enter to keep current): Milk, eggs, bread, vegetables

✓ Task updated successfully!
```

### Deleting a task

```
Choose an option: 5
Enter task ID: 550e8400-e29b-41d4-a716-446655440000

✓ Task deleted successfully!
```

## Running Tests

### Run all tests

```bash
uv run pytest
```

### Run with coverage report

```bash
uv run pytest --cov=src --cov-report=html
```

View coverage report:
```bash
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

### Run specific test categories

```bash
# Unit tests only
uv run pytest tests/unit/

# Integration tests only
uv run pytest tests/integration/

# Specific test file
uv run pytest tests/unit/test_task.py
```

## Project Structure

```
phase-01-console/
├── src/
│   ├── domain/          # Business entities and rules
│   ├── application/     # Use-case logic
│   ├── infrastructure/  # Storage implementation
│   ├── interface/       # CLI components
│   └── main.py         # Application entry point
│
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── fixtures/       # Test fixtures
│
├── pyproject.toml      # Project configuration
└── README.md          # Detailed documentation
```

## Troubleshooting

### Python version error

**Error**: `Python 3.13+ required`

**Solution**: Install Python 3.13 or higher from [python.org](https://python.org)

### uv not found

**Error**: `command not found: uv`

**Solution**: Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### ModuleNotFoundError

**Error**: `ModuleNotFoundError: No module named 'src'`

**Solution**: Run commands from the `phase-01-console/` directory and use `uv run`

### Tests fail

**Error**: Tests failing unexpectedly

**Solution**:
1. Ensure all dependencies installed: `uv sync`
2. Run from correct directory: `cd phase-01-console`
3. Check Python version: `python --version` (should be 3.13+)

## Important Notes

### Data Persistence

⚠️ **All data is in-memory only**. When you exit the application, all tasks are deleted. This is by design for Phase I.

Future phases will add:
- Phase II: Database persistence
- Phase III: Conversation history
- Phase IV: Distributed deployment
- Phase V: Event-driven architecture

### Limitations

This Phase I implementation has intentional limitations:
- Single user only
- No authentication
- No persistence
- No concurrency support
- No network access

These limitations will be addressed in future phases.

## Next Steps

After successfully running the console application:

1. Review the code structure in `src/`
2. Examine tests in `tests/`
3. Read the [Implementation Plan](plan.md) for architecture details
4. Review the [Data Model](data-model.md) for entity definitions
5. Check the [Service Contract](contracts/task_service.md) for API details

## Getting Help

- Review the README.md for detailed documentation
- Check the spec.md for requirements and acceptance criteria
- Examine test files for usage examples
- Review the constitution.md for development principles

## Development Workflow

1. All changes must follow Spec-Driven Development (SDD)
2. Tests must be written before implementation
3. Code must pass all tests before merging
4. Constitution principles must be respected

See the project CONSTITUTION.md for complete development guidelines.
