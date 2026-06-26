import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const COLUMNS = [
  { id: "people", label: "People", hint: "Fitness, fatigue, competency, behaviour, supervision.", color: "border-t-[#1C4448]" },
  { id: "equipment", label: "Equipment", hint: "Machinery, tools, vehicles, PPE, maintenance state.", color: "border-t-[#0F766E]" },
  { id: "environment", label: "Environment", hint: "Weather, terrain, lighting, noise, layout, conditions.", color: "border-t-[#7FA88B]" },
  { id: "procedures", label: "Procedures", hint: "SWMS, rules, permits, training, communication of method.", color: "border-t-[#D9923A]" },
  { id: "organisation", label: "Organisation", hint: "Culture, resourcing, design, planning, management decisions.", color: "border-t-[#C5563D]" },
];

export default function PEEPOChart({ peepo, onChange }) {
  const addItem = (id) => {
    const list = peepo[id] || [];
    onChange({ ...peepo, [id]: [...list, ""] });
  };

  const updateItem = (id, idx, value) => {
    const list = [...(peepo[id] || [])];
    list[idx] = value;
    onChange({ ...peepo, [id]: list });
  };

  const deleteItem = (id, idx) => {
    const list = (peepo[id] || []).filter((_, i) => i !== idx);
    onChange({ ...peepo, [id]: list });
  };

  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 mb-6 overflow-x-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 min-w-[760px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            <div className={`bg-white border border-[#D5E0DE] border-t-4 ${col.color} rounded-[10px] flex flex-col overflow-hidden flex-1`}>
              <div className="px-3 pt-3 pb-2">
                <h3 className="font-heading text-[15px] font-semibold text-[#0E2F33] text-center">
                  {col.label}
                </h3>
              </div>
              <div className="px-3 pb-2">
                <p className="text-[11px] text-[#1C4448] text-center min-h-[42px]">{col.hint}</p>
              </div>

              <div className="px-3 pb-3 flex-1 flex flex-col gap-2">
                {(peepo[col.id] || []).map((item, idx) => (
                  <div key={idx} className="relative">
                    <textarea
                      value={item}
                      onChange={(e) => updateItem(col.id, idx, e.target.value)}
                      placeholder="Enter a contributing factor…"
                      rows={2}
                      className="w-full text-[13px] text-[#0E2F33] bg-[#F1F5F4] border border-[#D5E0DE] rounded-lg p-2 pr-7 resize-none focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] placeholder:text-[#7FA88B]"
                    />
                    <button
                      onClick={() => deleteItem(col.id, idx)}
                      className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded text-[13px] leading-[18px] text-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <Button
                  onClick={() => addItem(col.id)}
                  className="w-full border-[1.5px] border-dashed border-[#D5E0DE] bg-transparent text-[#0F766E] hover:border-[#0F766E] hover:bg-[#F1F5F4] font-semibold text-[12.5px] print:hidden"
                  variant="outline"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add text
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}