import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { FileUpload } from '@/lib/types';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileLoad: (content: string, fileName: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUploader = ({ onFileLoad }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext !== 'md' && ext !== 'txt') {
      const msg = `Unsupported file type ".${ext}". Please upload .md or .txt files.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const msg = `File "${file.name}" is too large (max 5MB).`;
      setError(msg);
      toast.error(msg);
      return;
    }

    if (file.size === 0) {
      const msg = `File "${file.name}" is empty.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      const msg = `Failed to read "${file.name}". Please try again.`;
      setError(msg);
      toast.error(msg);
    };

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content || content.trim().length === 0) {
        const msg = `File "${file.name}" appears to be empty.`;
        setError(msg);
        toast.error(msg);
        return;
      }

      const fileInfo: FileUpload = {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        content,
        type: ext as 'md' | 'txt',
      };
      setUploadedFiles(prev => [...prev, fileInfo]);
      onFileLoad(content, file.name);
      toast.success(`Loaded "${file.name}" successfully`);
    };

    reader.readAsText(file);
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    files.forEach(processFile);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(processFile);
    }
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        }`}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload size={24} className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop <span className="font-mono text-foreground font-medium">.md</span> or <span className="font-mono text-foreground font-medium">.txt</span> files here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1.5">Max 5MB per file</p>
        <input
          id="file-upload"
          type="file"
          accept=".md,.txt"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-xl text-sm">
              <FileText size={16} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(file.size)} · {file.type.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
