import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Printer, Loader2, AlertTriangle, FileText, Mail, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { generateReportPdf } from "@/lib/reportPdf";

function Section({ number, title, children }) {
  return (
    <div className="mb-6">
      <h3 className="font-heading text-[15px] font-semibold text-[#0E2F33] mb-2 flex items-baseline gap-2">
        <span className="text-[#0F766E]">{number}.</span>
        {title}
      </h3>
      <div className="text-[13.5px] text-[#1C4448] leading-relaxed whitespace-pre-wrap pl-1">
        {children}
      </div>
    </div>
  );
}

function ActionCategory({ label, items, color }) {
  return (
    <div className="mb-3">
      <div className={`text-[11px] font-bold tracking-wider uppercase ${color} mb-1.5`}>{label}</div>
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#1C4448]">
              <span className="text-[#0F766E] mt-0.5 flex-shrink-0">▸</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12.5px] text-[#7FA88B] italic">No actions in this timeframe.</p>
      )}
    </div>
  );
}

export default function ReportModal({ open, loading, report, error, onClose, title }) {
  const [emailMode, setEmailMode] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);

  if (!open) return null;

  const handlePrint = () => window.print();

  const handleEmailReport = async () => {
    setEmailSending(true);
    setEmailError(null);
    try {
      const doc = generateReportPdf(report, title);
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], `investigation-report-${Date.now()}.pdf`, { type: "application/pdf" });
      const uploadResult = await base44.integrations.Core.UploadFile({ file: pdfFile });
      await base44.functions.invoke("emailReport", {
        email: emailAddress,
        fileUrl: uploadResult.file_url,
        title: title || "Untitled",
      });
      setEmailSent(true);
    } catch (err) {
      setEmailError(err.message || "Failed to send email.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#0E2F33]/55 flex items-center justify-center p-5 z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[14px] max-w-[780px] w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-[#0E2F33] text-white py-4 px-5 rounded-t-[14px] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#9FBF3B] flex-shrink-0" />
            <div>
              <h3 className="font-heading text-lg font-semibold">Investigation Report</h3>
              <p className="text-[12.5px] text-[#7FA88B] mt-0.5">
                AI-generated from your evidence and analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && !error && (
              <>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10 hover:text-white print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print
                </Button>
                <Button
                  onClick={() => { setEmailMode(!emailMode); setEmailSent(false); setEmailError(null); }}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10 hover:text-white print:hidden"
                >
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  Email
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white cursor-pointer border-none bg-transparent p-1 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {!loading && !error && report && emailMode && !emailSent && (
            <div className="mb-5 bg-[#F1F5F4] border border-[#D5E0DE] rounded-[10px] p-4 print:hidden">
              <label className="text-[12.5px] font-semibold text-[#0E2F33] mb-1.5 block">
                Email PDF to:
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-1 h-9 text-[13px]"
                  disabled={emailSending}
                />
                <Button
                  onClick={handleEmailReport}
                  disabled={emailSending || !emailAddress}
                  className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90"
                  size="sm"
                >
                  {emailSending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Mail className="w-3.5 h-3.5 mr-1" />}
                  Send
                </Button>
              </div>
              {emailError && (
                <p className="text-[12px] text-[#C5563D] mt-2">{emailError}</p>
              )}
            </div>
          )}
          {!loading && !error && report && emailSent && (
            <div className="mb-5 bg-[#F1F5F4] border border-[#7FA88B] rounded-[10px] p-4 flex items-center gap-2 print:hidden">
              <Check className="w-5 h-5 text-[#0F766E] flex-shrink-0" />
              <p className="text-[13px] text-[#1C4448]">
                Report PDF sent to <span className="font-semibold">{emailAddress}</span>
              </p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin mb-3" />
              <p className="text-[14px] text-[#1C4448] font-medium">Generating report…</p>
              <p className="text-[12.5px] text-[#7FA88B] mt-1">
                Analysing evidence, timeline and barrier breaches
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-8 h-8 text-[#C5563D] mb-3" />
              <p className="text-[14px] text-[#1C4448] font-medium">Report generation failed</p>
              <p className="text-[12.5px] text-[#7FA88B] mt-1 text-center max-w-[400px]">{error}</p>
              <Button variant="outline" onClick={onClose} className="mt-4 text-[#1C4448]">
                Close
              </Button>
            </div>
          )}

          {!loading && !error && report && (
            <>
              <Section number="1" title="Executive Summary">
                {report.executive_summary}
              </Section>

              <Section number="2" title="Description of Event">
                {report.description_of_event}
              </Section>

              <Section number="3" title="Images of Event">
                {report.images_of_event}
              </Section>

              <Section number="4" title="Contributing Factors">
                {report.contributing_factors}
              </Section>

              <Section number="5" title="Findings">
                {report.findings}
              </Section>

              <div className="mb-6">
                <h3 className="font-heading text-[15px] font-semibold text-[#0E2F33] mb-3 flex items-baseline gap-2">
                  <span className="text-[#0F766E]">6.</span>
                  Actions
                </h3>
                <div className="bg-[#F1F5F4] border border-[#D5E0DE] rounded-[10px] p-4">
                  <ActionCategory
                    label="Immediate"
                    items={report.actions?.immediate || []}
                    color="text-[#C5563D]"
                  />
                  <ActionCategory
                    label="Short-term"
                    items={report.actions?.short_term || []}
                    color="text-[#D9923A]"
                  />
                  <ActionCategory
                    label="Long-term"
                    items={report.actions?.long_term || []}
                    color="text-[#0F766E]"
                  />
                </div>
              </div>

              <div className="text-[11.5px] text-[#7FA88B] italic border-t border-[#D5E0DE] pt-3 mt-4">
                This report was AI-generated from the investigation data. Review and verify all content before distribution.
                Working analysis — no blame does not mean no accountability.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}