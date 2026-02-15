import { motion } from "framer-motion";
import { ChevronLeft, Bell, Clock, Coffee, Sparkles, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Notifications = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        reminders: true,
        aiCoach: true,
        water: false,
        summary: true
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="px-6 pt-16 pb-8 border-b border-white/5 bg-card/20 backdrop-blur-xl sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase">Notifications</h1>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Manage your alerts</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="glass-card p-6 bg-primary/5 border-primary/10 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-primary" size={20} />
                        <h3 className="font-bold text-foreground">AI Coach Wisdom</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Stay motivated with real-time insights and reminders to log your food throughout the day.
                    </p>
                </div>

                <div className="space-y-4">
                    <NotificationToggle
                        icon={Clock}
                        label="Meal Reminders"
                        description="Alerts at breakfast, lunch, and dinner"
                        isActive={settings.reminders}
                        onToggle={() => toggle('reminders')}
                    />
                    <NotificationToggle
                        icon={MessageSquare}
                        label="AI Coach Motivation"
                        description="Real-time tips and progress alerts"
                        isActive={settings.aiCoach}
                        onToggle={() => toggle('aiCoach')}
                    />
                    <NotificationToggle
                        icon={Coffee}
                        label="Water Tracking"
                        description="Gentle nudges to stay hydrated"
                        isActive={settings.water}
                        onToggle={() => toggle('water')}
                    />
                    <NotificationToggle
                        icon={Bell}
                        label="Daily Summary"
                        description="EndOfDay review of your nutrition"
                        isActive={settings.summary}
                        onToggle={() => toggle('summary')}
                    />
                </div>

                <div className="pt-8 opacity-40 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Notification settings are synced with your metabolic profile</p>
                </div>
            </div>
        </div>
    );
};

const NotificationToggle = ({ icon: Icon, label, description, isActive, onToggle }: any) => (
    <button
        onClick={onToggle}
        className="w-full glass-card p-5 flex items-center justify-between group transition-all"
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                <Icon size={22} />
            </div>
            <div className="text-left">
                <p className={`font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                <p className="text-xs text-muted-foreground opacity-60">{description}</p>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isActive ? 'bg-primary' : 'bg-white/10'}`}>
            <motion.div
                animate={{ x: isActive ? 26 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
            />
        </div>
    </button>
);

export default Notifications;
