import React, { useState, useCallback } from "react";
import Header from "@/components/mapper/Header";
import MetaPanel from "@/components/mapper/MetaPanel";
import PEEPOChart from "@/components/mapper/PEEPOChart";
import TimelineBoard from "@/components/mapper/TimelineBoard";
import CheeseBoard from "@/components/mapper/CheeseBoard";
import BreachModal from "@/components/mapper/BreachModal";
import EvidenceLibrary from "@/components/mapper/EvidenceLibrary";
import EvidenceLinker from "@/components/mapper/EvidenceLinker";
import ReportModal from "@/components/mapper/ReportModal";
import { base44 } from "@/api/base44Client";
import SummaryPanel from "@/components/mapper/SummaryPanel";
import SectionIntro from "@/components/mapper/SectionIntro";
import Caveat from "@/components/mapper/Caveat";
import Footer from "@/components/mapper/Footer";
import { LAYERS, DEMO_DATA, DEMO_PEEPO, DEMO_EVIDENCE, getInitialHoles } from "@/lib/layers";
import { FileText } from "lucide-react";

function normalizePeepo(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) =>
    typeof item === "string"
      ? { text: item, evidence_ids: [] }
      : { text: item.text || "", evidence_ids: Array.isArray(item.evidence_ids) ? item.evidence_ids : [] }
  );
}

export default function CausationMapper() {
  const [meta, setMeta] = useState({ ref: "", title: "", event_date: "", investigator: "", outcome: "" });
  const [timeline, setTimeline] = useState([]);
  const [holes, setHoles] = useState(getInitialHoles());
  const [peepo, setPeepo] = useState({ people: [], equipment: [], environment: [], procedures: [], organisation: [] });
  const [evidence, setEvidence] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLayerId, setModalLayerId] = useState(null);
  const [linkerOpen, setLinkerOpen] = useState(false);
  const [linkerTarget, setLinkerTarget] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportError, setReportError] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);

  // Timeline handlers
  const addStep = useCallback(() => {
    setTimeline((prev) => [...prev, { text: "", whys: [], evidence_ids: [] }]);
  }, []);

  const updateStep = useCallback((i, val) => {
    setTimeline((prev) => prev.map((ev, idx) => (idx === i ? { ...ev, text: val } : ev)));
  }, []);

  const deleteStep = useCallback((i) => {
    setTimeline((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const addWhy = useCallback((i) => {
    setTimeline((prev) =>
      prev.map((ev, idx) =>
        idx === i && (ev.whys || []).length < 10 ? { ...ev, whys: [...(ev.whys || []), ""] } : ev
      )
    );
  }, []);

  const updateWhy = useCallback((i, j, val) => {
    setTimeline((prev) =>
      prev.map((ev, idx) =>
        idx === i ? { ...ev, whys: (ev.whys || []).map((w, wIdx) => (wIdx === j ? val : w)) } : ev
      )
    );
  }, []);

  const deleteWhy = useCallback((i, j) => {
    setTimeline((prev) =>
      prev.map((ev, idx) =>
        idx === i ? { ...ev, whys: (ev.whys || []).filter((_, wIdx) => wIdx !== j) } : ev
      )
    );
  }, []);

  // Holes handlers
  const openModal = useCallback((layerId) => {
    setModalLayerId(layerId);
    setModalOpen(true);
  }, []);

  const saveBreach = useCallback(
    (breach) => {
      setHoles((prev) => ({
        ...prev,
        [modalLayerId]: [...(prev[modalLayerId] || []), breach],
      }));
    },
    [modalLayerId]
  );

  const deleteHole = useCallback((layerId, idx) => {
    setHoles((prev) => ({
      ...prev,
      [layerId]: prev[layerId].filter((_, i) => i !== idx),
    }));
  }, []);

  // Evidence handlers
  const addEvidence = useCallback((item) => {
    setEvidence((prev) => [...prev, item]);
  }, []);

  const deleteEvidence = useCallback((id) => {
    setEvidence((prev) => prev.filter((e) => e.id !== id));
    setTimeline((prev) =>
      prev.map((ev) => ({
        ...ev,
        evidence_ids: (ev.evidence_ids || []).filter((eid) => eid !== id),
      }))
    );
    setPeepo((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((colId) => {
        updated[colId] = (updated[colId] || []).map((item) => ({
          ...item,
          evidence_ids: (item.evidence_ids || []).filter((eid) => eid !== id),
        }));
      });
      return updated;
    });
  }, []);

  const openLinker = useCallback((target) => {
    setLinkerTarget(target);
    setLinkerOpen(true);
  }, []);

  const toggleEvidenceLink = useCallback(
    (evidenceId) => {
      if (!linkerTarget) return;
      if (linkerTarget.kind === "timeline") {
        setTimeline((prev) =>
          prev.map((ev, idx) => {
            if (idx !== linkerTarget.index) return ev;
            const ids = ev.evidence_ids || [];
            return {
              ...ev,
              evidence_ids: ids.includes(evidenceId)
                ? ids.filter((id) => id !== evidenceId)
                : [...ids, evidenceId],
            };
          })
        );
      } else {
        setPeepo((prev) => {
          const list = [...(prev[linkerTarget.colId] || [])];
          const item = list[linkerTarget.index];
          if (!item) return prev;
          const ids = item.evidence_ids || [];
          list[linkerTarget.index] = {
            ...item,
            evidence_ids: ids.includes(evidenceId)
              ? ids.filter((id) => id !== evidenceId)
              : [...ids, evidenceId],
          };
          return { ...prev, [linkerTarget.colId]: list };
        });
      }
    },
    [linkerTarget]
  );

  const handleGenerateReport = useCallback(async () => {
    setReportLoading(true);
    setReportError(null);
    setReportData(null);
    setReportOpen(true);
    try {
      const response = await base44.functions.invoke("generateReport", {
        meta, timeline, holes, peepo, evidence,
      });
      setReportData(response.data);
    } catch (err) {
      setReportError(err.message || "Failed to generate report.");
    } finally {
      setReportLoading(false);
    }
  }, [meta, timeline, holes, peepo, evidence]);

  const linkerLinkedIds = linkerTarget
    ? linkerTarget.kind === "timeline"
      ? timeline[linkerTarget.index]?.evidence_ids || []
      : peepo[linkerTarget.colId]?.[linkerTarget.index]?.evidence_ids || []
    : [];

  // File operations
  const handleExport = useCallback(() => {
    const data = { meta, timeline, holes, peepo, evidence, exported: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (meta.ref || "swiss-cheese-map") + ".json";
    a.click();
  }, [meta, timeline, holes, peepo, evidence]);

  const handleImport = useCallback((data) => {
    if (data.meta) {
      setMeta({
        ref: data.meta.ref || "",
        title: data.meta.title || "",
        event_date: data.meta.event_date || data.meta.date || "",
        investigator: data.meta.investigator || data.meta.inv || "",
        outcome: data.meta.outcome || "",
      });
    }
    setTimeline(
      Array.isArray(data.timeline)
        ? data.timeline.map((s) =>
            typeof s === "string"
              ? { text: s, whys: [], evidence_ids: [] }
              : {
                  text: s.text || "",
                  whys: Array.isArray(s.whys) ? s.whys : [],
                  evidence_ids: Array.isArray(s.evidence_ids) ? s.evidence_ids : [],
                }
          )
        : []
    );
    const newHoles = getInitialHoles();
    LAYERS.forEach((l) => {
      newHoles[l.id] = (data.holes && data.holes[l.id]) || [];
    });
    setHoles(newHoles);
    setPeepo({
      people: normalizePeepo(data.peepo?.people),
      equipment: normalizePeepo(data.peepo?.equipment),
      environment: normalizePeepo(data.peepo?.environment),
      procedures: normalizePeepo(data.peepo?.procedures),
      organisation: normalizePeepo(data.peepo?.organisation),
    });
    setEvidence(Array.isArray(data.evidence) ? data.evidence : []);
  }, []);

  const handleLoadDemo = useCallback(() => {
    setMeta(DEMO_DATA.meta);
    setTimeline(DEMO_DATA.timeline);
    setHoles(DEMO_DATA.holes);
    setPeepo(DEMO_PEEPO);
    setEvidence(DEMO_EVIDENCE);
  }, []);

  const handleClear = useCallback(() => {
    if (!confirm("Clear all events, breaches and metadata?")) return;
    setMeta({ ref: "", title: "", event_date: "", investigator: "", outcome: "" });
    setTimeline([]);
    setHoles(getInitialHoles());
    setPeepo({ people: [], equipment: [], environment: [], procedures: [], organisation: [] });
    setEvidence([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onLoadDemo={handleLoadDemo}
        onClear={handleClear}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="max-w-[1320px] mx-auto px-6">
        <MetaPanel meta={meta} onChange={setMeta} />

        <SectionIntro title="PEEPO Chart">
          A structured way to ensure no factor domain is overlooked before building the event sequence — categorise factors across People, Equipment, Environment, Procedures and Organisation.
        </SectionIntro>

        <PEEPOChart peepo={peepo} onChange={setPeepo} onLinkEvidence={openLinker} />

        <SectionIntro title="Sequence of events">
          The step-by-step lead-up to the incident. Add a box for each event in the chain, in the order it occurred, and describe what happened.
        </SectionIntro>

        <TimelineBoard
          timeline={timeline}
          onAdd={addStep}
          onUpdate={updateStep}
          onDelete={deleteStep}
          onAddWhy={addWhy}
          onUpdateWhy={updateWhy}
          onDeleteWhy={deleteWhy}
          onLinkEvidence={openLinker}
        />

        <SectionIntro title="Map the barrier breaches" legend>
          <>
            Unwanted events present as either a <b>latent condition</b> (a pre-existing organisational, system, or design weakness lying dormant) or an <b>active failure</b> (an unsafe act or error at the point of operation).
            <br /><br />
            For each, capture the control that failed or was absent.
          </>
        </SectionIntro>

        <CheeseBoard holes={holes} onOpenModal={openModal} onDeleteHole={deleteHole} />

        <SummaryPanel holes={holes} />

        <SectionIntro title="Evidence Library">
          Capture and manage all evidence items — interviews, photos, documents, telemetry — and link them to timeline events and PEEPO factors for a defensible audit trail.
        </SectionIntro>

        <EvidenceLibrary evidence={evidence} onAdd={addEvidence} onDelete={deleteEvidence} />

        <div className="flex justify-center mb-6 print:hidden">
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="bg-[#0F766E] text-white rounded-[10px] py-3 px-6 font-heading font-semibold text-[14px] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {reportLoading ? "Generating report…" : "Generate Investigation Report"}
          </button>
        </div>

        <Caveat />
      </div>

      <Footer />

      <BreachModal
        open={modalOpen}
        layerId={modalLayerId}
        onClose={() => setModalOpen(false)}
        onSave={saveBreach}
      />

      <EvidenceLinker
        open={linkerOpen}
        targetLabel={linkerTarget?.label || ""}
        evidence={evidence}
        linkedIds={linkerLinkedIds}
        onToggle={toggleEvidenceLink}
        onClose={() => setLinkerOpen(false)}
      />

      <ReportModal
        open={reportOpen}
        loading={reportLoading}
        report={reportData}
        error={reportError}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}