# Console Todo Application - Phase I

A simple, clean-architecture console-based todo application built with Python 3.13+. This application demonstrates Spec-Driven Development (SDD) principles with strict adherence to testing and code quality standards.

## Features

- Add new tasks with title and optional description
- View all tasks with completion status
- Mark tasks as complete/incomplete
- Update task details (title and description)
- Delete tasks
- In-memory storage (no persistence)

## Requirements

- Python 3.13 or higher
- uv package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Hackathon-two/phase-01-console
```

2. Install dependencies using uv:
```bash
uv sync
```

## Usage

### Running the Application

```bash
uv run python src/main.py
```

### Running Tests

Run all tests:
```bash
uv run pytest
```

Run tests with coverage:
```bash
uv run pytest --cov=src --cov-report=term-missing
```

Run specific test file:
```bash
uv run pytest tests/unit/test_task.py
```

## Project Structure

```
phase-01-console/
├── src/
│   ├── domain/              # Core business entities
│   │   ├── task.py          # Task entity
│   │   └── task_repository.py  # Repository interface
│   ├── application/         # Business logic
│   │   ├── task_service.py  # Task operations
│   │   └── exceptions.py    # Custom exceptions
│   ├── infrastructure/      # Implementations
│   │   └── in_memory_task_repository.py
│   ├── interface/           # CLI components
│   │   ├── cli.py           # Main CLI loop
│   │   ├── command_router.py
│   │   ├── console_renderer.py
│   │   └── input_handler.py
│   └── main.py             # Application entry point
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── fixtures/           # Test data
├── pyproject.toml          # Project configuration
└── README.md              # This file
```

## Architecture

The application follows clean architecture principles with clear layer separation:

- **Domain Layer**: Core entities and repository interfaces (no dependencies)
- **Application Layer**: Business logic and use case orchestration
- **Infrastructure Layer**: Concrete implementations (in-memory storage)
- **Interface Layer**: User interaction (CLI)

## Development Guidelines

This project follows strict Spec-Driven Development (SDD) principles:

- All code is generated from specifications
- Tests are written before implementation (TDD)
- >90% test coverage for domain and application layers
- No business logic in CLI layer
- Type hints for all function signatures
- Clear separation of concerns

## User Stories

### US1: Add New Tasks (P1)
Users can create tasks with a title and optional description.

### US2: View All Tasks (P1)
Users can view all their tasks with status indicators.

### US3: Complete Tasks (P2)
Users can toggle task completion status.

### US4: Update Task Details (P3)
Users can modify task titles and descriptions.

### US5: Delete Tasks (P3)
Users can remove tasks from their list.

## Testing

The application includes comprehensive test coverage:

- Unit tests for domain entities
- Unit tests for repository implementation
- Unit tests for business logic
- Integration tests for complete workflows
- Edge case testing

## Limitations (Phase I)

- In-memory storage only (data lost when app closes)
- Single-user, single-session only
- No data persistence
- No authentication or authorization
- Console interface only

## Future Phases

- Phase II: Web API with FastAPI
- Phase III: AI Chatbot interface (MCP)
- Phase IV: Kubernetes deployment
- Phase V: Cloud-native event-driven architecture

## License

See project root for license information.

## Contributing

This is a learning project demonstrating SDD principles. See CONSTITUTION.md for development guidelines.
