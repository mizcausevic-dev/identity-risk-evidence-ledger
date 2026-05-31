import { boardMemo, identityLane, riskEvidence, summary } from "../src/services/identityRiskEvidenceLedgerService.js";

console.log("identity-risk-evidence-ledger demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`${identityLane().length} identity lanes`);
console.log(`${riskEvidence().length} evidence findings`);
console.log(`${boardMemo().length} board memo packets`);
