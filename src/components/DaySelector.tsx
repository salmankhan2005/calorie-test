import { motion } from "framer-motion";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { useAppStore } from "@/store/useAppStore";

const DaySelector = () => {
    const { selectedDate, setSelectedDate } = useAppStore();
    const today = startOfToday();

    // Last 7 days
    const days = Array.from({ length: 7 }).map((_, i) => addDays(today, -i)).reverse();

    return (
        <div className="flex gap-3 overflow-x-auto px-6 py-4 no-scrollbar">
            {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isSelected = selectedDate === dateStr;
                const isToday = isSameDay(day, today);

                return (
                    <motion.button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center min-w-[55px] p-3 rounded-2xl border transition-all ${isSelected
                                ? "bg-primary border-primary text-black shadow-lg shadow-primary/20"
                                : "bg-secondary/50 border-border text-muted-foreground hover:border-border/50"
                            }`}
                    >
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? "text-black/60" : "text-muted-foreground"}`}>
                            {format(day, "eee")}
                        </span>
                        <span className="text-sm font-black">
                            {format(day, "d")}
                        </span>
                        {isToday && !isSelected && (
                            <div className="w-1 h-1 rounded-full bg-primary mt-1" />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default DaySelector;
