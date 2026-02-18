# Validation Contracts: Phase IV — Local Kubernetes Deployment

**Feature**: 007-k8s-deployment
**Date**: 2026-02-18

## Validation Matrix Contract

This document defines the formal validation contracts for the 10-gate validation matrix. Each gate specifies exact commands, expected outputs, and pass/fail criteria.

---

### Gate 1: Container Build

**Command**:
```bash
docker build -t hackathon-todo-backend:1.0.0 -f phase-04-k8s/docker/Dockerfile.backend phase-03-ai-chat/backend/
docker build -t hackathon-todo-frontend:1.0.0 -f phase-04-k8s/docker/Dockerfile.frontend phase-03-ai-chat/frontend/
```

**Pass Criteria**:
- Exit code 0 for both builds
- `docker images | grep hackathon-todo` shows both images
- Image sizes < 500MB each
- `docker inspect --format='{{.Config.Healthcheck}}' hackathon-todo-backend:1.0.0` returns non-empty

**Fail Criteria**:
- Any build error, image > 500MB, missing HEALTHCHECK

---

### Gate 2: Kubernetes Deploy

**Command**:
```bash
kubectl get events -n hackathon-dev --field-selector type=Warning --no-headers
```

**Pass Criteria**:
- Empty output (zero warning/error events for app resources)

**Fail Criteria**:
- Any Warning or Error events related to todo-frontend or todo-backend

---

### Gate 3: Pod Health

**Command**:
```bash
kubectl get pods -n hackathon-dev -o wide
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n hackathon-dev --timeout=120s
```

**Pass Criteria**:
- All pods show STATUS=Running
- All pods show READY=1/1
- `kubectl wait` exits with code 0 within 120 seconds

**Fail Criteria**:
- Any pod not Running, any pod not Ready, timeout exceeded

---

### Gate 4: Service Access

**Command**:
```bash
MINIKUBE_IP=$(minikube ip)
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:30860/api/health
curl -s -o /dev/null -w "%{http_code}" http://${MINIKUBE_IP}:30080
```

**Pass Criteria**:
- Backend returns HTTP 200
- Frontend returns HTTP 200

**Fail Criteria**:
- Any non-200 response, connection refused, timeout

---

### Gate 5: Replica Scaling

**Command**:
```bash
kubectl get hpa -n hackathon-dev
kubectl get deployment -n hackathon-dev
```

**Pass Criteria**:
- HPA shows TARGETS with current/target values
- HPA MINPODS=2, MAXPODS=5
- Deployments show READY=2/2

**Fail Criteria**:
- HPA shows `<unknown>` targets, incorrect min/max, replicas not matching

---

### Gate 6: Failure Recovery

**Command**:
```bash
POD=$(kubectl get pods -n hackathon-dev -l app=todo-backend -o jsonpath='{.items[0].metadata.name}')
kubectl delete pod $POD -n hackathon-dev
sleep 5
kubectl wait --for=condition=ready pod -l app=todo-backend -n hackathon-dev --timeout=90s
kubectl get pods -n hackathon-dev -l app=todo-backend
```

**Pass Criteria**:
- New pod created automatically
- New pod reaches Running/Ready within 90 seconds
- Total backend pods equals desired replica count

**Fail Criteria**:
- No replacement pod created, replacement takes > 90 seconds

---

### Gate 7: Helm Upgrade

**Command**:
```bash
helm upgrade todo-chatbot phase-04-k8s/helm/todo-chatbot/ -n hackathon-dev --set backend.replicaCount=3
kubectl wait --for=condition=ready pod -l app=todo-backend -n hackathon-dev --timeout=60s
kubectl get deployment -n hackathon-dev
curl -s -o /dev/null -w "%{http_code}" http://$(minikube ip):30080
```

**Pass Criteria**:
- Helm upgrade succeeds (exit code 0)
- Backend shows 3/3 READY
- Frontend still accessible (HTTP 200) during upgrade

**Fail Criteria**:
- Upgrade fails, incorrect replica count, frontend unavailable during upgrade

---

### Gate 8: Helm Rollback

**Command**:
```bash
helm rollback todo-chatbot 1 -n hackathon-dev
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n hackathon-dev --timeout=60s
kubectl get deployment -n hackathon-dev
```

**Pass Criteria**:
- Rollback succeeds (exit code 0)
- Backend restored to 2/2 READY within 60 seconds
- Application accessible after rollback

**Fail Criteria**:
- Rollback fails, previous state not restored, application unavailable

---

### Gate 9: AI Diagnostics

**Command**:
```bash
kubectl-ai "Show the status of all pods in hackathon-dev namespace"
kagent "Analyze cluster health"
```

**Pass Criteria**:
- kubectl-ai returns accurate pod status matching `kubectl get pods` output
- Kagent returns a health report with cluster metrics

**Fail Criteria**:
- AI tools return errors, inaccurate information, or no output

---

### Gate 10: Reproducibility

**Validation**:
1. Verify `phase-04-k8s/docs/deployment-guide.md` exists and is complete
2. Verify all steps are documented with no gaps
3. Verify `phase-04-k8s/.env.example` documents all required environment variables
4. Verify all PHRs exist in `history/prompts/007-k8s-deployment/`

**Pass Criteria**:
- Deployment guide exists with complete step-by-step instructions
- No undocumented manual steps
- Every AI-generated artifact has a corresponding PHR
- `.env.example` documents all required environment variables

**Fail Criteria**:
- Missing guide, undocumented steps, missing PHRs, missing env var documentation
