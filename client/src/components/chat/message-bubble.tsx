import { type Message, type User } from "@shared/schema";
import { Sparkles, User as UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Pick<Message, 'role' | 'content' | 'createdAt'>;
  user: User | null;
  isStreaming?: boolean;
}

export function MessageBubble({ message, user, isStreaming }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full py-6 sm:py-8 px-4 ${isAssistant ? 'bg-transparent' : 'bg-white/[0.02]'}`}
    >
      <div className="max-w-3xl mx-auto flex gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0 pt-1">
          {isAssistant ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center glow-box shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
          ) : user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="User" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary border border-white/10 flex items-center justify-center text-white/70">
              <UserIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-white/90">
              {isAssistant ? "1puzle AI" : (user?.firstName || "You")}
            </span>
            {message.createdAt && (
              <span className="text-[10px] text-white/30">
                {format(new Date(message.createdAt), "h:mm a")}
              </span>
            )}
          </div>
          
          <div className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl text-[15px] sm:text-base ${isAssistant ? 'text-white/90' : 'text-white/80'}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || (isStreaming ? "..." : "")}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
