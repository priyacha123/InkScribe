export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  tags: string[];
  author: string;
  coverImage: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
  readingTime: number;
  wordCount: number;
}

export interface BlogPostDraft extends Omit<BlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'readingTime' | 'wordCount'> {}

export interface FileUpload {
  name: string;
  size: number;
  lastModified: number;
  content: string;
  type: 'md' | 'txt';
}
