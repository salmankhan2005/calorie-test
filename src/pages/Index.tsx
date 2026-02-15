import { motion } from "framer-motion";
import { Flame, Settings, Dumbbell, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import CalorieRing from "@/components/CalorieRing";
import MacroBar from "@/components/MacroBar";
import WaterTracker from "@/components/WaterTracker";
import FoodLog from "@/components/FoodLog";
import DaySelector from "@/components/DaySelector";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

const Index = () => {
  const { profile, todayLog, history, isOnboarded, selectedDate } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOnboarded) {
      navigate("/onboarding");
    }
  }, [isOnboarded, navigate]);

  if (!profile && isOnboarded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">Syncing your coach profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  // Determine which log to display
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const displayLog = isToday
    ? todayLog
    : history.find(h => h.date === selectedDate) || { caloriesConsumed: 0, foodLogs: [], waterIntake: 0 };

  const foodLogs = displayLog?.foodLogs || [];
  const totalProtein = foodLogs.reduce((s, f) => s + (f.protein || 0), 0);
  const totalCarbs = foodLogs.reduce((s, f) => s + (f.carbs || 0), 0);
  const totalFat = foodLogs.reduce((s, f) => s + (f.fat || 0), 0);
  const totalConsumed = Math.round(displayLog?.caloriesConsumed || 0);

  // Simple day workout logic: try to find the day name in the workout plan
  const dayName = format(parseISO(selectedDate), "EEEE");
  const getDayWorkout = () => {
    if (!profile.workoutPlan) return null;
    const plan = profile.workoutPlan;
    // Basic extraction logic: find "Monday:" etc.
    const dayRegex = new RegExp(`${dayName}:?\\s*(.*?)(?=(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|$))`, 'i');
    const match = plan.match(dayRegex);
    return match ? match[1].trim() : "Follow your weekly training rhythm.";
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="px-6 pt-16 pb-4 border-b border-border bg-card/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-[1rem] bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Flame size={20} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">AI Coach</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-60">
                {format(parseISO(selectedDate), "EEE, MMM d")}
              </p>
            </div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/profile")}
            className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          >
            <Settings size={22} />
          </motion.button>
        </div>

        <DaySelector />
      </div>

      {/* Dashboard Content */}
      <div className="px-6 py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CalorieRing consumed={totalConsumed} target={profile.dailyCaloriesTarget} />
        </motion.div>

        {/* Workout Card for the Day */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/coach")}
          className="w-full glass-card p-6 flex items-center justify-between group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-10 -mt-10" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Dumbbell size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{dayName} Goal</p>
              <p className="font-bold text-foreground text-sm line-clamp-1">{getDayWorkout()}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-primary transition-all relative z-10" />
        </motion.button>

        {/* Macros Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{isToday ? "Macros Target" : "Recorded Macros"}</h3>
            <div className={`px-2 py-1 rounded ${isToday ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-muted-foreground'} text-[10px] font-black uppercase tracking-widest`}>
              {isToday ? "Live" : "History"}
            </div>
          </div>

          <div className="space-y-6">
            <MacroBar label="Protein" current={totalProtein} target={profile.protein} colorClass="text-protein" />
            <MacroBar label="Carbs" current={totalCarbs} target={profile.carbs} colorClass="text-carbs" />
            <MacroBar label="Fat" current={totalFat} target={profile.fat} colorClass="text-fat" />
          </div>
        </motion.div>

        {isToday && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WaterTracker />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-8"
        >
          <FoodLog forceLog={foodLogs} isReadOnly={!isToday} />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
