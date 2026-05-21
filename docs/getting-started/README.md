---
sidebar_position: 1
title: Getting Started
---

# Getting Started with OSDO

OSDO (Open SecDevOps) is a framework for implementing security pipelines in your CI/CD workflows. Choose the path that best fits your needs:

| Path | Best for | Time to first scan |
|------|----------|-------------------|
| **CLI Only** | Quick setup, single project | ~5 minutes |
| **CLI + App** | Teams, multiple projects, package management | ~15 minutes |
| **GitHub Actions** | Direct integration, no CLI needed | ~2 minutes |

---

## Path 1: CLI Only (Recommended for getting started)

Install the CLI and generate a secure pipeline with bundled templates — no server required.

### Prerequisites

- Node.js ≥ 18
- Git
- GitHub repository

### Install

```bash
npm install -g @osdo/cli
```

### Initialize a pipeline

```bash
cd your-project/

# Interactive mode — choose a template and answer prompts
osdo init

# Or specify a template directly
osdo init --template basic      # SAST + SCA + Secrets
osdo init --template container  # + Container scan + SBOM
osdo init --template full       # + IaC + Signing + Compliance
```

This generates `.github/workflows/osdo-security.yml` in your project.

### Commit & push

```bash
git add .github/workflows/osdo-security.yml
git commit -m "ci: add OSDO security pipeline"
git push
```

Your security pipeline is now running on every push and PR.

---

## Path 2: CLI + App (Teams & Advanced)

The OSDO App provides a web UI for managing security packages, customizing scan configurations, and generating pipelines for multiple projects.

### Start the App locally

```bash
git clone https://github.com/opensecdevops/osdo-app.git
cd osdo-app
docker compose up -d
```

The app is accessible at `http://localhost:8080`.

### Connect CLI to App

```bash
osdo app login http://localhost:8080
# Enter your API token (generate from App → Settings → API Tokens)

# Pull available packages
osdo app pull

# Deploy a package with interactive configuration
osdo deploy --package osdo-basic-pipeline
```

### Create custom packages

In the App, navigate to **Packages → Create** and upload a zip containing:
- `config.json` — Form definition (fields, validation, blocks)
- `templates/` — Handlebars templates (`.hbs` files)

See [Package Development Guide](/docs/v2/packages) for the full specification.

---

## Path 3: GitHub Actions (Direct Integration)

Use OSDO actions directly in your workflows without installing anything:

### Single action

```yaml
# .github/workflows/security.yml
name: Security
on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: opensecdevops/osdo-sast@v2
```

### Reusable workflow (all scans)

```yaml
# .github/workflows/security.yml
name: Security
on: [push, pull_request]

jobs:
  security:
    uses: opensecdevops/osdo-workflows/.github/workflows/osdo-framework.yml@v2
    with:
      scan-sast: true
      scan-sca: true
      scan-secrets: true
      scan-container: true
      scan-iac: true
```

### Available actions

| Action | Description |
|--------|-------------|
| `opensecdevops/osdo-sast@v2` | Static Application Security Testing (Semgrep) |
| `opensecdevops/osdo-sca@v2` | Software Composition Analysis (OSV-Scanner) |
| `opensecdevops/osdo-secrets-scan@v2` | Secret detection (Gitleaks) |
| `opensecdevops/osdo-container-scan@v2` | Container image scanning (Trivy) |
| `opensecdevops/osdo-iac-scan@v2` | Infrastructure as Code scanning (Checkov) |
| `opensecdevops/osdo-sbom@v2` | SBOM generation (Syft) |
| `opensecdevops/osdo-sign@v2` | Artifact signing (Cosign/Sigstore) |
| `opensecdevops/osdo-dast@v2` | Dynamic Application Security Testing (ZAP) |

---

## What's next?

- [Architecture Overview](/docs/v2/architecture) — How all OSDO components fit together
- [CLI Reference](/docs/v2/cli-reference) — Full command documentation
- [Actions Catalog](/docs/v2/actions) — Detailed action configuration
- [Certification Compliance](/docs/compliance) — SLSA, OpenSSF Scorecard alignment
