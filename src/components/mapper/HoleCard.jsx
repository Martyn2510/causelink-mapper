import React from "react";
import { Link2, X } from "lucide-react";

export default function HoleCard({ hole, layerId, idx, onDelete, onConnect, connectMode, isConnectSource, connectionCount }) {
  const isLatent = hole.type === "latent";

  return (
    <div
      data-hole-id={`${layerId}-${idx}`}
      className={`border rounded-lg p-2.5 mb-2 relative transition-all ${
        isLatent
          ? "bg-[#FBF1EE] border-[#D5E0DE] border-l-4 border-l-[#C5563D]"
          : "bg-[#FBF6EE] border-[#D5E0DE] border-l-4 border-l-[#D9923A]"
      } ${connectMode ? "cursor-pointer" : ""} ${
        isConnectSource ? "ring-2 ring-[#0F766E]" : ""
      }`}
      onClick={connectMode ? () => onConnect(layerId, idx) : undefined}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded text-[13px] leading-[18px] text-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden"
      >
        ×
      </button>
      <div className="flex items-center gap-1.5 mb-1">
        <div className={`text-[9.5px] font-bold tracking-wider uppercase ${isLatent ? "text-[#C5563D]" : "text-[#D9923A]"}`}>
          {isLatent ? "◆ Latent condition" : "● Active failure"}
        </div>
        {connectionCount > 0 && (
          <span className="text-[9px] font-bold text-[#0F766E] bg-[#0F766E]/10 px-1.5 py-0.5 rounded-full ml-auto">
            {connectionCount} link{connectionCount !== 1 ? "s" : ""}
          </span>
        )}
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
      {!connectMode && (
        <button
          onClick={(e) => { e.stopPropagation(); onConnect(layerId, idx); }}
          className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[#0F766E] hover:underline cursor-pointer border-none bg-transparent p-0 print:hidden"
        >
          <Link2 className="w-3 h-3" />
          Connect to another layer
        </button>
      )}
      {connectMode && !isConnectSource && (
        <div className="mt-1.5 text-[10px] font-semibold text-[#0F766E] flex items-center gap-1">
          <Link2 className="w-3 h-3" />
          Click to connect
        </div>
      )}
      {connectMode && isConnectSource && (
        <div className="mt-1.5 text-[10px] font-semibold text-[#C5563D] flex items-center gap-1">
          <X className="w-3 h-3" />
          Click to cancel
        </div>
      )}
    </div>
  );
}