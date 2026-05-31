`identity-risk-evidence-ledger` has two layers:

1. Analyzer / CLI
   - reads synthetic identity-risk evidence snapshots and packets
   - identifies privileged-access drift, guest exposure, service-account ownership gaps, MFA weakness, vendor-trust gaps, and review-coverage debt
   - emits one executive posture report

2. Dashboard / prerender surface
   - turns the same findings into identity-lane, risk-evidence, and board-memo views
   - serves HTML plus JSON payloads
   - can be exported as a static GitHub Pages site
