# Quickstart: Phase IV — Local Kubernetes Deployment

**Feature**: 007-k8s-deployment
**Date**: 2026-02-18

## Prerequisites

Ensure the following tools are installed:

- Docker Desktop (24.x+) with Docker AI (Gordon) enabled
- Minikube (v1.32+)
- Helm (v3.x)
- kubectl (v1.28+)
- kubectl-ai
- Kagent

## Quick Deployment (5 Steps)

### Step 1: Build Container Images

```bash
# Build backend image
docker build -t hackathon-todo-backend:1.0.0 \
  -f phase-04-k8s/docker/Dockerfile.backend \
  phase-03-ai-chat/backend/

# Build frontend image
docker build -t hackathon-todo-frontend:1.0.0 \
  -f phase-04-k8s/docker/Dockerfile.frontend \
  phase-03-ai-chat/frontend/
```

### Step 2: Start Minikube & Load Images

```bash
# Start cluster
minikube start --driver=docker --cpus=4 --memory=8192

# Enable metrics for HPA
minikube addons enable metrics-server

# Create namespace
kubectl create namespace hackathon-dev

# Load images
minikube image load hackathon-todo-backend:1.0.0
minikube image load hackathon-todo-frontend:1.0.0
```

### Step 3: Configure Secrets

```bash
# Create database secret (replace with your Neon PostgreSQL URL)
kubectl create secret generic todo-db-secret \
  -n hackathon-dev \
  --from-literal=DATABASE_URL="postgresql+asyncpg://user:pass@host/db"
```

### Step 4: Deploy with Helm

```bash
helm install todo-chatbot \
  phase-04-k8s/helm/todo-chatbot/ \
  -n hackathon-dev \
  -f phase-04-k8s/helm/todo-chatbot/values-dev.yaml
```

### Step 5: Verify

```bash
# Wait for pods
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=todo-chatbot \
  -n hackathon-dev --timeout=120s

# Check pods
kubectl get pods -n hackathon-dev

# Access services
echo "Frontend: http://$(minikube ip):30080"
echo "Backend:  http://$(minikube ip):30860/api/health"
```

## Common Operations

### Scale Replicas
```bash
helm upgrade todo-chatbot phase-04-k8s/helm/todo-chatbot/ \
  -n hackathon-dev --set backend.replicaCount=3
```

### Rollback
```bash
helm rollback todo-chatbot 1 -n hackathon-dev
```

### View Logs
```bash
kubectl logs -l app=todo-backend -n hackathon-dev --tail=50
kubectl logs -l app=todo-frontend -n hackathon-dev --tail=50
```

### Teardown
```bash
helm uninstall todo-chatbot -n hackathon-dev
kubectl delete namespace hackathon-dev
minikube stop
```
