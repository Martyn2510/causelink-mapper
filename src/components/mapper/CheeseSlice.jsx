import React from "react";
import HoleCard from "./HoleCard";

export default function CheeseSlice({ layer, holes, onAdd, onDelete, onConnect, connectSource, getConnectionCount }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="text-center mb-3 flex flex-col h-[110px]">
        <h3 className="font-heading text-[15.5px] text-[#0E2F33] flex-none flex items-end justify-center font-semibold leading-snug" style={{minHeight: '2.5em'}}>
          {layer.name}
        </h3>
        <div className="text-[11.5px] text-[#1C4448] mt-1.5 flex-1 overflow-hidden">
          {layer.desc}
        </div>
      </div>

      <div className={`bg-white border-2 ${layer.cls} rounded-[14px] flex-1 min-h-[320px] p-3 relative transition-all`}>
        <div className={`absolute top-[-1px] left-[-1px] right-[-1px] h-1.5 rounded-t-xl ${layer.labelBg}`} />

        {holes.map((hole, idx) => (
          <HoleCard
            key={idx}
            hole={hole}
            layerId={layer.id}
            idx={idx}
            onDelete={() => onDelete(idx)}
            onConnect={onConnect}
            connectMode={!!connectSource}
            isConnectSource={connectSource && connectSource.layerId === layer.id && connectSource.idx === idx}
            connectionCount={getConnectionCount(layer.id, idx)}
          />
        ))}

        <button
          onClick={onAdd}
          className="w-full border-[1.5px] border-dashed border-[#D5E0DE] bg-transparent text-[#0F766E] rounded-lg py-2.5 text-[12.5px] font-semibold cursor-pointer hover:border-[#0F766E] hover:bg-[#F1F5F4] print:hidden"
        >
          + {layer.id === "def" ? "Add Unwanted Event" : "Add error"}
        </button>
      </div>
    </div>
  );
}