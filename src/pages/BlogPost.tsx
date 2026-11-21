import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostBySlug, getRelatedPosts, seedSamplePosts } from '@/lib/blogStore';
import { BlogPost } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarkdownPreview from '@/components/MarkdownPreview';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import ShareDialog from '@/components/ShareDialog';
import BlogCard from '@/components/BlogCard';
import ReactionBar from '@/components/ReactionBar';
import { Calendar, Clock, User, ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure sample posts exist (localStorage may clear on preview rebuilds)
    seedSamplePosts();
    
    if (slug) {
      const found = getPostBySlug(slug);
      setPost(found || null);
      if (found) setRelated(getRelatedPosts(found));
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded-lg w-2/3 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-6">This post may have been removed or the link is incorrect.</p>
          <Link to="/" className="text-primary hover:underline font-medium">← Back to blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleExport = (format: 'md' | 'html') => {
    try {
      let content = post.content;
      let ext = 'md';
      let mime = 'text/markdown';

      if (format === 'html') {
        content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${post.title}</title></head><body><h1>${post.title}</h1>\n${post.content}</body></html>`;
        ext = 'html';
        mime = 'text/html';
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.slug}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as .${ext}`);
    } catch {
      toast.error('Export failed. Please try again.');
    }
  };

  const postUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ReadingProgressBar />
      <Navbar />

      <article className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex gap-10">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0 max-w-3xl"
          >
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to blog
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="pill-tag text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 text-foreground leading-tight">{post.title}</h1>

            {post.description && (
              <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">{post.description}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readingTime} min read</span>
              <span className="text-xs text-border">·</span>
              <span>{post.wordCount} words</span>
            </div>

            {post.coverImage && (
              <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl mb-8" loading="lazy" />
            )}

            {/* Content */}
            <MarkdownPreview content={post.content} />

            {/* Reactions */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">React to this post</p>
              <ReactionBar postId={post.id} postSlug={post.slug} postTitle={post.title} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
              <button
                onClick={() => handleExport('md')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-secondary hover:border-primary/30 transition-all duration-200"
              >
                <Download size={14} /> Markdown
              </button>
              <button
                onClick={() => handleExport('html')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-secondary hover:border-primary/30 transition-all duration-200"
              >
                <Download size={14} /> HTML
              </button>
              <ShareDialog url={postUrl} title={post.title} description={post.description} />
            </div>
          </motion.div>

          {/* Sidebar: TOC */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
            <TableOfContents content={post.content} />
          </aside>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="text-2xl font-display font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
