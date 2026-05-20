import { CheckCircle2, Clock, Truck, Package, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMELINE_STEPS = [
  { id: "pending", label: "Order Placed", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
        <XCircle className="w-6 h-6" />
        <div>
          <p className="font-bold">Order Cancelled</p>
          <p className="text-sm opacity-80">This order has been cancelled and will not be fulfilled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.findIndex(s => s.id === currentStatus);
  // If status is not found or is somehow earlier than pending, default to 0
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="relative py-4">
      {/* Background Line */}
      <div className="absolute top-8 left-4 md:left-[1.35rem] w-0.5 h-[calc(100%-4rem)] bg-gray-200 z-0"></div>
      
      {/* Active Line */}
      <div 
        className="absolute top-8 left-4 md:left-[1.35rem] w-0.5 bg-brand-green-dark z-0 transition-all duration-500 ease-in-out"
        style={{ height: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
      ></div>

      <div className="space-y-8 relative z-10">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isActive = index === activeIndex;
          
          return (
            <div key={step.id} className="flex gap-4 md:gap-6">
              <div className={cn(
                "w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300",
                isCompleted ? "bg-brand-green-dark text-white" : "bg-white border-2 border-gray-200 text-gray-400"
              )}>
                <step.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              </div>
              
              <div className="pt-2 flex-1">
                <p className={cn(
                  "font-bold text-sm md:text-base transition-colors",
                  isCompleted ? "text-brand-green-dark" : "text-gray-400"
                )}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-brand-green-dark/70 mt-1">Currently in this stage.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
