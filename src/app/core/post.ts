export const POST_TYPES = ['angular', 'mcp', 'ai', 'frontend', 'node', 'go'] as const;

export type PostType = (typeof POST_TYPES)[number];

export const POST_TYPE_LABELS: Record<PostType, string> = {
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
  description: string;
  date: string;
  updated: string;
  type: PostType;
  tags: string[];
  image: string | null;
  banner: string;
  draft: boolean;
}

export interface PostsFile {
  generatedAt: string;
  posts: Post[];
}
