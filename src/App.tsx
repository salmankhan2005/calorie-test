import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import FoodSearch from "./pages/FoodSearch";
import Coach from "./pages/Coach";
import AppSettings from "./pages/AppSettings";
import Notifications from "./pages/Notifications";
import Premium from "./pages/Premium";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import { SplashScreen } from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";
import { useFirebaseSync } from "./lib/sync";
import { useAppStore } from "./store/useAppStore";

const queryClient = new QueryClient();
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const SyncEngine = () => {
  useFirebaseSync();
  return null;
};

const AppContent = () => {
  const { theme } = useAppStore();
  const location = useLocation();
  const hideNav = ["/login", "/onboarding"].includes(location.pathname);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <>
      <SyncEngine />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={
            <SignedOut>
              <Login />
            </SignedOut>
          } />
          <Route path="/" element={
            <>
              <SignedIn>
                <Index />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          } />
          <Route path="/onboarding" element={
            <SignedIn>
              <Onboarding />
            </SignedIn>
          } />
          <Route path="/analytics" element={
            <SignedIn>
              <Analytics />
            </SignedIn>
          } />
          <Route path="/profile" element={
            <SignedIn>
              <Profile />
            </SignedIn>
          } />
          <Route path="/search" element={
            <SignedIn>
              <FoodSearch />
            </SignedIn>
          } />
          <Route path="/coach" element={
            <SignedIn>
              <Coach />
            </SignedIn>
          } />
          <Route path="/settings" element={
            <SignedIn>
              <AppSettings />
            </SignedIn>
          } />
          <Route path="/notifications" element={
            <SignedIn>
              <Notifications />
            </SignedIn>
          } />
          <Route path="/premium" element={
            <SignedIn>
              <Premium />
            </SignedIn>
          } />
          <Route path="/privacy" element={
            <SignedIn>
              <Privacy />
            </SignedIn>
          } />
          <Route path="/support" element={
            <SignedIn>
              <Support />
            </SignedIn>
          } />
          <Route path="/add" element={
            <SignedIn>
              <FoodSearch />
            </SignedIn>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SignedIn>
          {!hideNav && <BottomNav />}
        </SignedIn>
      </TooltipProvider>
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
