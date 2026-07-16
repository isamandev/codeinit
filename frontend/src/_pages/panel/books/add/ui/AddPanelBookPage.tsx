import { AdminBookForm } from "@/features/book-management";

export default function AddPanelBookPage() {
  return <AdminBookForm redirectAfter="/panel/books" />;
}
