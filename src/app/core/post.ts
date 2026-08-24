export const TAGS = ['angular', 'mcp', 'ai', 'frontend', 'node', 'go'] as const;

export type Tag = (typeof TAGS)[number];

export const TAG_LABELS: Record<Tag, string> = {
  angular: 'Angular',
  mcp: 'MCP',
  ai: 'AI',
  frontend: 'Front-end',
  node: 'Node.js',
  go: 'Go'
};

export interface Post {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  date: string;
  updated: string;
  mainTag: Tag;
  tags: Tag[];
  image: string | null;
  banner: string;
  draft: boolean;
}

export interface PostsFile {
  generatedAt: string;
  posts: Post[];
}
