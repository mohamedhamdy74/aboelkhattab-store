"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Check role in user_metadata - Server Side
  const role = data.user?.user_metadata?.role;

  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "عذراً، ليس لديك صلاحيات المسؤول." };
  }

  redirect("/admin");
}
