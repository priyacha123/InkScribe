import { useState, useEffect, useMemo } from 'react';
import { getPublishedPosts, getAllTags, seedSamplePosts, searchPosts } from '@/lib/blogStore';
import { BlogPost } from '@/lib/types';
import BlogCard from '@/components/BlogCard';
import FeaturedPost from '@/components/FeaturedPost';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, X, ArrowRight, PenLine, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 6;

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    seedSamplePosts();
    setPosts(getPublishedPosts());
    setTags(getAllTags());
  }, []);

  const featuredPost = useMemo(() => posts[0] || null, [posts]);
  const remainingPosts = useMemo(() => posts.slice(1), [posts]);

  const filtered = useMemo(() => {
    let result = query ? searchPosts(query) : remainingPosts;
    if (selectedTag) {
      result = result.filter(p => p.tags.includes(selectedTag));
    }
    return result;
  }, [remainingPosts, query, selectedTag]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const showFeatured = !query && !selectedTag && page === 1 && featuredPost;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-6">
              AI-Powered Blog Platform
            </p>

            <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight text-foreground mb-6">
              Blogora
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
              Write, publish, and share stories that matter. A clean space for bold ideas.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <PenLine size={16} />
                Start Writing
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-12 mt-16"
          >
            {[
              { label: 'Posts', value: posts.length },
              { label: 'Topics', value: tags.length },
              { label: 'AI Assist', value: '✓' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {showFeatured && (
        <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 pt-12 pb-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">Featured</h2>
          </div>
          <FeaturedPost post={featuredPost} />
        </section>
      )}

      {/* Search & Filters */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 w-full max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search posts..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setSelectedTag(null); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !selectedTag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              All
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => { setSelectedTag(selectedTag === tag ? null : tag); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'pill-tag'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 pb-16">
        {paginated.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-display font-bold">No posts found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                  p === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
