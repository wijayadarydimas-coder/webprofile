import { db } from "@/lib/db";
import Link from "next/link";
import {
  FolderKanban,
  MessageSquare,
  Image as ImageIcon,
  Mail,
  ArrowRight,
  ShieldCheck,
  User,
  Cpu,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const [profileRes, projectsRes, commentsRes, mediaRes, messagesRes] = await Promise.allSettled([
    db.getProfile(),
    db.getProjects(),
    db.getComments({ includeHidden: true }),
    db.getMediaItems(),
    db.getContactMessages(),
  ]);

  const profile =
    profileRes.status === "fulfilled" && profileRes.value
      ? profileRes.value
      : { fullName: "Wijaya Dary Dimas", headline: "Admin" };
  const projects = projectsRes.status === "fulfilled" ? projectsRes.value : [];
  const comments = commentsRes.status === "fulfilled" ? commentsRes.value : [];
  const media = mediaRes.status === "fulfilled" ? mediaRes.value : [];
  const messages = messagesRes.status === "fulfilled" ? messagesRes.value : [];

  const activeComments = comments.filter((c) => !c.isHidden && !c.isDeleted);
  const hiddenComments = comments.filter((c) => c.isHidden);
  const unreadMessages = messages.filter((m) => !m.isRead);

  const stats = [
    {
      title: "Total Portofolio",
      value: projects.length,
      detail: `${projects.filter((p) => p.featured).length} Proyek Unggulan`,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-[#6D8DFF]",
    },
    {
      title: "Diskusi Komunitas",
      value: comments.length,
      detail: `${hiddenComments.length} Perlu Moderasi`,
      icon: MessageSquare,
      href: "/admin/comments",
      color: "text-[#8B9CFF]",
    },
    {
      title: "Berkas & Media",
      value: media.length,
      detail: "Termasuk CV & Gambar",
      icon: ImageIcon,
      href: "/admin/media",
      color: "text-[#22C55E]",
    },
    {
      title: "Pesan Kontak",
      value: messages.length,
      detail: `${unreadMessages.length} Belum Dibaca`,
      icon: Mail,
      href: "#messages",
      color: "text-[#F59E0B]",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F3F4F6]">Admin Dashboard</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Sesi Aktif
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Selamat datang, <span className="text-[#F3F4F6] font-semibold">{profile.fullName}</span>. Kelola seluruh konten website Anda secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="btn-secondary text-xs py-2">
            <span>Lihat Website Publik</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="p-5 rounded-xl bg-[#15171C] border border-[#2B2D34] hover:border-[#6D8DFF]/40 transition-all flex flex-col gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#71717A]">{stat.title}</span>
                <div className={`p-2 rounded-lg bg-[#1B1D23] ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#F3F4F6] font-mono">{stat.value}</span>
                <span className="text-[11px] text-[#A1A1AA]">{stat.detail}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Actions */}
      <div className="p-6 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[#F3F4F6]">Aksi Cepat Pengelolaan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/profile"
            className="p-4 rounded-xl bg-[#1B1D23] hover:bg-[#20232B] border border-[#2B2D34] flex items-center gap-3 transition-colors"
          >
            <User className="w-4 h-4 text-[#6D8DFF]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#F3F4F6]">Edit Profil &amp; Hero</span>
              <span className="text-[10px] text-[#71717A]">Nama, foto avatar, bio &amp; CV</span>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="p-4 rounded-xl bg-[#1B1D23] hover:bg-[#20232B] border border-[#2B2D34] flex items-center gap-3 transition-colors"
          >
            <FolderKanban className="w-4 h-4 text-[#8B9CFF]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#F3F4F6]">Tambah Proyek Baru</span>
              <span className="text-[10px] text-[#71717A]">Publikasikan studi kasus proyek</span>
            </div>
          </Link>

          <Link
            href="/admin/research"
            className="p-4 rounded-xl bg-[#1B1D23] hover:bg-[#20232B] border border-[#2B2D34] flex items-center gap-3 transition-colors"
          >
            <Cpu className="w-4 h-4 text-[#22C55E]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#F3F4F6]">Kelola Skripsi YOLOv11</span>
              <span className="text-[10px] text-[#71717A]">Metodologi &amp; dataset APD</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Contact Messages Inbox */}
      <div id="messages" className="p-6 rounded-2xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#F59E0B]" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">Kotak Masuk Pesan Pengunjung</h2>
          </div>
          <span className="text-xs text-[#71717A] font-mono">{messages.length} Total Pesan</span>
        </div>

        {messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#71717A] bg-[#111317] rounded-xl border border-[#2B2D34]/50">
            Belum ada pesan yang masuk melalui formulir kontak.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-[#1B1D23] border border-[#2B2D34] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F3F4F6]">{msg.name}</span>
                    <span className="text-[11px] text-[#8B9CFF] font-mono">&lt;{msg.email}&gt;</span>
                  </div>
                  <span className="text-[10px] text-[#71717A] font-mono">
                    {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-wrap bg-[#15171C] p-3 rounded-lg border border-[#202228]">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
