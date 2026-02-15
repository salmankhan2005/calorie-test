import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts";
import { useAppStore } from "@/store/useAppStore";
import { TrendingUp, Award, Calendar, Zap } from "lucide-react";

const Analytics = () => {
    const { profile, todayLog, history } = useAppStore();

    const totalProtein = todayLog.foodLogs.reduce((s, f) => s + f.protein, 0);
    const totalCarbs = todayLog.foodLogs.reduce((s, f) => s + f.carbs, 0);
    const totalFat = todayLog.foodLogs.reduce((s, f) => s + f.fat, 0);
    const totalCalories = todayLog.caloriesConsumed;

    // Map history to chart data
    const chartData = [...history]
        .reverse() // Correct chronological order
        .map(h => ({
            name: new Date(h.date).toLocaleDateString("en-US", { weekday: "short" }),
            calories: h.caloriesConsumed,
            protein: h.foodLogs.reduce((s, f) => s + f.protein, 0),
            carbs: h.foodLogs.reduce((s, f) => s + f.carbs, 0),
            fat: h.foodLogs.reduce((s, f) => s + f.fat, 0),
        }));

    // Fallback if history is empty (new users)
    if (chartData.length === 0) {
        chartData.push({
            name: "Today",
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat
        });
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="px-6 pt-12 pb-8 border-b border-white/5">
                <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-foreground"
                >
                    Insights
                    <span className="block text-sm font-medium text-muted-foreground mt-1">Real-time health analysis</span>
                </motion.h1>
            </div>

            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-5 flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Weekly Accuracy</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">94%</h3>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-5 flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-3">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Avg. Deficit</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">320 <span className="text-sm font-normal text-muted-foreground">kcal</span></h3>
                        </div>
                    </motion.div>
                </div>

                {/* Calorie Goal Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg text-foreground">Calorie History</h3>
                        <span className="text-[10px] font-bold bg-white/5 text-muted-foreground px-2 py-1 rounded-lg uppercase tracking-wider">7 Days</span>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0c0e12", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5)" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="calories"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCalories)"
                                />
                                {profile && (
                                    <Line
                                        type="monotone"
                                        dataKey={() => profile.dailyCaloriesTarget}
                                        stroke="#ef4444"
                                        strokeDasharray="8 8"
                                        dot={false}
                                        name="Target"
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Macros Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg text-foreground">Macros Breakdown</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Protein</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Carbs</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0c0e12", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}
                                />
                                <Bar dataKey="protein" fill="#10b981" radius={[6, 6, 0, 0]} barSize={12} />
                                <Bar dataKey="carbs" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Achievements Section */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[2rem] text-white shadow-2xl overflow-hidden relative border border-white/10 premium-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/4 -translate-y-1/4">
                        <Award size={200} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 px-2 bg-white/20 backdrop-blur-md rounded-lg">
                                <Calendar size={14} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Streak Reward</span>
                        </div>
                        <h4 className="text-2xl font-bold mb-2">5 Day Streak!</h4>
                        <p className="text-emerald-50 text-base opacity-80 leading-relaxed max-w-[200px]">
                            You've hit your protein target 5 days in a row.
                        </p>
                        <button className="mt-6 bg-white text-emerald-900 px-6 py-3 rounded-2xl text-sm font-black shadow-xl active:scale-95 transition-transform">
                            View All Badges
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
