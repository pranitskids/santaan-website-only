import { NextResponse } from "next/server";
import { pushWebsiteLeadToAiCrm } from "@/lib/aicrm-website-intake";
import { ensureMandatoryUtm } from "@/lib/utm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const email = body?.email ? String(body.email).trim() : "";
    const question = body?.question ? String(body.question).trim() : "";
    const score = body?.score;
    const signal = body?.signal ? String(body.signal).trim() : "";
    const submissionId = String(body?.submissionId || "").trim();
    const utm = ensureMandatoryUtm(body?.utm || {});

    if (!name || !phone || submissionId.length < 8) {
      return NextResponse.json({ error: "Name and WhatsApp number are required." }, { status: 400 });
    }

    const result = await pushWebsiteLeadToAiCrm(request, {
      submissionId,
      formKind: "seminar_registration",
      name,
      phone,
      email,
      campaign: "SEMINAR",
      utm,
      landingPath: String(body?.landingPath || utm.landing_path || "/know-your-score"),
      referrer: body?.referrer ? String(body.referrer) : undefined,
      occurredAt: body?.occurredAt ? String(body.occurredAt) : undefined,
      attribution: body?.attribution,
      contentUrn: body?.attribution?.content_urn,
      formData: {
        question,
        score: typeof score === "number" ? score : String(score || ""),
        signal,
        ready_to_start: "exploring",
      },
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error || "Failed to reserve your spot." }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      duplicate: result.result?.duplicate === true,
      leadId: result.result?.lead_id,
      message: "Spot reserved. We will confirm the seminar details on WhatsApp.",
    });
  } catch (error) {
    console.error("Seminar registration error:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
