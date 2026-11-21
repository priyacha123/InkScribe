import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/types';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactionBar from './ReactionBar';

interface FeaturedPostProps {
  post: BlogPost;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group glow-card block rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative overflow-hidden min-h-[200px] md:min-h-[300px]">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-accent" />
            )}
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 4).map(tag => (
                <span key={tag} className="pill-tag text-[11px]">
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-card-foreground group-hover:text-primary transition-colors duration-200 mb-3 leading-tight">
              {post.title}
            </h2>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
              {post.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <User size={11} className="text-accent-foreground" />
              </div>
              <span className="font-medium">{post.author}</span>
            </div>

            <div className="mb-4">
              <ReactionBar postId={post.id} postSlug={post.slug} postTitle={post.title} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {post.readingTime} min read
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Read <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default FeaturedPost;
