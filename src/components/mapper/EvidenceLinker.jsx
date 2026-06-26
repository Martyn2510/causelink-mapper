import React from "react";
import { Button } from "@/components/ui/button";
import { X, Paperclip, Check } from "lucide-react";

const TYPE_LABELS = {
  photo: "Photo",
  interview: "Interview",
  document: "Document",
  site_observation: "Site Observation",
  cctv: "CCTV",
  telemetry: "Telemetry",
  other: "Other",
};

export default function EvidenceLinker({ open, targetLabel, evidence, linkedIds, onToggle, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[#0E2F33]/55 flex items-center justify-center p-5 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[14px] max-w-[520px] w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="bg-[#0E2F33] text-white py-4 px-5 rounded-t-[14px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Paperclip className="w-5 h-5 text-[#9FBF3B] flex-shrink-0" />
            <div>
              <h3 className="font-heading text-lg font-semibold">Link evidence</h3>
              <p className="text-[12.5px] text-[#7FA88B] mt-0.5">{targetLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white cursor-pointer border-none bg-transparent p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {evidence.length === 0 ? (
            <p className="text-[13.5px] text-[#1C4448] italic text-center py-6">
              No evidence items yet. Add items to the Evidence Library first.
            </p>
          ) : (
            <div className="space-y-2">
              {evidence.map((ev) => {
                const isLinked = linkedIds.includes(ev.id);
                return (
                  <label
                    key={ev.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isLinked
                        ? "border-[#0F766E] bg-[#0F766E]/5"
                        : "border-[#D5E0DE] hover:bg-[#F1F5F4]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isLinked ? "bg-[#0F766E] border-[#0F766E]" : "border-[#D5E0DE]"
                      }`}
                    >
                      {isLinked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isLinked}
                      onChange={() => onToggle(ev.id)}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[13.5px] text-[#0E2F33]">
                          {ev.title}
                        </span>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#0F766E]">
                          {TYPE_LABELS[ev.type] || "Other"}
                        </span>
                      </div>
                      {ev.description && (
                        <p className="text-[12px] text-[#1C4448] mt-0.5">{ev.description}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 pb-5 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}