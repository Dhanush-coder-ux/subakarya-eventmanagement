import React, { useState } from 'react';
import {
  X,
  Send,
  Heart,
  Trash2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

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

  if (!isOpen) return null;

  const currentComments = reelComments.filter((c) => c.reelId === reelId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    addReelComment(reelId, newCommentText.trim(), {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
    });

    setNewCommentText('');
  };

  const content = (
    <div
      className="flex flex-col h-full bg-surface select-none comments-drawer"
      data-scrollable="true"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-wine" />
          <h3 className="font-bold text-sm text-charcoal">Comments</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand text-charcoal border border-sand-dark">
            {currentComments.length}
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
        {currentComments.length === 0 ? (
          <div className="py-12 text-center text-charcoal-muted space-y-2">
            <div className="w-12 h-12 rounded-full bg-sand/60 text-wine flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-charcoal">No comments yet</p>
            <p className="text-[11px]">Start the conversation by sharing your thoughts!</p>
          </div>
        ) : (
          currentComments.map((comment) => {
            const isMyComment = comment.userId === currentUser.id;
            return (
              <div key={comment.id} className="pt-3 flex items-start justify-between gap-3 group">
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
                  </div>
                </div>

                {/* Comment Actions (Like & Delete) */}
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

                  {isMyComment && (
                    <button
                      type="button"
                      onClick={() => deleteReelComment(comment.id)}
                      className="p-1 text-charcoal-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={`Add a comment for ${professionalName}...`}
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
      <div className="w-80 lg:w-96 h-[80vh] max-h-[800px] rounded-2xl border border-border shadow-elevated overflow-hidden animate-in slide-in-from-right duration-200">
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
