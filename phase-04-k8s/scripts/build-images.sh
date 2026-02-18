#!/usr/bin/env bash
# Phase IV Image Build Script — AI-Generated via Claude Code
# Builds backend and frontend Docker images for the Todo Chatbot
# Usage: ./build-images.sh [--tag VERSION]

set -euo pipefail

TAG="${1:-1.0.0}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "=== Building Todo Chatbot Docker Images (tag: $TAG) ==="

echo ""
echo "--- Building Backend Image ---"
docker build \
    -t "hackathon-todo-backend:$TAG" \
    -f "$REPO_ROOT/phase-04-k8s/docker/Dockerfile.backend" \
    "$REPO_ROOT/phase-03-ai-chat/backend/"

echo ""
echo "--- Building Frontend Image ---"
docker build \
    -t "hackathon-todo-frontend:$TAG" \
    -f "$REPO_ROOT/phase-04-k8s/docker/Dockerfile.frontend" \
    "$REPO_ROOT/phase-03-ai-chat/frontend/"

echo ""
echo "=== Build Complete ==="
docker images | grep hackathon-todo

echo ""
echo "--- Image Sizes ---"
docker image inspect "hackathon-todo-backend:$TAG" --format='Backend: {{.Size}}' 2>/dev/null | awk '{printf "%s %.0f MB\n", $1, $2/1048576}'
docker image inspect "hackathon-todo-frontend:$TAG" --format='Frontend: {{.Size}}' 2>/dev/null | awk '{printf "%s %.0f MB\n", $1, $2/1048576}'
