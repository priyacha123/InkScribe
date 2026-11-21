import { useRef, useCallback, useEffect, useState } from 'react';
import EditorToolbar from './EditorToolbar';
import MarkdownPreview from './MarkdownPreview';
import { calculateReadingTime, calculateWordCount } from '@/lib/readingTime';
import { Clock, Type, Eye, Code2 } from 'lucide-react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  forcePreview?: boolean;
}

const MarkdownEditor = ({ content, onChange, forcePreview }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreviewOnly, setShowPreviewOnly] = useState(false);
  const wordCount = calculateWordCount(content);
  const readingTime = calculateReadingTime(content);

  // Auto-switch to preview when forcePreview changes to true
  useEffect(() => {
    if (forcePreview) {
      setShowPreviewOnly(true);
    }
  }, [forcePreview]);

  const insertMarkdown = useCallback((before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    onChange(newContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + before.length + selected.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  }, [content, onChange]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      
      switch (e.key) {
        case 'b': e.preventDefault(); insertMarkdown('**', '**'); break;
        case 'i': e.preventDefault(); insertMarkdown('*', '*'); break;
        case '1': e.preventDefault(); insertMarkdown('# '); break;
        case '2': e.preventDefault(); insertMarkdown('## '); break;
        case '3': e.preventDefault(); insertMarkdown('### '); break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [insertMarkdown]);

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between">
        <EditorToolbar onInsert={insertMarkdown} />
        <button
          onClick={() => setShowPreviewOnly(!showPreviewOnly)}
          className="flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          title={showPreviewOnly ? 'Show editor' : 'Full preview'}
        >
          {showPreviewOnly ? <Code2 size={14} /> : <Eye size={14} />}
          {showPreviewOnly ? 'Editor' : 'Preview'}
        </button>
      </div>
      
      {showPreviewOnly ? (
        /* Full-width preview mode */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 border-b border-border font-mono flex items-center gap-1.5">
            <Eye size={12} /> FULL PREVIEW
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            {content ? (
              <div className="max-w-3xl mx-auto">
                <MarkdownPreview content={content} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic text-center">Nothing to preview yet...</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
          {/* Editor */}
          <div className="flex flex-col border-r border-border min-h-0">
            <div className="px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 border-b border-border font-mono">
              MARKDOWN
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="editor-textarea flex-1 p-4 text-sm min-h-[400px]"
              placeholder="Start writing in Markdown..."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 border-b border-border font-mono">
              PREVIEW
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {content ? (
                <MarkdownPreview content={content} />
              ) : (
                <p className="text-muted-foreground text-sm italic">Preview will appear here...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Type size={12} /> {wordCount} words</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {readingTime} min read</span>
      </div>
    </div>
  );
};

export default MarkdownEditor;
