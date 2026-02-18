# Phase IV: Local Kubernetes Deployment Guide

> AI-Generated via Claude Code — All artifacts are AI-generated per governance rules

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Docker Desktop | 24.x+ | [docker.com](https://docs.docker.com/get-docker/) |
| Minikube | v1.32+ | `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && install minikube-linux-amd64 ~/.local/bin/minikube` |
| Helm 3 | v3.x | `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \| bash` |
| kubectl | v1.28+ | `curl -LO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && install kubectl ~/.local/bin/kubectl` |

**Optional AI Tools** (for enhanced diagnostics):
- kubectl-ai
- Kagent

## Quick Start (5 minutes)

```bash
# 1. Build Docker images
./phase-04-k8s/scripts/build-images.sh

# 2. Setup Minikube cluster and load images
./phase-04-k8s/scripts/setup-cluster.sh

# 3. Deploy (set your DATABASE_URL first)
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
./phase-04-k8s/scripts/deploy.sh
```

## Step-by-Step Deployment

### Step 1: Verify Tools

```bash
./phase-04-k8s/scripts/verify-tools.sh
```

### Step 2: Build Docker Images

```bash
# Backend (FastAPI)
docker build -t hackathon-todo-backend:1.0.0 \
  -f phase-04-k8s/docker/Dockerfile.backend \
  phase-03-ai-chat/backend/

# Frontend (Next.js)
docker build -t hackathon-todo-frontend:1.0.0 \
  -f phase-04-k8s/docker/Dockerfile.frontend \
  phase-03-ai-chat/frontend/

# Verify images
docker images | grep hackathon
```

**Expected sizes**: Backend ~249MB, Frontend ~80MB

### Step 3: Start Minikube

```bash
minikube start --driver=docker --cpus=2 --memory=2048
minikube addons enable metrics-server
```

### Step 4: Create Namespace and Load Images

```bash
kubectl create namespace hackathon-dev
minikube image load hackathon-todo-backend:1.0.0
minikube image load hackathon-todo-frontend:1.0.0
```

### Step 5: Create Database Secret

```bash
kubectl create secret generic todo-db-secret \
  -n hackathon-dev \
  --from-literal=DATABASE_URL="<your-neon-database-url>"
```

### Step 6: Deploy via Helm

```bash
# Validate chart first
helm lint phase-04-k8s/helm/todo-chatbot/

# Install
helm install todo-chatbot phase-04-k8s/helm/todo-chatbot/ \
  -n hackathon-dev \
  -f phase-04-k8s/helm/todo-chatbot/values-dev.yaml
```

**Note**: If namespace ownership error occurs:
```bash
kubectl annotate namespace hackathon-dev \
  meta.helm.sh/release-name=todo-chatbot \
  meta.helm.sh/release-namespace=hackathon-dev --overwrite
kubectl label namespace hackathon-dev \
  app.kubernetes.io/managed-by=Helm --overwrite
```

### Step 7: Verify Deployment

```bash
# Wait for pods
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=todo-chatbot \
  -n hackathon-dev --timeout=120s

# Check pods
kubectl get pods -n hackathon-dev

# Check services
kubectl get svc -n hackathon-dev

# Check HPA
kubectl get hpa -n hackathon-dev
```

### Step 8: Access Application

With Docker driver, NodePorts aren't directly accessible. Use port-forwarding:

```bash
# Backend
kubectl port-forward svc/todo-backend 7860:7860 -n hackathon-dev &
curl http://localhost:7860/api/health

# Frontend
kubectl port-forward svc/todo-frontend 3000:3000 -n hackathon-dev &
curl http://localhost:3000
```

Or use `minikube service`:
```bash
minikube service todo-frontend -n hackathon-dev
minikube service todo-backend -n hackathon-dev
```

## Validation

Run the full 10-gate validation matrix:

```bash
./phase-04-k8s/scripts/validate.sh
```

### Manual Validation Tests

**Scaling test**:
```bash
kubectl scale deployment todo-backend -n hackathon-dev --replicas=3
kubectl get pods -n hackathon-dev -l app=todo-backend
```

**Self-healing test**:
```bash
kubectl delete pod $(kubectl get pods -n hackathon-dev -l app=todo-backend -o jsonpath='{.items[0].metadata.name}') -n hackathon-dev
# Wait and verify replacement pod appears
kubectl get pods -n hackathon-dev -l app=todo-backend -w
```

**Helm upgrade test**:
```bash
helm upgrade todo-chatbot phase-04-k8s/helm/todo-chatbot/ \
  -n hackathon-dev \
  --set backend.replicaCount=3
```

**Helm rollback test**:
```bash
helm rollback todo-chatbot 1 -n hackathon-dev
```

## Architecture

```
Minikube Cluster (hackathon-dev namespace)
├── todo-backend (Deployment, 2 replicas)
│   ├── NodePort Service (7860 → 30860)
│   ├── HPA (min:2, max:5, CPU:70%)
│   └── Health: /api/health:7860
├── todo-frontend (Deployment, 2 replicas)
│   ├── NodePort Service (3000 → 30080)
│   ├── HPA (min:2, max:5, CPU:70%)
│   └── Health: /:3000
├── todo-config (ConfigMap)
├── todo-db-secret (Secret)
└── metrics-server (addon)
```

## Cleanup

```bash
helm uninstall todo-chatbot -n hackathon-dev
kubectl delete namespace hackathon-dev
minikube stop
minikube delete
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ErrImageNeverPull` | Ensure images are loaded: `minikube image load <image>` |
| Pods stuck in `Pending` | Check resources: `kubectl describe pod <name> -n hackathon-dev` |
| NodePort not accessible | Use `kubectl port-forward` with Docker driver |
| HPA shows `<unknown>` | Wait for metrics-server: `kubectl get --raw /apis/metrics.k8s.io/v1beta1/pods` |
| Namespace ownership error | Add Helm labels: see Step 6 note |
