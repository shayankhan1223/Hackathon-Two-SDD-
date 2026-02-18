# Feature Specification: Phase IV — Local Kubernetes Deployment

**Feature Branch**: `007-k8s-deployment`
**Created**: 2026-02-18
**Status**: Draft
**Input**: User description: "Phase IV: Local Kubernetes Deployment using Minikube, Helm Charts, Docker AI (Gordon), kubectl-ai, and Kagent for the Todo Chatbot application"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Containerize and Deploy Todo Chatbot to Local Kubernetes (Priority: P1)

A DevOps operator wants to deploy the Phase III Todo Chatbot application (frontend and backend) onto a local Kubernetes cluster using AI-generated infrastructure artifacts. The operator uses Docker AI (Gordon) to generate optimized Dockerfiles, builds container images, starts a Minikube cluster, deploys the application via AI-generated Helm charts, and verifies all services are running and accessible.

**Why this priority**: This is the core value proposition — without a working deployment on Kubernetes, no other stories can be validated. It proves the entire AI-governed infrastructure pipeline end-to-end.

**Independent Test**: Can be fully tested by building Docker images, deploying to Minikube via Helm, and accessing the frontend and backend services through exposed endpoints. Delivers a fully running Todo Chatbot on Kubernetes.

**Acceptance Scenarios**:

1. **Given** the Phase III source code exists, **When** Docker AI (Gordon) generates Dockerfiles for frontend and backend, **Then** both images build successfully with no errors and pass a container scan with no critical CVEs.
2. **Given** Docker images are built and tagged, **When** a Helm chart is deployed to Minikube, **Then** all pods reach `Running` state within 120 seconds and health probes pass.
3. **Given** the Helm release is active, **When** the operator accesses the frontend service URL, **Then** the Todo Chatbot UI loads and can communicate with the backend API.
4. **Given** the deployment is running, **When** the operator inspects Kubernetes events, **Then** there are zero error-level events related to the application pods.

---

### User Story 2 - Scaling and Self-Healing Validation (Priority: P2)

A DevOps operator wants to verify that the Kubernetes deployment supports horizontal scaling and automatic recovery from pod failures. The operator uses kubectl-ai to scale replicas and simulate failures, then observes that Kubernetes maintains the desired replica count.

**Why this priority**: Scaling and self-healing are fundamental Kubernetes capabilities that validate the deployment is production-grade. Without this, the deployment is fragile.

**Independent Test**: Can be tested by scaling replicas via kubectl-ai, deleting a pod, and verifying automatic recovery. Delivers confidence in deployment resilience.

**Acceptance Scenarios**:

1. **Given** the application is deployed with 2 replicas each for frontend and backend, **When** the operator uses kubectl-ai to scale backend to 3 replicas, **Then** the third replica reaches `Running` state within 60 seconds.
2. **Given** all pods are running, **When** the operator deletes one backend pod, **Then** Kubernetes automatically schedules a replacement pod that reaches `Running` state within 90 seconds.
3. **Given** a Horizontal Pod Autoscaler (HPA) is configured, **When** resource utilization is reviewed, **Then** the HPA is correctly targeting 70% CPU utilization with defined min/max replica counts.

---

### User Story 3 - Helm Lifecycle Management (Priority: P2)

A DevOps operator wants to perform Helm upgrades and rollbacks to verify the deployment supports safe iterative changes. The operator modifies configuration values, upgrades the release, verifies the new state, then rolls back and confirms the previous state is restored.

**Why this priority**: Helm upgrade and rollback capability is essential for operational safety. It ensures changes can be safely applied and reverted without downtime.

**Independent Test**: Can be tested by upgrading a Helm release with changed values, verifying the change, then rolling back and verifying the original state. Delivers operational lifecycle confidence.

**Acceptance Scenarios**:

1. **Given** a Helm release is active, **When** the operator upgrades the release with a modified replica count, **Then** the new replica count is applied within 60 seconds with zero downtime.
2. **Given** a Helm upgrade has been performed, **When** the operator rolls back to the previous revision, **Then** the previous configuration is restored within 60 seconds with zero downtime.
3. **Given** a rollback has completed, **When** the operator inspects pod status, **Then** all pods match the pre-upgrade configuration and are in `Running` state.

---

### User Story 4 - AI-Assisted Cluster Diagnostics (Priority: P3)

A DevOps operator wants to use AI tools (kubectl-ai and Kagent) to diagnose cluster health issues, debug failing pods, and receive optimization suggestions. The operator invokes AI tools to analyze the cluster state and receives actionable insights.

**Why this priority**: AI-assisted operations demonstrate the project's AI-governance philosophy and provide ongoing operational value, but require a working deployment first.

**Independent Test**: Can be tested by intentionally introducing a misconfiguration, using kubectl-ai and Kagent for diagnosis, and verifying they identify the issue. Delivers AI-powered operational intelligence.

**Acceptance Scenarios**:

1. **Given** the cluster is running, **When** the operator uses kubectl-ai to query deployment status, **Then** kubectl-ai returns an accurate summary of pod states, resource usage, and any warnings.
2. **Given** a pod is in `CrashLoopBackOff` state (intentionally misconfigured), **When** the operator uses kubectl-ai to debug the pod, **Then** kubectl-ai identifies the root cause and suggests a fix.
3. **Given** the cluster is healthy, **When** the operator uses Kagent for cluster health analysis, **Then** Kagent provides a health report with optimization recommendations.

---

### User Story 5 - Full Reproducibility from Scratch (Priority: P3)

A new team member wants to reproduce the entire Kubernetes deployment from a clean environment using only the repository contents and recorded AI prompts. They follow the documented steps and achieve a fully running deployment.

**Why this priority**: Reproducibility is a governance requirement and ensures the project's AI-governed workflow is complete and auditable, but it depends on all other stories being complete.

**Independent Test**: Can be tested by following the documented deployment guide on a clean machine with Docker and Minikube installed. Delivers confidence in documentation completeness.

**Acceptance Scenarios**:

1. **Given** a clean machine with Docker Desktop and Minikube installed, **When** the user follows the deployment guide, **Then** the entire application is running on Kubernetes within 15 minutes.
2. **Given** all AI prompts are recorded as PHRs, **When** the user reviews the prompt history, **Then** every generated artifact (Dockerfile, Helm chart, manifest) traces back to a documented prompt.
3. **Given** the deployment guide exists, **When** the user follows it step by step, **Then** no undocumented manual steps are required.

---

### Edge Cases

- What happens when Minikube runs out of allocated resources (CPU/memory) during deployment?
- How does the system handle a failed Docker image build due to network issues during dependency installation?
- What happens when a Helm upgrade fails midway (e.g., invalid configuration value)?
- How does the system behave when the backend cannot reach the external Neon PostgreSQL database from within the cluster?
- What happens when Minikube is stopped and restarted — does the deployment survive?
- How does the system handle image pull failures when using Minikube's built-in registry?

## Requirements *(mandatory)*

### Functional Requirements

#### Containerization

- **FR-001**: System MUST produce separate container images for the frontend (Next.js) and backend (FastAPI) services, generated via Docker AI (Gordon) or Claude Code.
- **FR-002**: All Dockerfiles MUST use multi-stage builds to minimize final image size.
- **FR-003**: All base images MUST pin exact versions (no `latest` tags).
- **FR-004**: All images MUST include a `HEALTHCHECK` instruction.
- **FR-005**: No secrets or credentials MUST be present in image layers.
- **FR-006**: Image naming convention MUST follow `hackathon-todo-<service>` (e.g., `hackathon-todo-frontend`, `hackathon-todo-backend`).
- **FR-007**: Image tagging MUST use semantic versioning with git SHA suffix (e.g., `1.0.0-abc1234`), plus a `latest` tag for the most recent build.

#### Kubernetes Cluster

- **FR-008**: System MUST use Minikube as the local Kubernetes cluster with Docker driver.
- **FR-009**: Cluster MUST be configured with a dedicated namespace `hackathon-dev` for development deployments.
- **FR-010**: Services MUST be exposed via NodePort for local development access.
- **FR-011**: Minikube's built-in Docker daemon MUST be used for loading images (via `minikube image load` or `eval $(minikube docker-env)`).

#### Helm Charts

- **FR-012**: System MUST deploy the entire application via a single Helm chart residing in `phase-04-k8s/helm/todo-chatbot/`.
- **FR-013**: Helm chart MUST include Deployment templates for both frontend and backend services.
- **FR-014**: Helm chart MUST include Service templates for both frontend and backend.
- **FR-015**: Helm chart MUST support configurable replica counts via `values.yaml`.
- **FR-016**: Helm chart MUST define resource requests and limits for all containers.
- **FR-017**: Helm chart MUST include liveness, readiness, and startup probes for all containers.
- **FR-018**: Helm chart MUST include a Horizontal Pod Autoscaler (HPA) for all stateless services.
- **FR-019**: Helm chart MUST include ConfigMap templates for environment-specific configuration.
- **FR-020**: Helm chart MUST support `helm upgrade` and `helm rollback` operations without downtime.

#### AI DevOps Operations

- **FR-021**: All Dockerfiles MUST be generated using Docker AI (Gordon) or Claude Code, with prompts recorded as PHRs.
- **FR-022**: All Helm chart templates MUST be generated using Claude Code, with prompts recorded as PHRs.
- **FR-023**: kubectl-ai MUST be used for deployment operations, scaling, and pod debugging.
- **FR-024**: Kagent MUST be used for cluster health analysis and resource optimization suggestions.
- **FR-025**: Every AI tool interaction MUST be logged as a Prompt History Record (PHR) in `history/prompts/007-k8s-deployment/`.

#### Configuration Management

- **FR-026**: All environment variables MUST be managed through Kubernetes ConfigMaps and Secrets, not hardcoded.
- **FR-027**: System MUST provide a `.env.example` template documenting all required environment variables.
- **FR-028**: Backend database connection (Neon PostgreSQL) MUST be configured via Kubernetes Secret.

### Key Entities

- **Container Image**: A packaged application artifact identified by name and tag, built from a Dockerfile, containing one service (frontend or backend).
- **Helm Release**: A deployed instance of the Helm chart on the Kubernetes cluster, versioned and supporting upgrade/rollback operations.
- **Namespace**: A logical isolation boundary within Kubernetes (`hackathon-dev`) containing all application resources.
- **Pod**: The smallest deployable unit, running one container, managed by a Deployment with defined health probes and resource limits.
- **Service**: A stable network endpoint exposing pods to internal or external traffic via NodePort.
- **HPA (Horizontal Pod Autoscaler)**: An auto-scaling controller that adjusts pod replica counts based on CPU utilization metrics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both frontend and backend container images build successfully in under 5 minutes each, with final image sizes under 500MB.
- **SC-002**: The complete application deploys to Minikube and all pods reach `Running` state within 120 seconds of Helm install.
- **SC-003**: The frontend service is accessible via browser through the Minikube-exposed URL, and the Todo Chatbot UI loads and functions correctly.
- **SC-004**: Minimum 2 replicas of each service run simultaneously with zero downtime during scaling operations.
- **SC-005**: Pod deletion triggers automatic recovery, with a replacement pod reaching `Running` state within 90 seconds.
- **SC-006**: Helm rollback restores the previous deployment configuration within 60 seconds with zero service interruption.
- **SC-007**: All AI-generated artifacts (Dockerfiles, Helm charts, manifests) trace to documented prompts in PHR records.
- **SC-008**: A new team member can reproduce the full deployment from a clean environment in under 15 minutes using only the repository documentation.
- **SC-009**: Zero manual YAML files exist in the final delivery — all Kubernetes and Helm configuration is AI-generated.
- **SC-010**: All health probes (liveness, readiness, startup) pass for every pod within 60 seconds of deployment.

## Infrastructure Architecture

### Deployment Topology

```
┌─────────────────────────────────────────────────────┐
│                    Minikube Cluster                  │
│                                                     │
│  ┌──────────── hackathon-dev namespace ───────────┐ │
│  │                                                │ │
│  │  ┌─────────────┐       ┌──────────────┐       │ │
│  │  │  Frontend    │       │  Backend     │       │ │
│  │  │  Deployment  │       │  Deployment  │       │ │
│  │  │  (2+ pods)   │       │  (2+ pods)   │       │ │
│  │  │  Next.js     │──────▶│  FastAPI     │       │ │
│  │  └──────┬──────┘       └──────┬───────┘       │ │
│  │         │                     │                │ │
│  │  ┌──────┴──────┐       ┌──────┴───────┐       │ │
│  │  │  Frontend    │       │  Backend     │       │ │
│  │  │  Service     │       │  Service     │       │ │
│  │  │  (NodePort)  │       │  (NodePort)  │       │ │
│  │  └─────────────┘       └──────────────┘       │ │
│  │         │                     │                │ │
│  │  ┌──────┴──────┐       ┌──────┴───────┐       │ │
│  │  │  Frontend    │       │  Backend     │       │ │
│  │  │  HPA         │       │  HPA         │       │ │
│  │  └─────────────┘       └──────────────┘       │ │
│  │                                                │ │
│  │  ┌─────────────┐       ┌──────────────┐       │ │
│  │  │  ConfigMap   │       │  Secret      │       │ │
│  │  │  (app config)│       │  (DB creds)  │       │ │
│  │  └─────────────┘       └──────────────┘       │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Neon PostgreSQL  │
              │  (External DB)    │
              └──────────────────┘
```

### Helm Chart Structure

```
phase-04-k8s/helm/todo-chatbot/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── templates/
│   ├── _helpers.tpl
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── frontend-hpa.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml
│   ├── configmap.yaml
│   └── secret.yaml
└── tests/
    └── test-connection.yaml
```

### values.yaml Configuration Structure

```yaml
# Service-level configuration
frontend:
  replicaCount: 2
  image:
    repository: hackathon-todo-frontend
    tag: "1.0.0"
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 3000
    nodePort: 30080
  resources:
    requests:
      cpu: "100m"
      memory: "128Mi"
    limits:
      cpu: "500m"
      memory: "512Mi"
  hpa:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 70

backend:
  replicaCount: 2
  image:
    repository: hackathon-todo-backend
    tag: "1.0.0"
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 7860
    nodePort: 30860
  resources:
    requests:
      cpu: "100m"
      memory: "128Mi"
    limits:
      cpu: "500m"
      memory: "512Mi"
  hpa:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 70

# Namespace
namespace: hackathon-dev
```

## AI Tool Responsibilities

| Tool | Responsibility | Output Artifacts |
|------|---------------|-----------------|
| **Docker AI (Gordon)** | Generate and optimize Dockerfiles for frontend and backend | `phase-04-k8s/docker/Dockerfile.frontend`, `phase-04-k8s/docker/Dockerfile.backend` |
| **Claude Code** | Generate Helm charts, deployment scripts, configuration templates, orchestrate workflow | Helm chart directory, deployment scripts, documentation |
| **kubectl-ai** | Deploy to cluster, scale services, debug pod failures, query cluster state | Deployment operations, diagnostic outputs |
| **Kagent** | Analyze cluster health, suggest resource optimizations, automated remediation | Health reports, optimization recommendations |

### AI Interaction Logging

Every interaction with an AI tool MUST be recorded as a PHR containing:
- The exact prompt used
- The AI tool and model that produced the output
- The iteration count (if refined)
- The output artifact reference
- Storage location: `history/prompts/007-k8s-deployment/`

## Deployment Flow

### Phase IV Deployment Pipeline

```
1. Prerequisites
   └─→ Verify Docker Desktop, Minikube, Helm, kubectl-ai, Kagent installed

2. Containerization (Docker AI / Gordon)
   ├─→ Generate frontend Dockerfile
   ├─→ Generate backend Dockerfile
   ├─→ Build and tag images
   └─→ Verify images (scan, size, healthcheck)

3. Cluster Setup
   ├─→ Start Minikube cluster
   ├─→ Create hackathon-dev namespace
   ├─→ Load images into Minikube
   └─→ Verify cluster readiness

4. Helm Deployment (Claude Code + kubectl-ai)
   ├─→ Generate Helm chart via Claude Code
   ├─→ Deploy via helm install
   ├─→ Verify all pods running
   └─→ Verify services accessible

5. Validation (Full Matrix)
   ├─→ Pod health verification
   ├─→ Service accessibility test
   ├─→ Replica scaling test
   ├─→ Failure simulation test
   ├─→ Helm upgrade/rollback test
   └─→ AI diagnostics validation

6. Documentation
   ├─→ Record all PHRs
   ├─→ Generate deployment guide
   └─→ Verify reproducibility
```

## Testing & Validation Criteria

### Validation Matrix

| Gate | Validation | Method | Pass Criteria |
|------|-----------|--------|---------------|
| **Container Build** | Images build successfully | `docker build` + scan | Zero build errors, no critical CVEs, image size < 500MB |
| **Kubernetes Deploy** | All resources created | `kubectl get events -n hackathon-dev` | Zero error events for application resources |
| **Pod Health** | All pods reach Running state | `kubectl get pods -n hackathon-dev` | All pods `Running`, all probes passing within 120s |
| **Service Access** | Frontend and backend reachable | `curl` via Minikube service URL | HTTP 200 response from both services |
| **Replica Scaling** | HPA scales under load | `kubectl get hpa -n hackathon-dev` | HPA active, scales between min and max replicas |
| **Failure Recovery** | Pod deletion triggers recovery | `kubectl delete pod` + observe | Replacement pod `Running` within 90 seconds |
| **Helm Upgrade** | Rolling update completes | `helm upgrade` + health check | Zero downtime, new configuration applied |
| **Helm Rollback** | Previous revision restores | `helm rollback` + verification | Previous configuration restored within 60 seconds |
| **AI Diagnostics** | kubectl-ai and Kagent functional | Run diagnostic commands | Accurate cluster state reporting, actionable suggestions |
| **Reproducibility** | Deployment guide works end-to-end | Fresh environment test | Complete deployment from docs in under 15 minutes |

## Governance & Constraints

### Mandatory Constraints

1. **Zero Manual YAML**: All Kubernetes manifests, Helm templates, and Dockerfiles MUST be AI-generated. No hand-written infrastructure configuration is permitted.
2. **Prompt Provenance**: Every AI-generated artifact MUST trace back to a recorded prompt (PHR). The chain from requirement to deployed resource MUST be auditable.
3. **Phase Isolation**: Phase IV MUST NOT modify files in Phase I, II, or III directories. It consumes their built images only.
4. **Resource Governance**: All pods MUST declare resource requests and limits. Omitting limits is a governance violation.
5. **Health Check Mandate**: Every deployment MUST include liveness, readiness, and startup probes.
6. **Namespace Isolation**: All resources MUST be deployed within the `hackathon-dev` namespace.
7. **Image Security**: No secrets in image layers. All sensitive configuration via Kubernetes Secrets.
8. **Reproducibility**: The deployment MUST be reproducible from a clean environment using only repository contents and documented prompts.

### Assumptions

- Docker Desktop is installed and running on the development machine.
- Minikube is installed and can be started with the Docker driver.
- Helm 3 is installed and available on the PATH.
- kubectl-ai and Kagent are installed and configured.
- The Phase III application source code is stable and does not require modifications for containerization (existing Dockerfile in `phase-03-ai-chat/backend/` serves as reference, but Phase IV generates its own optimized Dockerfiles).
- The external Neon PostgreSQL database is accessible from within the Minikube cluster (outbound network access available).
- Minikube has sufficient resources allocated (minimum 4 CPUs, 8GB RAM recommended).
- The metrics-server addon is enabled in Minikube for HPA functionality.

### Out of Scope

- Production cloud deployment (AWS EKS, GKE, AKS).
- CI/CD pipeline automation (GitHub Actions, ArgoCD).
- TLS/SSL certificate management.
- Multi-cluster or multi-region deployment.
- Service mesh (Istio, Linkerd).
- Persistent volume claims for application data (database is external).
- Ingress controller configuration (using NodePort for simplicity).
- Monitoring stack (Prometheus, Grafana) — may be a future phase.

### Dependencies

- **Phase III**: Working frontend and backend application source code.
- **External**: Neon PostgreSQL database connectivity.
- **Tools**: Docker Desktop, Minikube, Helm 3, kubectl, kubectl-ai, Kagent.
