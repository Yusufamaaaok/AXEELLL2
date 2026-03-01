import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Pages
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/auth-page";
import { IntroScreen } from "@/pages/intro-screen";
import { ChatPage } from "@/pages/chat-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="/c/:id" component={ChatPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainApp() {
  const { user, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Show intro only once per session when authenticated
  useEffect(() => {
    if (user && !hasSeenIntro) {
      setShowIntro(true);
      setHasSeenIntro(true);
    }
  }, [user, hasSeenIntro]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      
      {!showIntro && <Router />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
