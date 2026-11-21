import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllPosts, deletePost } from '@/lib/blogStore';
import { BlogPost } from '@/lib/types';
import { Pencil, Trash2, Eye, Clock, FileText, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(getAllPosts().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  const handleDelete = (id: string) => {
    if (!confirm('Delete this post?')) return;
    deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.success('Post deleted');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <Link
            to="/editor"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-md hover:shadow-primary/20 transition-all duration-200"
          >
            <FileText size={16} /> New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === f ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && ` (${posts.filter(p => p.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Post list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No posts yet.</p>
            <Link to="/editor" className="text-primary hover:underline mt-2 inline-block font-medium">Write your first post →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-md font-semibold ${
                      post.status === 'published'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {post.status}
                    </span>
                    <h3 className="text-sm font-semibold truncate text-foreground">{post.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User size={10} /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                    <span>{post.wordCount} words</span>
                    <span>{post.readingTime} min</span>
                    {post.tags.length > 0 && (
                      <span className="truncate max-w-[120px]">{post.tags.join(', ')}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  {post.status === 'published' && (
                    <button
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/editor?edit=${post.id}`)}
                    className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2.5 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
