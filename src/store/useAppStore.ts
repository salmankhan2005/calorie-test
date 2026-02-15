import { create } from 'zustand';

export interface UserProfile {
  fullName: string;
  age: number;
  gender: string;
  goal: string;
  workoutFrequency: string;
  birthDate: string;
  height: number;
  weight: number;
  dailyCaloriesTarget: number;
  protein: number;
  carbs: number;
  fat: number;
  preferredCuisine: string;
  waterLiters: number;
  dietStrategy?: string;
  workoutPlan?: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  time: string;
}

export interface DailyLog {
  caloriesConsumed: number;
  waterIntake: number;
  foodLogs: FoodEntry[];
  date?: string;
}

export interface HistoryEntry extends DailyLog {
  date: string;
}

interface AppState {
  isOnboarded: boolean;
  profile: UserProfile | null;
  todayLog: DailyLog;
  setOnboarded: (val: boolean) => void;
  setProfile: (p: UserProfile) => void;
  addFoodEntry: (entry: FoodEntry) => void;
  addWater: (ml: number) => void;
  setTodayLog: (log: DailyLog) => void;
  history: HistoryEntry[];
  setHistory: (history: HistoryEntry[]) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  units: 'metric' | 'imperial';
  setUnits: (units: 'metric' | 'imperial') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const DEFAULT_LOG: DailyLog = {
  caloriesConsumed: 0,
  waterIntake: 0,
  foodLogs: [],
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const loadState = () => {
  try {
    const profileStr = localStorage.getItem('calorieApp_profile');
    const logStr = localStorage.getItem('calorieApp_todayLog');
    const onboarded = localStorage.getItem('calorieApp_onboarded');

    const profile = profileStr ? JSON.parse(profileStr) : null;
    let todayLog = logStr ? JSON.parse(logStr) : DEFAULT_LOG;

    // Reset log if it's from a different day
    if (todayLog.date && todayLog.date !== getTodayDate()) {
      todayLog = { ...DEFAULT_LOG, date: getTodayDate() };
      localStorage.setItem('calorieApp_todayLog', JSON.stringify(todayLog));
    } else if (!todayLog.date) {
      todayLog.date = getTodayDate();
    }

    // Ensure caloriesConsumed is always correct based on foodLogs
    const totalCal = todayLog.foodLogs.reduce((sum: number, f: FoodEntry) => sum + (f.calories || 0), 0);
    todayLog.caloriesConsumed = totalCal;
    const theme = localStorage.getItem('calorieApp_theme') as 'dark' | 'light' || 'dark';
    const units = localStorage.getItem('calorieApp_units') as 'metric' | 'imperial' || 'metric';

    return {
      profile,
      todayLog,
      isOnboarded: onboarded === 'true',
      theme: theme as 'dark' | 'light',
      units: units as 'metric' | 'imperial'
    };
  } catch (err) {
    console.error("Load state error:", err);
    return {
      profile: null,
      todayLog: { ...DEFAULT_LOG, date: getTodayDate() },
      isOnboarded: false,
      theme: 'dark' as 'dark' | 'light',
      units: 'metric' as 'metric' | 'imperial'
    };
  }
};

const saved = loadState();

export const useAppStore = create<AppState>((set) => ({
  isOnboarded: saved.isOnboarded,
  profile: saved.profile,
  todayLog: saved.todayLog,
  setOnboarded: (val) => {
    localStorage.setItem('calorieApp_onboarded', String(val));
    set({ isOnboarded: val });
  },
  setProfile: (p) => {
    localStorage.setItem('calorieApp_profile', JSON.stringify(p));
    set({ profile: p });
  },
  addFoodEntry: (entry) =>
    set((state) => {
      const newFoodLogs = [...state.todayLog.foodLogs, entry];
      const newCalories = newFoodLogs.reduce((sum, f) => sum + (f.calories || 0), 0);

      const updated = {
        ...state.todayLog,
        caloriesConsumed: newCalories,
        foodLogs: newFoodLogs,
        date: state.todayLog.date || getTodayDate()
      };
      localStorage.setItem('calorieApp_todayLog', JSON.stringify(updated));
      return { todayLog: updated };
    }),
  addWater: (ml) =>
    set((state) => {
      const updated = {
        ...state.todayLog,
        waterIntake: (state.todayLog.waterIntake || 0) + ml,
        date: state.todayLog.date || getTodayDate()
      };
      localStorage.setItem('calorieApp_todayLog', JSON.stringify(updated));
      return { todayLog: updated };
    }),
  setTodayLog: (log) =>
    set((state) => {
      // Ensure date is set and calories are computed
      const logWithDate = {
        ...log,
        date: log.date || getTodayDate(),
        caloriesConsumed: log.foodLogs.reduce((sum, f) => sum + (f.calories || 0), 0)
      };
      localStorage.setItem('calorieApp_todayLog', JSON.stringify(logWithDate));
      return { todayLog: logWithDate };
    }),
  history: [],
  setHistory: (history) => set({ history }),
  theme: saved.theme,
  setTheme: (theme) => {
    localStorage.setItem('calorieApp_theme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
    set({ theme });
  },
  units: saved.units,
  setUnits: (units) => {
    localStorage.setItem('calorieApp_units', units);
    set({ units });
  },
  selectedDate: getTodayDate(),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
