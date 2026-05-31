import request from "supertest";

import app from "../src/app.js";

const routes = [
  "/",
  "/identity-lane",
  "/risk-evidence",
  "/board-memo",
  "/verification",
  "/docs",
  "/api/dashboard/summary",
  "/api/identity-lane",
  "/api/risk-evidence",
  "/api/board-memo",
  "/api/verification",
  "/api/sample"
];

for (const route of routes) {
  const response = await request(app).get(route);
  if (response.status !== 200) {
    throw new Error(`Smoke check failed for ${route}: ${response.status}`);
  }
}

console.log(`Smoke check passed for ${routes.length} routes.`);
