import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#101114] flex items-center justify-center p-4">
      <AdminLoginForm />
    </div>
  );
}
