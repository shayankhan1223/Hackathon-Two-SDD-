# Hackathon II — Governance & Development Rules

> **Cloud-Native, AI-Governed, Spec-Driven Multi-Phase Project**

This file is the authoritative governance document for all AI agents operating within this repository. All agents, tools, and workflows MUST comply with these rules. Violations invalidate the affected artifacts.

---

## 1. Project Overview

### 1.1 Multi-Phase Architecture

Hackathon II is a progressive, multi-phase software project where each phase builds upon the previous one, culminating in a fully cloud-native, AI-governed application.

| Phase | Directory | Description |
|-------|-----------|-------------|
| **I — Foundation** | `phase-01-console/` | Console-based Todo application. Core data model, CLI interface, TDD workflow. |
| **II — Core Application** | `phase-02-web/` | Web-based Todo with FastAPI backend, Next.js frontend, Neon PostgreSQL, JWT auth. |
| **III — Cloud Native Chatbot** | `phase-03-ai-chat/` | AI-powered chat Todo with OpenAI Agents SDK, real-time interactions, file uploads. |
| **IV — Infrastructure Automation** | `phase-04-k8s/` | Local Kubernetes deployment via Minikube, Helm, Docker AI (Gordon), kubectl-ai, Kagent. |

### 1.2 Progression Model

- Each phase inherits and extends the capabilities of prior phases.
- Phase IV introduces **Infrastructure-as-AI-Artifact** — all deployment configuration is AI-generated, not hand-written.
- The entire project must be reproducible from scratch using only the specs, plans, tasks, and recorded AI prompts.

---

## 2. Development Workflow Enforcement

### 2.1 Spec-Driven Development Lifecycle

All work follows a strict, sequential lifecycle. **Skipping steps is prohibited.**

```
/sp.constitution  →  /sp.specify  →  /sp.plan  →  /sp.tasks  →  Implementation via Claude Code
```

| Step | Command | Purpose | Required Before |
|------|---------|---------|-----------------|
| 1 | `/sp.constitution` | Establish project principles and constraints | Any feature work |
| 2 | `/sp.specify` | Define feature requirements in `spec.md` | Planning |
| 3 | `/sp.plan` | Produce architectural plan in `plan.md` | Task generation |
| 4 | `/sp.tasks` | Generate dependency-ordered tasks in `tasks.md` | Implementation |
| 5 | `/sp.implement` | Execute tasks via Claude Code | Deployment |

### 2.2 Enforcement Rules

- **No implementation without a spec.** Code changes require a corresponding `spec.md`.
- **No tasks without a plan.** Task generation requires a completed `plan.md`.
- **No skipping to implementation.** The lifecycle is sequential and auditable.
- **All artifacts are versioned.** Specs, plans, and tasks live under `specs/<feature>/`.

---

## 3. AI-Only Implementation Policy

### 3.1 Prohibition of Manual Artifact Creation

The following are **explicitly prohibited**:

- Manually writing Dockerfiles
- Manually writing Kubernetes YAML manifests
- Manually writing Helm chart templates
- Manually writing CI/CD pipeline configuration
- Manually writing infrastructure configuration of any kind

### 3.2 Mandatory AI Toolchain

All artifacts MUST be generated using one of the following AI tools:

| Tool | Scope |
|------|-------|
| **Claude Code** | Application code, specs, plans, tasks, orchestration |
| **Docker AI (Gordon)** | Dockerfile generation, image optimization, build diagnostics |
| **kubectl-ai** | Kubernetes manifest generation, resource configuration |
| **Kagent** | Kubernetes agent operations, cluster diagnostics, scaling |

### 3.3 Prompt Documentation Requirement

Every AI-generated artifact MUST have its generating prompt recorded:

- The exact prompt used to generate the artifact
- The AI tool that produced it
- The iteration count (if refined)
- The final output hash or version reference

---

## 4. Phase IV Infrastructure Rules

### 4.1 Docker Image Governance

- All images MUST be generated via Docker AI (Gordon) or Claude Code.
- Images MUST use multi-stage builds where applicable.
- Base images MUST pin exact versions (no `latest` tags).
- Images MUST include `HEALTHCHECK` instructions.
- No secrets or credentials in image layers.

### 4.2 Helm Chart Structure

All Helm charts MUST reside within `phase-04-k8s/helm/` and follow this structure:

```
phase-04-k8s/helm/<chart-name>/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── configmap.yaml
│   └── _helpers.tpl
└── tests/
```

### 4.3 Kubernetes Namespace Policy

| Namespace | Purpose |
|-----------|---------|
| `hackathon-dev` | Development deployments |
| `hackathon-staging` | Pre-production validation |
| `hackathon-prod` | Production-equivalent local deployment |

- Each service MUST declare its target namespace explicitly.
- Cross-namespace access MUST be documented and justified.

### 4.4 Replica & Scaling Configuration

- **Minimum replicas:** 1 (dev), 2 (staging/prod)
- **HPA (Horizontal Pod Autoscaler):** Required for all stateless services
- **Target CPU utilization:** 70%
- **Max replicas:** Defined per service in `values.yaml`

### 4.5 Resource Limits

All pods MUST declare resource requests and limits:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

Actual values are service-specific and defined in `values.yaml`. Omitting limits is a governance violation.

### 4.6 Health Checks

Every deployment MUST include:

- **Liveness probe:** Detects deadlocked containers; triggers restart.
- **Readiness probe:** Gates traffic until the container is ready.
- **Startup probe:** Allows slow-starting containers grace period.

### 4.7 AI-Assisted Diagnostics

- Use `kubectl-ai` for troubleshooting pod failures and resource issues.
- Use `Kagent` for cluster-wide diagnostics and automated remediation.
- All diagnostic sessions MUST be logged as PHRs.

---

## 5. Testing & Validation Standards

### 5.1 Mandatory Validation Matrix

All Phase IV deployments MUST pass the following validation gates:

| Gate | Validation | Method |
|------|-----------|--------|
| **Container Build** | Image builds successfully, no CVEs above threshold | `docker build` + scan |
| **Kubernetes Deploy** | All resources created, no error events | `kubectl get events` |
| **Pod Health** | All pods reach `Running` state, probes pass | `kubectl get pods` |
| **Replica Scaling** | HPA scales from min to target under load | Load test + `kubectl get hpa` |
| **Failure Simulation** | Pod deletion triggers automatic recovery | `kubectl delete pod` + observe |
| **Helm Upgrade** | Rolling update completes without downtime | `helm upgrade` + health check |
| **Helm Rollback** | Previous revision restores successfully | `helm rollback` + verification |

### 5.2 Validation Enforcement

- No deployment is considered complete until all gates pass.
- Validation results MUST be captured in the task completion record.
- Failed validations MUST be diagnosed using AI tools (kubectl-ai, Kagent) before manual intervention.

---

## 6. Documentation & Audit Trail

### 6.1 Prompt History Records (PHR)

Every user interaction with an AI agent MUST be recorded as a PHR.

**PHR routing (all under `history/prompts/`):**

| Context | Path |
|---------|------|
| Constitution | `history/prompts/constitution/` |
| Feature-specific | `history/prompts/<feature-name>/` |
| General | `history/prompts/general/` |

**PHR Creation Process:**

1. Detect stage: `constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general`
2. Generate title (3-7 words) and filename slug.
3. Read template from `.specify/templates/phr-template.prompt.md`.
4. Fill all placeholders: ID, TITLE, STAGE, DATE_ISO, SURFACE, MODEL, FEATURE, BRANCH, USER, COMMAND, LABELS, LINKS, FILES_YAML, TESTS_YAML, PROMPT_TEXT (verbatim), RESPONSE_TEXT.
5. Write to the appropriate route path.
6. Validate: no unresolved placeholders, correct front-matter, complete prompt text, file exists at expected path.
7. Report: ID, path, stage, title.

**PHR is mandatory for:**
- Implementation work (code changes, new features)
- Planning and architecture discussions
- Debugging sessions
- Spec, task, and plan creation
- Infrastructure generation and diagnostics
- Multi-step workflows

### 6.2 Architecture Decision Records (ADR)

When architecturally significant decisions are detected, suggest:

> "Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`."

**Significance test (all must be true):**
- **Impact:** Long-term consequences (framework, data model, API, security, platform, infrastructure)
- **Alternatives:** Multiple viable options were considered
- **Scope:** Cross-cutting, influences system design

ADRs are stored in `history/adr/`. Never auto-create; always require user consent.

### 6.3 Iteration Logging

- Every refinement cycle on an AI-generated artifact MUST increment the iteration count.
- The prompt, output diff, and rationale for each iteration MUST be recorded.
- Final artifacts MUST reference their iteration history.

### 6.4 Reproducibility Requirement

The entire project — including all infrastructure — MUST be reproducible from a clean environment using only:
- The repository contents (specs, plans, tasks, source code)
- Recorded AI prompts and their documented tool/model
- Environment variable templates (`.env.example`)

---

## 7. Folder Structure Governance

### 7.1 Phase Isolation

```
Hackathon-two/
├── CLAUDE.md                          # This governance document
├── .specify/                          # SpecKit Plus templates and scripts
│   ├── memory/constitution.md         # Project principles
│   └── templates/                     # PHR, spec, plan, task templates
├── specs/                             # Feature specifications (all phases)
│   ├── 001-console-todo-app/
│   ├── 002-web-todo-app/
│   ├── 003-web-auth-db/
│   ├── 004-ai-chat-todo/
│   ├── 005-dashboard-redesign-ai/
│   ├── 006-phase3-improvements/
│   └── 007-k8s-deployment/           # Phase IV spec
├── history/
│   ├── prompts/                       # PHR records
│   └── adr/                           # Architecture Decision Records
├── phase-01-console/                  # Phase I: Foundation
├── phase-02-web/                      # Phase II: Core Application
├── phase-03-ai-chat/                  # Phase III: Cloud Native Chatbot
└── phase-04-k8s/                      # Phase IV: Infrastructure Automation
    ├── docker/                        # AI-generated Dockerfiles
    ├── helm/                          # AI-generated Helm charts
    ├── manifests/                     # AI-generated K8s manifests
    ├── scripts/                       # AI-generated deployment scripts
    └── docs/                          # Infrastructure documentation
```

### 7.2 Isolation Rules

- **Phase IV MUST NOT modify files in Phase I, II, or III directories.** It consumes their built images.
- **Helm charts MUST reside within `phase-04-k8s/helm/`.**
- **Dockerfiles MUST reside within `phase-04-k8s/docker/`** (or reference phase-specific Dockerfiles if they exist).
- **Kubernetes manifests (non-Helm) MUST reside within `phase-04-k8s/manifests/`.**
- **Cross-phase references are read-only.** Phase IV reads source from prior phases to build images; it does not edit them.

---

## 8. Infrastructure Blueprint Philosophy

### 8.1 Infrastructure as AI-Governed Artifact

Phase IV extends Spec-Driven Development to infrastructure. Infrastructure configuration is not manually written — it is **specified, planned, tasked, and AI-generated**, following the same lifecycle as application code:

1. **Specify** — Define infrastructure requirements (services, scaling, networking, storage).
2. **Plan** — Architect the Kubernetes topology, Helm chart design, and deployment strategy.
3. **Task** — Break down into ordered, testable infrastructure tasks.
4. **Generate** — Use Docker AI, kubectl-ai, Kagent, and Claude Code to produce all artifacts.
5. **Validate** — Run the full validation matrix (Section 5) before acceptance.

### 8.2 Governing Principles

- **No hand-written YAML.** All Kubernetes and Helm configuration is AI-generated.
- **Prompt provenance.** Every generated artifact traces back to a recorded prompt.
- **Iterative refinement.** AI outputs are refined through documented iteration cycles, not manual edits.
- **Reproducibility.** Any team member can regenerate the infrastructure from the recorded prompts and specs.
- **Auditability.** The full chain from requirement to deployed resource is traceable through specs, plans, tasks, PHRs, and ADRs.

---

## 9. Agent Operational Rules

### 9.1 Authoritative Source Mandate

Agents MUST prioritize MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 9.2 Execution Flow

Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 9.3 Human as Tool Strategy

Agents are not expected to solve every problem autonomously. Invoke the user for input when encountering:

1. **Ambiguous Requirements** — Ask 2-3 targeted clarifying questions before proceeding.
2. **Unforeseen Dependencies** — Surface them and ask for prioritization.
3. **Architectural Uncertainty** — Present options with tradeoffs and get user preference.
4. **Completion Checkpoints** — Summarize what was done and confirm next steps.

### 9.4 Default Policies

- Clarify and plan first. Keep business understanding separate from technical plan.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and documentation.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with references (`start:end:path`); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

### 9.5 Execution Contract for Every Request

1. Confirm surface and success criteria (one sentence).
2. List constraints, invariants, non-goals.
3. Produce the artifact with acceptance checks inlined.
4. Add follow-ups and risks (max 3 bullets).
5. Create PHR in the appropriate subdirectory under `history/prompts/`.
6. Surface ADR suggestion if significant decisions were identified.

### 9.6 Minimum Acceptance Criteria

- Clear, testable acceptance criteria included.
- Explicit error paths and constraints stated.
- Smallest viable change; no unrelated edits.
- Code references to modified/inspected files where relevant.

---

## 10. Architect Guidelines

When performing architectural planning, address each of the following:

1. **Scope & Dependencies** — In scope, out of scope, external dependencies with ownership.
2. **Key Decisions & Rationale** — Options considered, tradeoffs, measurable principles.
3. **Interfaces & API Contracts** — Inputs, outputs, errors, versioning, idempotency, error taxonomy.
4. **Non-Functional Requirements** — Performance (p95 latency, throughput), reliability (SLOs, error budgets), security (AuthN/AuthZ, secrets), cost.
5. **Data Management** — Source of truth, schema evolution, migration/rollback, retention.
6. **Operational Readiness** — Observability (logs, metrics, traces), alerting, runbooks, deployment/rollback, feature flags.
7. **Risk Analysis** — Top 3 risks, blast radius, kill switches/guardrails.
8. **Evaluation & Validation** — Definition of done, output validation for format/requirements/safety.
9. **ADR** — For each significant decision, suggest an ADR and link it.

---

## 11. Active Technology Stack

### Application Layer

| Component | Technology | Phase |
|-----------|-----------|-------|
| Backend | Python 3.12, FastAPI, SQLModel, OpenAI Agents SDK | II, III |
| Frontend | TypeScript 5.9.3, Next.js 16, React 19, Tailwind CSS 4.x | II, III |
| Database | Neon PostgreSQL (serverless) via asyncpg | II, III |
| Auth | JWT-based authentication | II, III |
| Icons | Lucide React | II, III |
| Validation | Zod (frontend), Pydantic (backend) | II, III |

### Infrastructure Layer (Phase IV)

| Component | Technology |
|-----------|-----------|
| Container Runtime | Docker + Docker AI (Gordon) |
| Orchestration | Kubernetes via Minikube |
| Package Management | Helm 3 |
| AI Manifest Generation | kubectl-ai |
| AI Cluster Operations | Kagent |
| Local Registry | Minikube built-in registry |

---

**Version:** 2.0.0 | **Effective:** 2026-02-18 | **Scope:** All phases, all agents, all contributors

## Active Technologies
- Python 3.12 (backend), TypeScript 5.9.3 / Node.js (frontend) + Docker Desktop, Minikube (Docker driver), Helm 3, kubectl-ai, Kagent (007-k8s-deployment)
- Neon PostgreSQL (external, accessed via Kubernetes Secret) (007-k8s-deployment)

## Recent Changes
- 007-k8s-deployment: Added Python 3.12 (backend), TypeScript 5.9.3 / Node.js (frontend) + Docker Desktop, Minikube (Docker driver), Helm 3, kubectl-ai, Kagent
