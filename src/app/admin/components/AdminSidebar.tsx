"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Grid2X2, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const items = [
  { name: "الرئيسية", href: "/admin", icon: LayoutDashboard },
  { name: "الأقسام", href: "/admin/categories", icon: Grid2X2 },
  { name: "المنتجات", href: "/admin/products", icon: ShoppingBag },
  { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-zinc-950 text-slate-300 border-l border-zinc-900 flex-shrink-0 relative overflow-hidden hidden md:flex flex-col z-20">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      
      <div className="h-16 flex items-center px-6 border-b border-zinc-900 mt-2">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          أبو الخطاب للعطور
        </h1>
      </div>

      <nav className="p-4 space-y-1.5 flex-1 mt-4">
        {items.map((item) => {
          // Precise active state logic
          const isActive = item.href === '/admin' 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
            
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group text-sm font-medium",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-300" 
                  : "hover:bg-zinc-900/80 hover:text-white"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-300", 
                isActive ? "text-indigo-400 scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {item.name}
              
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-zinc-900 mt-auto">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors cursor-pointer rounded-xl hover:bg-red-500/10 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          تسجيل الخروج
        </div>
      </div>
    </aside>
  );
}
