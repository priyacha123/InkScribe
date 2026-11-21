import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarkdownEditor from '@/components/MarkdownEditor';
import FileUploader from '@/components/FileUploader';
import { savePost, getPostById, saveDraft, loadDraft, clearDraft } from '@/lib/blogStore';
import { toast } from 'sonner';
import { Save, Send, FileUp, X, Tag, Sparkles, Loader2 } from 'lucide-react';

const Editor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [isStructuring, setIsStructuring] = useState(false);
  const [showPreviewAfterStructure, setShowPreviewAfterStructure] = useState(false);

  useEffect(() => {
    if (editId) {
      const post = getPostById(editId);
      if (post) {
        setTitle(post.title);
        setDescription(post.description);
        setContent(post.content);
        setTags(post.tags);
        setAuthor(post.author);
        setCoverImage(post.coverImage);
        setMetaTitle(post.metaTitle);
        setMetaDescription(post.metaDescription);
      } else {
        toast.error('Post not found');
      }
    } else {
      const draft = loadDraft();
      if (draft) {
        setContent(draft.content);
        setTitle(draft.title);
        toast.info('Draft restored');
      }
    }
  }, [editId]);

  useEffect(() => {
    if (!editId && (content || title)) {
      const timer = setTimeout(() => saveDraft(content, title), 2000);
      return () => clearTimeout(timer);
    }
  }, [content, title, editId]);

  const handleSave = useCallback((status: 'draft' | 'published') => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please add some content');
      return;
    }

    try {
      const post = savePost({
        id: editId || undefined,
        title,
        description,
        content,
        tags,
        author: author || 'Anonymous',
        coverImage,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
        status,
        publishDate: status === 'published' ? new Date().toISOString() : undefined,
      });

      clearDraft();
      toast.success(status === 'published' ? 'Post published! 🎉' : 'Draft saved!');
      navigate(status === 'published' ? `/blog/${post.slug}` : '/dashboard');
    } catch {
      toast.error(`Failed to ${status === 'published' ? 'publish' : 'save'}. Please try again.`);
    }
  }, [title, description, content, tags, author, coverImage, metaTitle, metaDescription, editId, navigate]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const handleFileLoad = (fileContent: string, fileName: string) => {
    setContent(fileContent);
    if (!title) {
      setTitle(fileName.replace(/\.(md|txt)$/, '').replace(/[-_]/g, ' '));
    }
    setShowImport(false);
    toast.success(`Loaded ${fileName}`);
  };

  const handleStructure = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please add some content first');
      return;
    }
    setIsStructuring(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/structure-blog`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ content, title }),
        }
      );

      if (!resp.ok) {
        let errorMsg = 'Failed to structure content';
        try {
          const err = await resp.json();
          errorMsg = err.error || errorMsg;
        } catch { /* ignore */ }
        throw new Error(errorMsg);
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let result = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) result += token;
          } catch { /* partial JSON, skip */ }
        }
      }

      if (result) {
        setContent(result);
        setShowPreviewAfterStructure(true);
        toast.success('Content restructured! Showing preview.');
      } else {
        toast.warning('No structured content returned.');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to structure content');
    } finally {
      setIsStructuring(false);
    }
  }, [content, title]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{editId ? 'Edit Post' : 'Write a Post'}</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleStructure}
              disabled={isStructuring}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-all disabled:opacity-50"
            >
              {isStructuring ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isStructuring ? 'Structuring...' : 'Structure'}
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-sm hover:bg-secondary hover:border-primary/30 transition-all"
            >
              <FileUp size={16} /> Import
            </button>
            <button
              onClick={() => handleSave('draft')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-secondary hover:border-primary/30 transition-all"
            >
              <Save size={16} /> Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-md hover:shadow-primary/20 transition-all"
            >
              <Send size={16} /> Publish
            </button>
          </div>
        </div>

        {/* File Import */}
        {showImport && (
          <div className="mb-6 animate-fade-in">
            <FileUploader onFileLoad={handleFileLoad} />
          </div>
        )}

        {/* Post metadata */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-2xl sm:text-3xl font-display font-bold bg-transparent outline-none placeholder:text-muted-foreground/40 text-foreground"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description..."
            className="w-full text-base bg-transparent outline-none placeholder:text-muted-foreground/40 text-muted-foreground"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Cover image URL"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={14} className="text-muted-foreground" />
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-tag text-tag-foreground text-xs font-medium">
                {tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-foreground transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag..."
              className="bg-transparent text-sm outline-none w-28 text-foreground placeholder:text-muted-foreground/40"
            />
          </div>

          {/* SEO toggle */}
          <button
            onClick={() => setShowMeta(!showMeta)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            {showMeta ? 'Hide' : 'Show'} SEO fields
          </button>
          {showMeta && (
            <div className="space-y-3 animate-fade-in">
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Meta title (for SEO)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Meta description (for SEO)"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Editor */}
        <MarkdownEditor content={content} onChange={setContent} forcePreview={showPreviewAfterStructure} />
      </div>

      <Footer />
    </div>
  );
};

export default Editor;
