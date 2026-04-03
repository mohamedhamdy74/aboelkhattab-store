import { Metadata } from "next";
import "@/app/globals.css";
import AdminClientWrapper from "./components/AdminClientWrapper";

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
