#!/bin/bash
# Phase IV Todo Chatbot — Deployment Script
# AI-Generated via Claude Code
# Deploys the Todo Chatbot to Minikube via Helm

set -euo pipefail

NAMESPACE="${NAMESPACE:-hackathon-dev}"
RELEASE_NAME="${RELEASE_NAME:-todo-chatbot}"
CHART_PATH="${CHART_PATH:-phase-04-k8s/helm/todo-chatbot}"
VALUES_FILE="${VALUES_FILE:-phase-04-k8s/helm/todo-chatbot/values-dev.yaml}"
DATABASE_URL="${DATABASE_URL:-}"
TIMEOUT="${TIMEOUT:-120s}"

echo "=== Phase IV: Todo Chatbot Deployment ==="

# Verify prerequisites
echo "→ Verifying prerequisites..."
if ! minikube status --format='{{.Host}}' 2>/dev/null | grep -q "Running"; then
    echo "✗ Minikube is not running. Run setup-cluster.sh first."
    exit 1
fi
echo "✓ Minikube running"

if ! kubectl get namespace "$NAMESPACE" &>/dev/null; then
    echo "✗ Namespace $NAMESPACE not found. Run setup-cluster.sh first."
    exit 1
fi
echo "✓ Namespace $NAMESPACE exists"

# Create secret if DATABASE_URL is provided and secret doesn't exist
if [ -n "$DATABASE_URL" ]; then
    echo "→ Creating database secret..."
    kubectl create secret generic todo-db-secret \
        -n "$NAMESPACE" \
        --from-literal=DATABASE_URL="$DATABASE_URL" \
        --dry-run=client -o yaml | kubectl apply -f -
    echo "✓ Secret created/updated"
elif ! kubectl get secret todo-db-secret -n "$NAMESPACE" &>/dev/null; then
    echo "⚠ Warning: No DATABASE_URL provided and todo-db-secret not found."
    echo "  Set DATABASE_URL env var or create secret manually:"
    echo "  kubectl create secret generic todo-db-secret -n $NAMESPACE --from-literal=DATABASE_URL=<your-url>"
    exit 1
fi
echo "✓ Database secret ready"

# Deploy or upgrade via Helm
echo "→ Deploying via Helm..."
if helm status "$RELEASE_NAME" -n "$NAMESPACE" &>/dev/null; then
    echo "  Upgrading existing release..."
    helm upgrade "$RELEASE_NAME" "$CHART_PATH" \
        -n "$NAMESPACE" \
        -f "$VALUES_FILE" \
        --wait --timeout "$TIMEOUT"
    echo "✓ Helm upgrade complete"
else
    echo "  Installing new release..."
    helm install "$RELEASE_NAME" "$CHART_PATH" \
        -n "$NAMESPACE" \
        -f "$VALUES_FILE" \
        --wait --timeout "$TIMEOUT"
    echo "✓ Helm install complete"
fi

# Wait for pods to be ready
echo "→ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod \
    -l app.kubernetes.io/instance="$RELEASE_NAME" \
    -n "$NAMESPACE" \
    --timeout="$TIMEOUT" 2>/dev/null || echo "  (some pods may still be starting)"

# Verification
echo ""
echo "=== Deployment Verification ==="
echo ""
echo "Pods:"
kubectl get pods -n "$NAMESPACE" -o wide
echo ""
echo "Services:"
kubectl get svc -n "$NAMESPACE"
echo ""
echo "HPA:"
kubectl get hpa -n "$NAMESPACE"
echo ""

# Get Minikube IP for access
MINIKUBE_IP=$(minikube ip)
echo "=== Access URLs ==="
echo "Frontend: http://$MINIKUBE_IP:30080"
echo "Backend:  http://$MINIKUBE_IP:30860/api/health"
echo ""
echo "To test:"
echo "  curl http://$MINIKUBE_IP:30860/api/health"
echo "  curl http://$MINIKUBE_IP:30080"
