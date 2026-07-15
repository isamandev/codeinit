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

export type ArticleRecord = {
  id: string;
  title: string;
  pages?: number;
  [key: string]: unknown;
};
