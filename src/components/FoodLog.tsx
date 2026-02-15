import { motion } from "framer-motion";
import { Plus, Utensils } from "lucide-react";
import { useAppStore, FoodEntry } from "@/store/useAppStore";
import { useState } from "react";

interface FoodLogProps {
  forceLog?: FoodEntry[];
  isReadOnly?: boolean;
}

const FoodLog = ({ forceLog, isReadOnly = false }: FoodLogProps) => {
  const { todayLog, addFoodEntry } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "", serving: "" });

  const foodLogs = forceLog || todayLog.foodLogs;

  const handleAdd = () => {
    if (!form.name || !form.calories) return;
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      servingSize: form.serving || "1 serving",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    addFoodEntry(entry);
    setForm({ name: "", calories: "", protein: "", carbs: "", fat: "", serving: "" });
    setShowAdd(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-calories" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Food Log</h3>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Food
          </button>
        )}
      </div>

      {showAdd && !isReadOnly && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 space-y-3 p-4 bg-muted/50 rounded-xl"
        >
          <input
            placeholder="Food name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Calories"
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              placeholder="Serving size"
              value={form.serving}
              onChange={(e) => setForm({ ...form, serving: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="Protein (g)"
              type="number"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              placeholder="Carbs (g)"
              type="number"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              placeholder="Fat (g)"
              type="number"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Add Entry
          </button>
        </motion.div>
      )}

      {foodLogs.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">{isReadOnly ? "No food entries for this day" : "No food logged yet today"}</p>
      ) : (
        <div className="space-y-2">
          {foodLogs.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">{entry.servingSize} · {entry.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-calories">{entry.calories} kcal</p>
                <p className="text-xs text-muted-foreground">
                  P:{entry.protein} C:{entry.carbs} F:{entry.fat}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodLog;
