import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white blur-[60px] opacity-20 rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <Sparkles className="w-10 h-10 text-black" />
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold tracking-tight glow-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            1puzle AI
          </motion.h1>
          <motion.p 
            className="text-xs md:text-sm tracking-[0.3em] text-white/50 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            BY 1PUZLE HELPER REPLIT
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
