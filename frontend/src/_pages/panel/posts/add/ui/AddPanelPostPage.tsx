import { PostForm } from "@/features/post-management";

export default function AddPanelPostPage() {
  return <PostForm redirectAfter="/panel/posts" />;
}
