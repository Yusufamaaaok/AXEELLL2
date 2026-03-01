import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { useAuth } from "@/hooks/use-auth";
import { useConversation, useCreateConversation, useChatStream } from "@/hooks/use-chat";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function ChatPage() {
  const params = useParams();
  const activeId = params.id ? parseInt(params.id) : undefined;
  const [, setLocation] = useLocation();
  
  const { user } = useAuth();
  const { data: chatData, isLoading } = useConversation(activeId);
  const createMutation = useCreateConversation();
  const { sendMessage, isStreaming, streamedContent } = useChatStream();
  
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local messages with API data
  useEffect(() => {
    if (chatData?.messages) {
      setLocalMessages(chatData.messages);
    } else if (!activeId) {
      setLocalMessages([]);
    }
  }, [chatData, activeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, streamedContent, isStreaming]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming) return;
    
    const content = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Optimistically add user message
    const tempUserMsg = { id: Date.now(), role: "user", content, createdAt: new Date().toISOString() };
    setLocalMessages(prev => [...prev, tempUserMsg]);

    try {
      let targetId = activeId;
      
      // Create new conversation if none exists
      if (!targetId) {
        const newConv = await createMutation.mutateAsync(content.substring(0, 40) + "...");
        targetId = newConv.id;
        // Don't navigate yet to avoid unmounting during stream
        window.history.pushState({}, '', `/c/${targetId}`); 
      }

      await sendMessage(targetId, content);
      
      // If we created a new one, formally navigate after stream completes
      if (!activeId && targetId) {
        setLocation(`/c/${targetId}`);
      }
    } catch (error) {
      console.error("Failed to send message", error);
      // Revert optimistic update on failure
      setLocalMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
    }
  };

  const isNewChat = !activeId && localMessages.length === 0;

  return (
    <Layout activeId={activeId}>
      <div className="flex flex-col h-full relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-32">
          {isNewChat ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 glow-box shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <Sparkles className="w-8 h-8 text-black" />
              </motion.div>
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-2xl font-display font-semibold mb-2 glow-text"
              >
                How can I help you today?
              </motion.h2>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-white/40 text-sm max-w-md"
              >
                Ask anything. I'm equipped to handle complex problems, generate ideas, and assist with code.
              </motion.p>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {isLoading && activeId ? (
                <div className="py-8 text-center text-white/30 text-sm">Loading history...</div>
              ) : (
                <>
                  {localMessages.map((msg, idx) => (
                    <MessageBubble key={msg.id || idx} message={msg} user={user} />
                  ))}
                  
                  {isStreaming && (
                    <div className="w-full py-6 sm:py-8 px-4 bg-transparent">
                      <div className="max-w-3xl mx-auto flex gap-4 sm:gap-6">
                        <div className="flex-shrink-0 pt-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center glow-box">
                            <Sparkles className="w-5 h-5 text-black" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <span className="font-medium text-sm text-white/90">1puzle AI</span>
                          {streamedContent ? (
                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl text-[15px] sm:text-base text-white/90">
                              <ReactMarkdown>{streamedContent}</ReactMarkdown>
                            </div>
                          ) : (
                            <TypingIndicator />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-4 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-end w-full glass-panel rounded-2xl md:rounded-3xl p-2 transition-all duration-300 focus-within:border-white/30 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Message 1puzle AI..."
                className="w-full max-h-[200px] min-h-[44px] bg-transparent border-none outline-none resize-none px-4 py-3 text-[15px] sm:text-base text-white placeholder:text-white/30 focus:ring-0 leading-relaxed"
                rows={1}
                disabled={isStreaming}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isStreaming}
                className="flex-shrink-0 m-1 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-all active:scale-95 glow-box disabled:glow-none"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-white/30 mt-3 font-medium tracking-wide">
              1puzle AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFORMATION.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
