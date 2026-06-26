import React, { useState, useCallback } from "react";
import Header from "@/components/mapper/Header";
import MetaPanel from "@/components/mapper/MetaPanel";
import PEEPOChart from "@/components/mapper/PEEPOChart";
import TimelineBoard from "@/components/mapper/TimelineBoard";
import CheeseBoard from "@/components/mapper/CheeseBoard";
import BreachModal from "@/components/mapper/BreachModal";
import SummaryPanel from "@/components/mapper/SummaryPanel";
import SectionIntro from "@/components/mapper/SectionIntro";
import Caveat from "@/components/mapper/Caveat";
import Footer from "@/components/mapper/Footer";
import { LAYERS, DEMO_DATA, DEMO_PEEPO, getInitialHoles } from "@/lib/layers";

export default function CausationMapper() {
  const [meta, setMeta] = useState({ ref: "", title: "", event_date: "", investigator: "", outcome: "" });
  const [timeline, setTimeline] = useState([]);
  const [holes, setHoles] = useState(getInitialHoles());
  const [peepo, setPeepo] = useState({ people: "", equipment: "", environment: "", procedures: "", organisation: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLayerId, setModalLayerId] = useState(null);

  // Timeline handlers
  const addStep = useCallback(() => {
    setTimeline((prev) => [...prev, { text: "", whys: [] }]);
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

  // File operations
  const handleExport = useCallback(() => {
    const data = { meta, timeline, holes, peepo, exported: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (meta.ref || "swiss-cheese-map") + ".json";
    a.click();
  }, [meta, timeline, holes]);

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
        ? data.timeline.map((s) => (typeof s === "string" ? { text: s, whys: [] } : { text: s.text || "", whys: Array.isArray(s.whys) ? s.whys : [] }))
        : []
    );
    const newHoles = getInitialHoles();
    LAYERS.forEach((l) => {
      newHoles[l.id] = (data.holes && data.holes[l.id]) || [];
    });
    setHoles(newHoles);
    setPeepo({
      people: (data.peepo && data.peepo.people) || "",
      equipment: (data.peepo && data.peepo.equipment) || "",
      environment: (data.peepo && data.peepo.environment) || "",
      procedures: (data.peepo && data.peepo.procedures) || "",
      organisation: (data.peepo && data.peepo.organisation) || "",
    });
  }, []);

  const handleLoadDemo = useCallback(() => {
    setMeta(DEMO_DATA.meta);
    setTimeline(DEMO_DATA.timeline);
    setHoles(DEMO_DATA.holes);
    setPeepo(DEMO_PEEPO);
  }, []);

  const handleClear = useCallback(() => {
    if (!confirm("Clear all events, breaches and metadata?")) return;
    setMeta({ ref: "", title: "", event_date: "", investigator: "", outcome: "" });
    setTimeline([]);
    setHoles(getInitialHoles());
    setPeepo({ people: "", equipment: "", environment: "", procedures: "", organisation: "" });
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
          Brainstorm and categorise the contributing factors under People, Equipment, Environment, Procedures and Organisation — a structured way to ensure no factor domain is overlooked before building the event sequence.
        </SectionIntro>

        <PEEPOChart peepo={peepo} onChange={setPeepo} />

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

        <Caveat />
      </div>

      <Footer />

      <BreachModal
        open={modalOpen}
        layerId={modalLayerId}
        onClose={() => setModalOpen(false)}
        onSave={saveBreach}
      />
    </div>
  );
}