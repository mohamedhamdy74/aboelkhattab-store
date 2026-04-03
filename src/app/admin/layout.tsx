import { Metadata } from "next";
import "@/app/globals.css";
import AdminSidebar from "./components/AdminSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "لوحة تحكم | أبو الخطاب",
  description: "لوحة تحكم احترافية لإدارة المتجر",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex antialiased text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50/50 dark:bg-zinc-950/50">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl flex items-center px-8 sticky top-0 z-10 justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
            <span>أهلاً بك، المدير</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">أدمن المتجر</span>
              <span className="text-xs text-zinc-500">Abu Alkhattab</span>
            </div>
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/20 ring-2 ring-white dark:ring-zinc-900">
              A
            </span>
          </div>
        </header>
        
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
