"use client";

import { useState, useEffect } from "react";
import { MessageSquare, CornerDownRight, Edit2, Trash2, Shield, EyeOff, Eye } from "lucide-react";
import type { Comment, User } from "@/types";

interface CommentThreadProps {
  comment: Comment;
  currentUser: User | null;
  onReply: (parentId: string, content: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onModerate: (id: string, isHidden: boolean) => Promise<void>;
  allComments: Comment[];
  depth?: number;
}

export default function CommentThread({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onModerate,
  allComments,
  depth = 0,
}: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);

  // Find replies to this comment
  const replies = allComments.filter((c) => c.parentId === comment.id);

  const isAuthor = currentUser?.id === comment.authorId;
  const isAdmin = currentUser?.role === "admin";

  const handleSendReply = async () => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendEdit = async () => {
    if (!editText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onEdit(comment.id, editText);
      setIsEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    try {
      setFormattedDate(
        new Date(comment.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      setFormattedDate(comment.createdAt);
    }
  }, [comment.createdAt]);

  return (
    <div className={`flex flex-col gap-3 ${depth > 0 ? "ml-4 sm:ml-8 mt-2 pl-3 border-l border-[#2B2D34]" : ""}`}>
      <div className={`p-4 rounded-xl border transition-colors ${
        comment.isHidden
          ? "bg-[#1B1D23]/40 border-[#EF4444]/30 opacity-75"
          : comment.authorRole === "admin"
          ? "bg-[#15171C] border-[#6D8DFF]/30"
          : "bg-[#15171C] border-[#2B2D34]"
      }`}>
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              comment.authorRole === "admin"
                ? "bg-[#6D8DFF] text-white"
                : "bg-[#1B1D23] border border-[#2B2D34] text-[#A1A1AA]"
            }`}>
              {comment.authorName.charAt(0).toUpperCase()}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#F3F4F6]">{comment.authorName}</span>
              {comment.authorRole === "admin" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#6D8DFF]/20 text-[#8B9CFF] border border-[#6D8DFF]/40">
                  <Shield className="w-2.5 h-2.5" />
                  Owner / Admin
                </span>
              )}
            </div>
          </div>

          <span className="text-[11px] text-[#71717A] font-mono">{formattedDate}</span>
        </div>

        {/* Comment Body */}
        {isEditing ? (
          <div className="flex flex-col gap-2 mt-2">
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary py-1 px-2.5 text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSendEdit}
                disabled={submitting || !editText.trim()}
                className="btn-primary py-1 px-3 text-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
            {comment.isDeleted ? (
              <span className="italic text-[#71717A]">[Komentar ini telah dihapus oleh penulis]</span>
            ) : (
              comment.content
            )}
          </div>
        )}

        {/* Action Buttons Bar */}
        {!comment.isDeleted && (
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-[#202228] text-xs">
            {currentUser && depth < 3 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-[#8B9CFF] hover:text-[#F3F4F6] transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Balas</span>
              </button>
            )}

            {isAuthor && !comment.isDeleted && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-[#71717A] hover:text-[#A1A1AA] transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            {(isAuthor || isAdmin) && (
              <button
                onClick={() => {
                  if (confirm("Hapus komentar ini?")) onDelete(comment.id);
                }}
                className="flex items-center gap-1 text-[#EF4444]/80 hover:text-[#EF4444] transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onModerate(comment.id, !comment.isHidden)}
                className="flex items-center gap-1 text-[#F59E0B] hover:text-[#FBBF24] transition-colors ml-auto text-[11px]"
                title="Moderasi Admin"
              >
                {comment.isHidden ? (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Tampilkan</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Sembunyikan</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Inline Reply Composer */}
        {isReplying && (
          <div className="mt-3 pt-3 border-t border-[#2B2D34] flex flex-col gap-2">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Balas kepada ${comment.authorName}...`}
              className="w-full p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsReplying(false)}
                className="btn-secondary py-1 px-2.5 text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSendReply}
                disabled={submitting || !replyText.trim()}
                className="btn-primary py-1 px-3 text-xs"
              >
                Kirim Balasan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recursive Nested Replies */}
      {replies.length > 0 && (
        <div className="flex flex-col gap-3">
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onModerate={onModerate}
              allComments={allComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
