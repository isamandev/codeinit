import { UsersListClient } from "@/features/user-management";

export const metadata = { title: "مدیریت کاربران" };

export default function PanelUsersPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">مدیریت کاربران</h1>
      <UsersListClient />
    </div>
  );
}
