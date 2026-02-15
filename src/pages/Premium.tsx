import { motion } from "framer-motion";
import { ChevronLeft, Zap, Check, Star, ShieldCheck, Brain, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Premium = () => {
    const navigate = useNavigate();

    const benefits = [
        { icon: Brain, title: "Advanced AI Analysis", desc: "Deeper insights into your metabolic trends." },
        { icon: Zap, title: "Custom Workout Plans", desc: "Dynamic routines that adapt to your progress." },
        { icon: ShieldCheck, title: "Priority AI Core", desc: "Zero-latency responses from Llama 3.3 70B." },
        { icon: Star, title: "Exclusive Meal Maps", desc: "Curated diet strategies for any cuisine." },
    ];

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="px-6 pt-16 pb-8 bg-gradient-to-br from-purple-900/40 via-background to-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px]" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px]" />

                <div className="relative z-10 flex flex-col items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="self-start p-2 rounded-xl bg-white/5 text-muted-foreground mb-8"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-purple-500/20 mb-6">
                        <Crown size={40} />
                    </div>

                    <h1 className="text-4xl font-black text-foreground tracking-tighter text-center">GO PREMIUM</h1>
                    <p className="text-muted-foreground text-center mt-2 max-w-[250px]">Unlock the full power of your AI Calorie Coach</p>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {benefits.map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={item.title}
                            className="glass-card p-5 flex items-start gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">{item.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="glass-card p-8 border-purple-500/30 bg-purple-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-4 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">Best Value</div>

                    <h2 className="text-2xl font-black text-foreground">PRO PLAN</h2>
                    <p className="text-sm text-muted-foreground mb-6">Billed annually at $120/year</p>

                    <div className="text-4xl font-black text-foreground mb-8">
                        $9.99<span className="text-lg text-muted-foreground font-medium">/month</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {['All Premium Features', 'Offline Mode', 'Family Sharing', 'Ad-Free Experience'].map(feature => (
                            <li key={feature} className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                                <Check size={16} className="text-purple-400" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 active:scale-95 transition-all">
                        Upgrade Now
                    </button>

                    <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold opacity-60">Terms & Conditions Apply</p>
                </div>
            </div>
        </div>
    );
};

export default Premium;
