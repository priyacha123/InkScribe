import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface EmojiReaction {
  emoji: string;
  label: string;
}

const REACTIONS: EmojiReaction[] = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🚀', label: 'Rocket' },
];

interface ReactionBarProps {
  postId: string;
  postSlug: string;
  postTitle: string;
}

const getReactionKey = (postId: string) => `blogora-reactions-${postId}`;

const ReactionBar = ({ postId, postSlug, postTitle }: ReactionBarProps) => {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(getReactionKey(postId));
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);

  const handleReact = useCallback((e: React.MouseEvent, emoji: string) => {
    e.preventDefault();
    e.stopPropagation();

    setCounts(prev => {
      const updated = { ...prev, [emoji]: (prev[emoji] || 0) + 1 };
      localStorage.setItem(getReactionKey(postId), JSON.stringify(updated));
      return updated;
    });

    setAnimatingEmoji(emoji);
    setTimeout(() => setAnimatingEmoji(null), 600);
  }, [postId]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/blog/${postSlug}`;

    if (navigator.share) {
      navigator.share({ title: postTitle, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  }, [postSlug, postTitle]);

  return (
    <div className="flex items-center gap-1.5">
      {REACTIONS.map(({ emoji, label }) => (
        <div key={emoji} className="relative">
          <button
            onClick={(e) => handleReact(e, emoji)}
            className="relative flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/80 hover:bg-secondary text-xs transition-all duration-200 hover:scale-110 active:scale-95"
            title={label}
          >
            <span className="text-sm">{emoji}</span>
            {(counts[emoji] || 0) > 0 && (
              <span className="text-[10px] font-bold text-muted-foreground min-w-[12px]">
                {counts[emoji]}
              </span>
            )}
          </button>
          <AnimatePresence>
            {animatingEmoji === emoji && (
              <motion.span
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -30, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg pointer-events-none"
              >
                {emoji}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}

      <button
        onClick={handleShare}
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs transition-all duration-200 hover:scale-110 active:scale-95 ml-0.5"
        title="Share"
      >
        <Share2 size={12} />
      </button>
    </div>
  );
};

export default ReactionBar;
