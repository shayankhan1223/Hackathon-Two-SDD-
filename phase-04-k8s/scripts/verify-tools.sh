#!/usr/bin/env bash
# Phase IV Tool Verification Script — AI-Generated via Claude Code
# Verifies all required tools for Kubernetes deployment are installed
# Usage: ./verify-tools.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

check_tool() {
    local name="$1"
    local cmd="$2"
    local min_version="$3"
    local required="$4"

    if command -v "$cmd" &>/dev/null; then
        local version
        version=$("$cmd" --version 2>&1 | head -1 || "$cmd" version 2>&1 | head -1 || echo "unknown")
        echo -e "${GREEN}✓${NC} $name: $version"
        ((PASS++))
    else
        if [ "$required" = "required" ]; then
            echo -e "${RED}✗${NC} $name: NOT FOUND (required, min $min_version)"
            ((FAIL++))
        else
            echo -e "${YELLOW}!${NC} $name: NOT FOUND (optional)"
            ((WARN++))
        fi
    fi
}

echo "================================================"
echo "  Phase IV — Tool Verification"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "================================================"
echo ""

echo "--- Required Tools ---"
check_tool "Docker"    "docker"    "24.x+"   "required"
check_tool "Minikube"  "minikube"  "v1.32+"  "required"
check_tool "Helm"      "helm"      "v3.x"    "required"
check_tool "kubectl"   "kubectl"   "v1.28+"  "required"

echo ""
echo "--- AI Tools (Optional for MVP) ---"
check_tool "kubectl-ai" "kubectl-ai" "latest" "optional"
check_tool "kagent"     "kagent"     "latest" "optional"

echo ""
echo "--- Docker Status ---"
if docker info &>/dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon is running"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Docker daemon is NOT running"
    ((FAIL++))
fi

echo ""
echo "================================================"
echo -e "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}, ${YELLOW}$WARN warnings${NC}"
echo "================================================"

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo "Some required tools are missing. Install them before proceeding."
    exit 1
fi

echo ""
echo "All required tools verified. Ready for Phase IV deployment."
exit 0
