import { Link } from 'react-router-dom';
import { BlogPost } from '@/lib/types';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactionBar from './ReactionBar';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group glow-card block rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      >
        {post.coverImage && (
          <div className="relative overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-44 object-cover group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="pill-tag text-[10px]">
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-lg font-display font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
            {post.title}
          </h2>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {post.description || 'No description'}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
              <User size={10} className="text-accent-foreground" />
            </div>
            <span className="font-medium">{post.author}</span>
          </div>

          <div className="mb-3">
            <ReactionBar postId={post.id} postSlug={post.slug} postTitle={post.title} />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readingTime} min
              </span>
            </div>
            <span className="flex items-center gap-1 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
