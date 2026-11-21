import { extractHeadings } from '@/lib/markdownParser';

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const headings = extractHeadings(content);
  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </h4>
      {headings.map((heading, i) => (
        <a
          key={i}
          href={`#${heading.id}`}
          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
          style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
};

export default TableOfContents;
