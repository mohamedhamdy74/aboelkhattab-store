"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex antialiased text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 z-50 md:hidden"
            >
              <AdminSidebar onMobileSelect={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-h-screen bg-gray-50/50 dark:bg-zinc-950/50 max-w-full">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl flex items-center px-4 md:px-8 sticky top-0 z-30 justify-between">
          <div className="flex items-center gap-3">
             {/* Hamburger Menu Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 md:hidden text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2 truncate">
              <span>أهلاً بك، المدير</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">أدمن المتجر</span>
              <span className="text-xs text-zinc-500">Abu Alkhattab</span>
            </div>
            <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-zinc-900 transition-transform hover:scale-105">
              A
            </span>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
