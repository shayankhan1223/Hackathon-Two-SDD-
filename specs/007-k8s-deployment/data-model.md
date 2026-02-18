# Data Model: Phase IV — Local Kubernetes Deployment

**Feature**: 007-k8s-deployment
**Date**: 2026-02-18

## Infrastructure Entities

Phase IV is an infrastructure feature — the "data model" consists of Kubernetes resources and their relationships rather than application data entities.

### Entity: Container Image

| Attribute | Description |
|-----------|-------------|
| Name | `hackathon-todo-<service>` (frontend or backend) |
| Tag | Semantic version + git SHA (e.g., `1.0.0-abc1234`) |
| Registry | Local Docker daemon / Minikube image cache |
| Build Source | Phase III application source code |
| Dockerfile | AI-generated, multi-stage, stored in `phase-04-k8s/docker/` |

**Relationships**: Referenced by Deployment → Pod spec → container image
**Validation**: Image builds without errors, size < 500MB, HEALTHCHECK present

---

### Entity: Namespace

| Attribute | Value |
|-----------|-------|
| Name | `hackathon-dev` |
| Purpose | Isolate all Phase IV resources |
| Labels | `app.kubernetes.io/part-of: hackathon-todo` |

**Relationships**: Contains all Deployments, Services, HPAs, ConfigMaps, Secrets
**Validation**: Namespace Active status

---

### Entity: Deployment

| Attribute | Frontend | Backend |
|-----------|----------|---------|
| Name | `todo-frontend` | `todo-backend` |
| Replicas | 2 (min via HPA) | 2 (min via HPA) |
| Image | `hackathon-todo-frontend:1.0.0` | `hackathon-todo-backend:1.0.0` |
| Port | 3000 | 7860 |
| CPU Request | 100m | 100m |
| CPU Limit | 500m | 500m |
| Memory Request | 128Mi | 128Mi |
| Memory Limit | 512Mi | 512Mi |
| Liveness Probe | HTTP GET `/` :3000 | HTTP GET `/api/health` :7860 |
| Readiness Probe | HTTP GET `/` :3000 | HTTP GET `/api/health` :7860 |
| Startup Probe | HTTP GET `/` :3000, failureThreshold 30 | HTTP GET `/api/health` :7860, failureThreshold 30 |

**Relationships**: Managed by HPA, exposed by Service, uses ConfigMap + Secret
**Validation**: All replicas Running, probes passing

---

### Entity: Service

| Attribute | Frontend | Backend |
|-----------|----------|---------|
| Name | `todo-frontend-svc` | `todo-backend-svc` |
| Type | NodePort | NodePort |
| Port | 3000 | 7860 |
| NodePort | 30080 | 30860 |
| Selector | `app: todo-frontend` | `app: todo-backend` |

**Relationships**: Routes traffic to Deployment pods
**Validation**: Service accessible at `<minikube-ip>:<nodePort>`

---

### Entity: HPA (Horizontal Pod Autoscaler)

| Attribute | Frontend | Backend |
|-----------|----------|---------|
| Name | `todo-frontend-hpa` | `todo-backend-hpa` |
| Min Replicas | 2 | 2 |
| Max Replicas | 5 | 5 |
| Target CPU | 70% | 70% |
| Scale Target | Deployment/todo-frontend | Deployment/todo-backend |

**Relationships**: Controls Deployment replica count
**Validation**: HPA active, reporting current/target metrics

---

### Entity: ConfigMap

| Attribute | Value |
|-----------|-------|
| Name | `todo-app-config` |
| Data | Application-level env vars (non-secret) |
| Keys | `BACKEND_URL`, `FRONTEND_PORT`, `BACKEND_PORT`, `NODE_ENV` |

**Relationships**: Mounted as env vars in Deployment pods
**Validation**: ConfigMap exists with expected keys

---

### Entity: Secret

| Attribute | Value |
|-----------|-------|
| Name | `todo-db-secret` |
| Type | Opaque |
| Data | `DATABASE_URL` (Neon PostgreSQL connection string) |

**Relationships**: Mounted as env var in backend Deployment pods
**Validation**: Secret exists, backend pods can read it

---

### Entity: Helm Release

| Attribute | Value |
|-----------|-------|
| Name | `todo-chatbot` |
| Chart | `phase-04-k8s/helm/todo-chatbot/` |
| Namespace | `hackathon-dev` |
| Version | 1.0.0 |

**Relationships**: Manages all resources above
**Validation**: Release status `deployed`, supports upgrade/rollback

## Entity Relationship Diagram

```
Helm Release (todo-chatbot)
├── Namespace (hackathon-dev)
│   ├── Deployment (todo-frontend)
│   │   ├── Pod (frontend replica 1)
│   │   └── Pod (frontend replica 2)
│   ├── Deployment (todo-backend)
│   │   ├── Pod (backend replica 1)
│   │   └── Pod (backend replica 2)
│   ├── Service (todo-frontend-svc) → NodePort 30080
│   ├── Service (todo-backend-svc) → NodePort 30860
│   ├── HPA (todo-frontend-hpa) → Deployment/todo-frontend
│   ├── HPA (todo-backend-hpa) → Deployment/todo-backend
│   ├── ConfigMap (todo-app-config)
│   └── Secret (todo-db-secret)
└── Images (loaded via minikube image load)
    ├── hackathon-todo-frontend:1.0.0
    └── hackathon-todo-backend:1.0.0
```

## State Transitions

### Pod Lifecycle
```
Pending → ContainerCreating → Running → (Terminating → Terminated)
                                 ↑              │
                                 └──────────────┘
                              (auto-recovery on deletion)
```

### Helm Release Lifecycle
```
Not Installed → Deployed → Upgraded → (Rolled Back to previous)
                   ↑          │
                   └──────────┘
                  (upgrade cycle)
```
