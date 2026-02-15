import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, UserProfile } from "@/store/useAppStore";
import {
  User, Target, Dumbbell, Calendar, Ruler,
  ChevronRight, ChevronLeft, Sparkles,
  TrendingDown, TrendingUp, Equal, Utensils,
  MapPin, Brain, Scale
} from "lucide-react";
import { generateHealthPlan } from "@/lib/ai";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

const STEPS = [
  { title: "Identity", icon: User },
  { title: "Gender", icon: User },
  { title: "Goal", icon: Target },
  { title: "Activity", icon: Dumbbell },
  { title: "Cuisine", icon: Utensils },
  { title: "Age", icon: Calendar },
  { title: "Body Stats", icon: Ruler },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setProfile, setOnboarded } = useAppStore();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    fullName: user?.fullName || "",
    gender: "",
    goal: "",
    workoutFrequency: "",
    birthDate: "",
    height: 170,
    weight: 70,
    preferredCuisine: "Mediterranean",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const canNext = () => {
    switch (step) {
      case 0: return !!data.fullName;
      case 1: return !!data.gender;
      case 2: return !!data.goal;
      case 3: return !!data.workoutFrequency;
      case 4: return !!data.preferredCuisine;
      case 5: return !!data.birthDate;
      case 6: return data.height > 0 && data.weight > 0;
      default: return false;
    }
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const age = data.birthDate
        ? Math.floor((Date.now() - new Date(data.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 25;

      // Real-time AI generation with Llama 3.3 70b via Groq
      const aiPlan = await generateHealthPlan({
        ...data,
        age
      });

      if (!aiPlan) throw new Error("AI failed to generate plan");

      const profile: UserProfile = {
        fullName: data.fullName,
        age: age,
        gender: data.gender,
        goal: data.goal,
        workoutFrequency: data.workoutFrequency,
        birthDate: data.birthDate,
        height: data.height,
        weight: data.weight,
        dailyCaloriesTarget: aiPlan.dailyCaloriesTarget,
        protein: aiPlan.protein,
        carbs: aiPlan.carbs,
        fat: aiPlan.fat,
        preferredCuisine: data.preferredCuisine,
        waterLiters: Math.round((data.weight * 0.033) * 10) / 10,
        dietStrategy: aiPlan.dietStrategy,
        workoutPlan: aiPlan.workoutPlan,
      };

      setProfile(profile);
      setOnboarded(true);
      toast.success("AI Coach: Plan Generated!", {
        description: aiPlan.tip,
        icon: <Brain size={16} className="text-primary" />,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("AI connection lost. Using fallback targets.");
      // Fallback if AI fails
      handleFallbackFinish();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFallbackFinish = () => {
    const age = data.birthDate
      ? Math.floor((Date.now() - new Date(data.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : 25;

    const profile: UserProfile = {
      fullName: data.fullName,
      age: age,
      gender: data.gender,
      goal: data.goal,
      workoutFrequency: data.workoutFrequency,
      birthDate: data.birthDate,
      height: data.height,
      weight: data.weight,
      dailyCaloriesTarget: 2200,
      protein: 150,
      carbs: 250,
      fat: 70,
      preferredCuisine: data.preferredCuisine,
      waterLiters: 2.5,
      dietStrategy: "Focus on whole foods, lean proteins, and complex carbohydrates. Stay hydrated.",
      workoutPlan: "30 minutes of moderate activity 3-5 times a week.",
    };
    setProfile(profile);
    setOnboarded(true);
    navigate("/");
  };

  const Option = ({ value, current, onClick, icon: Icon, label }: {
    value: string; current: string; onClick: (v: string) => void;
    icon?: React.ComponentType<{ className?: string }>; label: string;
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(value)}
      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all w-full text-left ${current === value
        ? "border-primary bg-primary/10 text-foreground shadow-lg shadow-primary/10"
        : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/20"
        }`}
    >
      {Icon && <Icon className={`w-6 h-6 ${current === value ? "text-primary" : ""}`} />}
      <span className="font-bold text-lg">{label}</span>
    </motion.button>
  );

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">AI Coach Thinking...</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xs mx-auto">Connecting to Llama 3.3 70B to craft your scientific nutrition plan.</p>

          <div className="w-full max-w-xs mx-auto bg-white/5 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-primary shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-12">
      {/* Progress */}
      <div className="px-8 mb-12">
        <div className="flex gap-2 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/5"
                }`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Discovery Phase</p>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{step + 1} / {STEPS.length}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter leading-tight">First, what's<br />your name?</h1>
                  <p className="text-muted-foreground mt-3 text-lg">Your AI Coach likes to be personal.</p>
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="w-full bg-white/5 border-2 border-white/5 rounded-[2rem] px-8 py-6 text-2xl font-bold text-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter">Your gender?</h1>
                  <p className="text-muted-foreground mt-3 text-lg">Metabolism varies by biological factors.</p>
                </div>
                <div className="space-y-4">
                  <Option value="male" current={data.gender} onClick={(v) => setData({ ...data, gender: v })} icon={User} label="Male" />
                  <Option value="female" current={data.gender} onClick={(v) => setData({ ...data, gender: v })} icon={User} label="Female" />
                  <Option value="other" current={data.gender} onClick={(v) => setData({ ...data, gender: v })} icon={User} label="Other" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter">What is your<br />primary goal?</h1>
                  <p className="text-muted-foreground mt-3 text-lg">Targets change based on your objective.</p>
                </div>
                <div className="space-y-4">
                  <Option value="lose" current={data.goal} onClick={(v) => setData({ ...data, goal: v })} icon={TrendingDown} label="Lose Weight" />
                  <Option value="maintain" current={data.goal} onClick={(v) => setData({ ...data, goal: v })} icon={Equal} label="Maintain Weight" />
                  <Option value="gain" current={data.goal} onClick={(v) => setData({ ...data, goal: v })} icon={TrendingUp} label="Gain Muscle" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter">Activity level?</h1>
                  <p className="text-muted-foreground mt-3 text-lg">How often do you push yourself?</p>
                </div>
                <div className="space-y-4">
                  <Option value="sedentary" current={data.workoutFrequency} onClick={(v) => setData({ ...data, workoutFrequency: v })} icon={Dumbbell} label="Sedentary (No exercise)" />
                  <Option value="light" current={data.workoutFrequency} onClick={(v) => setData({ ...data, workoutFrequency: v })} icon={Dumbbell} label="Light (1-2 days/week)" />
                  <Option value="moderate" current={data.workoutFrequency} onClick={(v) => setData({ ...data, workoutFrequency: v })} icon={Dumbbell} label="Moderate (3-5 days/week)" />
                  <Option value="active" current={data.workoutFrequency} onClick={(v) => setData({ ...data, workoutFrequency: v })} icon={Dumbbell} label="Very Active (Every day)" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter">Favorite cuisine?</h1>
                  <p className="text-muted-foreground mt-3 text-lg">AI will tailor meal suggestions to this.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {["Mediterranean", "Asian", "Mexican", "American", "Indian", "Italian"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setData({ ...data, preferredCuisine: c })}
                      className={`p-5 rounded-2xl border-2 font-bold transition-all ${data.preferredCuisine === c
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-white/5 bg-white/5 text-muted-foreground"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter">Date of birth?</h1>
                  <p className="text-muted-foreground mt-3 text-lg">Age impacts your metabolic ceiling.</p>
                </div>
                <input
                  type="date"
                  value={data.birthDate}
                  onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                  className="w-full bg-white/5 border-2 border-white/5 rounded-[2rem] px-8 py-6 text-2xl font-bold text-foreground focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                />
              </div>
            )}

            {step === 6 && (
              <div className="space-y-10">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tighter">Current stats</h1>
                  <p className="text-muted-foreground mt-3 text-lg">Final details for the AI calculation.</p>
                </div>
                <div className="space-y-8">
                  <div className="glass-card p-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">Height (cm)</label>
                    <div className="flex items-center gap-6">
                      <Ruler className="text-primary" size={32} />
                      <input
                        type="number"
                        value={data.height}
                        onChange={(e) => setData({ ...data, height: Number(e.target.value) })}
                        className="flex-1 bg-transparent border-none text-4xl font-black text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="glass-card p-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">Weight (kg)</label>
                    <div className="flex items-center gap-6">
                      <Scale className="text-primary" size={32} />
                      <input
                        type="number"
                        value={data.weight}
                        onChange={(e) => setData({ ...data, weight: Number(e.target.value) })}
                        className="flex-1 bg-transparent border-none text-4xl font-black text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-8 pb-12 flex gap-4">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronLeft size={28} />
          </button>
        )}
        <button
          onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : handleFinish())}
          disabled={!canNext()}
          className="flex-1 h-16 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 disabled:opacity-20 transition-all flex items-center justify-center gap-3"
        >
          {step === STEPS.length - 1 ? (
            <>
              Generate Plan
              <Sparkles size={20} />
            </>
          ) : (
            <>
              Continue
              <ChevronRight size={20} strokeWidth={3} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default Onboarding;
