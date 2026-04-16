import { trpc } from "@/lib/trpc";

/**
 * ChristiesLetterPage — /letters/christies
 *
 * Standalone route: no nav chrome, document-only.
 * Renders the Christie's Letter to the Families.
 * PDF: client-side window.print() via Doctrine 43. No Puppeteer dependency.
 * Lead Summary Paragraph at top per Doctrine 37.
 */
export default function ChristiesLetterPage() {
  const { data, isLoading } = trpc.flagship.getChristiesLetter.useQuery();

  const handleDownload = () => {
    // Doctrine 43: client-side window.print() — no Puppeteer dependency.
    window.print();
  };

  // Parse letter text into paragraphs, separating Lead Summary from body
  const parseLetterContent = (text: string) => {
    const paragraphs = text.split("\n\n").filter(p => p.trim());
    const leadSummaryPara = paragraphs.find(p => p.startsWith("LEAD SUMMARY:"));
    const bodyParagraphs = paragraphs.filter(p => !p.startsWith("LEAD SUMMARY:"));
    const leadSummaryText = leadSummaryPara
      ? leadSummaryPara.replace("LEAD SUMMARY: ", "").replace("LEAD SUMMARY:", "")
      : null;
    return { leadSummaryText, bodyParagraphs };
  };

  const letterText = data?.text ?? "";
  const { leadSummaryText, bodyParagraphs } = parseLetterContent(letterText);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F8F5F0",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      {/* Print-hide download bar */}
      <div
        className="no-print flex items-center justify-between px-8 py-3"
        style={{
          background: "#1B2A4A",
          borderBottom: "1px solid #C8AC78",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src="https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png"
            alt="Christie's International Real Estate Group"
            style={{ height: "28px", filter: "brightness(1.1)" }}
          />
          <span
            style={{
              color: "#C8AC78",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            East Hampton · Letter to the Families
          </span>
        </div>
        <button
          onClick={handleDownload}
          style={{
            background: "#C8AC78",
            color: "#1B2A4A",
            border: "none",
            padding: "6px 18px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          ↓ Download PDF
        </button>
      </div>

      {/* Document */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "64px 32px 80px",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "2px solid #C8AC78",
            paddingBottom: "32px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#C8AC78",
              marginBottom: "12px",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Christie's International Real Estate Group · East Hampton
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#1B2A4A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 8px",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            A Letter to the Families of the East End
          </h1>
          <div
            style={{
              fontSize: "13px",
              color: "#384249",
              letterSpacing: "0.05em",
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Art. Beauty. Provenance. Since 1766.
          </div>
        </div>

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              color: "#384249",
              padding: "40px",
              fontSize: "16px",
              fontStyle: "italic",
            }}
          >
            Loading…
          </div>
        ) : (
          <>
            {/* Lead Summary */}
            {leadSummaryText && (
              <div
                style={{
                  background: "#1B2A4A",
                  borderLeft: "3px solid #C8AC78",
                  padding: "20px 24px",
                  marginBottom: "36px",
                  borderRadius: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#C8AC78",
                    marginBottom: "8px",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Lead Summary
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.7",
                    color: "#F8F5F0",
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                  }}
                >
                  {leadSummaryText}
                </p>
              </div>
            )}

            {/* Letter Body */}
            <div>
              {bodyParagraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.85",
                    color: "#1B2A4A",
                    marginBottom: "28px",
                    fontFamily: "'Cormorant Garamond', serif",
                    textIndent: i === 0 ? "0" : "0",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #C8AC78",
            paddingTop: "28px",
            marginTop: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#1B2A4A",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                marginBottom: "2px",
              }}
            >
              Ed Bruehl
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#384249",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
              }}
            >
              Managing Director · Christie's East Hampton
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#C8AC78",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.05em",
                marginTop: "4px",
              }}
            >
              26 Park Place, East Hampton · 646-752-1233
            </div>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#C8AC78",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Cormorant Garamond', serif",
              textAlign: "right",
            }}
          >
            Christie's · Since 1766
            <br />
            christiesrealestategroupeh.com
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
