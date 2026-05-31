import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { formatMarkdown, formatSummary } from "../src/format.js";
import type { IdentityRiskEvidenceExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): IdentityRiskEvidenceExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as IdentityRiskEvidenceExport;

const NOW = "2026-05-31T08:00:00Z";

describe("analyze", () => {
  it("counts systems and identity-risk packets", () => {
    const report = analyze(fixture("identity-risk-evidence.json"), { now: NOW });
    expect(report.systems).toBe(3);
    expect(report.currentSnapshots).toBe(2);
    expect(report.packets).toBe(6);
    expect(report.blockingPackets).toBe(4);
    expect(report.privilegedPackets).toBe(1);
    expect(report.guestPackets).toBe(1);
    expect(report.exposedAccounts).toBe(146);
  });

  it("flags privileged access and guest exposure as high", () => {
    const report = analyze(fixture("identity-risk-evidence.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "privileged-access-unreviewed")?.severity).toBe("high");
    expect(report.findingsList.find((item) => item.code === "guest-access-unbounded")?.severity).toBe("high");
  });

  it("flags service-account and vendor-evidence gaps", () => {
    const report = analyze(fixture("identity-risk-evidence.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "service-account-ownerless")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "vendor-trust-evidence-missing")).toBeDefined();
  });

  it("returns ok=true on a clean fixture", () => {
    const report = analyze(fixture("identity-risk-evidence-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((item) => item.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("renders findings in markdown", () => {
    const markdown = formatMarkdown(analyze(fixture("identity-risk-evidence.json"), { now: NOW }));
    expect(markdown).toContain("# Identity Risk Evidence Ledger");
    expect(markdown).toContain("privileged-access-unreviewed");
  });

  it("renders clean markdown and summary", () => {
    const report = analyze(fixture("identity-risk-evidence-clean.json"), { now: NOW });
    expect(formatMarkdown(report)).toContain("No findings generated.");
    expect(formatSummary(report)).toContain("systems: 2");
  });
});
