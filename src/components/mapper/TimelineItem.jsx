import React from "react";
import { Paperclip } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Droppable } from "@hello-pangea/dnd";
import WhyNode from "./WhyNode";
import { whysToTree, updateNodeText, addChildAtPath, deleteNodeAtPath } from "./whyTreeUtils";

function ArrowSvg() {
  return (
    <div className="flex items-center justify-center w-[30px] text-[#7FA88B] flex-shrink-0 min-h-[118px]">
      <svg width="20" height="14" viewBox="0 0 20 14">
        <path d="M0 7h15M11 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function TimelineItem({ index, event, isLast, onUpdate, onDelete, onWhyTreeUpdate, onLinkEvidence }) {
  const tree = whysToTree(event.whys || []);

  const handleUpdateText = (path, val) => {
    const newTree = updateNodeText(tree, path, val);
    onWhyTreeUpdate(index, newTree);
  };

  const handleAddChild = (path) => {
    const newTree = addChildAtPath(tree, path);
    onWhyTreeUpdate(index, newTree);
  };

  const handleDeleteNode = (path) => {
    const newTree = deleteNodeAtPath(tree, path);
    onWhyTreeUpdate(index, newTree);
  };

  return (
    <div className="flex items-start">
      <div className="flex flex-col w-[200px] mb-4">
        <Droppable droppableId={`timeline-${index}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`relative bg-white border-[1.5px] rounded-[10px] p-3 flex flex-col min-h-[118px] transition-colors ${
                snapshot.isDraggingOver
                  ? "border-[#0F766E] border-t-[5px] border-t-[#0F766E] bg-[#0F766E]/5"
                  : "border-[#D5E0DE] border-t-[5px] border-t-[#0F766E]"
              }`}
            >
              <button
                onClick={onDelete}
                className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded text-[13px] leading-[18px] text-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden z-10"
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
                {(event.evidence_ids || []).length > 0
                  ? `${(event.evidence_ids || []).length} evidence linked`
                  : "Link evidence"}
              </button>
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Why tree */}
        {(event.whys || []).length > 0 && (
          <div className="mt-1.5">
            <WhyNode
              node={tree}
              depth={0}
              path={[0]}
              onUpdateText={(path, val) => handleUpdateText(path, val)}
              onAddChild={(path) => handleAddChild(path)}
              onDeleteNode={(path) => handleDeleteNode(path)}
            />
          </div>
        )}

        {/* Add Why button */}
        <button
          onClick={() => {
            const newTree = addChildAtPath(whysToTree(event.whys || []), []);
            onWhyTreeUpdate(index, newTree);
          }}
          disabled={(event.whys || []).length >= 10}
          className="mt-2 ml-3.5 bg-[#0F766E] text-white border-none rounded-[7px] py-1.5 px-2.5 text-[12px] font-semibold cursor-pointer self-start hover:brightness-110 disabled:bg-[#D5E0DE] disabled:text-[#1C4448] disabled:cursor-not-allowed print:hidden"
        >
          {(event.whys || []).length >= 10 ? "Max 10 Whys" : "+ Why"}
        </button>
      </div>

      {!isLast && <ArrowSvg />}
    </div>
  );
}