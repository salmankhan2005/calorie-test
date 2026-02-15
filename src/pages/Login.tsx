import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Coffee, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
            {/* Decorative Side Panel - Premium Gradient */}
            <div className="w-full md:w-5/12 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -ml-48 -mb-48 blur-[100px]" />

                <div className="relative z-10 flex items-center space-x-4">
                    <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                        <Coffee className="text-primary fill-primary/20" size={28} />
                    </div>
                    <span className="text-white font-black text-2xl tracking-tight">AI Coach</span>
                </div>

                <div className="relative z-10 my-16 md:my-0">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter"
                    >
                        Track with<br />
                        Intelligence.<br />
                        <span className="text-primary">Live Better.</span>
                    </motion.h2>
                    <p className="text-white/60 mt-8 text-xl max-w-sm leading-relaxed font-medium">
                        Personalized nutrition coaching powered by real-time behavioral analysis.
                    </p>
                </div>

                <div className="relative z-10 pt-12 border-t border-white/10 hidden md:block">
                    <div className="flex items-center space-x-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-black text-white shadow-2xl overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover opacity-80" />
                                </div>
                            ))}
                        </div>
                        <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Trusted by 10k+ athletes</p>
                    </div>
                </div>
            </div>

            {/* Login Content Area - Centered & Dark */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-16 relative bg-[#05070a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent)] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    <div className="mb-12 md:hidden">
                        <Link to="/" className="flex items-center text-primary font-black uppercase tracking-widest text-xs gap-2">
                            <ChevronLeft size={16} strokeWidth={3} />
                            <span>Back</span>
                        </Link>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-muted-foreground text-lg">Enter your details to access your dashboard.</p>
                    </div>

                    <div className="clerk-container premium-auth-box">
                        <SignIn
                            appearance={{
                                baseTheme: undefined,
                                variables: {
                                    colorPrimary: "#10b981",
                                    colorBackground: "#0c0e12",
                                    colorText: "#ffffff",
                                    colorTextSecondary: "#94a3b8",
                                    colorInputBackground: "#1e293b",
                                    colorInputText: "#ffffff",
                                    borderRadius: "1rem",
                                },
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-[#0c0e12] border border-white/5 shadow-none p-0 w-full",
                                    header: "hidden",
                                    socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 transition-all py-3 text-sm font-bold text-white",
                                    socialButtonsBlockButtonText: "text-white font-bold",
                                    dividerLine: "bg-white/10",
                                    dividerText: "text-muted-foreground uppercase text-[10px] font-black tracking-widest",
                                    formFieldLabel: "text-muted-foreground uppercase text-[10px] font-black tracking-widest mb-2",
                                    formFieldInput: "bg-white/5 border-white/10 text-white rounded-xl py-3 focus:ring-primary/50",
                                    formButtonPrimary: "bg-primary hover:bg-emerald-600 text-black py-4 transition-all text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-4",
                                    footerActionText: "text-muted-foreground font-bold",
                                    footerActionLink: "text-primary hover:text-emerald-400 font-black",
                                    identityPreviewText: "text-white",
                                    identityPreviewEditButtonIcon: "text-primary",
                                }
                            }}
                            routing="hash"
                        />
                    </div>

                    <p className="mt-12 text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-30">
                        Securely encrypted by Clerk Auth
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
