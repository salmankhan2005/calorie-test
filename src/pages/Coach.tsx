import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Utensils, Dumbbell, RefreshCcw, Zap, Loader2 } from "lucide-react";
import { useAppStore, UserProfile } from "@/store/useAppStore";
import { generateHealthPlan } from "@/lib/ai";
import { toast } from "sonner";

const Coach = () => {
    const { profile, setProfile } = useAppStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (!profile) return null;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const aiPlan = await generateHealthPlan(profile);
            if (aiPlan) {
                const updatedProfile: UserProfile = {
                    ...profile,
                    dailyCaloriesTarget: aiPlan.dailyCaloriesTarget,
                    protein: aiPlan.protein,
                    carbs: aiPlan.carbs,
                    fat: aiPlan.fat,
                    dietStrategy: aiPlan.dietStrategy,
                    workoutPlan: aiPlan.workoutPlan,
                };
                setProfile(updatedProfile);
                toast.success("Health Solution Updated!", {
                    icon: <Zap size={16} className="text-primary" />,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update solution.");
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <div className="px-6 pt-16 pb-8 border-b border-white/5 bg-card/20 backdrop-blur-xl sticky top-0 z-40">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
                            <Brain size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground tracking-tighter">AI Health Solution</h1>
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] opacity-60">Personalized for {profile.fullName}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50"
                    >
                        {isRefreshing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
                    </button>
                </div>
            </div>

            <div className="px-6 py-8 space-y-8">
                {/* AI Tip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 bg-gradient-to-br from-primary/20 to-transparent border-primary/20"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="text-primary" size={20} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Wisdom</h3>
                    </div>
                    <p className="text-lg font-bold text-foreground leading-snug">
                        "Your metabolism is like a precision engine. Treat it with the right fuel and the right movement."
                    </p>
                </motion.div>

                {/* Nutrition Solution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Utensils className="text-primary" size={24} />
                            <h2 className="text-2xl font-black tracking-tighter">Nutrition Strategy</h2>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">Diet Solution</div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-foreground leading-relaxed">
                            {profile.dietStrategy || "Your personalized nutrition strategy is being analyzed. Please complete onboarding for the full experience."}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-protein/10 p-4 rounded-2xl border border-protein/20 text-center">
                            <p className="text-[10px] font-black text-protein uppercase mb-1">Protein</p>
                            <p className="text-xl font-black">{profile.protein}g</p>
                        </div>
                        <div className="bg-carbs/10 p-4 rounded-2xl border border-carbs/20 text-center">
                            <p className="text-[10px] font-black text-carbs uppercase mb-1">Carbs</p>
                            <p className="text-xl font-black">{profile.carbs}g</p>
                        </div>
                        <div className="bg-fat/10 p-4 rounded-2xl border border-fat/20 text-center">
                            <p className="text-[10px] font-black text-fat uppercase mb-1">Fat</p>
                            <p className="text-xl font-black">{profile.fat}g</p>
                        </div>
                    </div>
                </motion.div>

                {/* Workout Solution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Dumbbell className="text-primary" size={24} />
                            <h2 className="text-2xl font-black tracking-tighter">Workout Plan</h2>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">Training Solution</div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {profile.workoutPlan || "A weekly exercise routine tailored to your goals is being generated by the AI."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Goal: {profile.goal.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">{profile.workoutFrequency.toUpperCase()} Intensity</p>
                        </div>
                    </div>
                </motion.div>

                {/* Recommendation Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center space-y-2 opacity-50"
                >
                    <Brain className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Scientific Health Audit</p>
                    <p className="text-xs px-10">Based on Llama 3.3 70B analysis of your metabolic profile.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Coach;
