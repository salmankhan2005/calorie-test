import { Home, BarChart2, Plus, User, Brain, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Search, label: "Search", path: "/search" },
        { icon: Plus, label: "Add", path: "/add", isAction: true },
        { icon: Brain, label: "Coach", path: "/coach" },
        { icon: BarChart2, label: "Stats", path: "/analytics" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-6 py-3 pb-8 z-50">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    if (item.isAction) {
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="relative -top-8 bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 text-white transform hover:scale-110 active:scale-95 transition-all"
                            >
                                <item.icon size={28} />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className={`p-1 rounded-xl transition-all ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-[-12px] w-1 h-1 bg-emerald-600 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
