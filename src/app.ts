import express from "express";

import { boardMemo, identityLane, payload, riskEvidence, summary, verification } from "./services/identityRiskEvidenceLedgerService.js";
import { renderBoardMemo, renderDocs, renderIdentityLane, renderOverview, renderRiskEvidence, renderVerification } from "./services/render.js";

export function createApp() {
  const app = express();

  app.get("/", (_req, res) => res.type("html").send(renderOverview()));
  app.get("/identity-lane", (_req, res) => res.type("html").send(renderIdentityLane()));
  app.get("/risk-evidence", (_req, res) => res.type("html").send(renderRiskEvidence()));
  app.get("/board-memo", (_req, res) => res.type("html").send(renderBoardMemo()));
  app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
  app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

  app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
  app.get("/api/identity-lane", (_req, res) => res.json(identityLane()));
  app.get("/api/risk-evidence", (_req, res) => res.json(riskEvidence()));
  app.get("/api/board-memo", (_req, res) => res.json(boardMemo()));
  app.get("/api/verification", (_req, res) => res.json(verification()));
  app.get("/api/sample", (_req, res) => res.json(payload()));

  return app;
}

const app = createApp();
export default app;

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT || 5533);
  app.listen(port, () => {
    console.log(`identity-risk-evidence-ledger listening on http://127.0.0.1:${port}`);
  });
}
