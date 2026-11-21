import { useState, useCallback } from 'react';
import { Share2, Copy, Check, Twitter, Linkedin, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface ShareDialogProps {
  url: string;
  title: string;
  description?: string;
}

const ShareDialog = ({ url, title, description = '' }: ShareDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch {
        // User cancelled or API failed — fall through to dialog
      }
    }

    setOpen(prev => !prev);
  }, [title, description, url]);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'Twitter / X',
      icon: <Twitter size={14} />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={14} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={14} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-200"
        title="Share"
      >
        <Share2 size={14} />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 right-0 z-50 w-64 rounded-2xl border border-border bg-card shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs font-semibold text-foreground mb-3">Share this post</p>

              {/* Copy link */}
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary hover:bg-muted text-sm text-foreground transition-colors mb-3"
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>

              {/* Social links */}
              <div className="space-y-1">
                {socialLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareDialog;
