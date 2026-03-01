import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Menu, X, Trash2, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useConversations, useCreateConversation, useDeleteConversation } from "@/hooks/use-chat";
import { format } from "date-fns";

interface LayoutProps {
  children: ReactNode;
  activeId?: number;
}

export function Layout({ children, activeId }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: conversations, isLoading } = useConversations();
  const createMutation = useCreateConversation();
  const deleteMutation = useDeleteConversation();
  const [, setLocation] = useLocation();

  const handleNewChat = async () => {
    setLocation("/");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      await deleteMutation.mutateAsync(id);
      if (activeId === id) setLocation("/");
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative z-50 h-full w-72 flex-shrink-0 flex flex-col border-r border-white/10 bg-background/95 backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center glow-box">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-wide">1puzle AI</h2>
              <p className="text-[9px] tracking-widest text-white/40">BY 1PUZLE HELPER</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-white/50 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group"
          >
            <Plus className="w-5 h-5 text-white/70 group-hover:text-white" />
            <span className="font-medium text-sm text-white/90">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          <div className="px-3 mb-2 mt-4 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
            Recent Conversations
          </div>
          
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-white/40">Loading...</div>
          ) : conversations?.length === 0 ? (
            <div className="px-4 py-3 text-xs text-white/30 text-center">No history yet</div>
          ) : (
            conversations?.map((conv) => (
              <Link 
                key={conv.id} 
                href={`/c/${conv.id}`}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-200 group ${
                  activeId === conv.id 
                    ? "bg-white/10 text-white shadow-[inset_2px_0_0_#fff]" 
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-50" />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="truncate w-full text-left">{conv.title || "New Conversation"}</span>
                    <span className="text-[10px] opacity-40">{format(new Date(conv.createdAt), "MMM d, h:mm a")}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>
            ))
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 border border-white/20">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.firstName || "User"}</span>
              <span className="text-xs text-white/40 truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-background/80 backdrop-blur-md z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-white/70">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <h1 className="font-display font-semibold text-sm">1puzle AI</h1>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}
