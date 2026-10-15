"use client";

import { useState, useEffect } from "react";
import { MessageSquare, EyeOff, Eye, Trash2, Shield, RefreshCw } from "lucide-react";
import type { Comment } from "@/types";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/comments?includeHidden=true");
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleToggleHide = async (id: string, isHidden: boolean) => {
    try {
      await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isHidden: !isHidden }),
      });
      setComments(
        comments.map((c) => (c.id === id ? { ...c, isHidden: !isHidden } : c))
      );
    } catch (err) {
      alert("Gagal memperbarui status moderasi komentar.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus komentar ini secara permanen?")) return;
    try {
      await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      setComments(comments.filter((c) => c.id !== id));
    } catch {
      alert("Gagal menghapus komentar.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202228]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#8B9CFF]" />
            <h1 className="text-xl font-bold text-[#F3F4F6]">Moderasi Komentar Komunitas</h1>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            Tinjau seluruh diskusi, sembunyikan tanggapan yang melanggar norma, atau hapus komentar spam.
          </p>
        </div>

        <button
          onClick={fetchComments}
          disabled={loading}
          className="btn-secondary text-xs py-2 px-3.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Muat Ulang</span>
        </button>
      </div>

      {comments.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#71717A] bg-[#15171C] rounded-2xl border border-[#2B2D34]">
          Belum ada komentar dalam sistem.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                comment.isHidden
                  ? "bg-[#1B1D23]/50 border-[#EF4444]/40"
                  : comment.authorRole === "admin"
                  ? "bg-[#15171C] border-[#6D8DFF]/30"
                  : "bg-[#15171C] border-[#2B2D34]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F3F4F6]">{comment.authorName}</span>
                  {comment.authorRole === "admin" && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#6D8DFF]/20 text-[#8B9CFF] flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                  {comment.isHidden && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#EF4444]/20 text-[#EF4444]">
                      Disembunyikan dari Publik
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-[#71717A] font-mono">
                  {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-wrap bg-[#1B1D23]/60 p-3 rounded-lg border border-[#202228]">
                {comment.content}
              </p>

              <div className="flex items-center justify-end gap-3 pt-1 text-xs">
                <button
                  onClick={() => handleToggleHide(comment.id, comment.isHidden)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-colors ${
                    comment.isHidden
                      ? "bg-[#22C55E]/15 text-[#22C55E] hover:bg-[#22C55E]/25"
                      : "bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25"
                  }`}
                >
                  {comment.isHidden ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan Kembali</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 text-xs text-[#EF4444] hover:bg-[#EF4444]/15 px-2.5 py-1 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
