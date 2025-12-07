import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type TimelineStep = {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  detail?: string;
};

interface UnitLifecycleTimelineProps {
  steps: TimelineStep[];
  onStepClick?: (step: TimelineStep) => void;
  className?: string;
}

export function UnitLifecycleTimeline({ steps, onStepClick, className }: UnitLifecycleTimelineProps) {
  return (
    <div className={cn("w-full overflow-x-auto pb-4", className)}>
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div 
              key={step.id}
              onClick={() => onStepClick?.(step)}
              className={cn(
                "relative flex items-center h-12 pl-4 pr-8 cursor-pointer transition-all duration-200 group select-none",
                // Chevron shape using clip-path
                "first:pl-6", // Extra padding for first item
                step.status === "completed" && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                step.status === "current" && "bg-primary text-primary-foreground shadow-md z-10 scale-105 font-bold",
                step.status === "pending" && "bg-slate-50 text-slate-400 hover:bg-slate-100",
              )}
              style={{
                clipPath: isLast 
                  ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 15px 50%)" // Flat end for last item
                  : "polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)", // Chevron for middle items
                marginLeft: index === 0 ? 0 : "-15px", // Overlap the chevrons
              }}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                {step.status === "completed" && <Check className="h-3.5 w-3.5" />}
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
