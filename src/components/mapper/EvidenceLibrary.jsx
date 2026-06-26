import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Camera, Mic, FileText, Eye, Video, Database, FileQuestion } from "lucide-react";

const EVIDENCE_TYPES = [
  { value: "photo", label: "Photo", icon: Camera },
  { value: "interview", label: "Interview", icon: Mic },
  { value: "document", label: "Document", icon: FileText },
  { value: "site_observation", label: "Site Observation", icon: Eye },
  { value: "cctv", label: "CCTV / Footage", icon: Video },
  { value: "telemetry", label: "Telemetry / Data", icon: Database },
  { value: "other", label: "Other", icon: FileQuestion },
];

const TYPE_STYLES = {
  photo: "bg-[#0F766E]/10 text-[#0F766E]",
  interview: "bg-[#1C4448]/10 text-[#1C4448]",
  document: "bg-[#D9923A]/10 text-[#D9923A]",
  site_observation: "bg-[#7FA88B]/15 text-[#1C4448]",
  cctv: "bg-[#C5563D]/10 text-[#C5563D]",
  telemetry: "bg-[#9FBF3B]/15 text-[#1C4448]",
  other: "bg-[#0E2F33]/5 text-[#1C4448]",
};

function genId() {
  return "ev_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export default function EvidenceLibrary({ evidence, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("photo");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ id: genId(), title: title.trim(), type, description: description.trim() });
    setTitle("");
    setType("photo");
    setDescription("");
    setShowForm(false);
  };

  const handleCancel = () => {
    setTitle("");
    setType("photo");
    setDescription("");
    setShowForm(false);
  };

  const getTypeMeta = (typeValue) => EVIDENCE_TYPES.find((t) => t.value === typeValue) || EVIDENCE_TYPES[6];

  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 mb-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-heading text-[15px] font-semibold text-[#0E2F33]">Evidence Library</h2>
          <p className="text-[12px] text-[#1C4448] mt-0.5">
            {evidence.length} item{evidence.length !== 1 ? "s" : ""} — link these to timeline events and PEEPO factors.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold text-[13px]"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add evidence
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Operator interview — W2"
                className="text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
                Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVIDENCE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              Description / reference
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or reference (e.g. interview date, document number, photo location)."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} className="text-[#1C4448]">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold"
            >
              Add to library
            </Button>
          </div>
        </div>
      )}

      {evidence.length === 0 && !showForm ? (
        <p className="text-[13.5px] text-[#1C4448] italic py-2">
          No evidence items yet. Click "Add evidence" to start building your evidence library.
        </p>
      ) : (
        <div className="space-y-2">
          {evidence.map((ev) => {
            const meta = getTypeMeta(ev.type);
            const Icon = meta.icon;
            return (
              <div key={ev.id} className="relative bg-white border border-[#D5E0DE] rounded-[10px] p-3 pr-10">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      TYPE_STYLES[ev.type] || TYPE_STYLES.other
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[13.5px] text-[#0E2F33]">{ev.title}</span>
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                          TYPE_STYLES[ev.type] || TYPE_STYLES.other
                        }`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="text-[12px] text-[#1C4448] mt-0.5">{ev.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(ev.id)}
                  className="absolute top-2 right-2 w-[18px] h-[18px] rounded flex items-center justify-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}