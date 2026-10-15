"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Cpu,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Profile & Hero", href: "/admin/profile", icon: User },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Research & Thesis", href: "/admin/research", icon: Cpu },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Comments & Mod", href: "/admin/comments", icon: MessageSquare },
    { name: "AI & Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#15171C] border-r border-[#2B2D34] flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-[#2B2D34] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6D8DFF] text-white flex items-center justify-center font-mono font-bold text-xs">
            W
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#F3F4F6]">Admin Panel</span>
            <span className="text-[10px] text-[#71717A] font-mono">Wijaya Dary Dimas</span>
          </div>
        </div>

        <Link
          href="/"
          className="p-1.5 rounded hover:bg-[#1B1D23] text-[#71717A] hover:text-[#F3F4F6] transition-colors"
          title="Buka Website Publik"
          target="_blank"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#6D8DFF]/15 text-[#8B9CFF] border border-[#6D8DFF]/30 font-semibold"
                  : "text-[#A1A1AA] hover:text-[#F3F4F6] hover:bg-[#1B1D23]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Session Action */}
      <div className="p-3 border-t border-[#2B2D34]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Sesi Admin</span>
        </button>
      </div>
    </aside>
  );
}
