import React, { useState, useRef } from 'react';
import {
  X,
  Send,
  Heart,
  MessageCircle,
  Sparkles,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { ReelComment } from '../types/reel.types';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  reelCaption: string;
  professionalName: string;
  professionalAvatar: string;
  isDesktopDrawer?: boolean;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  reelId,
  reelCaption,
  professionalName,
  professionalAvatar,
  isDesktopDrawer = false,
}) => {
  const { currentUser } = useAuthStore();
  const {
    reelComments,
    addReelComment,
    deleteReelComment,
    toggleLikeReelComment,
  } = useMarketplaceStore();

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    userName: string;
  } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter all comments for this reel
  const reelLevelComments = reelComments.filter((c) => c.reelId === reelId);

  // Separate top-level comments and map their replies
  const topLevelComments = reelLevelComments.filter((c) => !c.parentId);

  const getRepliesForComment = (parentId: string): ReelComment[] => {
    return reelLevelComments.filter((c) => c.parentId === parentId);
  };

  const handleStartReply = (parentCommentId: string, targetUserName: string) => {
    setReplyingTo({ commentId: parentCommentId, userName: targetUserName });
    setExpandedReplies((prev) => ({ ...prev, [parentCommentId]: true }));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const toggleRepliesExpansion = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (replyingTo) {
      addReelComment(
        reelId,
        newCommentText.trim(),
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        replyingTo.commentId,
        replyingTo.userName
      );
      setExpandedReplies((prev) => ({ ...prev, [replyingTo.commentId]: true }));
      setReplyingTo(null);
    } else {
      addReelComment(reelId, newCommentText.trim(), {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      });
    }

    setNewCommentText('');
  };

  const content = (
    <div
      className="flex flex-col h-full bg-surface select-none comments-drawer"
      data-scrollable="true"
    >
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-border bg-surface-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-wine" />
          <h3 className="font-bold text-sm text-charcoal">Comments</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand text-charcoal border border-sand-dark">
            {reelLevelComments.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-sand/30 transition-colors"
          title="Close Comments"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-border/40">
        {/* Creator's Caption Pinned at Top (Instagram style) */}
        <div className="flex items-start gap-3 pb-3">
          <img
            src={professionalAvatar}
            alt={professionalName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-border shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0 text-xs">
            <span className="font-bold text-charcoal mr-1.5">{professionalName}</span>
            <span className="text-charcoal-muted leading-relaxed">{reelCaption}</span>
            <div className="text-[10px] text-charcoal-muted mt-1 font-medium">Original Creator</div>
          </div>
        </div>

        {/* User Comments */}
        {topLevelComments.length === 0 ? (
          <div className="py-12 text-center text-charcoal-muted space-y-2">
            <div className="w-12 h-12 rounded-full bg-sand/60 text-wine flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-charcoal">No comments yet</p>
            <p className="text-[11px]">Start the conversation by sharing your thoughts!</p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const isMyComment = comment.userId === currentUser.id;
            const replies = getRepliesForComment(comment.id);
            const areRepliesExpanded = expandedReplies[comment.id] ?? false;

            return (
              <div key={comment.id} className="pt-3 space-y-2.5">
                {/* Main Comment Row */}
                <div className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-border shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal truncate">{comment.userName}</span>
                        <span className="text-[10px] text-charcoal-muted">{comment.createdAt}</span>
                      </div>
                      <p className="text-charcoal leading-relaxed mt-0.5 text-xs break-words">
                        {comment.text}
                      </p>

                      {/* Reply Button & Actions */}
                      <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleStartReply(comment.id, comment.userName)}
                          className="font-semibold text-charcoal-muted hover:text-wine transition-colors flex items-center gap-1"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>Reply</span>
                        </button>

                        {isMyComment && (
                          <button
                            type="button"
                            onClick={() => deleteReelComment(comment.id)}
                            className="text-charcoal-muted hover:text-error transition-colors text-[10px]"
                            title="Delete your comment"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comment Like Action */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleLikeReelComment(comment.id)}
                      className="flex flex-col items-center group/btn active:scale-125 transition-transform"
                      title="Like comment"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          comment.isLiked
                            ? 'fill-wine text-wine'
                            : 'text-charcoal-muted group-hover/btn:text-wine'
                        }`}
                      />
                      {comment.likesCount > 0 && (
                        <span className="text-[9px] text-charcoal-muted font-bold mt-0.5">
                          {comment.likesCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* View / Hide Replies Toggle Button */}
                {replies.length > 0 && (
                  <div className="ml-11">
                    <button
                      type="button"
                      onClick={() => toggleRepliesExpansion(comment.id)}
                      className="text-[11px] font-bold text-wine hover:text-wine-dark flex items-center gap-1 transition-colors"
                    >
                      <span className="w-4 h-[1px] bg-wine/60 inline-block mr-0.5" />
                      <span>
                        {areRepliesExpanded
                          ? 'Hide replies'
                          : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                      </span>
                      {areRepliesExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {/* Nested Replies List */}
                    {areRepliesExpanded && (
                      <div className="mt-2.5 space-y-2.5 border-l-2 border-sand-dark/40 pl-3">
                        {replies.map((reply) => {
                          const isMyReply = reply.userId === currentUser.id;
                          return (
                            <div
                              key={reply.id}
                              className="flex items-start justify-between gap-2.5 group"
                            >
                              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                <img
                                  src={reply.userAvatar}
                                  alt={reply.userName}
                                  className="w-6 h-6 rounded-full object-cover ring-1 ring-border shrink-0 mt-0.5"
                                />
                                <div className="min-w-0 flex-1 text-xs">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-charcoal truncate">
                                      {reply.userName}
                                    </span>
                                    <span className="text-[10px] text-charcoal-muted">
                                      {reply.createdAt}
                                    </span>
                                  </div>
                                  <p className="text-charcoal leading-relaxed mt-0.5 text-[11px] break-words">
                                    {reply.replyToUserName && (
                                      <span className="text-wine font-semibold mr-1">
                                        @{reply.replyToUserName}
                                      </span>
                                    )}
                                    {reply.text}
                                  </p>

                                  {/* Reply Actions */}
                                  <div className="flex items-center gap-3 mt-1 text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() => handleStartReply(comment.id, reply.userName)}
                                      className="font-semibold text-charcoal-muted hover:text-wine transition-colors"
                                    >
                                      Reply
                                    </button>

                                    {isMyReply && (
                                      <button
                                        type="button"
                                        onClick={() => deleteReelComment(reply.id)}
                                        className="text-charcoal-muted hover:text-error transition-colors"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Like Reply */}
                              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => toggleLikeReelComment(reply.id)}
                                  className="flex flex-col items-center group/btn active:scale-125 transition-transform"
                                  title="Like reply"
                                >
                                  <Heart
                                    className={`w-3 h-3 transition-colors ${
                                      reply.isLiked
                                        ? 'fill-wine text-wine'
                                        : 'text-charcoal-muted group-hover/btn:text-wine'
                                    }`}
                                  />
                                  {reply.likesCount > 0 && (
                                    <span className="text-[8px] text-charcoal-muted font-bold mt-0.5">
                                      {reply.likesCount}
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-sand/60 border-t border-border flex items-center justify-between text-xs text-charcoal shrink-0 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center gap-1.5 truncate">
            <CornerDownRight className="w-3.5 h-3.5 text-wine shrink-0" />
            <span className="text-charcoal-muted">Replying to</span>
            <span className="font-bold text-wine truncate">@{replyingTo.userName}</span>
          </div>
          <button
            type="button"
            onClick={handleCancelReply}
            className="p-1 rounded-full text-charcoal-muted hover:text-charcoal transition-colors ml-2 shrink-0"
            title="Cancel reply"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Add Comment Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border bg-surface-card shrink-0 flex items-center gap-2.5"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover ring-1 ring-border shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={
            replyingTo
              ? `Reply to @${replyingTo.userName}...`
              : `Add a comment for ${professionalName}...`
          }
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine transition-colors"
        />
        <button
          type="submit"
          disabled={!newCommentText.trim()}
          className="px-3 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0 active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );

  // Desktop side drawer presentation
  if (isDesktopDrawer) {
    return (
      <div className="w-80 lg:w-96 h-[84vh] max-h-[860px] rounded-2xl border border-border shadow-elevated overflow-hidden animate-in slide-in-from-right duration-200">
        {content}
      </div>
    );
  }

  // Mobile bottom sheet / modal presentation
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Mobile Bottom Sheet Box */}
      <div className="relative w-full sm:max-w-md h-[75vh] max-h-[640px] bg-surface rounded-t-3xl sm:rounded-2xl border-t sm:border border-border shadow-elevated z-10 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-250">
        {content}
      </div>
    </div>
  );
};

