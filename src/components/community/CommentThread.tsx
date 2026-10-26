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
        new Date(comment.createdAt).toLocaleDateString("en-US", {
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
    <div className={`flex flex-col gap-3 ${depth > 0 ? "ml-4 sm:ml-8 mt-2 pl-3 border-l border-[#292D39]" : ""}`}>
      <div className={`p-4 rounded-xl border transition-colors ${
        comment.isHidden
          ? "bg-[#1F2330]/40 border-[#EF4444]/30 opacity-75"
          : comment.authorRole === "admin"
          ? "bg-[#171A24] border-[#7790FF]/30"
          : "bg-[#171A24] border-[#292D39]"
      }`}>
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              comment.authorRole === "admin"
                ? "bg-[#7790FF] text-white"
                : "bg-[#1F2330] border border-[#292D39] text-[#A1A6B5]"
            }`}>
              {comment.authorName.charAt(0).toUpperCase()}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#F1F2F5]">{comment.authorName}</span>
              {comment.authorRole === "admin" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#7790FF]/20 text-[#96A9FF] border border-[#7790FF]/40">
                  <Shield className="w-2.5 h-2.5" />
                  Owner / Admin
                </span>
              )}
            </div>
          </div>

          <span className="text-[11px] text-[#7D8496] font-mono">{formattedDate}</span>
        </div>

        {/* Comment Body */}
        {isEditing ? (
          <div className="flex flex-col gap-2 mt-2">
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary py-1 px-2.5 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEdit}
                disabled={submitting || !editText.trim()}
                className="btn-primary py-1 px-3 text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-[#A1A6B5] leading-relaxed whitespace-pre-wrap">
            {comment.isDeleted ? (
              <span className="italic text-[#7D8496]">[This comment has been deleted by the author]</span>
            ) : (
              comment.content
            )}
          </div>
        )}

        {/* Action Buttons Bar */}
        {!comment.isDeleted && (
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-[#1C202B] text-xs">
            {currentUser && depth < 3 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-[#96A9FF] hover:text-[#F1F2F5] transition-colors cursor-pointer"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            )}

            {isAuthor && !comment.isDeleted && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-[#7D8496] hover:text-[#A1A6B5] transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            {(isAuthor || isAdmin) && (
              <button
                onClick={() => {
                  if (confirm("Delete this comment?")) onDelete(comment.id);
                }}
                className="flex items-center gap-1 text-[#EF4444]/80 hover:text-[#EF4444] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onModerate(comment.id, !comment.isHidden)}
                className="flex items-center gap-1 text-[#F59E0B] hover:text-[#FBBF24] transition-colors ml-auto text-[11px] cursor-pointer"
                title="Admin Moderation"
              >
                {comment.isHidden ? (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Show</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Inline Reply Composer */}
        {isReplying && (
          <div className="mt-3 pt-3 border-t border-[#292D39] flex flex-col gap-2">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.authorName}...`}
              className="w-full p-2.5 rounded-lg bg-[#1F2330] border border-[#292D39] text-xs text-[#F1F2F5] focus:border-[#7790FF] focus:outline-none"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsReplying(false)}
                className="btn-secondary py-1 px-2.5 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={submitting || !replyText.trim()}
                className="btn-primary py-1 px-3 text-xs"
              >
                Post Reply
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
