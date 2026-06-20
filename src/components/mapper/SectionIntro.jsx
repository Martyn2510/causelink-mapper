import React from "react";

export default function SectionIntro({ title, children, legend }) {
  return (
    <div className="my-2 mb-4">
      <h2 className="font-heading text-2xl font-semibold mb-1.5">{title}</h2>
      <p className="text-[14.5px] text-[#1C4448] max-w-[880px]">{children}</p>
      {legend && (
        <div className="flex gap-4 flex-wrap mt-3.5 text-[12.5px]">
          <span className="inline-flex items-center gap-1.5 text-[#1C4448]">
            <span className="w-[13px] h-[13px] rounded-sm flex-shrink-0 bg-[#C5563D]" />
            Latent condition (dormant, system/management)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#1C4448]">
            <span className="w-[13px] h-[13px] rounded-sm flex-shrink-0 bg-[#D9923A]" />
            Active failure (point-of-operation error/violation)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#1C4448]">
            <span className="w-[13px] h-[13px] rounded-sm flex-shrink-0 bg-[#1C4448]" />
            Layer accent = defensive tier
          </span>
        </div>
      )}
    </div>
  );
}