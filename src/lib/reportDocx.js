import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from "docx";
import { LAYERS } from "@/lib/layers";

const COLORS = {
  ink: "0E2F33",
  teal: "0F766E",
  deep: "1C4448",
  sage: "7FA88B",
  lime: "9FBF3B",
  clay: "C5563D",
  amber: "D9923A",
  muted: "7FA88B",
};

function heading(text, level = HeadingLevel.HEADING_1, color = COLORS.teal) {
  return new Paragraph({
    heading: level,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        color,
        size: level === HeadingLevel.HEADING_1 ? 28 : level === HeadingLevel.HEADING_2 ? 24 : 22,
        font: "Calibri",
      }),
    ],
  });
}

function bodyParagraph(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: text || "",
        size: 22,
        color: COLORS.deep,
        font: "Calibri",
        ...opts,
      }),
    ],
  });
}

function bulletParagraph(text) {
  return new Paragraph({
    spacing: { after: 60 },
    bullet: { level: 0 },
    children: [
      new TextRun({
        text: text || "",
        size: 22,
        color: COLORS.deep,
        font: "Calibri",
      }),
    ],
  });
}

function evidenceByIdMap(evidence) {
  const map = {};
  (evidence || []).forEach((ev) => {
    map[ev.id] = ev;
  });
  return map;
}

function formatEvidenceRefs(ids, evidenceMap) {
  if (!ids || ids.length === 0) return "";
  return ids
    .map((id) => {
      const ev = evidenceMap[id];
      return ev ? `${ev.title} (${ev.type})` : id;
    })
    .join("; ");
}

/**
 * Builds a .docx Document from investigation data (not from the AI report — this
 * exports the raw investigation board state, unlike the PDF which exports the
 * generated report).
 */
export function buildInvestigationDocx(data) {
  const { meta = {}, timeline = [], holes = {}, peepo = {}, evidence = [] } = data;
  const evidenceMap = evidenceByIdMap(evidence);

  const children = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "Causal Link Mapper — Investigation Report",
          bold: true,
          size: 32,
          color: COLORS.ink,
          font: "Calibri",
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: meta.title || "Untitled Investigation",
          bold: true,
          size: 26,
          color: COLORS.teal,
          font: "Calibri",
        }),
      ],
    })
  );

  // Metadata table
  children.push(heading("Investigation Details", HeadingLevel.HEADING_1));
  const metaRows = [
    ["Reference", meta.ref || "—"],
    ["Event Date", meta.event_date || "—"],
    ["Investigator", meta.investigator || "—"],
    ["Outcome / Loss Event", meta.outcome || "—"],
  ];
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: metaRows.map(
        ([label, value]) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: label, bold: true, size: 22, color: COLORS.ink, font: "Calibri" }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: value, size: 22, color: COLORS.deep, font: "Calibri" }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    })
  );

  // Sequence of Events
  children.push(heading("Sequence of Events", HeadingLevel.HEADING_1));
  if (timeline.length === 0) {
    children.push(bodyParagraph("No timeline events recorded."));
  } else {
    timeline.forEach((ev, i) => {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [
            new TextRun({
              text: `Event ${i + 1}`,
              bold: true,
              size: 22,
              color: COLORS.teal,
              font: "Calibri",
            }),
          ],
        })
      );
      children.push(bodyParagraph(ev.text || "—"));

      // Whys (use tree if available, fallback to flat)
      const whys = ev.whys || [];
      if (whys.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({ text: "Why Analysis:", bold: true, italics: true, size: 20, color: COLORS.amber, font: "Calibri" }),
            ],
          })
        );
        // Handle both flat array (strings) and tree structure
        whys.forEach((w, wi) => {
          const whyText = typeof w === "string" ? w : w.text;
          if (whyText) children.push(bulletParagraph(whyText));
        });
      }

      // Evidence links
      const evRefs = formatEvidenceRefs(ev.evidence_ids, evidenceMap);
      if (evRefs) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({ text: "Evidence: ", bold: true, size: 20, color: COLORS.deep, font: "Calibri" }),
              new TextRun({ text: evRefs, size: 20, color: COLORS.muted, font: "Calibri" }),
            ],
          })
        );
      }
    });
  }

  // Barrier Breaches (Swiss Cheese Model)
  children.push(heading("Barrier Breaches — Swiss Cheese Model", HeadingLevel.HEADING_1));
  LAYERS.forEach((layer) => {
    const layerHoles = holes[layer.id] || [];
    if (layerHoles.length === 0) return;

    children.push(
      heading(layer.name, HeadingLevel.HEADING_2, COLORS.ink)
    );

    layerHoles.forEach((hole, hi) => {
      const typeLabel = hole.type === "latent" ? "Latent condition" : "Active failure";
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: `${hi + 1}. [${typeLabel}] `, bold: true, size: 22, color: hole.type === "latent" ? COLORS.clay : COLORS.amber, font: "Calibri" }),
            new TextRun({ text: hole.text || "—", size: 22, color: COLORS.deep, font: "Calibri" }),
          ],
        })
      );
      if (hole.ctrl) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 360 },
            children: [
              new TextRun({ text: "Failed control: ", bold: true, size: 20, color: COLORS.teal, font: "Calibri" }),
              new TextRun({ text: hole.ctrl, size: 20, color: COLORS.deep, font: "Calibri" }),
            ],
          })
        );
      }
      if (hole.ev) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 360 },
            children: [
              new TextRun({ text: "Evidence: ", bold: true, size: 20, color: COLORS.teal, font: "Calibri" }),
              new TextRun({ text: hole.ev, size: 20, color: COLORS.muted, font: "Calibri" }),
            ],
          })
        );
      }
    });
  });

  // PEEPO Chart
  children.push(heading("PEEPO Contributing Factors", HeadingLevel.HEADING_1));
  const peepoCols = [
    { id: "people", label: "People" },
    { id: "equipment", label: "Equipment" },
    { id: "environment", label: "Environment" },
    { id: "procedures", label: "Procedures" },
    { id: "organisation", label: "Organisation" },
  ];
  peepoCols.forEach((col) => {
    const items = peepo[col.id] || [];
    if (items.length === 0) return;
    children.push(heading(col.label, HeadingLevel.HEADING_2, COLORS.ink));
    items.forEach((item, ii) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: `${ii + 1}. `, bold: true, size: 22, color: COLORS.teal, font: "Calibri" }),
            new TextRun({ text: item.text || "—", size: 22, color: COLORS.deep, font: "Calibri" }),
          ],
        })
      );
      const evRefs = formatEvidenceRefs(item.evidence_ids, evidenceMap);
      if (evRefs) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            indent: { left: 360 },
            children: [
              new TextRun({ text: "Evidence: ", bold: true, size: 20, color: COLORS.teal, font: "Calibri" }),
              new TextRun({ text: evRefs, size: 20, color: COLORS.muted, font: "Calibri" }),
            ],
          })
        );
      }
    });
  });

  // Evidence Library
  if (evidence.length > 0) {
    children.push(heading("Evidence Library", HeadingLevel.HEADING_1));
    evidence.forEach((ev, i) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: `${i + 1}. ${ev.title}`, bold: true, size: 22, color: COLORS.ink, font: "Calibri" }),
            new TextRun({ text: `  [${ev.type}]`, size: 20, color: COLORS.muted, font: "Calibri" }),
          ],
        })
      );
      if (ev.description) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 360 },
            children: [
              new TextRun({ text: ev.description, size: 20, color: COLORS.deep, font: "Calibri" }),
            ],
          })
        );
      }
    });
  }

  // Disclaimer
  children.push(
    new Paragraph({
      spacing: { before: 360 },
      children: [
        new TextRun({
          text: "This document was generated from the Causal Link Mapper investigation board. Working analysis — no blame does not mean no accountability.",
          italics: true,
          size: 18,
          color: COLORS.muted,
          font: "Calibri",
        }),
      ],
    })
  );

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children,
      },
    ],
  });
}

export async function exportToDocx(data, filename) {
  const doc = buildInvestigationDocx(data);
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (filename || "investigation") + ".docx";
  a.click();
  URL.revokeObjectURL(url);
}