import UsersListClient from "./UsersListClient";

export const metadata = { title: "مدیریت کاربران" };

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">مدیریت کاربران</h1>
      <UsersListClient />
    </div>
  );
}
