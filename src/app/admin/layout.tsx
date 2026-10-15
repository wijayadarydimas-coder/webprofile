import { getCurrentUser } from "@/lib/auth/session";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#101114] flex items-center justify-center p-4">
        <AdminLoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101114] flex text-[#F3F4F6]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
