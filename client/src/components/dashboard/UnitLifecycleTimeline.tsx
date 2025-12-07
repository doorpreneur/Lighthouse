import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ClipboardList, 
  Truck, 
  ClipboardCheck, 
  Hammer, 
  Wrench, 
  Sparkles, 
  Key, 
  Circle,
  CheckCircle2,
  Clock,
  LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";

export type TimelineStep = {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  duration?: string;
  detail?: string;
};

interface UnitLifecycleTimelineProps {
  steps: TimelineStep[];
  onStepClick?: (step: TimelineStep) => void;
  className?: string;
}

const STEP_ICONS: Record<string, LucideIcon> = {
  "pre-move-out": ClipboardList,
  "move-out": Truck,
  "move-out-insp": ClipboardCheck,
  "punch-list": Hammer,
  "maintenance": Wrench,
  "cleaning": Sparkles,
  "rent-ready": Key,
};

export function UnitLifecycleTimeline({ steps, onStepClick, className }: UnitLifecycleTimelineProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  // Geometry Constants
  const STEP_WIDTH = 140;
  const CIRCLE_RADIUS = 36;
  const PATH_THICKNESS = 16;
  const PADDING_LEFT = 60;
  const PADDING_TOP = 60; // Space for text above
  const ROW_HEIGHT = 100; // Vertical distance between top and bottom rows
  
  // Total width calculation
  const totalWidth = steps.length * STEP_WIDTH + PADDING_LEFT;
  const height = ROW_HEIGHT + PADDING_TOP * 2;

  // Helper to get coordinates for a step
  const getStepCoords = (index: number) => {
    const x = PADDING_LEFT + index * STEP_WIDTH;
    const isTop = index % 2 === 0;
    const y = PADDING_TOP + (isTop ? 0 : ROW_HEIGHT);
    return { x, y, isTop };
  };

  // Generate path segment for a step
  const getPathSegment = (index: number) => {
    if (index >= steps.length - 1) return "";

    const current = getStepCoords(index);
    const next = getStepCoords(index + 1);
    const r = CIRCLE_RADIUS;

    // Start at 3 o'clock of current circle
    const startX = current.x + r;
    const startY = current.y;

    // End at 9 o'clock of next circle
    const endX = next.x - r;
    const endY = next.y;

    // Control points for S-curve
    // We want to exit current vertical-ish and enter next vertical-ish
    // If current is Top (y=0), we exit 3 o'clock heading DOWN? 
    // Wait, the logic I designed: 
    // Top Arc: 9 -> 3. Tangent at 3 is DOWN.
    // Bottom Arc: 9 -> 3. Tangent at 9 is DOWN.
    // So we connect Down to Down.
    
    // Actually, let's draw the ARC around the circle as part of the path?
    // Or just draw the connectors and let the circles sit on top?
    // The image shows the path IS the circle border for half the circle.
    
    // Let's draw the full continuous path.
    // We need to build the "d" attribute for the whole line or segments.
    // Segments are better for coloring.
    
    // Segment i: Arc around Step i + Curve to Step i+1
    
    // Arc logic:
    // If Top: Arc from 9 o'clock (x-r, y) to 3 o'clock (x+r, y) via Top (Sweep 1)
    // If Bottom: Arc from 9 o'clock (x-r, y) to 3 o'clock (x+r, y) via Bottom (Sweep 0)
    
    // Connector logic:
    // From (x+r, y) to Next (x-r, next_y).
    // Tangents:
    // Top -> Bottom: Exit (x+r, y) heading DOWN (0, 1). Enter (next_x-r, next_y) heading DOWN (0, 1).
    // Bottom -> Top: Exit (x+r, y) heading UP (0, -1). Enter (next_x-r, next_y) heading UP (0, -1).
    
    const isTop = index % 2 === 0;
    
    // Arc part
    // Move to start of arc (only if first segment, otherwise we are already there)
    const arcStart = `M ${current.x - r} ${current.y}`;
    // Arc to end of circle
    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    // Top circle: Sweep 1 (CW)
    // Bottom circle: Sweep 0 (CCW) -> Wait, usually 0 is CCW, 1 is CW.
    // SVG coord system: Y grows down.
    // Top circle (y small): 9 o'clock is (x-r, y). 3 o'clock is (x+r, y).
    // To go via Top (y-r), we need CW? 
    // (x-r, y) -> (x, y-r) -> (x+r, y). Yes, CW (1).
    // Bottom circle (y large): 9 o'clock (x-r, y) -> 3 o'clock (x+r, y).
    // To go via Bottom (y+r), we need CCW? 
    // (x-r, y) -> (x, y+r) -> (x+r, y). CCW (0).
    
    const sweep = isTop ? 1 : 0;
    const arc = `A ${r} ${r} 0 0 ${sweep} ${current.x + r} ${current.y}`;
    
    // Curve part
    // Bezier C cp1x cp1y, cp2x cp2y, endx endy
    // Start point: current.x + r, current.y
    // End point: next.x - r, next.y
    // Control points:
    // If Top->Bottom: Start tangent is (0, 1). End tangent is (0, 1).
    // CP1: (current.x + r + offset, current.y + offset_y)
    // Simple vertical control:
    // CP1 = (current.x + r, current.y + VERTICAL_control)
    // CP2 = (next.x - r, next.y - VERTICAL_control)
    // Since we go Top (y=low) to Bottom (y=high), deltaY is positive.
    // Tangent is DOWN (positive Y).
    // So CP1 should be below start. CP2 should be above end.
    
    const cpOffset = (next.x - current.x - 2*r) / 2; // Horizontal spacing split
    // Actually, standard bezier for S-curve with vertical tangents:
    // CP1: (start_x, start_y + k)
    // CP2: (end_x, end_y - k)
    // where k is some vertical distance.
    const k = ROW_HEIGHT * 0.6; // Adjust curvature
    
    // Direction multiplier
    // Top->Bottom: Start Y < End Y. Tangent Down (+). k should be positive.
    // Bottom->Top: Start Y > End Y. Tangent Up (-). k should be negative (relative to axis? No).
    // Tangent at Exit of Bottom (CCW 9->3) is UP (0, -1).
    // Tangent at Entry of Top (CW 9->3) is UP (0, -1).
    // So we need CP1 above start, CP2 below end.
    // SVG Y is Down. Up is negative Y.
    // So if Bottom->Top: Exit vector is (0, -1). CP1 = (start_x, start_y - k).
    // Entry vector is (0, -1). CP2 = (end_x, end_y + k).
    
    const dir = isTop ? 1 : -1;
    const curve = `C ${current.x + r} ${current.y + k * dir}, ${next.x - r} ${next.y - k * dir}, ${next.x - r} ${next.y}`;
    
    return `${arcStart} ${arc} ${curve}`;
  };
  
  // Last step just needs the arc
  const getLastSegment = (index: number) => {
    const current = getStepCoords(index);
    const r = CIRCLE_RADIUS;
    const isTop = index % 2 === 0;
    const sweep = isTop ? 1 : 0;
    return `M ${current.x - r} ${current.y} A ${r} ${r} 0 0 ${sweep} ${current.x + r} ${current.y}`;
  };

  const getStatusColor = (status: TimelineStep['status']) => {
    switch(status) {
      case 'completed': return "var(--color-health-good)";
      case 'current': return "var(--color-primary)";
      default: return "var(--color-muted)"; // slate-200
    }
  };

  return (
    <div className={cn("w-full overflow-x-auto pb-4 pt-2 px-1 custom-scrollbar", className)}>
      <div 
        className="relative min-w-max select-none" 
        style={{ width: totalWidth, height: height + 60 }} // Extra height for labels
      >
        {/* SVG Paths */}
        <svg 
          width={totalWidth} 
          height={height} 
          className="absolute top-0 left-0 pointer-events-none drop-shadow-sm"
          style={{ overflow: 'visible' }}
        >
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const d = isLast ? getLastSegment(index) : getPathSegment(index);
            const color = getStatusColor(step.status);
            
            // For pending steps, make the path lighter/dashed?
            // User requested "one of the other colors". Muted is fine.
            
            return (
              <path
                key={`path-${step.id}`}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={PATH_THICKNESS}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors duration-500 ease-in-out"
                style={{
                  opacity: step.status === 'pending' ? 0.3 : 1
                }}
              />
            );
          })}
        </svg>

        {/* Nodes and Labels */}
        {steps.map((step, index) => {
          const coords = getStepCoords(index);
          const Icon = STEP_ICONS[step.id] || Circle;
          const isHovered = hoveredStep === step.id;
          const isTop = index % 2 === 0;

          return (
            <div
              key={step.id}
              className="absolute group cursor-pointer"
              style={{
                left: coords.x - CIRCLE_RADIUS,
                top: coords.y - CIRCLE_RADIUS,
                width: CIRCLE_RADIUS * 2,
                height: CIRCLE_RADIUS * 2,
              }}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              onClick={() => onStepClick?.(step)}
            >
              {/* Icon Circle */}
              <motion.div 
                className={cn(
                  "absolute inset-0 rounded-full flex items-center justify-center border-4 bg-white z-10 transition-colors duration-300",
                  step.status === 'current' ? "border-primary text-primary shadow-lg shadow-primary/20" :
                  step.status === 'completed' ? "border-health-good text-health-good" :
                  "border-muted text-muted-foreground"
                )}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </motion.div>

              {/* Text Label */}
              <div 
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-48 text-center transition-all duration-300 z-20 pointer-events-none",
                  isTop ? "-top-16" : "-bottom-20"
                )}
              >
                <div className={cn(
                  "text-sm font-bold transition-colors duration-300 mb-1",
                  isHovered || step.status === 'current' ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </div>
                
                <div className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full inline-block transition-all duration-300",
                  step.status === 'current' ? "bg-primary/10 text-primary" :
                  step.status === 'completed' ? "bg-health-good/10 text-health-good" :
                  "text-muted-foreground"
                )}>
                   {step.duration || (step.status === 'completed' ? "Done" : "Pending")}
                </div>
              </div>

              {/* Connector Dot for visual continuity? No, the snake is continuous. */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
