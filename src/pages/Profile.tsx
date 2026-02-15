import { motion } from "framer-motion";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useAppStore } from "@/store/useAppStore";
import {
    Settings,
    CreditCard,
    Bell,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Target,
    Scale,
    Calendar,
    Utensils,
    Dumbbell,
    BarChart2,
    Save,
    X,
    Edit2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { profile, setProfile } = useAppStore();
    const navigate = useNavigate();
    const [lastSync, setLastSync] = useState<string>("Initializing...");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    useEffect(() => {
        setLastSync(new Date().toLocaleTimeString());
        if (profile) setEditData({ ...profile });
    }, [profile]);

    const handleSave = () => {
        if (editData) {
            setProfile(editData);
            setIsEditing(false);
        }
    };

    const menuItems = [
        { icon: Settings, label: "App Settings", color: "text-blue-400", bg: "bg-blue-400/10", path: "/settings" },
        { icon: Bell, label: "Notifications", color: "text-orange-400", bg: "bg-orange-400/10", path: "/notifications" },
        { icon: CreditCard, label: "Premium Plan", color: "text-purple-400", bg: "bg-purple-400/10", badge: "Active", path: "/premium" },
        { icon: Shield, label: "Privacy & Security", color: "text-emerald-400", bg: "bg-emerald-400/10", path: "/privacy" },
        { icon: HelpCircle, label: "Support Center", color: "text-muted-foreground", bg: "bg-white/5", path: "/support" },
    ];

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="bg-gradient-to-b from-card to-background px-6 pt-16 pb-12 border-b border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent)]" />

                <div className="flex flex-col items-center relative z-10">
                    <div className="relative mb-6">
                        <div className="p-1 rounded-full border-4 border-primary/20 bg-primary/5">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-28 h-28 shadow-2xl",
                                    }
                                }}
                            />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute bottom-1 right-1 bg-primary text-black p-2 rounded-full border-4 border-background shadow-lg"
                        >
                            <Target size={16} strokeWidth={3} />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{profile?.fullName || user?.fullName || "Aesthetic User"}</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">{user?.primaryEmailAddress?.emailAddress}</p>

                    {/* Detailed User Stats */}
                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                        <div className="px-3 py-1 bg-secondary border border-border rounded-full flex items-center gap-2">
                            <Calendar size={12} className="text-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{profile?.age} Years</span>
                        </div>
                        <div className="px-3 py-1 bg-secondary border border-border rounded-full flex items-center gap-2">
                            <Utensils size={12} className="text-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{profile?.preferredCuisine}</span>
                        </div>
                        <div className="px-3 py-1 bg-secondary border border-border rounded-full flex items-center gap-2">
                            <Dumbbell size={12} className="text-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{profile?.workoutFrequency}</span>
                        </div>
                    </div>

                    {/* Firebase Sync Indicator */}
                    <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Firebase Live Sync: {lastSync}</span>
                    </div>

                    <div className="mt-8 flex gap-4 w-full max-w-sm">
                        <div className="flex-1 glass-card p-4 text-center border-border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 opacity-60">Daily Goal</p>
                            <p className="text-lg font-black text-foreground">{profile?.dailyCaloriesTarget || 2000} <span className="text-xs font-normal text-muted-foreground">kcal</span></p>
                        </div>
                        <div className="flex-1 glass-card p-4 text-center border-border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 opacity-60">Current Weight</p>
                            <p className="text-lg font-black text-foreground">{profile?.weight || 70} <span className="text-xs font-normal text-muted-foreground">kg</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-8 space-y-6">
                {/* Real-time Controls */}
                <div className="space-y-4">
                    <button
                        onClick={() => navigate("/analytics")}
                        className="w-full glass-card p-5 flex items-center justify-between group hover:bg-primary/5 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-calories/10 flex items-center justify-center text-calories shadow-inner">
                                <BarChart2 size={22} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-foreground">Detailed Analytics</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">View History & Trends</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </button>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="w-full glass-card p-5 flex items-center justify-between group hover:bg-primary/5 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                <Edit2 size={22} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-foreground">Update Requirements</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Manage Weight & Goals</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </button>
                </div>

                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 border-primary/20 space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-black tracking-tighter uppercase">Edit Profile Data</h3>
                            <button onClick={() => setIsEditing(false)} className="text-muted-foreground"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Current Weight (kg)</label>
                                <input
                                    type="number"
                                    value={editData?.weight}
                                    onChange={(e) => setEditData({ ...editData, weight: Number(e.target.value) })}
                                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-lg font-bold text-foreground focus:border-primary/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Daily Calorie Target</label>
                                <input
                                    type="number"
                                    value={editData?.dailyCaloriesTarget}
                                    onChange={(e) => setEditData({ ...editData, dailyCaloriesTarget: Number(e.target.value) })}
                                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-lg font-bold text-foreground focus:border-primary/50 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 h-12 rounded-xl bg-white/5 font-bold text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 h-12 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                            >
                                <Save size={16} />
                                Sync Updates
                            </button>
                        </div>
                    </motion.div>
                )}

                <div className="glass-card overflow-hidden">
                    {menuItems.map((item, index) => (
                        <motion.button
                            onClick={() => navigate(item.path)}
                            whileTap={{ backgroundColor: "var(--secondary)" }}
                            key={item.label}
                            className={`w-full flex items-center justify-between p-5 ${index !== menuItems.length - 1 ? 'border-b border-border' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-inner`}>
                                    <item.icon size={22} />
                                </div>
                                <span className="font-bold text-foreground/90">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">
                                        {item.badge}
                                    </span>
                                )}
                                <ChevronRight size={18} className="text-muted-foreground/40" />
                            </div>
                        </motion.button>
                    ))}
                </div>

                <button
                    onClick={() => signOut(() => navigate("/login"))}
                    className="w-full bg-destructive/10 rounded-[1.5rem] p-5 flex items-center justify-center gap-3 text-destructive font-black border border-destructive/20 shadow-lg shadow-destructive/5 active:scale-[0.98] transition-all"
                >
                    <LogOut size={22} />
                    Sign Out
                </button>

                <div className="text-center pt-8">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">
                        AI Calorie Coach Premium v1.0.4
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
