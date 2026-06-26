import React from "react";
import { Paperclip } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

function ArrowSvg() {
  return (
    <div className="flex items-center justify-center w-[30px] text-[#7FA88B] flex-shrink-0 min-h-[118px]">
      <svg width="20" height="14" viewBox="0 0 20 14">
        <path d="M0 7h15M11 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function TimelineItem({ index, event, isLast, onUpdate, onDelete, onAddWhy, onUpdateWhy, onDeleteWhy, onLinkEvidence }) {
  const atMax = (event.whys || []).length >= 10;
  const evCount = (event.evidence_ids || []).length;

  return (
    <div className="flex items-start">
      <div className="flex flex-col w-[200px] mb-4">
        {/* Event box */}
        <div className="relative bg-white border-[1.5px] border-[#D5E0DE] border-t-[5px] border-t-[#0F766E] rounded-[10px] p-3 flex flex-col min-h-[118px]">
          <button
            onClick={onDelete}
            className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded text-[13px] leading-[18px] text-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden"
          >
            ×
          </button>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#0F766E] mb-1">
            Event {index + 1}
          </div>
          <Textarea
            value={event.text || ""}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Describe what happened…"
            className="flex-1 border-none resize-none text-[13px] text-[#0E2F33] bg-transparent leading-snug p-0 focus-visible:ring-0 shadow-none min-h-[60px]"
          />
          <button
            onClick={onLinkEvidence}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#0F766E] hover:underline mt-1 print:hidden"
          >
            <Paperclip className="w-3 h-3" />
            {evCount > 0 ? `${evCount} evidence linked` : "Link evidence"}
          </button>
        </div>

        {/* Why boxes */}
        {(event.whys || []).map((w, j) => (
          <div
            key={j}
            className="relative bg-[#1C4448] rounded-[9px] p-2.5 ml-3.5 mt-1.5 flex flex-col min-h-[58px] shadow-sm"
          >
            <button
              onClick={() => onDeleteWhy(j)}
              className="absolute top-1.5 right-1.5 w-[17px] h-[17px] rounded text-[12px] leading-[17px] text-center bg-white/15 text-white hover:bg-[#C5563D] cursor-pointer border-none print:hidden"
            >
              ×
            </button>
            <div className="text-[9px] font-bold tracking-wider uppercase text-[#9FBF3B] mb-1">
              Why {j + 1}
            </div>
            <Textarea
              value={w}
              onChange={(e) => onUpdateWhy(j, e.target.value)}
              placeholder="Because…"
              className="flex-1 border-none resize-none text-[12.5px] text-white bg-transparent leading-snug p-0 focus-visible:ring-0 shadow-none placeholder:text-white/50 min-h-[24px]"
            />
          </div>
        ))}

        {/* Add Why button */}
        <button
          onClick={onAddWhy}
          disabled={atMax}
          className="mt-2 ml-3.5 bg-[#0F766E] text-white border-none rounded-[7px] py-1.5 px-2.5 text-[12px] font-semibold cursor-pointer self-start hover:brightness-110 disabled:bg-[#D5E0DE] disabled:text-[#1C4448] disabled:cursor-not-allowed print:hidden"
        >
          {atMax ? "Max 10 Whys" : "+ Why"}
        </button>
      </div>

      {!isLast && <ArrowSvg />}
    </div>
  );
}