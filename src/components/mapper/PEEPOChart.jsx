import React from "react";
import { Textarea } from "@/components/ui/textarea";

const COLUMNS = [
  { id: "people", label: "People", hint: "Fitness, fatigue, competency, behaviour, supervision.", color: "border-t-[#1C4448]" },
  { id: "equipment", label: "Equipment", hint: "Machinery, tools, vehicles, PPE, maintenance state.", color: "border-t-[#0F766E]" },
  { id: "environment", label: "Environment", hint: "Weather, terrain, lighting, noise, layout, conditions.", color: "border-t-[#7FA88B]" },
  { id: "procedures", label: "Procedures", hint: "SWMS, rules, permits, training, communication of method.", color: "border-t-[#D9923A]" },
  { id: "organisation", label: "Organisation", hint: "Culture, resourcing, design, planning, management decisions.", color: "border-t-[#C5563D]" },
];

export default function PEEPOChart({ peepo, onChange }) {
  const update = (id, value) => {
    onChange({ ...peepo, [id]: value });
  };

  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 mb-6 overflow-x-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 min-w-[760px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            <div className={`bg-white border border-[#D5E0DE] border-t-4 ${col.color} rounded-[10px] flex flex-col overflow-hidden`}>
              <div className="px-3 pt-3 pb-2">
                <h3 className="font-heading text-[15px] font-semibold text-[#0E2F33] text-center">
                  {col.label}
                </h3>
              </div>
              <div className="px-3 pb-1">
                <p className="text-[11px] text-[#1C4448] text-center min-h-[42px]">{col.hint}</p>
              </div>
              <Textarea
                value={peepo[col.id] || ""}
                onChange={(e) => update(col.id, e.target.value)}
                placeholder="List contributing factors…"
                className="rounded-none border-t border-[#D5E0DE] border-x-0 border-b-0 text-[13px] text-[#0E2F33] resize-none min-h-[200px] focus-visible:ring-0 shadow-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}