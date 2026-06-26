import React from "react";
import TimelineItem from "./TimelineItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TimelineBoard({ timeline, onAdd, onUpdate, onDelete, onWhyTreeUpdate, onLinkEvidence }) {
  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 mb-6">
      <div className="flex flex-wrap items-start">
        {timeline.length === 0 && (
          <p className="text-[#1C4448] text-[13.5px] italic py-1.5">
            No events yet — click "Add event" to start building the sequence.
          </p>
        )}
        {timeline.map((ev, i) => (
          <TimelineItem
            key={i}
            index={i}
            event={ev}
            isLast={i === timeline.length - 1}
            onUpdate={(val) => onUpdate(i, val)}
            onDelete={() => onDelete(i)}
            onWhyTreeUpdate={onWhyTreeUpdate}
            onLinkEvidence={() => onLinkEvidence({ kind: "timeline", index: i, label: `Event ${i + 1}` })}
          />
        ))}
      </div>
      <Button
        onClick={onAdd}
        className="w-full mt-1 bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold text-[13px] print:hidden"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add event
      </Button>
    </div>
  );
}