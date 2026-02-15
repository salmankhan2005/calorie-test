import { motion } from "framer-motion";

interface CalorieRingProps {
  consumed: number;
  target: number;
}

const CalorieRing = ({ consumed = 0, target = 2000 }: CalorieRingProps) => {
  const safeTarget = target > 0 ? target : 2000;
  const percentage = Math.min((consumed / safeTarget) * 100, 100);
  const remaining = Math.max(safeTarget - consumed, 0);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card glow-calories p-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Daily Calories</h3>
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background ring */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <motion.circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="hsl(var(--calories))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-display font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {remaining}
          </motion.span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">kcal left</span>
        </div>
      </div>
      <div className="flex justify-between w-full mt-4 text-sm">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Eaten</p>
          <p className="font-semibold text-calories">{consumed}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Target</p>
          <p className="font-semibold text-foreground">{target}</p>
        </div>
      </div>
    </div>
  );
};

export default CalorieRing;
