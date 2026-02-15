import { motion } from "framer-motion";

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  colorClass: string;
}

const MacroBar = ({ label, current, target, unit = "g", colorClass }: MacroBarProps) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          <span className={colorClass}>{current}</span>
          <span className="text-muted-foreground">/{target}{unit}</span>
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass.replace("text-", "bg-")}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default MacroBar;
