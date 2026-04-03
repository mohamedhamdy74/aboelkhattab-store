"use client";

import { useState } from "react";
import { login } from "./actions";
import { ShoppingBag, Lock, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/5 blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
             <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
                <ShoppingBag className="text-black" size={32} />
             </div>
             <h1 className="text-2xl font-black text-white">تسجيل دخول المسؤول</h1>
             <p className="text-zinc-500 text-sm mt-2">مرحباً بك مجدداً في لوحة تحكم أبو الخطاب</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 mr-1 text-right block">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-medium text-right"
                  placeholder="admin@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 mr-1 text-right block">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-medium text-right"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl text-center font-bold"
              >
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : "دخول"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
