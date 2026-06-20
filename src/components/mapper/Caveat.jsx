import React from "react";

export default function Caveat() {
  return (
    <div className="text-[12.5px] text-[#1C4448] italic bg-[#F1F5F4] border-l-[3px] border-l-[#7FA88B] py-3 px-3.5 rounded-r-lg mb-8">
      Working analysis, not findings. This map represents the investigation team's current understanding of how defences were breached.
      It applies a no-blame logic — <b className="text-[#0E2F33]">no blame does not mean no accountability</b> — and is subject to revision as evidence is tested.
      Latent conditions are weaknesses in the system as designed and managed; identifying them is the basis for organisational learning, not individual fault attribution.
    </div>
  );
}