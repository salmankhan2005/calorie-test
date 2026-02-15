import { motion } from "framer-motion";
import { ChevronLeft, Moon, Sun, Ruler, Layout, Globe, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

const AppSettings = () => {
    const navigate = useNavigate();
    const { theme, setTheme, units, setUnits } = useAppStore();

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <div className="px-6 pt-16 pb-8 border-b border-border bg-card/20 backdrop-blur-xl sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase">App Settings</h1>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Personalize your experience</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Theme Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sun className="text-primary" size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Appearance</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'light'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted text-muted-foreground hover:border-border/50'
                                }`}
                        >
                            <Sun size={32} strokeWidth={theme === 'light' ? 2.5 : 2} />
                            <span className="font-bold text-sm uppercase tracking-widest">Light</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme === 'dark'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted text-muted-foreground hover:border-border/50'
                                }`}
                        >
                            <Moon size={32} strokeWidth={theme === 'dark' ? 2.5 : 2} />
                            <span className="font-bold text-sm uppercase tracking-widest">Dark</span>
                        </button>
                    </div>
                </section>

                {/* Units Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Ruler className="text-primary" size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Measurement Units</h3>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <button
                            onClick={() => setUnits('metric')}
                            className={`w-full p-5 flex items-center justify-between border-b border-border transition-all ${units === 'metric' ? 'bg-primary/5' : ''}`}
                        >
                            <div className="flex flex-col text-left">
                                <span className={`font-bold ${units === 'metric' ? 'text-primary' : 'text-foreground'}`}>Metric System</span>
                                <span className="text-[10px] text-muted-foreground uppercase">cm, kg, ml</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${units === 'metric' ? 'border-primary bg-primary shadow-lg shadow-primary/20' : 'border-white/10'}`}>
                                {units === 'metric' && <div className="w-2 h-2 rounded-full bg-black" />}
                            </div>
                        </button>
                        <button
                            onClick={() => setUnits('imperial')}
                            className={`w-full p-5 flex items-center justify-between transition-all ${units === 'imperial' ? 'bg-primary/5' : ''}`}
                        >
                            <div className="flex flex-col text-left">
                                <span className={`font-bold ${units === 'imperial' ? 'text-primary' : 'text-foreground'}`}>Imperial System</span>
                                <span className="text-[10px] text-muted-foreground uppercase">ft, lbs, oz</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${units === 'imperial' ? 'border-primary bg-primary shadow-lg shadow-primary/20' : 'border-white/10'}`}>
                                {units === 'imperial' && <div className="w-2 h-2 rounded-full bg-black" />}
                            </div>
                        </button>
                    </div>
                </section>

                {/* Other Options */}
                <section className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4 p-5 glass-card opacity-50 pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Globe size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold">Language</p>
                            <p className="text-xs text-muted-foreground">English (US)</p>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-muted px-2 py-1 rounded">Soon</span>
                    </div>

                    <div className="flex items-center gap-4 p-5 glass-card opacity-50 pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Monitor size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold">Haptic Feedback</p>
                            <p className="text-xs text-muted-foreground">Enabled</p>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-1 rounded">Beta</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AppSettings;
