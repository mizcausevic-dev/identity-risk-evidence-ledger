import fs from "node:fs";

import { analyze } from "./analyze.js";
import { formatMarkdown, formatSummary } from "./format.js";
import type { IdentityRiskEvidenceExport } from "./types.js";

function usage() {
  console.log(`identity-risk-evidence-ledger

Usage:
  npx identity-risk-evidence-ledger <input.json> [--format summary|markdown|json]

Examples:
  npx identity-risk-evidence-ledger fixtures/identity-risk-evidence.json --format summary
  npx identity-risk-evidence-ledger fixtures/identity-risk-evidence-clean.json --format markdown`);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const input = args[0];
const formatArgIndex = args.indexOf("--format");
const format = formatArgIndex >= 0 ? args[formatArgIndex + 1] ?? "summary" : "summary";

const raw = fs.readFileSync(input, "utf8");
const payload = JSON.parse(raw) as IdentityRiskEvidenceExport;
const report = analyze(payload);

if (format === "json") {
  console.log(JSON.stringify(report, null, 2));
} else if (format === "markdown") {
  console.log(formatMarkdown(report));
} else {
  console.log(formatSummary(report));
}
