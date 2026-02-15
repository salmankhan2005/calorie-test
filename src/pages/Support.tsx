import { motion } from "framer-motion";
import { ChevronLeft, HelpCircle, MessageSquare, Mail, BookOpen, ExternalLink, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Support = () => {
    const navigate = useNavigate();

    const faqs = [
        { q: "How are my calories calculated?", a: "We use the Mifflin-St Jeor equation combined with AI analysis of your specific activity level." },
        { q: "Is the food database accurate?", a: "Yes, our AI cross-references visual data with validated nutritional databases for high accuracy." },
        { q: "How do I sync with Apple Health?", a: "This feature is currently in Beta and will be released in the v1.1 update." },
    ];

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
                        <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase">Support</h1>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Help & Resources</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="text-primary" size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contact Us</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => toast.success("Opening chat...")}
                            className="p-5 glass-card flex flex-col items-center gap-3 active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <MessageCircle size={24} />
                            </div>
                            <span className="font-bold text-sm">Live Chat</span>
                        </button>
                        <button
                            onClick={() => window.location.href = "mailto:support@aicaloriecoach.com"}
                            className="p-5 glass-card flex flex-col items-center gap-3 active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground">
                                <Mail size={24} />
                            </div>
                            <span className="font-bold text-sm">Email</span>
                        </button>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="text-primary" size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">FAQs</h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map(faq => (
                            <div key={faq.q} className="glass-card p-5 space-y-2">
                                <p className="font-bold text-foreground">{faq.q}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="pt-4">
                    <button className="w-full h-14 glass-card flex items-center justify-center gap-2 font-bold text-muted-foreground hover:text-foreground transition-all">
                        View Full Documentation
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
