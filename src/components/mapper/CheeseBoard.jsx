import React, { useRef, useState, useEffect, useCallback } from "react";
import { LAYERS } from "@/lib/layers";
import CheeseSlice from "./CheeseSlice";
import { X } from "lucide-react";

export default function CheeseBoard({ holes, onOpenModal, onDeleteHole, connections, onConnect, connectSource, onRemoveConnection }) {
  const containerRef = useRef(null);
  const [linePositions, setLinePositions] = useState([]);
  const [showConnections, setShowConnections] = useState(true);

  const computePositions = useCallback(() => {
    if (!containerRef.current || !connections || connections.length === 0) {
      setLinePositions([]);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerScrollLeft = containerRef.current.scrollLeft;
    const containerScrollTop = containerRef.current.scrollTop;

    const positions = connections
      .map((conn) => {
        const fromEl = containerRef.current.querySelector(`[data-hole-id="${conn.fromLayer}-${conn.fromIdx}"]`);
        const toEl = containerRef.current.querySelector(`[data-hole-id="${conn.toLayer}-${conn.toIdx}"]`);
        if (!fromEl || !toEl) return null;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        return {
          id: conn.id,
          x1: fromRect.right - containerRect.left + containerScrollLeft - 4,
          y1: fromRect.top - containerRect.top + containerScrollTop + fromRect.height / 2,
          x2: toRect.left - containerRect.left + containerScrollLeft + 4,
          y2: toRect.top - containerRect.top + containerScrollTop + toRect.height / 2,
        };
      })
      .filter(Boolean);

    setLinePositions(positions);
  }, [connections]);

  useEffect(() => {
    computePositions();
    const handleResize = () => computePositions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computePositions]);

  // Recompute when holes change
  useEffect(() => {
    const timer = setTimeout(computePositions, 100);
    return () => clearTimeout(timer);
  }, [holes, computePositions]);

  const getConnectionCount = (layerId, idx) => {
    if (!connections) return 0;
    return connections.filter(
      (c) =>
        (c.fromLayer === layerId && c.fromIdx === idx) ||
        (c.toLayer === layerId && c.toIdx === idx)
    ).length;
  };

  return (
    <div ref={containerRef} className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 overflow-x-auto relative">
      {connections && connections.length > 0 && (
        <div className="flex items-center gap-2 mb-3 print:hidden">
          <button
            onClick={() => setShowConnections(!showConnections)}
            className="text-[11px] font-semibold text-[#0F766E] hover:underline cursor-pointer border-none bg-transparent"
          >
            {showConnections ? "Hide" : "Show"} accident path ({connections.length})
          </button>
        </div>
      )}
      <div className="relative">
        <div className="flex gap-3 items-stretch min-w-[920px] py-2.5">
          {LAYERS.map((layer) => (
            <CheeseSlice
              key={layer.id}
              layer={layer}
              holes={holes[layer.id] || []}
              onAdd={() => onOpenModal(layer.id)}
              onDelete={(idx) => onDeleteHole(layer.id, idx)}
              onConnect={onConnect}
              connectSource={connectSource}
              getConnectionCount={getConnectionCount}
            />
          ))}
        </div>

        {/* SVG overlay for connection lines */}
        {showConnections && linePositions.length > 0 && (
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#0F766E" />
              </marker>
            </defs>
            {linePositions.map((line) => (
              <g key={line.id} className="pointer-events-auto">
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#0F766E"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                  markerEnd="url(#arrowhead)"
                  opacity="0.7"
                />
                <circle cx={line.x1} cy={line.y1} r="3" fill="#0F766E" opacity="0.7" />
                <circle cx={line.x2} cy={line.y2} r="3" fill="#C5563D" opacity="0.7" />
                {/* Remove button at midpoint */}
                <g
                  transform={`translate(${(line.x1 + line.x2) / 2 - 8}, ${(line.y1 + line.y2) / 2 - 8})`}
                  className="cursor-pointer"
                  onClick={() => onRemoveConnection(line.id)}
                  style={{ pointerEvents: "all" }}
                >
                  <circle cx="8" cy="8" r="7" fill="white" stroke="#C5563D" strokeWidth="1" />
                  <text x="8" y="11" textAnchor="middle" fill="#C5563D" fontSize="10" fontWeight="bold">×</text>
                </g>
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}