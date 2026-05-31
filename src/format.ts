import type { PostureReport } from "./types.js";

export function formatSummary(report: PostureReport) {
  return [
    `generatedAt: ${report.generatedAt}`,
    `systems: ${report.systems}`,
    `currentSnapshots: ${report.currentSnapshots}`,
    `packets: ${report.packets}`,
    `blockingPackets: ${report.blockingPackets}`,
    `exposedAccounts: ${report.exposedAccounts}`,
    `evidenceScore: ${report.evidenceScore}`,
    `highFindings: ${report.findingsList.filter((finding) => finding.severity === "high").length}`
  ].join("\n");
}

export function formatMarkdown(report: PostureReport) {
  const rows = report.findingsList
    .map(
      (finding) =>
        `| ${finding.severity} | ${finding.code} | ${finding.subjectName ?? finding.subject} | ${finding.message.replace(/\|/g, "\\|")} |`
    )
    .join("\n");

  return [
    "# Identity Risk Evidence Ledger",
    "",
    `- Generated at: \`${report.generatedAt}\``,
    `- Evidence score: **${report.evidenceScore}**`,
    `- Blocking packets: **${report.blockingPackets}**`,
    `- Exposed accounts: **${report.exposedAccounts}**`,
    "",
    "## Findings",
    "",
    "| Severity | Code | Subject | Message |",
    "| --- | --- | --- | --- |",
    rows || "| info | none | none | No findings generated. |"
  ].join("\n");
}
