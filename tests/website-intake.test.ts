import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { pushWebsiteLeadToAiCrm } from "../src/lib/aicrm-website-intake";
import { POST as atHomePost } from "../src/app/api/at-home/register/route";
import { POST as seminarPost } from "../src/app/api/seminar/register/route";

const originalFetch = globalThis.fetch;
const originalEnv = {
  secret: process.env.AICRM_WEBSITE_INTAKE_SECRET,
  url: process.env.AICRM_WEBSITE_INTAKE_URL,
  site: process.env.NEXT_PUBLIC_SITE_URL,
};

beforeEach(() => {
  process.env.AICRM_WEBSITE_INTAKE_SECRET = "test-intake-secret";
  process.env.AICRM_WEBSITE_INTAKE_URL = "https://crm.example/api/intake/lead";
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.santaan.in";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env.AICRM_WEBSITE_INTAKE_SECRET = originalEnv.secret;
  process.env.AICRM_WEBSITE_INTAKE_URL = originalEnv.url;
  process.env.NEXT_PUBLIC_SITE_URL = originalEnv.site;
});

test("website intake sends an authenticated, source-rich CRM payload", async () => {
  let outbound: RequestInit | undefined;
  let outboundUrl = "";
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    outboundUrl = String(url);
    outbound = init;
    return Response.json(
      {
        accepted: true,
        duplicate: false,
        lead_id: "lead-test-1",
        submission_id: "web-test-12345678",
        capi: { queued: true, status: "pending" },
      },
      { status: 201 },
    );
  }) as typeof fetch;

  const result = await pushWebsiteLeadToAiCrm(
    new Request("https://www.santaan.in/api/at-home/register", {
      headers: {
        "user-agent": "Santaan intake test",
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
      },
    }),
    {
      submissionId: "web-test-12345678",
      formKind: "at_home_testing",
      name: "QA Website Lead",
      phone: "99999 99999",
      campaign: "AT_HOME_TEST",
      landingPath: "/at-home-fertility-testing?utm_source=meta",
      utm: {
        utm_source: "meta",
        utm_medium: "paid_social",
        utm_campaign: "odisha_ivf",
      },
      attribution: {
        fbclid: "click-1",
        fbp: "fb.1.123.456",
        fbc: "fb.1.123.click-1",
        ad_id: "ad-1",
        campaign_id: "campaign-1",
      },
      formData: { concern: "At-home test", ready_to_start: "yes" },
    },
  );

  assert.equal(result.ok, true);
  assert.equal(outboundUrl, "https://crm.example/api/intake/lead");
  assert.equal((outbound?.headers as Record<string, string>).Authorization, "Bearer test-intake-secret");
  const payload = JSON.parse(String(outbound?.body));
  assert.equal(payload.phone, "+919999999999");
  assert.equal(payload.landing_page, "https://www.santaan.in/at-home-fertility-testing?utm_source=meta");
  assert.equal(payload.client.ip_address, "203.0.113.10");
  assert.equal(payload.attribution.fbclid, "click-1");
  assert.equal(payload.form_kind, "at_home_testing");
});

test("at-home route keeps the submission id stable for CRM idempotency", async () => {
  let submissionId = "";
  globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    const payload = JSON.parse(String(init?.body));
    submissionId = payload.submission_id;
    return Response.json(
      {
        accepted: true,
        duplicate: true,
        lead_id: "lead-existing",
        submission_id: payload.submission_id,
        capi: { queued: false, status: "sent" },
      },
      { status: 200 },
    );
  }) as typeof fetch;

  const response = await atHomePost(
    new Request("https://www.santaan.in/api/at-home/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: "web-retry-12345678",
        name: "QA Retry Lead",
        phone: "9999999999",
        landingPath: "/at-home-fertility-testing",
      }),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(submissionId, "web-retry-12345678");
  assert.equal(body.duplicate, true);
  assert.equal("leadId" in body, false);
});

test("website intake fails closed when the server secret is missing", async () => {
  delete process.env.AICRM_WEBSITE_INTAKE_SECRET;
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return Response.json({ accepted: true, lead_id: "unexpected" });
  }) as typeof fetch;

  const result = await pushWebsiteLeadToAiCrm(
    new Request("https://www.santaan.in/api/at-home/register"),
    {
      submissionId: "web-test-87654321",
      formKind: "at_home_testing",
      name: "QA Website Lead",
      phone: "9999999999",
      campaign: "AT_HOME_TEST",
      landingPath: "/at-home-fertility-testing",
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
  assert.equal(called, false);
});

test("seminar route forwards the assessment context without requiring email", async () => {
  let outboundPayload: Record<string, unknown> = {};
  globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    outboundPayload = JSON.parse(String(init?.body));
    return Response.json(
      {
        accepted: true,
        duplicate: false,
        lead_id: "lead-seminar-1",
        submission_id: "web-seminar-12345678",
        capi: { queued: true, status: "pending" },
      },
      { status: 201 },
    );
  }) as typeof fetch;

  const response = await seminarPost(
    new Request("https://www.santaan.in/api/seminar/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: "web-seminar-12345678",
        name: "QA Seminar Lead",
        phone: "9999999999",
        question: "What should I do next?",
        score: 7,
        signal: "Yellow",
        landingPath: "/know-your-score",
      }),
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(outboundPayload.form_kind, "seminar_registration");
  assert.deepEqual(outboundPayload.form_data, {
    question: "What should I do next?",
    score: 7,
    signal: "Yellow",
    ready_to_start: "exploring",
  });
});
