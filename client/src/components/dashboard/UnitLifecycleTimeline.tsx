import React from "react";
import { cn } from "@/lib/utils";
import { 
  Check, 
  ClipboardCheck, 
  Truck, 
  Search, 
  Hammer, 
  Paintbrush, 
  Sparkles, 
  Key,
  Clock
} from "lucide-react";

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

const getStepIcon = (id: string) => {
  switch (id) {
    case "pre-move-out": return ClipboardCheck;
    case "move-out": return Truck;
    case "move-out-insp": return Search;
    case "punch-list": return Hammer;
    case "maintenance": return Paintbrush;
    case "cleaning": return Sparkles;
    case "rent-ready": return Key;
    default: return Clock;
  }
};

export function UnitLifecycleTimeline({ steps, onStepClick, className }: UnitLifecycleTimelineProps) {
  return (
    <div className={cn("w-full overflow-x-auto py-8 px-4", className)}>
      <div className="relative min-w-[800px] flex justify-between items-start">
        {/* Horizontal Connecting Line - Dashed */}
        <div className="absolute top-[106px] left-0 w-full h-px border-t-2 border-dashed border-slate-200 -z-10" />

        {steps.map((step, index) => {
          const Icon = getStepIcon(step.id);
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div 
              key={step.id}
              onClick={() => onStepClick?.(step)}
              className="group flex flex-col items-center cursor-pointer relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* 1. Large Circular Pin */}
              <div className={cn(
                "relative flex items-center justify-center w-20 h-20 rounded-full border-[6px] bg-white transition-all duration-300 shadow-sm group-hover:-translate-y-1",
                isCompleted ? "border-health-good text-health-good" : 
                isCurrent ? "border-primary text-primary shadow-lg shadow-primary/20 scale-110" : 
                "border-slate-200 text-slate-300 hover:border-slate-300"
              )}>
                <Icon className="w-8 h-8" strokeWidth={2} />
                
                {/* Triangle Pointer at bottom of circle */}
                <div className={cn(
                  "absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px]",
                  isCompleted ? "border-t-health-good" : 
                  isCurrent ? "border-t-primary" : 
                  "border-t-slate-200 group-hover:border-t-slate-300"
                )} />
              </div>

              {/* 2. Small Dot on the Line */}
              <div className={cn(
                "mt-6 w-4 h-4 rounded-full border-2 bg-white z-10 transition-colors duration-300",
                isCompleted ? "border-health-good bg-health-good" : 
                isCurrent ? "border-primary bg-primary ring-4 ring-primary/20" : 
                "border-slate-300 bg-slate-100"
              )} />

              {/* 3. Vertical Dashed Line Connector */}
              <div className="h-8 w-px border-l border-dashed border-slate-300 my-1" />

              {/* 4. Text Content */}
              <div className="text-center">
                <h4 className={cn(
                  "text-sm font-bold mb-1 transition-colors",
                  isCompleted ? "text-health-good" : 
                  isCurrent ? "text-primary scale-105" : 
                  "text-slate-500"
                )}>
                  {step.label}
                </h4>
                {step.duration && (
                  <span className="text-[10px] font-medium text-slate-400 block">
                    {step.duration}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
