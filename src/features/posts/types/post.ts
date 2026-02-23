export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
}

export type PostSummary = Pick<
  Post,
  "id" | "title" | "excerpt" | "publishedAt"
>;
