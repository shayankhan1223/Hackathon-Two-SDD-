# Implementation Plan: Phase IV — Local Kubernetes Deployment

**Branch**: `007-k8s-deployment` | **Date**: 2026-02-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-k8s-deployment/spec.md`

## Summary

Deploy the Phase III Todo Chatbot application (Next.js frontend + FastAPI backend) to a local Kubernetes cluster using Minikube, with all infrastructure artifacts (Dockerfiles, Helm charts, manifests) AI-generated via Docker AI (Gordon), Claude Code, kubectl-ai, and Kagent. The deployment uses a single Helm chart with configurable replicas, resource limits, health probes, and HPA, exposed via NodePort in the `hackathon-dev` namespace.

## Technical Context

**Language/Version**: Python 3.12 (backend), TypeScript 5.9.3 / Node.js (frontend)
**Primary Dependencies**: Docker Desktop, Minikube (Docker driver), Helm 3, kubectl-ai, Kagent
**Storage**: Neon PostgreSQL (external, accessed via Kubernetes Secret)
**Testing**: Manual validation matrix (10 gates) — kubectl, helm, curl commands
**Target Platform**: Local Kubernetes (Minikube) on Linux
**Project Type**: Infrastructure-as-AI-Artifact (containerization + orchestration)
**Performance Goals**: All pods Running within 120s, pod recovery within 90s, images < 500MB
**Constraints**: Zero manual YAML, all artifacts AI-generated with PHR provenance, phase isolation (no Phase I-III file modifications)
**Scale/Scope**: 2 services (frontend, backend), 2+ replicas each, single namespace, NodePort exposure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution template is unfilled. Governance rules are defined in `CLAUDE.md`. Checking against CLAUDE.md governance:

| Gate | Rule | Status |
|------|------|--------|
| Spec-Driven Lifecycle | `/sp.specify` → `/sp.plan` → `/sp.tasks` → Implementation | PASS — Spec complete, now in plan phase |
| AI-Only Implementation | All Dockerfiles, Helm charts, K8s manifests AI-generated | PASS — Planned via Gordon, Claude Code, kubectl-ai |
| Prompt Documentation | Every AI artifact has PHR | PASS — PHR logging planned for every milestone |
| Phase Isolation | Phase IV does not modify Phase I-III directories | PASS — Phase IV reads source only; outputs to `phase-04-k8s/` |
| Resource Limits | All pods declare requests and limits | PASS — Defined in values.yaml spec |
| Health Checks | Liveness, readiness, startup probes required | PASS — FR-017 mandates all three probe types |
| Namespace Policy | Resources in `hackathon-dev` namespace | PASS — FR-009 specifies namespace |
| Helm Chart Location | Charts reside in `phase-04-k8s/helm/` | PASS — FR-012 specifies `phase-04-k8s/helm/todo-chatbot/` |

**Result**: All gates PASS. No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/007-k8s-deployment/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (infrastructure entities)
├── quickstart.md        # Phase 1 output (deployment quickstart)
├── contracts/           # Phase 1 output (validation contracts)
│   └── validation-matrix.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
phase-04-k8s/
├── docker/
│   ├── Dockerfile.frontend    # AI-generated (Docker AI / Gordon)
│   └── Dockerfile.backend     # AI-generated (Docker AI / Gordon)
├── helm/
│   └── todo-chatbot/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       ├── templates/
│       │   ├── _helpers.tpl
│       │   ├── namespace.yaml
│       │   ├── frontend-deployment.yaml
│       │   ├── frontend-service.yaml
│       │   ├── frontend-hpa.yaml
│       │   ├── backend-deployment.yaml
│       │   ├── backend-service.yaml
│       │   ├── backend-hpa.yaml
│       │   ├── configmap.yaml
│       │   └── secret.yaml
│       └── tests/
│           └── test-connection.yaml
├── scripts/
│   ├── setup-cluster.sh       # AI-generated cluster setup
│   ├── build-images.sh        # AI-generated image build
│   ├── deploy.sh              # AI-generated deployment
│   └── validate.sh            # AI-generated validation runner
├── docs/
│   └── deployment-guide.md    # AI-generated deployment documentation
└── .env.example               # Environment variable template
```

**Structure Decision**: Infrastructure-as-AI-Artifact layout under `phase-04-k8s/`. All files are AI-generated; no hand-written YAML. Phase III source is consumed read-only for Docker builds.

## Complexity Tracking

No constitution violations to justify. All gates pass.

---

## Milestone 1 — Environment Preparation

### Objective
Verify that all required AI DevOps tools are installed, configured, and functional on the local development machine.

### Inputs
- Development machine with Linux OS
- Internet connectivity for tool installation

### AI Tools Used
- **Claude Code**: Generate installation verification script

### Expected Outputs
- All tools installed and version-verified
- `phase-04-k8s/scripts/verify-tools.sh` — AI-generated verification script
- PHR documenting tool verification

### Steps

1. **Verify Docker Desktop** is installed and running with Docker AI (Gordon) enabled
   - `docker --version` returns Docker 24.x+
   - `docker ai` or Gordon CLI is responsive
2. **Verify Minikube** is installed
   - `minikube version` returns v1.32+
3. **Verify Helm** is installed
   - `helm version` returns v3.x
4. **Verify kubectl** is installed
   - `kubectl version --client` returns v1.28+
5. **Verify kubectl-ai** is installed and configured
   - `kubectl-ai --help` returns usage information
6. **Verify Kagent** is installed
   - `kagent --help` or equivalent returns usage information
7. **Generate verification script** via Claude Code that checks all tools and reports status
8. **Record PHR** for environment preparation

### Validation Criteria

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| Docker | `docker --version` | Version 24.x+ reported |
| Docker AI | `docker ai --help` or Gordon CLI test | Responds with usage info |
| Minikube | `minikube version` | Version 1.32+ reported |
| Helm | `helm version` | Version 3.x reported |
| kubectl | `kubectl version --client` | Version 1.28+ reported |
| kubectl-ai | `kubectl-ai --help` | Usage info displayed |
| Kagent | `kagent --help` | Usage info displayed |

### Exit Conditions
- All 7 tools verified as installed and functional
- Verification script generated and committed
- PHR recorded

---

## Milestone 2 — Containerization via AI

### Objective
Generate optimized, multi-stage Dockerfiles for both frontend and backend services using Docker AI (Gordon), build container images, and verify they run correctly.

### Inputs
- Phase III source code: `phase-03-ai-chat/frontend/` and `phase-03-ai-chat/backend/`
- Existing backend Dockerfile reference: `phase-03-ai-chat/backend/Dockerfile`
- Frontend: Next.js 16+, React 19, TypeScript 5.9.3, Tailwind CSS 4.x
- Backend: Python 3.12, FastAPI, SQLModel, uvicorn, port 7860
- Backend health endpoint: `/api/health`

### AI Tools Used
- **Docker AI (Gordon)**: Generate and optimize Dockerfiles
- **Claude Code**: Orchestrate, review, and refine Dockerfiles

### Expected Outputs
- `phase-04-k8s/docker/Dockerfile.frontend` — Multi-stage Dockerfile for Next.js frontend
- `phase-04-k8s/docker/Dockerfile.backend` — Multi-stage Dockerfile for FastAPI backend
- Built images: `hackathon-todo-frontend:1.0.0`, `hackathon-todo-backend:1.0.0`
- `phase-04-k8s/scripts/build-images.sh` — AI-generated build script
- PHRs for each Dockerfile generation

### Steps

1. **Generate backend Dockerfile** using Docker AI (Gordon)
   - Prompt Gordon for a production-grade, multi-stage Python 3.12 FastAPI Dockerfile
   - Requirements: pinned base image, multi-stage build, HEALTHCHECK, no secrets, minimal image size
   - Output: `phase-04-k8s/docker/Dockerfile.backend`
   - Record PHR
2. **Generate frontend Dockerfile** using Docker AI (Gordon)
   - Prompt Gordon for a production-grade, multi-stage Node.js/Next.js Dockerfile
   - Requirements: pinned base image, multi-stage build (deps → build → runtime), HEALTHCHECK, standalone output
   - Output: `phase-04-k8s/docker/Dockerfile.frontend`
   - Record PHR
3. **Build both images** using Docker CLI
   - Backend: `docker build -t hackathon-todo-backend:1.0.0 -f phase-04-k8s/docker/Dockerfile.backend phase-03-ai-chat/backend/`
   - Frontend: `docker build -t hackathon-todo-frontend:1.0.0 -f phase-04-k8s/docker/Dockerfile.frontend phase-03-ai-chat/frontend/`
4. **Verify image sizes** are under 500MB each
5. **Test backend container** locally
   - `docker run -d -p 7860:7860 --name test-backend hackathon-todo-backend:1.0.0`
   - Verify `/api/health` returns HTTP 200
6. **Test frontend container** locally
   - `docker run -d -p 3000:3000 --name test-frontend hackathon-todo-frontend:1.0.0`
   - Verify HTTP 200 on port 3000
7. **Optimize via AI** — ask Gordon for optimization suggestions, iterate if improvements found
8. **Generate build script** via Claude Code
   - Output: `phase-04-k8s/scripts/build-images.sh`

### Validation Criteria

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Backend image builds | `docker build` | Exit code 0, no errors |
| Frontend image builds | `docker build` | Exit code 0, no errors |
| Backend image size | `docker images` | < 500MB |
| Frontend image size | `docker images` | < 500MB |
| Backend container runs | `curl localhost:7860/api/health` | HTTP 200 |
| Frontend container runs | `curl localhost:3000` | HTTP 200 |
| Multi-stage build | Inspect Dockerfile | Multiple FROM statements |
| Pinned base images | Inspect Dockerfile | No `:latest` tags |
| HEALTHCHECK present | `docker inspect` | HEALTHCHECK instruction exists |
| No secrets in layers | `docker history` | No env vars with secrets |

### Exit Conditions
- Both Dockerfiles generated and stored in `phase-04-k8s/docker/`
- Both images build successfully under 500MB
- Both containers pass local health checks
- Build script generated
- PHRs recorded for each Dockerfile generation

---

## Milestone 3 — Kubernetes Cluster Setup

### Objective
Start a Minikube cluster, create the `hackathon-dev` namespace, load Docker images into the cluster, and verify cluster readiness.

### Inputs
- Built Docker images from Milestone 2
- Minikube installed (verified in Milestone 1)

### AI Tools Used
- **Claude Code**: Generate cluster setup script
- **kubectl-ai**: Verify cluster state

### Expected Outputs
- Running Minikube cluster with Docker driver
- `hackathon-dev` namespace created
- Docker images loaded into Minikube
- `phase-04-k8s/scripts/setup-cluster.sh` — AI-generated setup script
- PHR documenting cluster setup

### Steps

1. **Start Minikube** with sufficient resources
   - `minikube start --driver=docker --cpus=4 --memory=8192`
   - Enable metrics-server addon: `minikube addons enable metrics-server`
2. **Create namespace**
   - `kubectl create namespace hackathon-dev`
3. **Load images into Minikube**
   - `minikube image load hackathon-todo-frontend:1.0.0`
   - `minikube image load hackathon-todo-backend:1.0.0`
4. **Verify cluster readiness** using kubectl-ai
   - Query cluster health via kubectl-ai
   - Verify all system pods running
5. **Generate setup script** via Claude Code
   - Output: `phase-04-k8s/scripts/setup-cluster.sh`
6. **Record PHR**

### Validation Criteria

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| Minikube running | `minikube status` | Host, kubelet, apiserver all Running |
| Namespace exists | `kubectl get ns hackathon-dev` | Namespace Active |
| Images loaded | `minikube image list` | Both images appear in list |
| Metrics server | `kubectl get pods -n kube-system` | metrics-server pod Running |
| kubectl-ai works | `kubectl-ai "list all namespaces"` | Returns accurate namespace list |

### Exit Conditions
- Minikube cluster running with Docker driver
- `hackathon-dev` namespace active
- Both images loaded into Minikube
- Metrics-server addon enabled
- Setup script generated
- PHR recorded

---

## Milestone 4 — Helm Chart Generation

### Objective
Generate a complete Helm chart for the Todo Chatbot application using Claude Code, including deployment templates, service templates, HPA, ConfigMaps, Secrets, and health probes.

### Inputs
- Spec: Helm chart structure and values.yaml configuration from spec.md
- Image names and tags from Milestone 2
- Backend port: 7860, Frontend port: 3000
- Backend health endpoint: `/api/health`
- Resource limits from spec (100m-500m CPU, 128Mi-512Mi memory)

### AI Tools Used
- **Claude Code**: Generate all Helm chart files

### Expected Outputs
- Complete Helm chart at `phase-04-k8s/helm/todo-chatbot/`
  - `Chart.yaml` — Chart metadata (name: todo-chatbot, version: 1.0.0)
  - `values.yaml` — Default configuration
  - `values-dev.yaml` — Dev overrides
  - `templates/_helpers.tpl` — Template helpers
  - `templates/namespace.yaml` — Namespace definition
  - `templates/frontend-deployment.yaml` — Frontend Deployment with probes
  - `templates/frontend-service.yaml` — Frontend NodePort Service
  - `templates/frontend-hpa.yaml` — Frontend HPA
  - `templates/backend-deployment.yaml` — Backend Deployment with probes
  - `templates/backend-service.yaml` — Backend NodePort Service
  - `templates/backend-hpa.yaml` — Backend HPA
  - `templates/configmap.yaml` — Application configuration
  - `templates/secret.yaml` — Database credentials
  - `tests/test-connection.yaml` — Helm test
- PHRs for chart generation

### Steps

1. **Generate Chart.yaml** via Claude Code
   - name: todo-chatbot, version: 1.0.0, appVersion: 1.0.0
2. **Generate values.yaml** via Claude Code
   - Frontend: 2 replicas, NodePort 30080, resources per spec
   - Backend: 2 replicas, NodePort 30860, resources per spec
   - HPA: min 2, max 5, target CPU 70%
3. **Generate template helpers** (`_helpers.tpl`) via Claude Code
4. **Generate namespace template** via Claude Code
5. **Generate frontend deployment** via Claude Code
   - 2 replicas, resource limits, liveness/readiness/startup probes
   - Liveness: HTTP GET on port 3000, path `/`
   - Readiness: HTTP GET on port 3000, path `/`
   - Startup: HTTP GET on port 3000, path `/`, failureThreshold 30
6. **Generate backend deployment** via Claude Code
   - 2 replicas, resource limits, liveness/readiness/startup probes
   - Liveness: HTTP GET on port 7860, path `/api/health`
   - Readiness: HTTP GET on port 7860, path `/api/health`
   - Startup: HTTP GET on port 7860, path `/api/health`, failureThreshold 30
   - Environment variables from ConfigMap and Secret
7. **Generate service templates** via Claude Code
   - Frontend: NodePort, port 3000, nodePort 30080
   - Backend: NodePort, port 7860, nodePort 30860
8. **Generate HPA templates** via Claude Code
   - Both: min 2, max 5, targetCPUUtilizationPercentage 70
9. **Generate ConfigMap and Secret templates** via Claude Code
10. **Generate Helm test** via Claude Code
11. **Validate chart structure** — `helm lint phase-04-k8s/helm/todo-chatbot/`
12. **Dry run** — `helm template todo-chatbot phase-04-k8s/helm/todo-chatbot/ -n hackathon-dev`
13. **Record PHRs**

### Validation Criteria

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Chart lint | `helm lint` | No errors (warnings acceptable) |
| Template render | `helm template --dry-run` | All templates render valid YAML |
| Values complete | Inspect values.yaml | All spec-defined values present |
| Probes defined | Inspect deployment templates | Liveness, readiness, startup probes for both services |
| Resources defined | Inspect deployment templates | Requests and limits set |
| HPA configured | Inspect HPA templates | min/max replicas, target CPU set |
| NodePorts set | Inspect service templates | Frontend 30080, backend 30860 |
| Secrets templated | Inspect secret template | Database URL via Secret reference |

### Exit Conditions
- Helm chart passes `helm lint` with no errors
- `helm template` renders all templates without errors
- All templates include required probes, resources, and configurations
- PHRs recorded for chart generation

---

## Milestone 5 — Deployment via Helm

### Objective
Deploy the Todo Chatbot to the Minikube cluster using Helm, verify all pods are running, services are exposed, and the application is accessible.

### Inputs
- Helm chart from Milestone 4
- Minikube cluster with loaded images from Milestone 3
- Environment variables (database URL, API keys)

### AI Tools Used
- **Claude Code**: Generate deployment script
- **kubectl-ai**: Verify deployment state

### Expected Outputs
- Active Helm release `todo-chatbot` in `hackathon-dev` namespace
- All pods Running with health probes passing
- Frontend accessible at Minikube IP:30080
- Backend accessible at Minikube IP:30860
- `phase-04-k8s/scripts/deploy.sh` — AI-generated deployment script
- PHR documenting deployment

### Steps

1. **Create Kubernetes Secret** for database credentials
   - `kubectl create secret generic todo-db-secret -n hackathon-dev --from-literal=DATABASE_URL=<neon-url>`
2. **Install Helm release**
   - `helm install todo-chatbot phase-04-k8s/helm/todo-chatbot/ -n hackathon-dev -f phase-04-k8s/helm/todo-chatbot/values-dev.yaml`
3. **Wait for pods** to reach Running state
   - `kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=todo-chatbot -n hackathon-dev --timeout=120s`
4. **Verify pod status** via kubectl-ai
   - Use kubectl-ai to query pod states in `hackathon-dev`
5. **Verify services**
   - `kubectl get svc -n hackathon-dev`
   - Confirm NodePort assignments
6. **Test service accessibility**
   - Get Minikube IP: `minikube ip`
   - Test backend: `curl http://$(minikube ip):30860/api/health`
   - Test frontend: `curl http://$(minikube ip):30080`
7. **Check for error events**
   - `kubectl get events -n hackathon-dev --field-selector type=Warning`
   - Zero warning/error events for app pods
8. **Generate deployment script** via Claude Code
9. **Record PHR**

### Validation Criteria

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Helm release active | `helm list -n hackathon-dev` | todo-chatbot release with status deployed |
| All pods Running | `kubectl get pods -n hackathon-dev` | All pods Running, READY x/x |
| Probes passing | `kubectl describe pod` | Liveness, readiness probes healthy |
| Backend accessible | `curl <minikube-ip>:30860/api/health` | HTTP 200 |
| Frontend accessible | `curl <minikube-ip>:30080` | HTTP 200 with HTML content |
| No error events | `kubectl get events` | Zero Warning/Error events for app pods |
| Replica count | `kubectl get deployment -n hackathon-dev` | 2/2 READY for each deployment |

### Exit Conditions
- Helm release deployed and active
- All pods Running with probes passing within 120 seconds
- Both services accessible via NodePort
- Zero error events
- Deployment script generated
- PHR recorded

---

## Milestone 6 — AI-Assisted Operations

### Objective
Demonstrate AI-assisted DevOps operations using kubectl-ai for scaling and debugging, and Kagent for cluster health analysis and optimization recommendations.

### Inputs
- Running deployment from Milestone 5
- kubectl-ai and Kagent tools

### AI Tools Used
- **kubectl-ai**: Scaling, debugging, querying
- **Kagent**: Health analysis, optimization

### Expected Outputs
- kubectl-ai scaling demonstration and log
- kubectl-ai debugging demonstration and log
- Kagent health report
- Kagent optimization recommendations
- PHRs for each AI interaction

### Steps

1. **kubectl-ai: Query deployment status**
   - Prompt: "Show me the status of all deployments and pods in hackathon-dev namespace"
   - Verify accurate state reporting
   - Record PHR
2. **kubectl-ai: Scale backend replicas**
   - Prompt: "Scale the backend deployment to 3 replicas in hackathon-dev"
   - Verify third replica reaches Running state within 60 seconds
   - Record PHR
3. **kubectl-ai: Scale back to 2 replicas**
   - Prompt: "Scale backend back to 2 replicas in hackathon-dev"
   - Verify 2 replicas running
   - Record PHR
4. **kubectl-ai: Debug a failing pod** (intentional misconfiguration)
   - Introduce a temporary misconfiguration (e.g., wrong image tag)
   - Prompt: "Debug why the pod in hackathon-dev is failing"
   - Verify kubectl-ai identifies the root cause
   - Restore correct configuration
   - Record PHR
5. **Kagent: Cluster health analysis**
   - Prompt: "Analyze the health of my Kubernetes cluster"
   - Verify health report is generated with actionable insights
   - Record PHR
6. **Kagent: Resource optimization**
   - Prompt: "Suggest resource optimizations for deployments in hackathon-dev"
   - Verify optimization recommendations are provided
   - Record PHR

### Validation Criteria

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| kubectl-ai status query | Run query prompt | Accurate pod/deployment summary returned |
| kubectl-ai scaling | Scale to 3, verify, scale to 2 | Replicas reach target within 60s |
| kubectl-ai debugging | Introduce fault, query diagnosis | Root cause correctly identified |
| Kagent health report | Run health analysis | Report generated with cluster status |
| Kagent optimization | Run optimization query | Recommendations provided |
| PHRs complete | Check history/prompts/ | One PHR per AI interaction |

### Exit Conditions
- kubectl-ai successfully queries, scales, and diagnoses
- Kagent provides health report and optimization recommendations
- All AI interactions logged as PHRs
- Deployment restored to healthy state after debugging test

---

## Milestone 7 — Resilience & Failure Testing

### Objective
Validate that the Kubernetes deployment is resilient — pods auto-recover from deletion, Helm upgrades apply without downtime, and rollbacks restore previous state.

### Inputs
- Running healthy deployment from Milestone 5/6
- Helm chart from Milestone 4

### AI Tools Used
- **kubectl-ai**: Monitor recovery
- **Claude Code**: Generate validation script

### Expected Outputs
- Failure simulation results (pod recovery verified)
- Helm upgrade results (new config applied, zero downtime)
- Helm rollback results (previous config restored)
- `phase-04-k8s/scripts/validate.sh` — AI-generated validation script
- PHR documenting resilience testing

### Steps

1. **Pod failure simulation**
   - Delete one backend pod: `kubectl delete pod <pod-name> -n hackathon-dev`
   - Monitor recovery: `kubectl get pods -n hackathon-dev -w`
   - Verify replacement pod reaches Running within 90 seconds
   - Use kubectl-ai to confirm cluster health after recovery
2. **Pod failure simulation (frontend)**
   - Delete one frontend pod
   - Verify recovery within 90 seconds
3. **Helm upgrade test**
   - Upgrade with modified replica count (e.g., 3 replicas):
     `helm upgrade todo-chatbot phase-04-k8s/helm/todo-chatbot/ -n hackathon-dev --set backend.replicaCount=3`
   - Verify 3 backend replicas running
   - Verify frontend still accessible during upgrade (zero downtime)
4. **Helm rollback test**
   - `helm rollback todo-chatbot 1 -n hackathon-dev`
   - Verify 2 backend replicas restored
   - Verify application accessible after rollback
5. **HPA verification**
   - `kubectl get hpa -n hackathon-dev`
   - Verify HPA targets and current state
6. **Generate validation script** via Claude Code
7. **Record PHR**

### Validation Criteria

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Backend pod recovery | Delete pod, watch | Replacement Running within 90s |
| Frontend pod recovery | Delete pod, watch | Replacement Running within 90s |
| Helm upgrade | `helm upgrade --set replicas=3` | 3 replicas running, zero downtime |
| Helm rollback | `helm rollback` | Previous config restored within 60s |
| HPA active | `kubectl get hpa` | HPA shows targets and current metrics |
| Service continuity | `curl` during operations | HTTP 200 throughout |

### Exit Conditions
- Pod deletion recovery verified for both services (< 90 seconds)
- Helm upgrade applies new configuration with zero downtime
- Helm rollback restores previous configuration within 60 seconds
- HPA is active and reporting metrics
- Validation script generated
- PHR recorded

---

## Milestone 8 — Final Validation & Documentation

### Objective
Validate the full deployment is reproducible from scratch, document all AI prompts used, generate a deployment guide, and run the complete validation matrix.

### Inputs
- All artifacts from Milestones 1-7
- All PHRs generated during the process
- Validation matrix from spec

### AI Tools Used
- **Claude Code**: Generate deployment guide and final documentation
- **kubectl-ai**: Final cluster validation
- **Kagent**: Final health assessment

### Expected Outputs
- `phase-04-k8s/docs/deployment-guide.md` — Complete deployment guide
- `phase-04-k8s/.env.example` — Environment variable template
- Final validation matrix results (all 10 gates passed)
- Complete PHR collection in `history/prompts/007-k8s-deployment/`
- PHR documenting final validation

### Steps

1. **Generate deployment guide** via Claude Code
   - Step-by-step instructions from clean environment to running deployment
   - Prerequisites, tool installation, image building, cluster setup, deployment, validation
   - Must be self-contained and reproducible
2. **Generate .env.example** via Claude Code
   - Document all required environment variables with descriptions
3. **Run full validation matrix**
   - Gate 1: Container Build — verify images build cleanly
   - Gate 2: Kubernetes Deploy — verify zero error events
   - Gate 3: Pod Health — verify all pods Running, probes passing
   - Gate 4: Service Access — verify HTTP 200 from both services
   - Gate 5: Replica Scaling — verify HPA active
   - Gate 6: Failure Recovery — verify pod recovery
   - Gate 7: Helm Upgrade — verify upgrade works
   - Gate 8: Helm Rollback — verify rollback works
   - Gate 9: AI Diagnostics — verify kubectl-ai and Kagent functional
   - Gate 10: Reproducibility — verify guide completeness
4. **Final Kagent health assessment**
   - Run cluster-wide health check
5. **Verify PHR completeness**
   - Every AI-generated artifact traces to a PHR
   - PHR directory: `history/prompts/007-k8s-deployment/`
6. **Verify zero manual YAML** (governance SC-009)
   - All YAML in `phase-04-k8s/` is AI-generated
7. **Record final PHR**

### Validation Criteria

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Deployment guide exists | File check | `phase-04-k8s/docs/deployment-guide.md` complete |
| .env.example exists | File check | All vars documented |
| All 10 gates pass | Run validation matrix | PASS on all gates |
| PHR completeness | Review `history/prompts/007-k8s-deployment/` | Every artifact has a PHR |
| Zero manual YAML | Audit `phase-04-k8s/` | All YAML AI-generated |
| Reproducibility | Follow guide from scratch | Deployment works end-to-end |

### Exit Conditions
- Deployment guide is complete and self-contained
- All 10 validation matrix gates pass
- Every AI-generated artifact has a corresponding PHR
- Zero manual YAML exists in the delivery
- Feature is ready for merge

---

## Milestone Dependency Graph

```
M1 (Environment) ──→ M2 (Containerization) ──→ M3 (Cluster Setup) ──→ M4 (Helm Chart)
                                                                           │
                                                                           ▼
M8 (Documentation) ←── M7 (Resilience) ←── M6 (AI Operations) ←── M5 (Deployment)
```

All milestones are sequential. Each milestone's exit conditions must be met before proceeding.

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Docker AI (Gordon) unavailable or limited | Medium | High | Fallback to Claude Code for Dockerfile generation |
| Minikube resource exhaustion | Low | Medium | Configure with 4 CPUs + 8GB RAM; monitor with `minikube dashboard` |
| Neon PostgreSQL unreachable from Minikube | Low | High | Verify outbound networking; fallback to local PostgreSQL container |
| kubectl-ai/Kagent not yet installed | Medium | Medium | Document manual installation steps; verify in Milestone 1 |
| Image size exceeds 500MB limit | Low | Low | Use Docker AI optimization suggestions; multi-stage builds |
