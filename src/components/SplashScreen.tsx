import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 overflow-hidden">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-8"
            >
                <div className="absolute inset-0 blur-3xl opacity-50 bg-white rounded-full animate-pulse" />
                <div className="relative p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                    <Coffee size={64} className="text-white fill-white/20" />
                </div>
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl font-bold text-white tracking-tight mb-2"
            >
                AI Calorie Coach
            </motion.h1>

            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-white/80 text-lg font-medium"
            >
                Empowering your health journey
            </motion.p>

            <div className="mt-12 flex space-x-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.8 + i * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 0.5
                        }}
                        className="w-3 h-3 bg-white/60 rounded-full"
                    />
                ))}
            </div>

            <div className="absolute bottom-12 left-0 right-0 text-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.2 }}
                    className="text-white text-xs uppercase tracking-[0.2em]"
                >
                    Loading Premium Experience
                </motion.span>
            </div>
        </div>
    );
};
