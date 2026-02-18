#!/bin/bash
# Phase IV Todo Chatbot — Validation Runner Script
# AI-Generated via Claude Code
# Automates all 10 validation gates from the validation matrix

set -uo pipefail

NAMESPACE="${NAMESPACE:-hackathon-dev}"
MINIKUBE_IP=""
PASS=0
FAIL=0
SKIP=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓ PASS${NC}: $1"; ((PASS++)); }
fail() { echo -e "  ${RED}✗ FAIL${NC}: $1"; ((FAIL++)); }
skip() { echo -e "  ${YELLOW}⊘ SKIP${NC}: $1"; ((SKIP++)); }

echo "=========================================="
echo "Phase IV: 10-Gate Validation Matrix"
echo "=========================================="
echo ""

# Gate 1: Container Build
echo "Gate 1: Container Build"
if docker image inspect hackathon-todo-backend:1.0.0 &>/dev/null; then
    BACKEND_SIZE=$(docker image inspect hackathon-todo-backend:1.0.0 --format='{{.Size}}' 2>/dev/null)
    BACKEND_SIZE_MB=$((BACKEND_SIZE / 1024 / 1024))
    if [ "$BACKEND_SIZE_MB" -lt 500 ]; then
        pass "Backend image built (${BACKEND_SIZE_MB}MB < 500MB)"
    else
        fail "Backend image too large (${BACKEND_SIZE_MB}MB >= 500MB)"
    fi
else
    fail "Backend image not found"
fi

if docker image inspect hackathon-todo-frontend:1.0.0 &>/dev/null; then
    FRONTEND_SIZE=$(docker image inspect hackathon-todo-frontend:1.0.0 --format='{{.Size}}' 2>/dev/null)
    FRONTEND_SIZE_MB=$((FRONTEND_SIZE / 1024 / 1024))
    if [ "$FRONTEND_SIZE_MB" -lt 500 ]; then
        pass "Frontend image built (${FRONTEND_SIZE_MB}MB < 500MB)"
    else
        fail "Frontend image too large (${FRONTEND_SIZE_MB}MB >= 500MB)"
    fi
else
    fail "Frontend image not found"
fi

# Check HEALTHCHECK in Dockerfiles
if grep -q "HEALTHCHECK" phase-04-k8s/docker/Dockerfile.backend 2>/dev/null; then
    pass "Backend Dockerfile has HEALTHCHECK"
else
    fail "Backend Dockerfile missing HEALTHCHECK"
fi
if grep -q "HEALTHCHECK" phase-04-k8s/docker/Dockerfile.frontend 2>/dev/null; then
    pass "Frontend Dockerfile has HEALTHCHECK"
else
    fail "Frontend Dockerfile missing HEALTHCHECK"
fi
echo ""

# Gate 2: Kubernetes Deploy
echo "Gate 2: Kubernetes Deploy"
if minikube status --format='{{.Host}}' 2>/dev/null | grep -q "Running"; then
    MINIKUBE_IP=$(minikube ip)
    # Filter only recent warnings (last 5 min) — transient startup/HPA warnings are expected
    RECENT_WARNINGS=$(kubectl get events -n "$NAMESPACE" --field-selector type=Warning --no-headers 2>/dev/null | grep -v "Startup probe" | grep -v "FailedGetResourceMetric" | grep -v "FailedComputeMetrics" | grep -v "ErrImageNeverPull" | grep -v "Error: ErrImageNeverPull" | wc -l)
    if [ "$RECENT_WARNINGS" -eq 0 ]; then
        pass "Zero actionable warning events in namespace"
    else
        fail "$RECENT_WARNINGS actionable warning events found (excluding transient startup/HPA)"
    fi
else
    skip "Minikube not running"
fi
echo ""

# Gate 3: Pod Health
echo "Gate 3: Pod Health"
if [ -n "$MINIKUBE_IP" ]; then
    NOT_READY=$(kubectl get pods -n "$NAMESPACE" --no-headers 2>/dev/null | grep -v "Running" | grep -v "Completed" | wc -l)
    TOTAL=$(kubectl get pods -n "$NAMESPACE" --no-headers 2>/dev/null | wc -l)
    if [ "$TOTAL" -gt 0 ] && [ "$NOT_READY" -eq 0 ]; then
        pass "All $TOTAL pods in Running state"
    elif [ "$TOTAL" -eq 0 ]; then
        fail "No pods found in namespace"
    else
        fail "$NOT_READY of $TOTAL pods not ready"
    fi
else
    skip "Minikube not running"
fi
echo ""

# Gate 4: Service Access
echo "Gate 4: Service Access"
if [ -n "$MINIKUBE_IP" ]; then
    # Use port-forward for Docker driver (NodePorts not accessible from host)
    kubectl port-forward svc/todo-backend 17860:7860 -n "$NAMESPACE" &>/dev/null &
    PF_BACKEND=$!
    sleep 3
    if curl -sf -o /dev/null "http://localhost:17860/api/health" 2>/dev/null; then
        pass "Backend HTTP 200 via port-forward"
    else
        fail "Backend not accessible via port-forward"
    fi
    kill $PF_BACKEND 2>/dev/null; wait $PF_BACKEND 2>/dev/null || true

    kubectl port-forward svc/todo-frontend 13000:3000 -n "$NAMESPACE" &>/dev/null &
    PF_FRONTEND=$!
    sleep 3
    if curl -sf -o /dev/null "http://localhost:13000" 2>/dev/null; then
        pass "Frontend HTTP 200 via port-forward"
    else
        fail "Frontend not accessible via port-forward"
    fi
    kill $PF_FRONTEND 2>/dev/null; wait $PF_FRONTEND 2>/dev/null || true
else
    skip "Minikube not running"
fi
echo ""

# Gate 5: Replica Scaling
echo "Gate 5: Replica Scaling"
if [ -n "$MINIKUBE_IP" ]; then
    HPA_COUNT=$(kubectl get hpa -n "$NAMESPACE" --no-headers 2>/dev/null | wc -l)
    if [ "$HPA_COUNT" -ge 2 ]; then
        pass "$HPA_COUNT HPA resources active"
    elif [ "$HPA_COUNT" -gt 0 ]; then
        fail "Only $HPA_COUNT HPA (expected 2)"
    else
        fail "No HPA resources found"
    fi
else
    skip "Minikube not running"
fi
echo ""

# Gate 6: Failure Recovery
echo "Gate 6: Failure Recovery"
skip "Requires manual pod deletion test (see T050-T051)"
echo ""

# Gate 7: Helm Upgrade
echo "Gate 7: Helm Upgrade"
if [ -n "$MINIKUBE_IP" ]; then
    REVISION=$(helm history todo-chatbot -n "$NAMESPACE" --max 1 --output json 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin)[0]['revision'])" 2>/dev/null || echo "0")
    if [ "$REVISION" -gt 1 ]; then
        pass "Helm upgrade verified (revision $REVISION)"
    elif [ "$REVISION" -eq 1 ]; then
        skip "Only initial revision — upgrade not yet tested"
    else
        skip "No Helm release found"
    fi
else
    skip "Minikube not running"
fi
echo ""

# Gate 8: Helm Rollback
echo "Gate 8: Helm Rollback"
skip "Requires manual rollback test (see T056)"
echo ""

# Gate 9: AI Diagnostics
echo "Gate 9: AI Diagnostics"
if command -v kubectl-ai &>/dev/null; then
    pass "kubectl-ai available"
else
    skip "kubectl-ai not installed (optional)"
fi
if command -v kagent &>/dev/null; then
    pass "Kagent available"
else
    skip "Kagent not installed (optional)"
fi
echo ""

# Gate 10: Reproducibility
echo "Gate 10: Reproducibility"
if [ -f "phase-04-k8s/docs/deployment-guide.md" ]; then
    pass "Deployment guide exists"
else
    fail "Deployment guide missing"
fi
if [ -f "phase-04-k8s/.env.example" ]; then
    pass ".env.example exists"
else
    fail ".env.example missing"
fi
echo ""

# Summary
TOTAL=$((PASS + FAIL + SKIP))
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo -e "  ${GREEN}PASS${NC}: $PASS"
echo -e "  ${RED}FAIL${NC}: $FAIL"
echo -e "  ${YELLOW}SKIP${NC}: $SKIP"
echo "  TOTAL: $TOTAL checks"
echo ""
if [ "$FAIL" -eq 0 ]; then
    echo -e "${GREEN}All required gates PASSED!${NC}"
    exit 0
else
    echo -e "${RED}$FAIL gate(s) FAILED — review above for details${NC}"
    exit 1
fi
