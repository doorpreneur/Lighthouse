import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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

export function UnitLifecycleTimeline({ steps, onStepClick, className }: UnitLifecycleTimelineProps) {
  return (
    <div className={cn("w-full overflow-x-auto pb-6 pt-2 px-1", className)}>
      <div className="flex items-center gap-3 min-w-max">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          
          return (
            <button 
              key={step.id}
              onClick={() => onStepClick?.(step)}
              className={cn(
                "relative flex items-center justify-center h-14 px-8 cursor-pointer transition-all duration-200 group select-none outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
                // Colors
                step.status === "current" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]" 
                  : step.status === "completed"
                    ? "bg-health-good/15 text-health-good hover:bg-health-good/25"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
              )}
              style={{
                clipPath: isFirst
                  ? "polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%)" // Rounded start (via border-radius), point right
                  : isLast
                    ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 15px 50%)" // Notch left, flat/rounded end
                    : "polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)", // Notch left, point right
                borderRadius: isFirst ? "30px 0 0 30px" : isLast ? "0 30px 30px 0" : "0",
              }}
            >
              <div className="flex flex-col items-center justify-center gap-0.5 z-10">
                <div className="flex items-center gap-2">
                  {step.status === "completed" && <Check className="h-3.5 w-3.5" />}
                  <span className={cn("text-sm font-bold whitespace-nowrap", step.status === "current" ? "text-white" : "")}>
                    {step.label}
                  </span>
                </div>
                {step.duration && (
                  <span className={cn("text-[10px] font-medium opacity-80", step.status === "current" ? "text-white/90" : "")}>
                    {step.duration}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
