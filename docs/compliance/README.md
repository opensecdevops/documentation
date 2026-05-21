---
sidebar_position: 1
title: Compliance & Certifications
---

# OSDO Compliance & Certification Alignment

OSDO is designed to help organizations meet security compliance requirements. This document maps OSDO capabilities to major security frameworks and certifications.

## Framework Alignment Summary

| Framework | Coverage | OSDO Components |
|-----------|----------|-----------------|
| **OpenSSF Best Practices** | 🟢 High | Scorecard, SECURITY.md, CONTRIBUTING.md, signed releases |
| **SLSA (Supply Chain)** | 🟡 Level 2 | Build provenance, SBOM generation, signed artifacts |
| **OWASP Top 10** | 🟢 High | SAST, SCA, DAST, Secrets scanning |
| **NIST SSDF** | 🟡 Partial | Secure development workflows, vulnerability management |
| **CIS Benchmarks** | 🟡 Partial | IaC scanning, container security |
| **SOC 2 Type II** | 🟡 Partial | Audit trails, access controls, security monitoring |

---

## OpenSSF Best Practices

The [OpenSSF Best Practices Badge](https://www.bestpractices.dev/) is a self-certification program for open source projects.

### Passing Level Criteria

| Criterion | Status | How OSDO Meets It |
|-----------|--------|-------------------|
| Published documentation | ✅ | Docusaurus site + repo READMEs |
| FLOSS license | ✅ | MIT License across all repos |
| Version control (Git) | ✅ | GitHub with protected branches |
| Bug reporting process | ✅ | Issue templates (bug + feature) |
| Build system | ✅ | GitHub Actions CI/CD |
| Automated test suite | 🔄 | Action test workflows |
| Security policy | ✅ | SECURITY.md in .github repo |
| Vulnerability reporting | ✅ | GitHub Security Advisories |
| Code of Conduct | ✅ | CODE_OF_CONDUCT.md |
| Contributing guidelines | ✅ | CONTRIBUTING.md (org-wide) |
| License in standard location | ✅ | LICENSE in each repo |
| CHANGELOG | ✅ | CHANGELOG.md (Keep a Changelog format) |

### Silver Level Additions

| Criterion | Status | How OSDO Meets It |
|-----------|--------|-------------------|
| DCO or CLA | ✅ | DCO enforcement via GitHub Action |
| Code review required | 🔄 | CODEOWNERS + branch protection (recommended) |
| Signed releases | ✅ | Build provenance attestations |
| SECURITY-INSIGHTS.yml | ✅ | Present in main osdo repo |

---

## SLSA (Supply-chain Levels for Software Artifacts)

[SLSA](https://slsa.dev/) is a framework for ensuring software supply chain integrity.

### SLSA Level Mapping

| Level | Requirements | OSDO Status |
|-------|-------------|-------------|
| **Level 1** | Documentation of build process | ✅ Release workflows documented |
| **Level 2** | Hosted build + signed provenance | ✅ GitHub Actions + attest-build-provenance |
| **Level 3** | Hardened build platform | 🔄 GitHub-hosted runners (partial) |

### OSDO Supply Chain Controls

| Control | Implementation |
|---------|---------------|
| **Source integrity** | GitHub protected branches, signed commits |
| **Build integrity** | GitHub Actions (hosted, ephemeral runners) |
| **Provenance** | `actions/attest-build-provenance@v2` on every release |
| **SBOM** | Generated with Syft (SPDX + CycloneDX) on every release |
| **Dependency scanning** | `osdo-sca` with OSV-Scanner and Grype |
| **Artifact signing** | `osdo-sign` with Cosign/Sigstore |

---

## OWASP Alignment

### OWASP Top 10 (2021) Coverage

| # | Risk | OSDO Action | Detection |
|---|------|-------------|-----------|
| A01 | Broken Access Control | `osdo-sast` | Static analysis rules |
| A02 | Cryptographic Failures | `osdo-sast` | Crypto anti-pattern detection |
| A03 | Injection | `osdo-sast`, `osdo-dast` | SAST + DAST coverage |
| A04 | Insecure Design | `osdo-iac-scan` | Architecture review rules |
| A05 | Security Misconfiguration | `osdo-iac-scan`, `osdo-container-scan` | IaC + Dockerfile scanning |
| A06 | Vulnerable Components | `osdo-sca` | Dependency vulnerability DB |
| A07 | Auth Failures | `osdo-sast`, `osdo-dast` | Auth pattern analysis |
| A08 | Software/Data Integrity | `osdo-sign`, `osdo-sbom` | Signing + SBOM |
| A09 | Logging Failures | `osdo-sast` | Logging pattern checks |
| A10 | SSRF | `osdo-sast`, `osdo-dast` | URL validation rules |

### OWASP ASVS Coverage

| Category | OSDO Support |
|----------|-------------|
| V1 - Architecture | IaC scanning, container security |
| V2 - Authentication | SAST auth pattern detection |
| V5 - Validation | SAST input validation rules |
| V9 - Communications | SAST TLS/crypto checks |
| V10 - Malicious Code | SCA vulnerability scanning |
| V14 - Configuration | IaC + container configuration scanning |

---

## NIST SSDF (Secure Software Development Framework)

| SSDF Practice | OSDO Implementation |
|---------------|---------------------|
| **PO.1** Define security requirements | Security policy templates, SECURITY.md |
| **PS.1** Protect software | Branch protection, signed commits, access controls |
| **PW.1** Design secure software | IaC scanning, architecture validation |
| **PW.5** Create source code | SAST, secrets scanning, pre-commit hooks |
| **PW.6** Build software | SLSA provenance, reproducible builds |
| **PW.7** Review code | PR templates, CODEOWNERS, review requirements |
| **PW.8** Test software | DAST, SCA, container scanning |
| **PW.9** Configure software | IaC scanning, CIS benchmarks |
| **RV.1** Identify vulnerabilities | SCA, SAST, DAST, container scanning |
| **RV.2** Assess vulnerabilities | Severity thresholds, fail-on-critical gates |
| **RV.3** Remediate vulnerabilities | Automated PRs, fix suggestions |

---

## CIS Benchmarks

| Benchmark | OSDO Component |
|-----------|---------------|
| CIS Docker | `osdo-container-scan` (Hadolint + Trivy) |
| CIS Kubernetes | `osdo-iac-scan` (Checkov + KICS) |
| CIS AWS/Azure/GCP | `osdo-iac-scan` (Checkov frameworks) |

---

## Implementation Checklist

Use this checklist to track your organization's compliance posture with OSDO:

### Essential (Do First)
- [ ] Add `osdo-sast` to all repositories
- [ ] Add `osdo-sca` to all repositories
- [ ] Add `osdo-secrets-scan` to all repositories
- [ ] Enable GitHub Security Advisories
- [ ] Add SECURITY.md to all repositories

### Supply Chain
- [ ] Enable SLSA provenance on releases
- [ ] Generate SBOM for all releases
- [ ] Sign artifacts with `osdo-sign`
- [ ] Enable Dependabot or Renovate

### Container Security
- [ ] Add `osdo-container-scan` to container builds
- [ ] Lint Dockerfiles with Hadolint
- [ ] Scan base images for vulnerabilities

### Infrastructure
- [ ] Add `osdo-iac-scan` to IaC repositories
- [ ] Select compliance frameworks (CIS, NIST, PCI-DSS)
- [ ] Enable fail-on-high for production pipelines

### Governance
- [ ] Register for OpenSSF Best Practices Badge
- [ ] Complete SLSA Level 2 self-assessment
- [ ] Document security incident response plan
- [ ] Establish vulnerability disclosure policy

---

## Certification Roadmap

| Certification | Target | Status |
|---------------|--------|--------|
| OpenSSF Best Practices (Passing) | Q3 2026 | 🔄 In progress |
| SLSA Level 2 | Q3 2026 | 🔄 In progress |
| OpenSSF Best Practices (Silver) | Q4 2026 | 📋 Planned |
| CNCF Sandbox | Q1 2027 | 📋 Planned |
| SLSA Level 3 | Q2 2027 | 📋 Planned |
