import { BlogPost } from './types';
import { slugify } from './slugify';
import { calculateReadingTime, calculateWordCount } from './readingTime';

const STORAGE_KEY = 'blogora_posts';
const DRAFT_KEY = 'blogora_draft';

export function getAllPosts(): BlogPost[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts().filter(p => p.status === 'published').sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

export function getPostById(id: string): BlogPost | undefined {
  return getAllPosts().find(p => p.id === id);
}

export function savePost(post: Partial<BlogPost> & { content: string; title: string }): BlogPost {
  const posts = getAllPosts();
  const now = new Date().toISOString();
  
  if (post.id) {
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      const updated: BlogPost = {
        ...posts[index],
        ...post,
        slug: slugify(post.title),
        updatedAt: now,
        readingTime: calculateReadingTime(post.content),
        wordCount: calculateWordCount(post.content),
      };
      posts[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      return updated;
    }
  }

  const newPost: BlogPost = {
    id: crypto.randomUUID(),
    title: post.title,
    description: post.description || '',
    content: post.content,
    slug: slugify(post.title),
    tags: post.tags || [],
    author: post.author || 'Anonymous',
    coverImage: post.coverImage || '',
    publishDate: post.publishDate || now,
    createdAt: now,
    updatedAt: now,
    status: post.status || 'draft',
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.description || '',
    readingTime: calculateReadingTime(post.content),
    wordCount: calculateWordCount(post.content),
  };

  posts.push(newPost);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
}

export function deletePost(id: string): void {
  const posts = getAllPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

export function saveDraft(content: string, title: string): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, title, savedAt: Date.now() }));
}

export function loadDraft(): { content: string; title: string; savedAt: number } | null {
  const data = localStorage.getItem(DRAFT_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.toLowerCase();
  return getPublishedPosts().filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.content.toLowerCase().includes(q)
  );
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getPublishedPosts()
    .filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t)))
    .slice(0, limit);
}

// Seed some sample posts
export function seedSamplePosts(): void {
  if (getAllPosts().length > 0) return;
  
  const samplePosts = [
    {
      title: "Getting Started with Markdown",
      description: "A comprehensive guide to writing in Markdown, from basic syntax to advanced features.",
      content: `## Why Markdown?

Markdown is **everywhere**. It's used in:

- GitHub repositories
- Documentation sites
- Blog platforms
- Note-taking apps

## Basic Syntax

### Headings

Use \`#\` symbols for headings:

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
\`\`\`

### Emphasis

- **Bold text** using \`**bold**\`
- *Italic text* using \`*italic*\`
- ~~Strikethrough~~ using \`~~strikethrough~~\`

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

### Links and Images

[Visit GitHub](https://github.com) to learn more.

### Tables

| Feature | Support |
|---------|---------|
| Tables | ✅ |
| Code blocks | ✅ |
| Images | ✅ |

### Blockquotes

> Markdown is intended to be as easy-to-read and easy-to-write as is feasible.
> — John Gruber

## Conclusion

Markdown makes writing for the web simple and enjoyable. Start using it today!`,
      tags: ["markdown", "tutorial", "writing"],
      author: "Blogora Team",
      status: 'published' as const,
    },
    {
      title: "The Art of Technical Writing",
      description: "Learn how to communicate complex ideas clearly through effective technical writing.",
      content: `Good technical writing bridges the gap between complexity and understanding.

## Principles

1. **Clarity over cleverness** — Simple words beat jargon
2. **Structure matters** — Use headings, lists, and paragraphs
3. **Show, don't just tell** — Include examples and code snippets
4. **Know your audience** — Adapt your language accordingly

## Writing Process

### 1. Research

Before writing, understand your topic deeply. Read documentation, experiment with code, and take notes.

### 2. Outline

Create a skeleton structure:

\`\`\`
- Introduction
- Problem statement
- Solution approach
- Implementation
- Conclusion
\`\`\`

### 3. Draft

Write freely without self-editing. Get your ideas on paper first.

### 4. Edit

> The first draft is just you telling yourself the story.
> — Terry Pratchett

Review for:
- Accuracy
- Clarity
- Completeness
- Grammar

## Tools of the Trade

| Tool | Purpose |
|------|---------|
| Markdown | Writing format |
| Git | Version control |
| Grammarly | Grammar checking |
| Hemingway | Readability |

Happy writing! ✍️`,
      tags: ["writing", "technical", "tips"],
      author: "Blogora Team",
      status: 'published' as const,
    },
    {
      title: "Building with React and TypeScript",
      description: "A practical guide to building type-safe React applications with TypeScript.",
      content: `TypeScript brings type safety to React development, catching errors before they reach production.

## Setup

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
\`\`\`

## Core Concepts

### Typing Props

\`\`\`typescript
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}

const Button = ({ label, variant = 'primary', onClick }: ButtonProps) => (
  <button className={variant} onClick={onClick}>
    {label}
  </button>
);
\`\`\`

### Using Hooks with Types

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
\`\`\`

### Generic Components

\`\`\`typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
\`\`\`

## Best Practices

- Always define prop interfaces
- Use \`const\` assertions for fixed values
- Leverage union types for variants
- Keep types close to where they're used

## Conclusion

TypeScript + React = 🔥 Developer experience.`,
      tags: ["react", "typescript", "development"],
      author: "Blogora Team",
      status: 'published' as const,
    },
  ];

  samplePosts.forEach(post => savePost(post));
}

// Initialize on module load — ensures posts exist regardless of which page loads first
seedSamplePosts();
