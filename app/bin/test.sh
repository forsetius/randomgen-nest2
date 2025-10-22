#!/usr/bin/env bash
set -Eeuo pipefail

# --- paths ---
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Prefer local rimraf; if not present, use rm -rf
RIMRAF="$ROOT_DIR/node_modules/.bin/rimraf"
cleanup() {
  if [[ -x "$RIMRAF" ]]; then
    "$RIMRAF" dist-test || true
  else
    rm -rf dist-test || true
  fi
}
trap cleanup EXIT

# --- helper do uruchamiania kroków i zbierania kodów wyjścia ---
run_step() {
  local name="$1"; shift
  echo -e "\n\033[1;34m▶ $name\033[0m"
  if "$@"; then
    echo -e "\033[1;32m✔ $name OK\033[0m"
    return 0
  else
    local code=$?
    echo -e "\033[1;31m✖ $name FAIL (exit $code)\033[0m"
    return $code
  fi
}

UNIT=0
PAR=0
SER=0

# --- 1) test build ---
run_step "test:build" npm run -s test:build || true

# --- 2) unit ---
run_step "test:unit" npm run -s test:unit || UNIT=$?

# --- 3) e2e parallel ---
run_step "test:e2e:parallel" npm run -s test:e2e:parallel || PAR=$?

# --- 4) e2e serial ---
run_step "test:e2e:serial" npm run -s test:e2e:serial || SER=$?

EXIT=$(( UNIT || PAR || SER ))

echo -e "\n\033[1mSummary:\033[0m"
printf "  unit:          %s\n"  "$([[ $UNIT -eq 0 ]] && echo OK || echo FAIL)"
printf "  e2e-parallel:  %s\n"  "$([[ $PAR  -eq 0 ]] && echo OK || echo FAIL)"
printf "  e2e-serial:    %s\n"  "$([[ $SER  -eq 0 ]] && echo OK || echo FAIL)"
echo "  cleanup:   dist-test deleted"

exit $EXIT
