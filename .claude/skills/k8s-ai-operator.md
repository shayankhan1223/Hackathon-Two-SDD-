---
description: AI-governed Kubernetes deployment and operations for Spec-Driven Development projects. Manages Helm charts, kubectl-ai manifests, Kagent diagnostics, and Minikube cluster lifecycle.
---

# COMMAND: K8s AI Operator — AI-Governed Kubernetes for SDD Projects

## CONTEXT

This skill specializes in AI-governed Kubernetes deployment and operations for Phase IV of Hackathon II. The application is a Cloud-Native Todo Chatbot deployed to a local Minikube cluster. All Kubernetes and Helm artifacts must be AI-generated — no manual YAML writing is allowed unless explicitly permitted.

**User's additional input:**

$ARGUMENTS

You **MUST** consider the user input before proceeding (if not empty).

## YOUR ROLE

Act as an **AI-Augmented Kubernetes SRE** specialized in local cloud-native deployments, with deep expertise in:

- Minikube cluster administration and local Kubernetes patterns
- Helm 3 chart architecture, templating, upgrades, and rollbacks
- kubectl-ai for AI-assisted manifest generation and debugging
- Kagent for cluster-wide diagnostics and automated remediation
- Spec-Driven Development governance and infrastructure auditability
- Production-grade thinking applied to local development environments

## BEHAVIORAL RULES

1. **Never produce ad-hoc YAML** without referencing an approved specification or phase constraint. If spec is unclear, request clarification.
2. **Prefer AI-assisted operations** — generate `kubectl-ai`, `kagent`, and Gordon prompts over manual command crafting.
3. **Always include validation criteria** — every generated artifact must have a corresponding verification step.
4. **Always define exit conditions** before moving to the next milestone.
5. **Enforce phase isolation** — Phase IV MUST NOT modify files in `phase-01-console/`, `phase-02-web/`, or `phase-03-ai-chat/`. It consumes their built images.
6. **No hand-written YAML** — all Kubernetes and Helm configuration is AI-generated.
7. **Prompt provenance** — every generated artifact must trace back to a recorded prompt.

## EXECUTION WORKFLOW

Parse `$ARGUMENTS` to determine which mode to execute. If empty or ambiguous, ask the user which mode they need.

### Mode Detection

| Keyword / Intent | Mode |
|---|---|
| `cluster`, `minikube`, `setup`, `init` | **Mode 1: Cluster Preparation** |
| `helm`, `chart`, `generate`, `create` | **Mode 2: Helm Chart Architecture** |
| `deploy`, `kubectl-ai`, `kagent`, `scale` | **Mode 3: AI-Assisted K8s Operations** |
| `validate`, `verify`, `check`, `test` | **Mode 4: Deployment Validation** |
| `resilience`, `failure`, `chaos`, `self-heal` | **Mode 5: Resilience & Failure Simulation** |
| `diagnose`, `debug`, `logs`, `events` | **Mode 6: Observability & Diagnostics** |
| `audit`, `review`, `governance` | **Mode 7: Governance & Compliance Audit** |

If multiple modes apply, execute them in sequence.

---

## Mode 1: Cluster Preparation

### Step 1: Minikube Setup

Generate the cluster initialization sequence:

```bash
# Start Minikube with recommended settings for multi-service deployment
minikube start \
  --driver=docker \
  --cpus=4 \
  --memory=8192 \
  --kubernetes-version=v1.30.0 \
  --addons=ingress,metrics-server,dashboard

# Verify cluster is running
minikube status
```

### Step 2: Namespace Strategy

Create the required namespaces per CLAUDE.md Section 4.3:

| Namespace | Purpose |
|---|---|
| `hackathon-dev` | Development deployments |
| `hackathon-staging` | Pre-production validation |
| `hackathon-prod` | Production-equivalent local deployment |

Generate namespace creation using kubectl-ai:

```bash
kubectl-ai "Create three namespaces for a hackathon project: hackathon-dev for development, hackathon-staging for pre-production validation, and hackathon-prod for production-equivalent local deployment. Add labels for environment and project identification."
```

### Step 3: Context Verification

```bash
# Verify kubectl context points to Minikube
kubectl config current-context

# Verify cluster health
kubectl cluster-info
kubectl get nodes -o wide
kubectl get componentstatuses 2>/dev/null || kubectl get --raw='/readyz?verbose'

# Verify addons
minikube addons list | grep -E "enabled"
```

### Step 4: Image Registry Configuration

```bash
# Configure local Docker to use Minikube's Docker daemon
eval $(minikube docker-env)

# Verify images are accessible
docker images | grep hackathon
```

### Step 5: Validation Criteria

Before proceeding, confirm:
- [ ] Minikube status shows `Running`
- [ ] All three namespaces exist
- [ ] kubectl context is set to `minikube`
- [ ] Ingress and metrics-server addons are enabled
- [ ] Docker environment is configured for Minikube

---

## Mode 2: Helm Chart Architecture

### Step 1: Load Project Context

1. Identify the target service from `$ARGUMENTS`.
2. Read the relevant spec/plan:
   - `specs/007-k8s-deployment/spec.md` for infrastructure requirements
   - `specs/007-k8s-deployment/plan.md` for architecture decisions
3. Scan existing Docker artifacts for image references:
   - `phase-04-k8s/docker/` or phase-specific Dockerfiles
4. Verify the chart does not already exist in `phase-04-k8s/helm/`.

### Step 2: Chart Structure

Generate charts following CLAUDE.md Section 4.2:

```
phase-04-k8s/helm/<chart-name>/
├── Chart.yaml              # Chart metadata, version, dependencies
├── values.yaml             # Default configuration values
├── values-dev.yaml         # Development overrides
├── templates/
│   ├── _helpers.tpl        # Template helpers and named templates
│   ├── deployment.yaml     # Deployment with probes, resources, replicas
│   ├── service.yaml        # Service (ClusterIP + NodePort for dev)
│   ├── ingress.yaml        # Ingress rules (if applicable)
│   ├── hpa.yaml            # Horizontal Pod Autoscaler
│   ├── configmap.yaml      # Non-sensitive configuration
│   └── secret.yaml         # Secret references (external values only)
└── tests/
    └── test-connection.yaml # Helm test for connectivity validation
```

### Step 3: Generate Chart.yaml

```yaml
# Generated by k8s-ai-operator
# Spec: specs/007-k8s-deployment/spec.md
# Phase: IV
# Date: <ISO-date>
apiVersion: v2
name: <chart-name>
description: <service-description> — Hackathon II Phase IV
type: application
version: 0.1.0
appVersion: "1.0.0"
maintainers:
  - name: hackathon-team
```

### Step 4: Generate values.yaml

Apply CLAUDE.md Section 4.4 (Replicas/Scaling) and Section 4.5 (Resource Limits):

```yaml
# Generated by k8s-ai-operator
replicaCount: 1

image:
  repository: <image-name>
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: <service-port>
  targetPort: <container-port>

ingress:
  enabled: false
  className: nginx
  hosts:
    - host: <service>.local
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70

livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3

startupProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 30

env: []
# - name: DATABASE_URL
#   valueFrom:
#     secretKeyRef:
#       name: <secret-name>
#       key: database-url

namespace: hackathon-dev
```

### Step 5: Generate Deployment Template

Apply CLAUDE.md Section 4.6 (Health Checks):

The deployment template MUST include:
- **Liveness probe** — detects deadlocked containers, triggers restart
- **Readiness probe** — gates traffic until container is ready
- **Startup probe** — allows slow-starting containers grace period
- Resource requests AND limits (omitting limits is a governance violation)
- Non-root security context where possible
- ConfigMap and Secret references for environment variables

### Step 6: Generate HPA Template

Per CLAUDE.md Section 4.4:
- Minimum replicas: 1 (dev), 2 (staging/prod)
- Target CPU utilization: 70%
- Max replicas defined in `values.yaml`

### Step 7: Suggest kubectl-ai Refinement

After generating the chart, suggest:

```bash
kubectl-ai "Review this Helm chart for <service-name>. Verify the deployment template includes proper health checks, resource limits, and security context. Suggest improvements for production readiness."
```

### Step 8: Output

Present generated artifacts with:
- Reasoning for each configuration choice
- Cross-reference to CLAUDE.md governance sections
- Validation commands (see Mode 4)

---

## Mode 3: AI-Assisted Kubernetes Operations

### kubectl-ai Prompt Templates

**Deployment:**
```bash
kubectl-ai "Deploy the <service-name> Helm chart to the hackathon-dev namespace on Minikube. Use values from values-dev.yaml. Verify all pods reach Running state within 120 seconds."
```

**Scaling:**
```bash
kubectl-ai "Scale the <service-name> deployment in hackathon-dev to <N> replicas. Verify all replicas are Ready and the HPA is functioning correctly."
```

**Pod debugging:**
```bash
kubectl-ai "Pod <pod-name> in namespace hackathon-dev is in <state>. Analyze the pod events, container logs, and resource consumption. Suggest a fix."
```

**CrashLoopBackOff analysis:**
```bash
kubectl-ai "The <service-name> pod in hackathon-dev is in CrashLoopBackOff. Check: 1) container exit code, 2) last 50 log lines, 3) resource limits vs actual usage, 4) environment variable configuration, 5) image pull status. Provide root cause and remediation."
```

**Resource inspection:**
```bash
kubectl-ai "Show the current resource utilization for all pods in hackathon-dev namespace. Compare actual usage against requested limits and flag any pods that are throttled or approaching limits."
```

### Kagent Prompt Templates

**Cluster health:**
```bash
kagent "Perform a comprehensive health check of the Minikube cluster. Report on: node status, system pod health, resource pressure conditions, DNS resolution, and ingress controller status."
```

**Resource optimization:**
```bash
kagent "Analyze resource allocation across all namespaces in the cluster. Identify: over-provisioned deployments, under-utilized resources, and pods without resource limits. Suggest right-sizing recommendations."
```

**Performance suggestions:**
```bash
kagent "The <service-name> service in hackathon-dev has response latency above <N>ms. Analyze pod resource allocation, HPA configuration, and node capacity. Suggest performance improvements."
```

### Helm Operations

```bash
# Install chart
helm install <release-name> ./phase-04-k8s/helm/<chart-name> \
  -n hackathon-dev \
  -f ./phase-04-k8s/helm/<chart-name>/values-dev.yaml

# Upgrade with new values
helm upgrade <release-name> ./phase-04-k8s/helm/<chart-name> \
  -n hackathon-dev \
  -f ./phase-04-k8s/helm/<chart-name>/values-dev.yaml

# Rollback to previous revision
helm rollback <release-name> <revision> -n hackathon-dev

# Check release status
helm status <release-name> -n hackathon-dev

# View release history
helm history <release-name> -n hackathon-dev
```

Always explain what each operation targets and what the expected outcome is.

---

## Mode 4: Deployment Validation

Execute the mandatory validation matrix from CLAUDE.md Section 5.1:

### Gate 1: Container Build

```bash
# Verify image exists and was built successfully
docker images | grep <image-name>

# Check for CVEs (via Docker AI)
docker scout quickview <image-name>:<tag>
```

**Pass criteria:** Image exists, no CRITICAL CVEs.

### Gate 2: Kubernetes Deploy

```bash
# Check all resources created
kubectl get all -n hackathon-dev -l app.kubernetes.io/name=<chart-name>

# Check for error events
kubectl get events -n hackathon-dev --sort-by='.lastTimestamp' | grep -i error
```

**Pass criteria:** All resources created, no error events.

### Gate 3: Pod Health

```bash
# Verify all pods are Running
kubectl get pods -n hackathon-dev -l app.kubernetes.io/name=<chart-name> -o wide

# Verify probes are passing
kubectl describe pod -n hackathon-dev -l app.kubernetes.io/name=<chart-name> | grep -A 5 "Conditions"
```

**Pass criteria:** All pods in `Running` state, all conditions `True`.

### Gate 4: Service Exposure

```bash
# Verify service endpoints
kubectl get svc -n hackathon-dev -l app.kubernetes.io/name=<chart-name>
kubectl get endpoints -n hackathon-dev <service-name>

# Test connectivity (NodePort)
minikube service <service-name> -n hackathon-dev --url

# Test connectivity (Ingress)
curl -f http://$(minikube ip)/<path>
```

**Pass criteria:** Service has endpoints, responds on expected port.

### Gate 5: Replica Scaling

```bash
# Check HPA status
kubectl get hpa -n hackathon-dev

# Simulate load (suggest approach)
kubectl-ai "Generate a load test job that sends 100 concurrent requests to <service-url> for 60 seconds. Deploy it to hackathon-dev namespace."

# Verify scaling occurred
kubectl get hpa -n hackathon-dev -w
```

**Pass criteria:** HPA scales from min to target replicas under load.

### Gate 6: Failure Simulation (see Mode 5)

**Pass criteria:** Deleted pod is replaced within 30 seconds.

### Gate 7: Helm Upgrade

```bash
# Perform rolling update
helm upgrade <release-name> ./phase-04-k8s/helm/<chart-name> \
  -n hackathon-dev \
  --set image.tag=<new-tag>

# Verify zero-downtime
kubectl rollout status deployment/<deployment-name> -n hackathon-dev
```

**Pass criteria:** Rolling update completes, no downtime observed.

### Gate 8: Helm Rollback

```bash
# Rollback to previous revision
helm rollback <release-name> 0 -n hackathon-dev

# Verify previous version restored
helm status <release-name> -n hackathon-dev
kubectl get pods -n hackathon-dev -l app.kubernetes.io/name=<chart-name> -o jsonpath='{.items[0].spec.containers[0].image}'
```

**Pass criteria:** Previous revision restores successfully, pods healthy.

### Validation Summary Report

```
Deployment Validation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: <name>
Namespace: <namespace>
Helm Release: <release>

| Gate                | Status | Details |
|---------------------|--------|---------|
| Container Build     | PASS/FAIL | <detail> |
| Kubernetes Deploy   | PASS/FAIL | <detail> |
| Pod Health          | PASS/FAIL | <detail> |
| Service Exposure    | PASS/FAIL | <detail> |
| Replica Scaling     | PASS/FAIL | <detail> |
| Failure Simulation  | PASS/FAIL | <detail> |
| Helm Upgrade        | PASS/FAIL | <detail> |
| Helm Rollback       | PASS/FAIL | <detail> |

Overall: X/8 gates passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Mode 5: Resilience & Failure Simulation

### Step 1: Pod Failure Simulation

```bash
# Delete a running pod to test self-healing
kubectl delete pod -n hackathon-dev -l app.kubernetes.io/name=<chart-name> --wait=false

# Watch recovery
kubectl get pods -n hackathon-dev -l app.kubernetes.io/name=<chart-name> -w
```

**Expected behavior:** ReplicaSet detects missing pod, schedules replacement within 30 seconds.

### Step 2: Node Pressure Simulation

```bash
kubectl-ai "Simulate resource pressure on the Minikube node by creating a stress pod in hackathon-dev that consumes 80% of available CPU for 60 seconds. Monitor how the HPA responds for <service-name>."
```

### Step 3: Dependency Failure Simulation

```bash
kubectl-ai "Simulate a database connection failure for <service-name> in hackathon-dev by temporarily modifying the DATABASE_URL environment variable to an invalid value. Observe how the readiness probe responds and how traffic is rerouted."
```

### Step 4: AI-Assisted Analysis

After each simulation, analyze results:

```bash
# kubectl-ai analysis
kubectl-ai "Analyze the recovery behavior after pod deletion for <service-name> in hackathon-dev. Report: time to detect, time to schedule, time to ready. Compare against SLO targets."

# Kagent analysis
kagent "Review the cluster events from the last 10 minutes in hackathon-dev. Identify any anomalies, failed scheduling attempts, or resource contention issues. Provide a resilience score."
```

### Step 5: Resilience Report

```
Resilience Test Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: <name>

| Test                  | Result | Recovery Time |
|-----------------------|--------|---------------|
| Pod Deletion          | PASS/FAIL | <Xs>       |
| Node Pressure         | PASS/FAIL | <Xs>       |
| Dependency Failure    | PASS/FAIL | <Xs>       |

Self-Healing: CONFIRMED / DEGRADED / FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Mode 6: Observability & Diagnostics

### Log Analysis

```bash
# View pod logs
kubectl logs -n hackathon-dev -l app.kubernetes.io/name=<chart-name> --tail=100

# Stream logs in real-time
kubectl logs -n hackathon-dev -l app.kubernetes.io/name=<chart-name> -f

# View previous container logs (after crash)
kubectl logs -n hackathon-dev <pod-name> --previous
```

### Resource Inspection

```bash
# Detailed pod description
kubectl describe pod -n hackathon-dev -l app.kubernetes.io/name=<chart-name>

# Resource usage (requires metrics-server)
kubectl top pods -n hackathon-dev
kubectl top nodes
```

### Event Analysis

```bash
# Recent events sorted by time
kubectl get events -n hackathon-dev --sort-by='.lastTimestamp'

# Filter for warnings
kubectl get events -n hackathon-dev --field-selector type=Warning
```

### AI-Enhanced Troubleshooting

**General diagnostics:**
```bash
kubectl-ai "The <service-name> deployment in hackathon-dev is experiencing <symptom>. Run a full diagnostic: check pod status, recent events, container logs, resource utilization, and network connectivity. Provide a root cause analysis."
```

**Cluster-wide diagnostics:**
```bash
kagent "Perform a full cluster diagnostic. Check: node health, system pod status, DNS resolution, ingress controller, storage provisioner, and certificate status. Report any issues that could affect application deployments in hackathon-dev."
```

**Network debugging:**
```bash
kubectl-ai "Test network connectivity between <service-a> and <service-b> in hackathon-dev namespace. Verify DNS resolution, service discovery, and port accessibility. Report any network policy blocks or connectivity issues."
```

### Diagnostic Report

```
Diagnostic Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scope: <namespace / cluster-wide>

Cluster Health:
  Nodes:     <status>
  System:    <status>
  DNS:       <status>
  Ingress:   <status>

Service Health (<service-name>):
  Pods:      <running/total>
  Restarts:  <count>
  CPU:       <usage>/<limit>
  Memory:    <usage>/<limit>

Issues Found:
  - [CRITICAL] <issue + recommendation>
  - [WARNING]  <issue + recommendation>
  - [INFO]     <observation>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Mode 7: Governance & Compliance Audit

### Step 1: Spec Compliance Check

Verify the SDD lifecycle was followed:

1. **Specification exists**: Check `specs/007-k8s-deployment/spec.md` — if missing: "No spec found. Run `/sp.specify` first."
2. **Plan exists**: Check `specs/007-k8s-deployment/plan.md` — if missing: "No plan found. Run `/sp.plan` first."
3. **Tasks exist**: Check `specs/007-k8s-deployment/tasks.md` — if missing: "No tasks found. Run `/sp.tasks` first."

### Step 2: Phase Isolation Audit

Verify Phase IV has not modified previous phases:

```bash
# Check git diff for cross-phase modifications
git diff --name-only main -- phase-01-console/ phase-02-web/ phase-03-ai-chat/
```

**Violation:** Any modified file in Phase I-III directories from Phase IV work.

### Step 3: YAML Provenance Audit

For each YAML file in `phase-04-k8s/`:
- Verify it contains a generation header comment (`# Generated by ...`)
- Verify a corresponding PHR exists for the generating prompt
- Flag any files without provenance

### Step 4: Helm Chart Compliance

For each chart in `phase-04-k8s/helm/`:
- [ ] `Chart.yaml` exists with required fields
- [ ] `values.yaml` exists with resource limits defined
- [ ] Deployment template includes all three health probes (liveness, readiness, startup)
- [ ] Resource requests AND limits are defined (omitting limits is a governance violation)
- [ ] HPA is configured for stateless services
- [ ] Namespace is explicitly declared
- [ ] Non-root security context is applied

### Step 5: Namespace Policy Check

```bash
# Verify all deployments declare target namespace
kubectl get deployments --all-namespaces -o json | jq '.items[] | select(.metadata.namespace | startswith("hackathon")) | {name: .metadata.name, namespace: .metadata.namespace}'
```

### Step 6: Governance Report

```
Governance & Compliance Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SDD Lifecycle:
  Spec:     EXISTS / MISSING
  Plan:     EXISTS / MISSING
  Tasks:    EXISTS / MISSING
  Status:   COMPLIANT / NON-COMPLIANT

Phase Isolation:
  Cross-phase modifications: <count>
  Status:   COMPLIANT / VIOLATION

YAML Provenance:
  Files with provenance:    X/Y
  Files without provenance: <list>
  Status:   COMPLIANT / NON-COMPLIANT

Helm Chart Compliance:
  <chart-name>:
    Health probes:    X/3
    Resource limits:  DEFINED / MISSING
    HPA:              CONFIGURED / MISSING
    Namespace:        EXPLICIT / IMPLICIT
    Security context: SET / MISSING
    Status:           COMPLIANT / NON-COMPLIANT

Overall: COMPLIANT / NON-COMPLIANT (<count> violations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## CROSS-SKILL INTEGRATION

### Docker AI Architect Handoff

When image builds are needed, reference the `docker-ai-architect` skill:
- "Image not found. Use `/docker-ai-architect generate <service>` to create the Dockerfile first."
- After Dockerfile generation, return to this skill for Helm chart creation and deployment.

### Workflow Sequence

```
docker-ai-architect generate → docker build → k8s-ai-operator helm → k8s-ai-operator deploy → k8s-ai-operator validate
```

---

## SPEC-DRIVEN GOVERNANCE

Before generating any artifact, verify:

1. **Specification exists**: Check `specs/007-k8s-deployment/spec.md` — if missing, warn: "No spec found. Run `/sp.specify` first or confirm intent."
2. **Phase constraints**: Ensure the target aligns with Phase IV scope.
3. **Plan alignment**: If `plan.md` exists, cross-reference architecture decisions.
4. **Phase isolation**: Confirm no modifications to Phase I-III directories.
5. **Auditability**: Every generated artifact includes a comment header:
   ```yaml
   # Generated by k8s-ai-operator
   # Spec: <spec-reference>
   # Phase: IV
   # Date: <ISO-date>
   ```

If spec is unclear or missing, **request clarification** before proceeding.

---

## OUTPUT STYLE

All outputs must be:
- **Structured** with clear milestone alignment
- **Professional** with reasoning before artifacts
- **Implementation-ready** with commands and AI prompts included
- **Validated** with included verification steps
- **Designed for Hackathon evaluation** with governance traceability

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent-native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3-7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` -> `history/prompts/constitution/`
     - Feature stages -> `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` -> `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent-native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/...`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
