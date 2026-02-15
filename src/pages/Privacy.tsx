import { motion } from "framer-motion";
import { ChevronLeft, Shield, Lock, Eye, Download, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Privacy = () => {
    const navigate = useNavigate();

    const handleDataAction = (action: string) => {
        toast.info(`${action} requested`, {
            description: "We are processing your data request. You will receive an email shortly."
        });
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
                        <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase transition-all">Privacy</h1>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Manage your data</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="text-emerald-400" size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Security Controls</h3>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="p-5 flex items-center justify-between border-b border-white/5">
                            <div>
                                <p className="font-bold text-foreground">Encrypted Storage</p>
                                <p className="text-xs text-muted-foreground">Your biometric data is end-to-end encrypted.</p>
                            </div>
                            <Shield className="text-emerald-400" size={20} />
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-foreground">Cloud Sync</p>
                                <p className="text-xs text-muted-foreground">Secure backups on Firebase servers.</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Eye size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-primary" size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Data Management</h3>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleDataAction("Data Download")}
                            className="w-full glass-card p-5 flex items-center gap-4 hover:bg-white/5 transition-all text-left"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Download size={20} />
                            </div>
                            <div>
                                <p className="font-bold">Export My Data</p>
                                <p className="text-xs text-muted-foreground">Download a JSON record of all meal logs.</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleDataAction("Account Deletion")}
                            className="w-full glass-card p-5 flex items-center gap-4 hover:bg-destructive/5 transition-all text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive group-hover:scale-110 transition-transform">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-destructive">Delete Account</p>
                                <p className="text-xs text-muted-foreground">Permanently remove all your data from our servers.</p>
                            </div>
                        </button>
                    </div>
                </section>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 opacity-60">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">AI Data Policy</h4>
                    <p className="text-xs leading-relaxed">
                        We use limited behavioral data to improve the AI Calorie Coach responses. Your personal identity is never shared with third-party model providers like Groq.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
