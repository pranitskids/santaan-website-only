import { NextResponse } from "next/server";
import { pushWebsiteLeadToAiCrm } from "@/lib/aicrm-website-intake";
import { ensureMandatoryUtm } from "@/lib/utm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const email = body?.email ? String(body.email).trim() : "";
    const location = body?.location ? String(body.location).trim() : "";
    const concerns = body?.concerns ? String(body.concerns).trim() : "";
    const submissionId = String(body?.submissionId || "").trim();
    const utm = ensureMandatoryUtm(body?.utm || {});

    if (!name || !phone || submissionId.length < 8) {
      return NextResponse.json({ error: "Name and WhatsApp number are required." }, { status: 400 });
    }

    const result = await pushWebsiteLeadToAiCrm(request, {
      submissionId,
      formKind: "at_home_testing",
      name,
      phone,
      email,
      location,
      campaign: "AT_HOME_TEST",
      utm,
      landingPath: String(body?.landingPath || utm.landing_path || "/at-home-fertility-testing"),
      referrer: body?.referrer ? String(body.referrer) : undefined,
      occurredAt: body?.occurredAt ? String(body.occurredAt) : undefined,
      attribution: body?.attribution,
      contentUrn: body?.attribution?.content_urn,
      formData: {
        concern: concerns,
        ready_to_start: "yes",
      },
    });

    if (!result.ok) {
      const status = result.status >= 200 && result.status < 300 ? 202 : result.status;
      return NextResponse.json(
        {
          success: false,
          pending: status === 202,
          error: result.error || "Failed to register your request.",
        },
        { status },
      );
    }

    const leadId = result.result?.lead_id;
    if (!leadId) {
      return NextResponse.json(
        {
          success: false,
          pending: true,
          error: "CRM confirmation is still pending. Please try again in a moment.",
        },
        { status: 202 },
      );
    }

    return NextResponse.json({
      success: true,
      duplicate: result.result?.duplicate === true,
      leadId,
      message: "Request received. Our team will follow up on WhatsApp shortly.",
    });
  } catch (error) {
    console.error("At-home register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
