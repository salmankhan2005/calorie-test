import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, Plus, Zap, Star, Camera, Brain, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { detectFoodFromImage, searchFoodAI } from "@/lib/ai";
import { useRef } from "react";

const MOCK_FOODS = [
    { id: "1", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
    { id: "2", name: "Brown Rice", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving: "100g" },
    { id: "3", name: "Avocado", calories: 160, protein: 2, carbs: 8.5, fat: 14.7, serving: "100g" },
    { id: "4", name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: "100g" },
    { id: "5", name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, serving: "100g" },
];

const FoodSearch = () => {
    const [query, setQuery] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isSearchingAI, setIsSearchingAI] = useState(false);
    const [aiResults, setAiResults] = useState<any[]>([]);
    const [scannedFood, setScannedFood] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { addFoodEntry } = useAppStore();

    const filteredFoods = MOCK_FOODS.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setScannedFood(null);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const result = await detectFoodFromImage(base64);

                if (result) {
                    const mappedResult = {
                        name: result.name,
                        calories: result.calories,
                        protein: result.protein,
                        carbs: result.carbs,
                        fat: result.fat,
                        servingSize: result.serving || "100g",
                        id: Date.now().toString()
                    };
                    setScannedFood(mappedResult);
                    toast.success("AI Detected the food!", {
                        description: `Identified: ${result.name}`,
                        icon: <Brain size={16} className="text-primary" />,
                    });
                } else {
                    toast.error("Could not identify the food", {
                        description: "Please try with a clearer photo.",
                    });
                }
                setIsScanning(false);
            };
        } catch (error) {
            console.error(error);
            setIsScanning(false);
            toast.error("Error processing image");
        }
    };

    const handleAISearch = async () => {
        if (!query.trim()) return;
        setIsSearchingAI(true);
        setAiResults([]);
        try {
            const results = await searchFoodAI(query);
            setAiResults(results.map((r: any) => ({ ...r, id: Math.random().toString() })));
            if (results.length > 0) {
                toast.success(`AI found ${results.length} matches!`);
            } else {
                toast.error("AI couldn't find matching food.");
            }
        } catch (error) {
            console.error(error);
            toast.error("AI Search failed.");
        } finally {
            setIsSearchingAI(false);
        }
    };

    const handleAdd = (food: any) => {
        addFoodEntry({
            ...food,
            servingSize: food.servingSize || food.serving || "100g",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        toast.success(`Added ${food.name}!`, {
            description: "Successfully logged to your daily intake.",
            icon: <Zap size={16} className="text-primary" />,
        });

        // Return to home page after a short delay so they see the toast
        setTimeout(() => {
            navigate("/");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            <div className="bg-card/40 backdrop-blur-xl px-6 pt-16 pb-8 border-b border-white/5 sticky top-0 z-40">
                <div className="flex items-center gap-5 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-foreground border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-foreground">Add Food</h1>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a food..."
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none font-medium text-lg text-foreground placeholder:text-muted-foreground/50"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAISearch}
                            disabled={isSearchingAI || !query}
                            className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isSearchingAI ? <Loader2 size={18} className="animate-spin" /> : <Brain size={20} />}
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                            className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center border border-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isScanning ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            <div className="p-6">
                <AnimatePresence>
                    {scannedFood && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Brain size={14} /> AI Detection Result
                                </h3>
                                <button
                                    onClick={() => setScannedFood(null)}
                                    className="text-[10px] text-muted-foreground hover:text-foreground font-bold"
                                >
                                    CLEAR
                                </button>
                            </div>

                            <motion.div
                                layout
                                className="glass-card p-6 border-primary/30 bg-primary/5 ring-1 ring-primary/20 relative"
                            >
                                <div className="absolute -top-3 -right-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">
                                        <Zap size={16} fill="black" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-black text-2xl text-foreground mb-2">{scannedFood.name}</h4>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">{scannedFood.calories} kcal</span>
                                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">AI Estimated</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-40 mb-1">Protein</span>
                                                <span className="text-lg font-black text-foreground">{scannedFood.protein}g</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-40 mb-1">Carbs</span>
                                                <span className="text-lg font-black text-foreground">{scannedFood.carbs}g</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-40 mb-1">Fat</span>
                                                <span className="text-lg font-black text-foreground">{scannedFood.fat}g</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Portion:</span>
                                            <span className="text-xs font-bold text-foreground/60">{scannedFood.servingSize}</span>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            handleAdd(scannedFood);
                                            setScannedFood(null);
                                        }}
                                        className="w-16 h-16 rounded-3xl bg-primary text-black flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
                                    >
                                        <Plus size={32} strokeWidth={4} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Common Foods</h3>
                    <Star size={16} className="text-muted-foreground/20" />
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredFoods.map((food, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                key={food.id}
                                className="glass-card p-5 flex items-center justify-between group overflow-hidden relative border-white/5"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{food.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-widest">{food.calories} kcal</span>
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{food.serving}</span>
                                    </div>
                                    <div className="flex gap-4 mt-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-40">Protein</span>
                                            <span className="text-xs font-bold text-foreground/80">{food.protein}g</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-40">Carbs</span>
                                            <span className="text-xs font-bold text-foreground/80">{food.carbs}g</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-40">Fat</span>
                                            <span className="text-xs font-bold text-foreground/80">{food.fat}g</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAdd(food)}
                                    className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:bg-primary-foreground"
                                >
                                    <Plus size={24} strokeWidth={3} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredFoods.length === 0 && !isSearchingAI && aiResults.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 text-muted-foreground/20 mb-6 border border-white/5">
                                <Search size={40} />
                            </div>
                            <p className="text-muted-foreground font-bold tracking-tight">No results found for "{query}"</p>
                            <p className="text-muted-foreground/40 text-sm mt-1 mb-8">Try our AI Smart Search for more accurate results</p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAISearch}
                                className="px-8 py-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 mx-auto"
                            >
                                <Brain size={18} /> Smart AI Search
                            </motion.button>
                        </div>
                    )}

                    {isSearchingAI && (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <Loader2 size={48} className="text-primary animate-spin mb-6 opacity-40" />
                            <p className="text-muted-foreground font-bold italic">Consulting AI food database...</p>
                        </div>
                    )}

                    {aiResults.length > 0 && !isSearchingAI && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mt-4">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">AI Suggestions</h3>
                                <button onClick={() => setAiResults([])} className="text-[10px] text-muted-foreground font-bold">CLEAR</button>
                            </div>
                            {aiResults.map((food, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={food.id}
                                    className="glass-card p-5 flex items-center justify-between border-primary/10 bg-primary/5"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-foreground mb-1">{food.name}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-widest">{food.calories} kcal</span>
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{food.serving || food.servingSize}</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleAdd({ ...food, servingSize: food.serving || food.servingSize })}
                                        className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg"
                                    >
                                        <Plus size={24} strokeWidth={3} />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodSearch;
