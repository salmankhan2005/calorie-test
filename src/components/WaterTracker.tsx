import { motion } from "framer-motion";
import { Droplets, Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const WaterTracker = () => {
  const { todayLog, addWater, profile } = useAppStore();
  const targetMl = (profile?.waterLiters || 2.5) * 1000;
  const currentMl = todayLog.waterIntake;
  const glassSize = 250; // ml per glass
  const totalGlasses = Math.ceil(targetMl / glassSize);
  const filledGlasses = Math.floor(currentMl / glassSize);
  const percentage = Math.min((currentMl / targetMl) * 100, 100);

  return (
    <div className="glass-card glow-water p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-water" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Water Intake</h3>
        </div>
        <span className="text-sm font-semibold">
          <span className="text-water">{currentMl}</span>
          <span className="text-muted-foreground">/{targetMl}ml</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-water"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Glass grid */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: Math.min(totalGlasses, 12) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
              i < filledGlasses
                ? "bg-water/20 text-water"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Droplets className="w-4 h-4" />
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => addWater(glassSize)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-water/10 text-water hover:bg-water/20 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Glass ({glassSize}ml)
      </button>
    </div>
  );
};

export default WaterTracker;
