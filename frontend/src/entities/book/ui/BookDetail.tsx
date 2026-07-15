"use client";

type Props = {
  id?: string;
  title?: string;
  author?: string;
  imageUrl?: string;
  description?: string;
  aiIntro?: string;
  published?: string;
  pages?: number;
  publisher?: string;
  isbn?: string;
  price?: number | string;
  tags?: string[];
  categories?: string[];
  recommendations?: unknown[];
};

export default function BookDetail(_props: Props) {
  return null;
}
