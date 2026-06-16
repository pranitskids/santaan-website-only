"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { readUtmParams } from "@/lib/utm";

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function FooterNewsletterForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubscribe = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim() || !phone.trim()) return;

        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, utm: readUtmParams() }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || "Failed to subscribe");
            }

            setStatus("success");
            setMessage(data?.message || "You're in. We will follow up on WhatsApp.");
            setName("");
            setPhone("");

            const analyticsWindow = window as GtagWindow;
            analyticsWindow.gtag?.("event", "sign_up", {
                event_category: "engagement",
                event_label: "whatsapp_tips_signup",
            });
        } catch (error: unknown) {
            setStatus("error");
            const errorMessage = error instanceof Error ? error.message : "Failed to subscribe";
            setMessage(errorMessage);
        }
    };

    return (
        <form className="space-y-2" onSubmit={handleSubscribe}>
            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-santaan-amber"
            />
            <input
                type="tel"
                placeholder="WhatsApp number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-santaan-amber"
            />
            <Button
                fullWidth
                className="bg-santaan-amber hover:bg-[#E08E45]"
                disabled={status === "loading"}
            >
                {status === "loading" ? "Saving..." : "Get WhatsApp tips"}
            </Button>
            {message && (
                <p
                    className={`text-xs ${status === "success" ? "text-emerald-200" : "text-rose-200"}`}
                >
                    {message}
                </p>
            )}
            <p className="text-xs text-gray-400">
                We use this only for fertility guidance and follow-up on WhatsApp.
            </p>
        </form>
    );
}
