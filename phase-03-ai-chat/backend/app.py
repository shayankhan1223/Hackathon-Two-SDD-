# Hugging Face Space entrypoint
from src.main import app

# This file serves as the entrypoint for Hugging Face Spaces
# The main application is imported from src.main
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)