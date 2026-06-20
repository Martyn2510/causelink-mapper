import React from "react";

export default function HoleCard({ hole, onDelete }) {
  const isLatent = hole.type === "latent";

  return (
    <div
      className={`border rounded-lg p-2.5 mb-2 relative ${
        isLatent
          ? "bg-[#FBF1EE] border-[#D5E0DE] border-l-4 border-l-[#C5563D]"
          : "bg-[#FBF6EE] border-[#D5E0DE] border-l-4 border-l-[#D9923A]"
      }`}
    >
      <button
        onClick={onDelete}
        className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded text-[13px] leading-[18px] text-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden"
      >
        ×
      </button>
      <div className={`text-[9.5px] font-bold tracking-wider uppercase mb-1 ${isLatent ? "text-[#C5563D]" : "text-[#D9923A]"}`}>
        {isLatent ? "◆ Latent condition" : "● Active failure"}
      </div>
      <div className="text-[13px] text-[#0E2F33] whitespace-pre-wrap break-words">
        {hole.text}
      </div>
      {hole.ctrl && (
        <div className="text-[11px] text-[#0F766E] mt-1.5 pt-1.5 border-t border-dashed border-[#D5E0DE] whitespace-pre-wrap">
          <b className="text-[#1C4448]">Control:</b> {hole.ctrl}
        </div>
      )}
      {hole.ev && (
        <div className="text-[11px] text-[#0F766E] mt-1 whitespace-pre-wrap">
          <b className="text-[#1C4448]">Evidence:</b> {hole.ev}
        </div>
      )}
    </div>
  );
}