import { Bold, Italic, Heading1, Heading2, Heading3, Code, Link as LinkIcon, List, ListOrdered, Quote, Minus, ImageIcon } from 'lucide-react';

interface EditorToolbarProps {
  onInsert: (before: string, after?: string) => void;
}

const EditorToolbar = ({ onInsert }: EditorToolbarProps) => {
  const tools = [
    { icon: <Heading1 size={16} />, action: () => onInsert('# '), label: 'H1', shortcut: 'Ctrl+1' },
    { icon: <Heading2 size={16} />, action: () => onInsert('## '), label: 'H2', shortcut: 'Ctrl+2' },
    { icon: <Heading3 size={16} />, action: () => onInsert('### '), label: 'H3', shortcut: 'Ctrl+3' },
    { type: 'sep' },
    { icon: <Bold size={16} />, action: () => onInsert('**', '**'), label: 'Bold', shortcut: 'Ctrl+B' },
    { icon: <Italic size={16} />, action: () => onInsert('*', '*'), label: 'Italic', shortcut: 'Ctrl+I' },
    { icon: <Code size={16} />, action: () => onInsert('`', '`'), label: 'Code', shortcut: 'Ctrl+`' },
    { type: 'sep' },
    { icon: <List size={16} />, action: () => onInsert('- '), label: 'Bullet list' },
    { icon: <ListOrdered size={16} />, action: () => onInsert('1. '), label: 'Numbered list' },
    { icon: <Quote size={16} />, action: () => onInsert('> '), label: 'Quote' },
    { icon: <Minus size={16} />, action: () => onInsert('\n---\n'), label: 'Divider' },
    { type: 'sep' },
    { icon: <LinkIcon size={16} />, action: () => onInsert('[', '](url)'), label: 'Link' },
    { icon: <ImageIcon size={16} />, action: () => onInsert('![alt](', ')'), label: 'Image' },
  ];

  return (
    <div className="flex items-center gap-0.5 p-2 border-b border-border bg-card overflow-x-auto">
      {tools.map((tool, i) =>
        tool.type === 'sep' ? (
          <div key={i} className="w-px h-5 bg-border mx-1" />
        ) : (
          <button
            key={i}
            onClick={tool.action}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
          >
            {tool.icon}
          </button>
        )
      )}
    </div>
  );
};

export default EditorToolbar;
