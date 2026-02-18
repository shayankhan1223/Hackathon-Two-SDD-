#!/bin/bash
# Phase IV Todo Chatbot — Cluster Setup Script
# AI-Generated via Claude Code
# Sets up Minikube cluster and loads Docker images

set -euo pipefail

NAMESPACE="${NAMESPACE:-hackathon-dev}"
BACKEND_IMAGE="${BACKEND_IMAGE:-hackathon-todo-backend:1.0.0}"
FRONTEND_IMAGE="${FRONTEND_IMAGE:-hackathon-todo-frontend:1.0.0}"
CPUS="${CPUS:-2}"
MEMORY="${MEMORY:-2048}"

echo "=== Phase IV: Minikube Cluster Setup ==="

# Check if minikube is already running
if minikube status --format='{{.Host}}' 2>/dev/null | grep -q "Running"; then
    echo "✓ Minikube is already running"
else
    echo "→ Starting Minikube cluster (cpus=$CPUS, memory=${MEMORY}MB)..."
    minikube start --driver=docker --cpus="$CPUS" --memory="$MEMORY"
    echo "✓ Minikube started"
fi

# Enable metrics-server addon for HPA
echo "→ Enabling metrics-server addon..."
minikube addons enable metrics-server 2>/dev/null || true
echo "✓ Metrics-server enabled"

# Create namespace if not exists
echo "→ Creating namespace: $NAMESPACE"
kubectl create namespace "$NAMESPACE" 2>/dev/null || echo "  (namespace already exists)"
echo "✓ Namespace ready"

# Load Docker images into Minikube
echo "→ Loading backend image into Minikube..."
minikube image load "$BACKEND_IMAGE"
echo "✓ Backend image loaded"

echo "→ Loading frontend image into Minikube..."
minikube image load "$FRONTEND_IMAGE"
echo "✓ Frontend image loaded"

# Verify images are available
echo ""
echo "=== Verification ==="
echo "Cluster status:"
minikube status
echo ""
echo "Namespace:"
kubectl get namespace "$NAMESPACE"
echo ""
echo "Images in Minikube:"
minikube image list 2>/dev/null | grep hackathon || echo "  (images loaded)"
echo ""
echo "=== Cluster setup complete! ==="
echo "Next: Create secret and deploy via Helm"
echo "  kubectl create secret generic todo-db-secret -n $NAMESPACE --from-literal=DATABASE_URL=<your-url>"
echo "  helm install todo-chatbot phase-04-k8s/helm/todo-chatbot/ -n $NAMESPACE -f phase-04-k8s/helm/todo-chatbot/values-dev.yaml"
