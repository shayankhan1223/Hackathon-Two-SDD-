---
id: 0001
title: Update CLAUDE.md for Phase IV Governance
stage: general
date: 2026-02-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 006-phase3-improvements
user: shayan
command: governance-update
labels: ["governance", "claude-md", "phase-4", "kubernetes", "infrastructure"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - CLAUDE.md
tests:
  - none
---

## Prompt

You are acting as the Governance Architect for Hackathon II.

Your task is to update the existing CLAUDE.md file to align with the current project state, which now includes Phase IV: Local Kubernetes Deployment.

Project Context:

This project follows Spec-Driven Development across multiple phases:
- Phase I – Foundation
- Phase II – Core Application Logic
- Phase III – Cloud Native Todo Chatbot
- Phase IV – Local Kubernetes Deployment using Minikube, Helm, Docker AI (Gordon), kubectl-ai, and Kagent

The project strictly follows:
Spec → Plan → Tasks → AI Implementation

CRITICAL GOVERNANCE RULES:
- No manual coding allowed.
- All infrastructure artifacts must be AI-generated.
- All prompts and iterations must be documented.
- Every phase must be reproducible from scratch.
- Each phase exists in a separate folder.

Your Task:

Update CLAUDE.md to include the following structured sections:

1. Project Overview - Describe the multi-phase architecture. Explain that each phase builds upon the previous one. Clarify that Phase IV introduces Infrastructure Automation.
2. Development Workflow Enforcement - Enforce Spec-Driven Development lifecycle. Define strict order. State that skipping steps is not allowed.
3. AI-Only Implementation Policy - Explicitly prohibit manual YAML writing. Explicitly prohibit manual Dockerfile writing. Require use of Docker AI (Gordon), kubectl-ai, kagent, Claude Code. Require documentation of all AI prompts used.
4. Phase IV Infrastructure Rules - Define governance rules for Docker image generation, Helm chart structure, Kubernetes namespace usage, Replica configuration, Resource limits, Health checks, Scaling, AI-assisted diagnostics.
5. Testing & Validation Standards - Define mandatory validation for container build, K8s deploy, pod health, replica scaling, failure simulation, Helm upgrade & rollback.
6. Documentation & Audit Trail - All AI interactions must be logged. Iterations must be recorded. Prompts must be versioned. Deployment must be reproducible.
7. Folder Structure Governance - Each phase has its own directory. Phase IV must not modify earlier phases. Helm charts and Docker artifacts scoped to Phase IV.
8. Infrastructure Blueprint Philosophy - Explain how Phase IV uses SDD for Infrastructure Automation. Infrastructure treated as governed AI-managed artifacts.

Output Requirements: Rewrite entire CLAUDE.md. Structured, professional, governance language, judge-review ready.

## Response snapshot

Rewrote CLAUDE.md from 230 lines to 407 lines. The updated file now contains 11 major sections:
1. Project Overview (multi-phase architecture table, progression model)
2. Development Workflow Enforcement (strict SDD lifecycle, enforcement rules)
3. AI-Only Implementation Policy (prohibition list, mandatory toolchain, prompt documentation)
4. Phase IV Infrastructure Rules (Docker governance, Helm structure, namespace policy, replicas, resources, health checks, AI diagnostics)
5. Testing & Validation Standards (7-gate validation matrix, enforcement rules)
6. Documentation & Audit Trail (PHR process, ADR significance test, iteration logging, reproducibility)
7. Folder Structure Governance (full tree, isolation rules)
8. Infrastructure Blueprint Philosophy (Infrastructure-as-AI-Artifact, governing principles)
9. Agent Operational Rules (source mandate, execution flow, human-as-tool, policies, contract)
10. Architect Guidelines (9-point checklist)
11. Active Technology Stack (application layer + infrastructure layer tables)

## Outcome

- ✅ Impact: Complete governance rewrite — CLAUDE.md now reflects cloud-native, AI-governed, multi-phase project with Phase IV Kubernetes infrastructure rules
- 🧪 Tests: none (governance document, no code changes)
- 📁 Files: CLAUDE.md (rewritten)
- 🔁 Next prompts: `/sp.constitution` to align constitution with new governance, `/sp.specify` for Phase IV spec
- 🧠 Reflection: Successfully preserved all existing operational rules (PHR, ADR, agent behavior) while adding comprehensive Phase IV governance. The document is now structured for judge review with clear sections, tables, and enforceable rules.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A — governance document
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate that constitution.md is updated to match new CLAUDE.md governance scope
