import { Metadata } from "next";
import "@/app/globals.css";
import AdminClientWrapper from "./components/AdminClientWrapper";
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
    <AdminClientWrapper>
      {children}
    </AdminClientWrapper>
  );
}
