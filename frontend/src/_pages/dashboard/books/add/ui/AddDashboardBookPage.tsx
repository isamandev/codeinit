import { AdminBookForm } from "@/features/book-management";

export default function AddDashboardBookPage() {
  return <AdminBookForm redirectAfter="/dashboard/books" />;
}
