import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AuthPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md glass-panel p-10 md:p-14 rounded-[2rem] flex flex-col items-center text-center glow-border"
      >
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          <Sparkles className="w-8 h-8 text-black" />
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-3 tracking-tight glow-text">1puzle AI</h1>
        <p className="text-xs tracking-[0.3em] text-white/40 mb-12 font-medium">BY 1PUZLE HELPER REPLIT</p>
        
        <div className="space-y-6 w-full">
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            Experience the next generation of AI assistance. Minimalist, fast, and remarkably intelligent.
          </p>
          
          <button
            onClick={login}
            className="group relative w-full overflow-hidden rounded-full bg-white text-black font-semibold text-sm py-4 px-8 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span className="relative z-10">Continue with Replit</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
