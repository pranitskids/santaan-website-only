import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { pushWebsiteLeadToAiCrm } from "../src/lib/aicrm-website-intake";
import { POST as atHomePost } from "../src/app/api/at-home/register/route";
import { POST as seminarPost } from "../src/app/api/seminar/register/route";
import { POST as consultationPost } from "../src/app/api/consultation/register/route";
import { POST as intentPost } from "../src/app/api/intent/route";

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
  assert.equal(body.leadId, "lead-existing");
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

test("website intake preserves the CRM status when the worker returns non-JSON error text", async () => {
  globalThis.fetch = (async () =>
    new Response("gateway timeout", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    })) as typeof fetch;

  const result = await pushWebsiteLeadToAiCrm(
    new Request("https://www.santaan.in/api/at-home/register"),
    {
      submissionId: "web-test-24681357",
      formKind: "at_home_testing",
      name: "QA Website Lead",
      phone: "9999999999",
      campaign: "AT_HOME_TEST",
      landingPath: "/at-home-fertility-testing",
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.status, 502);
  assert.equal(result.error, "CRM returned 502.");
});

test("website intake treats an in-progress CRM submission as pending, not confirmed", async () => {
  globalThis.fetch = (async () =>
    Response.json(
      {
        error: "submission_in_progress",
        submission_id: "web-test-in-progress",
      },
      { status: 409 },
    )) as typeof fetch;

  const result = await pushWebsiteLeadToAiCrm(
    new Request("https://www.santaan.in/api/at-home/register"),
    {
      submissionId: "web-test-in-progress",
      formKind: "at_home_testing",
      name: "QA Website Lead",
      phone: "9999999999",
      campaign: "AT_HOME_TEST",
      landingPath: "/at-home-fertility-testing",
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.status, 202);
  assert.equal(result.result?.duplicate, true);
  assert.match(String(result.error), /still processing/i);
});

test("website intake treats its own CRM timeout as pending, not confirmed", async () => {
  globalThis.fetch = (async () => {
    throw new DOMException("The operation timed out.", "TimeoutError");
  }) as typeof fetch;

  const result = await pushWebsiteLeadToAiCrm(
    new Request("https://www.santaan.in/api/at-home/register"),
    {
      submissionId: "web-test-timeout",
      formKind: "at_home_testing",
      name: "QA Website Lead",
      phone: "9999999999",
      campaign: "AT_HOME_TEST",
      landingPath: "/at-home-fertility-testing",
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.status, 202);
  assert.equal(result.result?.submission_id, "web-test-timeout");
  assert.match(String(result.error), /still processing/i);
});

test("at-home route does not confirm a CRM response without a lead id", async () => {
  globalThis.fetch = (async () =>
    Response.json(
      {
        accepted: true,
        duplicate: false,
        submission_id: "web-test-no-lead",
      },
      { status: 201 },
    )) as typeof fetch;

  const response = await atHomePost(
    new Request("https://www.santaan.in/api/at-home/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: "web-test-no-lead",
        name: "QA Pending Lead",
        phone: "9999999999",
        landingPath: "/at-home-fertility-testing",
      }),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.success, false);
  assert.equal(body.pending, true);
  assert.equal(body.leadId, undefined);
});

test("at-home route reports CRM timeout as pending without a lead id", async () => {
  globalThis.fetch = (async () => {
    throw new DOMException("The operation timed out.", "TimeoutError");
  }) as typeof fetch;

  const response = await atHomePost(
    new Request("https://www.santaan.in/api/at-home/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: "web-test-timeout-route",
        name: "QA Timeout Lead",
        phone: "9999999999",
        landingPath: "/at-home-fertility-testing",
      }),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.success, false);
  assert.equal(body.pending, true);
  assert.equal(body.leadId, undefined);
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

test("Jeypore consultation request is tagged as coming soon and returns the confirmed lead id", async () => {
  let outboundPayload: Record<string, unknown> = {};
  globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    outboundPayload = JSON.parse(String(init?.body));
    return Response.json(
      {
        accepted: true,
        duplicate: false,
        lead_id: "lead-jeypore-1",
        submission_id: "web-jeypore-12345678",
        capi: { queued: true, status: "pending" },
      },
      { status: 201 },
    );
  }) as typeof fetch;

  const response = await consultationPost(
    new Request("https://www.santaan.in/api/consultation/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: "web-jeypore-12345678",
        name: "Jeypore QA Lead",
        phone: "9999999999",
        centre: "Jeypore",
        concern: "Opening consultation update",
        landingPath: "/ivf-clinic-jeypore?utm_source=google&gclid=test-click",
        utm: {
          utm_source: "google",
          utm_medium: "cpc",
          utm_campaign: "jeypore_launch",
        },
        attribution: { gclid: "test-click" },
      }),
    }),
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.leadId, "lead-jeypore-1");
  assert.equal(outboundPayload.form_kind, "book_consultation");
  assert.equal(outboundPayload.location, "Jeypore");
  assert.equal(outboundPayload.campaign, "JEYPORE_COMING_SOON");
  assert.deepEqual(outboundPayload.form_data, {
    concern: "Opening consultation update",
    appointment_type: "opening_update",
    preferred_centre: "Jeypore",
    centre_status: "coming_soon",
  });
});

test("contact intent proxy forwards a non-lead Contact event to CRM", async () => {
  let outboundPayload: Record<string, unknown> = {};
  let outboundUrl = "";
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    outboundUrl = String(url);
    outboundPayload = JSON.parse(String(init?.body));
    return Response.json({ ok: true, sent: true, event_id: outboundPayload.event_id });
  }) as typeof fetch;

  const response = await intentPost(new Request("https://www.santaan.in/api/intent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "user-agent": "QA browser" },
    body: JSON.stringify({
      event_id: "intent:qa:12345678",
      event_name: "Lead",
      kind: "call",
      center: "Bhubaneswar",
      target: "tel:+918065481541",
      page_url: "https://www.santaan.in/",
      test_event_code: "must-not-forward",
    }),
  }));

  assert.equal(response.status, 200);
  assert.equal(outboundUrl, "https://api.crmai.greybrain.ai/api/website/intent");
  assert.equal(outboundPayload.event_name, "Contact");
  assert.equal(outboundPayload.test_event_code, undefined);
});
