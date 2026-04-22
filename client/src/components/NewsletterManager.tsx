/**
 * Newsletter Manager — Sprint 7 Item 5
 *
 * INTEL Layer 3 component for managing the Christie's East Hampton
 * weekly newsletter. Two channels: Beehiiv + Gmail SMTP.
 *
 * Features:
 *  - Subscribe form (Beehiiv)
 *  - Subscriber stats display
 *  - Gmail SMTP test email
 *  - Setup instructions for Ed
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Setup Steps ──────────────────────────────────────────────────────────────

const SETUP_STEPS = [
  {
    id: "beehiiv-account",
    label: "Create Beehiiv Publication",
    detail: "Go to beehiiv.com → New Publication → Name: 'Christie's East Hampton' → Sender: edbruehl@christiesrealestategroup.com",
    status: "manual",
    link: "https://app.beehiiv.com",
  },
  {
    id: "beehiiv-api-key",
    label: "Beehiiv API Key → Manny",
    detail: "Beehiiv Settings → API → Generate API Key → Send to Manny. Manny sets BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID.",
    status: "manual",
    link: "https://app.beehiiv.com/settings/integrations",
  },
  {
    id: "gmail-forward",
    label: "Enable Christie's Email Auto-Forward",
    detail: "Christie's email admin → forward edbruehl@christiesrealestategroup.com to your Gmail. Or: use Gmail 'Send As' with SMTP credentials.",
    status: "manual",
    link: "https://mail.google.com/mail/u/0/#settings/accounts",
  },
  {
    id: "gmail-app-password",
    label: "Gmail App Password → Manny",
    detail: "Google Account → Security → 2-Step Verification → App Passwords → Generate for 'Mail'. Send to Manny. Manny sets GMAIL_SMTP_USER + GMAIL_APP_PASSWORD.",
    status: "manual",
    link: "https://myaccount.google.com/apppasswords",
  },
  {
    id: "smtp-test",
    label: "Send SMTP Test Email",
    detail: "Once credentials are set, use the test form below to confirm Gmail SMTP is live.",
    status: "action",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function NewsletterManager() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeFirst, setSubscribeFirst] = useState("");
  const [subscribeLast, setSubscribeLast] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Subscribed successfully");
        setSubscribeEmail("");
        setSubscribeFirst("");
        setSubscribeLast("");
      } else {
        toast.error(data.message || "Subscription failed");
      }
    },
    onError: (err) => {
      // Beehiiv not configured yet — show friendly message
      if (err.message.includes("BEEHIIV_API_KEY")) {
        toast.info("Beehiiv not yet configured. Complete setup steps below.");
      } else {
        toast.error(err.message);
      }
    },
  });

  const testEmailMutation = trpc.newsletter.sendTestEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Test email sent (ID: ${data.messageId?.slice(0, 16)}…)`);
        setTestEmail("");
      } else {
        toast.error(data.error || "Test email failed");
      }
    },
    onError: (err) => {
      if (err.message.includes("GMAIL_APP_PASSWORD") || err.message.includes("GMAIL_SMTP_USER")) {
        toast.info("Gmail SMTP not yet configured. Complete setup steps below.");
      } else {
        toast.error(err.message);
      }
    },
  });

  const statsQuery = trpc.newsletter.getStats.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const subscriberCount = statsQuery.data?.subscriberCount;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
          Newsletter Infrastructure
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
          Christie's East Hampton Market Report · Weekly
        </div>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem' }}>
          Beehiiv subscriber management + Gmail SMTP branded delivery. Every Monday.
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 700, fontSize: '1.4rem' }}>
            {subscriberCount !== null && subscriberCount !== undefined ? subscriberCount.toLocaleString() : '—'}
          </div>
          <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e' }}>
            Subscribers
          </div>
        </div>
        <div className="text-center p-3 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 700, fontSize: '1.4rem' }}>
            Monday
          </div>
          <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e' }}>
            Cadence
          </div>
        </div>
        <div className="text-center p-3 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 700, fontSize: '1.4rem' }}>
            Free
          </div>
          <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e' }}>
            Forever
          </div>
        </div>
      </div>

      {/* Two-column layout: Subscribe + Test Email */}
      <div className="grid grid-cols-1 gap-5 mb-6 md:grid-cols-2">
        {/* Subscribe form */}
        <div className="p-4 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.1)' }}>
          <div className="text-[10px] uppercase tracking-widest mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
            Add Subscriber
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address"
              value={subscribeEmail}
              onChange={e => setSubscribeEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border bg-transparent outline-none"
              style={{ fontFamily: '"Source Sans 3", sans-serif', borderColor: '#D3D1C7', color: '#1B2A4A' }}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First name"
                value={subscribeFirst}
                onChange={e => setSubscribeFirst(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border bg-transparent outline-none"
                style={{ fontFamily: '"Source Sans 3", sans-serif', borderColor: '#D3D1C7', color: '#1B2A4A' }}
              />
              <input
                type="text"
                placeholder="Last name"
                value={subscribeLast}
                onChange={e => setSubscribeLast(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border bg-transparent outline-none"
                style={{ fontFamily: '"Source Sans 3", sans-serif', borderColor: '#D3D1C7', color: '#1B2A4A' }}
              />
            </div>
            <button
              onClick={() => {
                if (!subscribeEmail) { toast.error("Email required"); return; }
                subscribeMutation.mutate({ email: subscribeEmail, firstName: subscribeFirst || undefined, lastName: subscribeLast || undefined });
              }}
              disabled={subscribeMutation.isPending}
              className="px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] disabled:opacity-50"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#1B2A4A', letterSpacing: '0.16em' }}
            >
              {subscribeMutation.isPending ? 'Adding…' : 'Add to Beehiiv →'}
            </button>
          </div>
        </div>

        {/* SMTP test */}
        <div className="p-4 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.1)' }}>
          <div className="text-[10px] uppercase tracking-widest mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
            Test Gmail SMTP
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Send test to…"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border bg-transparent outline-none"
              style={{ fontFamily: '"Source Sans 3", sans-serif', borderColor: '#D3D1C7', color: '#1B2A4A' }}
            />
            <button
              onClick={() => {
                if (!testEmail) { toast.error("Email required"); return; }
                testEmailMutation.mutate({ to: testEmail });
              }}
              disabled={testEmailMutation.isPending}
              className="px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] disabled:opacity-50"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.16em' }}
            >
              {testEmailMutation.isPending ? 'Sending…' : 'Send Test Email →'}
            </button>
            <div className="text-[10px] leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
              Sends a branded Christie's East Hampton test email. Requires GMAIL_SMTP_USER + GMAIL_APP_PASSWORD.
            </div>
          </div>
        </div>
      </div>

      {/* Setup checklist */}
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
          Setup Checklist — Ed + Manny
        </div>
        <div className="flex flex-col gap-2">
          {SETUP_STEPS.map((step, idx) => {
            const isExpanded = expandedStep === step.id;
            return (
              <div
                key={step.id}
                className="rounded-sm cursor-pointer transition-all"
                style={{
                  background: isExpanded ? 'rgba(200,172,120,0.04)' : 'rgba(27,42,74,0.02)',
                  border: `1px solid ${isExpanded ? 'rgba(200,172,120,0.3)' : 'rgba(27,42,74,0.1)'}`,
                  padding: '10px 14px',
                }}
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 flex items-center justify-center text-[9px] rounded-full"
                    style={{ background: 'rgba(200,172,120,0.12)', color: '#947231', fontFamily: '"Barlow Condensed", sans-serif' }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A', fontSize: '0.82rem', fontWeight: 500 }}>
                      {step.label}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs" style={{ color: '#947231' }}>
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(200,172,120,0.12)' }}>
                    <div className="text-xs leading-relaxed mb-2" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                      {step.detail}
                    </div>
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-block px-3 py-1 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#1B2A4A', letterSpacing: '0.14em', textDecoration: 'none' }}
                      >
                        Open ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Product spec */}
      <div className="p-4 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.1)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
          Product Spec · One Product, Four Surfaces
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Beehiiv", detail: "Subscriber management, analytics, archive" },
            { label: "Gmail SMTP", detail: "Branded send-as Christie's email" },
            { label: "Dashboard", detail: "Subscribe form + stats in INTEL Layer 3" },
            { label: "WhatsApp", detail: "Monday morning brief via Twilio (live)" },
          ].map(item => (
            <div key={item.label}>
              <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
                {item.label}
              </div>
              <div className="text-[10px]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
