import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";

// Recursive node: { text, children: [node, ...] }

export default function WhyNode({ node, depth, onUpdateText, onAddChild, onDeleteNode, path, maxDepth = 6 }) {
  const [expanded, setExpanded] = React.useState(true);
  const isRoot = depth === 0;
  const indent = depth * 16;
  const canAddChild = depth < maxDepth - 1;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded((p) => !p);
  };

  return (
    <div style={{ marginLeft: indent }} className="relative">
      {/* Connector line */}
      {depth > 0 && (
        <div className="absolute left-[-10px] top-0 bottom-0 w-[1.5px] bg-white/20" />
      )}
      <div
        className={`relative rounded-[9px] p-2.5 flex flex-col min-h-[48px] shadow-sm ${
          isRoot ? "bg-[#1C4448]" : "bg-[#0F766E]"
        }`}
      >
        <button
          onClick={() => onDeleteNode(path)}
          className="absolute top-1.5 right-1.5 w-[17px] h-[17px] rounded text-[12px] leading-[17px] text-center bg-white/15 text-white hover:bg-[#C5563D] cursor-pointer border-none print:hidden z-10"
        >
          ×
        </button>

        <div className="flex items-center gap-1.5 mb-1">
          {/* Expand toggle (only if has children) */}
          {node.children && node.children.length > 0 ? (
            <button
              onClick={toggleExpand}
              className="text-white/70 hover:text-white cursor-pointer border-none bg-transparent p-0 flex items-center print:hidden"
            >
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          ) : (
            <div className="w-3.5 h-3.5 flex-shrink-0" />
          )}
          <div className="text-[9px] font-bold tracking-wider uppercase text-[#9FBF3B]">
            {isRoot ? `Why ${path.length > 0 ? path[0] + 1 : 1}` : `Sub-cause`}
          </div>
        </div>

        <Textarea
          value={node.text || ""}
          onChange={(e) => onUpdateText(path, e.target.value)}
          placeholder="Because…"
          className="flex-1 border-none resize-none text-[12.5px] text-white bg-transparent leading-snug p-0 focus-visible:ring-0 shadow-none placeholder:text-white/50 min-h-[24px]"
        />

        <div className="flex gap-2 mt-1 print:hidden">
          {canAddChild && (
            <button
              onClick={() => onAddChild(path)}
              className="text-[10px] font-semibold text-[#9FBF3B] hover:underline cursor-pointer border-none bg-transparent p-0"
            >
              + Sub-cause
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {expanded && node.children && node.children.length > 0 && (
        <div className="mt-1.5 space-y-1.5">
          {node.children.map((child, ci) => (
            <WhyNode
              key={ci}
              node={child}
              depth={depth + 1}
              path={[...path, ci]}
              onUpdateText={onUpdateText}
              onAddChild={onAddChild}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}