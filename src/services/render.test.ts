import { describe, expect, it } from "vitest";

import { renderBoardMemo, renderDocs, renderIdentityLane, renderOverview, renderRiskEvidence, renderVerification } from "./render.js";

describe("render", () => {
  it("renders overview copy", () => {
    expect(renderOverview()).toContain("Identity Risk Evidence Ledger");
    expect(renderOverview()).toContain("evidence score");
  });

  it("renders the identity lane route", () => {
    expect(renderIdentityLane()).toContain("Identity Lane");
    expect(renderIdentityLane()).toContain("Privileged access lane");
  });

  it("renders docs copy", () => {
    expect(renderDocs()).toContain("/api/identity-lane");
    expect(renderDocs()).toContain("identity-risk-evidence-ledger");
  });

  it("renders board memo and verification", () => {
    expect(renderBoardMemo()).toContain("Board Memo");
    expect(renderRiskEvidence()).toContain("Risk Evidence");
    expect(renderVerification()).toContain("board-safe claims only");
  });
});
