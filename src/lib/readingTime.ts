export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
