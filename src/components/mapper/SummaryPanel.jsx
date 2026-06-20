import React from "react";
import { LAYERS, interpret } from "@/lib/layers";

export default function SummaryPanel({ holes }) {
  let latent = 0;
  let active = 0;
  let total = 0;
  let layersHit = 0;

  LAYERS.forEach((l) => {
    const arr = holes[l.id] || [];
    if (arr.length) layersHit++;
    arr.forEach((h) => {
      total++;
      if (h.type === "latent") latent++;
      else active++;
    });
  });

  const interpretation = interpret(latent, active, layersHit);

  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 my-6">
      <h2 className="font-heading text-xl font-semibold mb-3.5">Breach profile</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-4 text-center">
          <div className="font-heading text-3xl font-bold text-[#0F766E]">{total}</div>
          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-[#1C4448] mt-0.5">Total breaches</div>
        </div>
        <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-4 text-center">
          <div className="font-heading text-3xl font-bold text-[#C5563D]">{latent}</div>
          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-[#1C4448] mt-0.5">Latent conditions</div>
        </div>
        <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-4 text-center">
          <div className="font-heading text-3xl font-bold text-[#D9923A]">{active}</div>
          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-[#1C4448] mt-0.5">Active failures</div>
        </div>
        <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-4 text-center">
          <div className="font-heading text-3xl font-bold text-[#0F766E]">{layersHit}/5</div>
          <div className="text-[11.5px] font-semibold tracking-wide uppercase text-[#1C4448] mt-0.5">Layers penetrated</div>
        </div>
      </div>
      <p className="text-[13.5px] text-[#1C4448]" dangerouslySetInnerHTML={{ __html: interpretation }} />
    </div>
  );
}