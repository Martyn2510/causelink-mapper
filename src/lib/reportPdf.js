import { jsPDF } from "jspdf";

export function generateReportPdf(report, title) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addText = (text, fontSize, fontStyle, lineSpacing) => {
    if (!text) return;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle || "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      ensureSpace(lineSpacing);
      doc.text(line, margin, y);
      y += lineSpacing;
    });
  };

  // Title
  addText("Investigation Report", 20, "bold", 10);
  y += 2;
  addText(title || "Untitled", 12, "normal", 7);
  y += 4;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const sections = [
    { num: "1", title: "Executive Summary", content: report.executive_summary },
    { num: "2", title: "Description of Event", content: report.description_of_event },
    { num: "3", title: "Images of Event", content: report.images_of_event },
    { num: "4", title: "Contributing Factors", content: report.contributing_factors },
    { num: "5", title: "Findings", content: report.findings },
  ];

  sections.forEach((s) => {
    addText(`${s.num}. ${s.title}`, 14, "bold", 8);
    addText(s.content || "N/A", 11, "normal", 6);
    y += 4;
  });

  // Actions
  addText("6. Actions", 14, "bold", 8);
  const actions = report.actions || {};
  const categories = [
    { label: "Immediate", items: actions.immediate || [] },
    { label: "Short-term", items: actions.short_term || [] },
    { label: "Long-term", items: actions.long_term || [] },
  ];
  categories.forEach((cat) => {
    ensureSpace(10);
    addText(cat.label.toUpperCase(), 11, "bold", 6);
    if (cat.items.length === 0) {
      addText("No actions in this timeframe.", 10, "italic", 5);
    } else {
      cat.items.forEach((item) => addText(`- ${item}`, 10, "normal", 5));
    }
    y += 2;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("AI-generated report — review and verify before distribution.", margin, pageHeight - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
    doc.setTextColor(0);
  }

  return doc;
}