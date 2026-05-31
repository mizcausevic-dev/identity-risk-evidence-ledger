import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { boardMemo, identityLane, payload, riskEvidence, summary, verification } from "../src/services/identityRiskEvidenceLedgerService.js";
import { renderBoardMemo, renderDocs, renderIdentityLane, renderOverview, renderRiskEvidence, renderVerification } from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

rmSync(site, { recursive: true, force: true });

const files: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("identity-lane", "index.html")]: renderIdentityLane(),
  [path.join("risk-evidence", "index.html")]: renderRiskEvidence(),
  [path.join("board-memo", "index.html")]: renderBoardMemo(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs(),
  "robots.txt": "User-agent: *\nAllow: /\nSitemap: https://identity.kineticgain.com/sitemap.xml\n",
  "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://identity.kineticgain.com/</loc></url>
  <url><loc>https://identity.kineticgain.com/identity-lane/</loc></url>
  <url><loc>https://identity.kineticgain.com/risk-evidence/</loc></url>
  <url><loc>https://identity.kineticgain.com/board-memo/</loc></url>
  <url><loc>https://identity.kineticgain.com/verification/</loc></url>
  <url><loc>https://identity.kineticgain.com/docs/</loc></url>
</urlset>`,
  [path.join("api", "dashboard", "summary.json")]: JSON.stringify(summary(), null, 2),
  [path.join("api", "identity-lane.json")]: JSON.stringify(identityLane(), null, 2),
  [path.join("api", "risk-evidence.json")]: JSON.stringify(riskEvidence(), null, 2),
  [path.join("api", "board-memo.json")]: JSON.stringify(boardMemo(), null, 2),
  [path.join("api", "verification.json")]: JSON.stringify(verification(), null, 2),
  [path.join("api", "sample.json")]: JSON.stringify(payload(), null, 2)
};

for (const [relativePath, contents] of Object.entries(files)) {
  const fullPath = path.join(site, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}
