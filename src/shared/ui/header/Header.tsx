"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/shared/lib/swr/useAuth";

export default function Header() {
  const { user: meData, mutate } = useAuth();
  const user = meData?.name ?? meData?.email ?? null;
  const role = meData?.role ?? null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, []);

  function handleLogout() {
    // call server to clear HttpOnly cookie
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .catch((error) => console.warn("logout failed", error))
      .finally(() => {
        void mutate(null, false);
        window.location.href = "/";
      });
  }

  return (
    <header
      className="w-full sticky top-0 z-40 backdrop-blur border-b h-16"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 h-full">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center bg-[var(--color-scarlet-rose)] text-white font-bold">
            K
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="text-base font-semibold"
              style={{ color: "var(--color-german-camo)" }}
            >
              کد اینیت
            </span>
            <small className="text-xs text-[var(--muted-foreground)] hidden sm:block">
              کتاب‌های برنامه‌نویسی و فرانت‌اند
            </small>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="sm:hidden p-2 rounded-md"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <nav className="hidden sm:flex items-center gap-3">
            <Link
              href="/books"
              className="text-sm text-[var(--color-german-camo)] hover:text-[var(--color-scarlet-rose)]"
            >
              کتاب‌ها
            </Link>
            <Link
              href="/posts"
              className="text-sm text-[var(--color-german-camo)] hover:text-[var(--color-scarlet-rose)]"
            >
              مقالات
            </Link>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((isOpen) => !isOpen)}
                  className="w-9 h-9 rounded-full bg-[var(--color-scarlet-rose)] text-white flex items-center justify-center font-medium"
                >
                  {user ? user.charAt(0).toUpperCase() : "U"}
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 bg-[var(--background)] border rounded shadow-md flex flex-col py-2"
                  >
                    <div className="px-3 py-2 text-sm text-[var(--color-german-camo)]">
                      {user}
                    </div>
                    <div className="px-3 text-xs text-[var(--muted-foreground)]">
                      {role ?? "کاربر"}
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      داشبورد
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-left px-3 py-2 hover:bg-gray-100"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-[var(--color-german-camo)] hover:text-[var(--color-scarlet-rose)]"
                >
                  ورود
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm text-[var(--color-german-camo)] hover:text-[var(--color-scarlet-rose)]"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </nav>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 sm:hidden">
            <div className="bg-[var(--background)] border-t">
              <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
                <Link
                  href="/books"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[var(--color-german-camo)]"
                >
                  کتاب‌ها
                </Link>
                <Link
                  href="/posts"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[var(--color-german-camo)]"
                >
                  مقالات
                </Link>
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-scarlet-rose)] text-white flex items-center justify-center">
                        {user ? user.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-[var(--color-german-camo)]">
                          {user}
                        </span>
                        <small className="text-xs text-[var(--muted-foreground)]">
                          {role ?? "کاربر"}
                        </small>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="px-2 py-2 text-sm"
                    >
                      داشبورد
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-2 py-2 text-sm text-left"
                    >
                      خروج
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-[var(--color-german-camo)]"
                    >
                      ورود
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-[var(--color-german-camo)]"
                    >
                      ثبت‌نام
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
