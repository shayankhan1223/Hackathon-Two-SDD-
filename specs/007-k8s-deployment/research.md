# Research: Phase IV — Local Kubernetes Deployment

**Feature**: 007-k8s-deployment
**Date**: 2026-02-18
**Status**: Complete

## Research Areas

### R1: Docker AI (Gordon) Availability and Usage

**Decision**: Use Docker AI (Gordon) as primary Dockerfile generator; Claude Code as fallback.

**Rationale**: Docker AI (Gordon) is integrated into Docker Desktop and provides context-aware Dockerfile generation with optimization suggestions. It understands Docker best practices natively. If Gordon is unavailable or limited in the user's Docker Desktop version, Claude Code can generate equivalent Dockerfiles using the docker-ops-subagent.

**Alternatives Considered**:
- Claude Code only (no Gordon): Less Docker-native optimization, but fully functional
- Manual Dockerfile writing: Prohibited by governance rules

### R2: Minikube Driver Selection

**Decision**: Use Docker driver for Minikube.

**Rationale**: The Docker driver is the most portable and well-supported driver for Minikube on Linux. It runs Kubernetes nodes as Docker containers, avoiding the need for a hypervisor. Since Docker Desktop is already a prerequisite, this adds no extra dependencies.

**Alternatives Considered**:
- KVM2 driver: Requires KVM hypervisor, additional setup complexity
- VirtualBox driver: Heavier weight, slower startup
- Podman driver: Less mature Minikube integration

### R3: Service Exposure Method

**Decision**: Use NodePort for service exposure.

**Rationale**: NodePort is the simplest method for local development and requires no additional components (no Ingress controller needed). Services are directly accessible at `<minikube-ip>:<nodePort>`. The spec explicitly calls for NodePort (FR-010).

**Alternatives Considered**:
- Ingress with NGINX controller: More production-like but adds complexity for local dev
- `minikube tunnel` with LoadBalancer: Requires running tunnel process, less straightforward
- Port-forwarding: Not persistent, requires active kubectl session

### R4: Image Loading Strategy

**Decision**: Use `minikube image load` to transfer local Docker images into Minikube.

**Rationale**: `minikube image load` copies images from the local Docker daemon into Minikube's container runtime. This is simpler than configuring a local registry and works with `imagePullPolicy: IfNotPresent` in Kubernetes manifests.

**Alternatives Considered**:
- `eval $(minikube docker-env)` + build inside Minikube: Requires rebuilding inside Minikube, less clean separation
- Local Docker registry: More infrastructure to manage, overkill for local dev
- Minikube's built-in registry addon: Additional configuration needed

### R5: Helm Chart Architecture (Single vs. Multiple Charts)

**Decision**: Single umbrella Helm chart for the entire application.

**Rationale**: With only 2 services (frontend + backend), a single chart is simpler to manage, deploy, and version. It keeps the deployment atomic — both services are deployed/upgraded/rolled back together. The spec explicitly requires a single chart (FR-012).

**Alternatives Considered**:
- Separate charts per service: More flexibility but overkill for 2 services
- Helmfile for multi-chart orchestration: Unnecessary complexity at this scale

### R6: Health Probe Configuration

**Decision**: Use HTTP GET probes for all services with appropriate paths.

**Rationale**:
- Backend already has `/api/health` endpoint (confirmed in source code)
- Frontend (Next.js) serves on port 3000; root path `/` returns HTTP 200 when healthy
- Startup probes with `failureThreshold: 30` allow up to 5 minutes for slow container starts
- Liveness and readiness probes use standard intervals (10s period, 5s timeout)

**Alternatives Considered**:
- TCP socket probes: Less informative, don't verify application health
- Exec probes: Slower, more resource-intensive
- gRPC probes: Not applicable (HTTP services)

### R7: kubectl-ai and Kagent Installation

**Decision**: Verify installation in Milestone 1; document installation instructions in deployment guide.

**Rationale**: kubectl-ai and Kagent may not be pre-installed on all development machines. Milestone 1 verifies their presence and provides guidance. These tools are used for AI-assisted operations (Milestone 6) and diagnostics but don't block the core deployment flow (Milestones 2-5).

**Alternatives Considered**:
- Skip AI tools if not installed: Violates spec requirements (FR-023, FR-024)
- Docker-based AI tool containers: Additional complexity, not standard approach

### R8: Next.js Standalone Output for Docker

**Decision**: Use Next.js standalone output mode for Docker builds.

**Rationale**: Next.js `output: 'standalone'` produces a minimal Node.js server with only necessary dependencies. This significantly reduces Docker image size (from ~1GB to ~200MB) and is the recommended approach for containerized Next.js applications. The frontend Dockerfile will configure the build to use standalone output.

**Alternatives Considered**:
- Full `node_modules` copy: Much larger image size, includes dev dependencies
- Static export: Not suitable if the app uses server-side features (API routes, SSR)

## Unresolved Items

None — all research areas resolved with clear decisions.
