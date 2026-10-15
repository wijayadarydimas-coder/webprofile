"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Users, Shield, LogOut } from "lucide-react";
import type { Comment, User } from "@/types";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";
import AuthModal from "./AuthModal";

interface CommunityViewProps {
  initialComments: Comment[];
  initialUser: User | null;
}

export default function CommunityView({ initialComments, initialUser }: CommunityViewProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const refreshComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (content: string, parentId?: string | null) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal mengirim komentar.");

    await refreshComments();
  };

  const handleEditComment = async (id: string, content: string) => {
    const res = await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal mengedit komentar.");

    await refreshComments();
  };

  const handleDeleteComment = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal menghapus komentar.");

    await refreshComments();
  };

  const handleModerateComment = async (id: string, isHidden: boolean) => {
    const res = await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isHidden }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal moderasi komentar.");

    await refreshComments();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
  };

  // Filter root comments (parentId === null)
  const rootComments = comments.filter((c) => !c.parentId);

  return (
    <div className="flex flex-col gap-8">
      {/* Session status banner */}
      <div className="p-4 rounded-xl bg-[#15171C] border border-[#2B2D34] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1B1D23] text-[#6D8DFF]">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#F3F4F6]">
              {currentUser ? `Masuk sebagai: ${currentUser.name}` : "Mode Pengunjung (Tamu)"}
            </span>
            <span className="text-[11px] text-[#71717A]">
              {currentUser
                ? currentUser.role === "admin"
                  ? "Hak Akses Administrator Aktif"
                  : "Akun Komunitas Terverifikasi"
                : "Masuk untuk menulis komentar dan bergabung dalam diskusi."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1D23] hover:bg-[#22252E] border border-[#2B2D34] text-xs text-[#EF4444] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="btn-primary text-xs py-1.5 px-3.5"
            >
              <span>Masuk / Daftar Akun</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Comment Composer */}
      <CommentForm
        currentUser={currentUser}
        onSubmit={(content) => handlePostComment(content, null)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Threaded Comments List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#202228]">
          <h2 className="text-sm font-semibold text-[#F3F4F6] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8B9CFF]" />
            <span>Diskusi Terbuka ({comments.length})</span>
          </h2>
        </div>

        {rootComments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A] bg-[#15171C] rounded-2xl border border-[#2B2D34]">
            Belum ada diskusi terbuka. Jadilah yang pertama memberikan masukan atau pertanyaan!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rootComments.map((rootComment) => (
              <CommentThread
                key={rootComment.id}
                comment={rootComment}
                currentUser={currentUser}
                onReply={(parentId, content) => handlePostComment(content, parentId)}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onModerate={handleModerateComment}
                allComments={comments}
              />
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
