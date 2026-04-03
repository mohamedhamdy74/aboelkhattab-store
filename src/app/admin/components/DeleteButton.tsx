"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ itemName }: { itemName?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all text-xs font-medium ${
        pending ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
      }`}
      onClick={(e) => {
        if (!confirm(`هل تريد فعلاً حذف ${itemName || "هذا العنصر"}؟`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-3.5 h-3.5" />
      {pending ? "جاري الحذف..." : "حذف"}
    </button>
  );
}
