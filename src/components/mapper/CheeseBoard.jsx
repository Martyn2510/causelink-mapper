import React from "react";
import { LAYERS } from "@/lib/layers";
import CheeseSlice from "./CheeseSlice";

export default function CheeseBoard({ holes, onOpenModal, onDeleteHole }) {
  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 overflow-x-auto">
      <div className="flex gap-3 items-stretch min-w-[920px] py-2.5">
        {LAYERS.map((layer) => (
          <CheeseSlice
            key={layer.id}
            layer={layer}
            holes={holes[layer.id] || []}
            onAdd={() => onOpenModal(layer.id)}
            onDelete={(idx) => onDeleteHole(layer.id, idx)}
          />
        ))}
      </div>
    </div>
  );
}