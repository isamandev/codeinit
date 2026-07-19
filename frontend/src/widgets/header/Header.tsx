"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession, clearStoredSession } from "@/entities/user";
import { SITE_RESTRICTED_TO_JOBS } from "@/shared/config/site-restriction";

export default function Header() {
  const { user: meData, mutate } = useSession();
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
    clearStoredSession();
    void mutate(null, false);
    window.location.href = "/";
  }

  const navLinks = [
    { href: "/books", label: "کتاب‌ها" },
    { href: "/posts", label: "مقالات" },
    { href: "/jobs", label: "فرصت‌های شغلی" },
  ];

  return (
    <header
      className="w-full sticky top-0 z-40 flex h-14 items-center gap-6 border-b-2 px-6"
      style={{
        background: "var(--foreground)",
        color: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-[15px] font-bold tracking-tight"
        style={{ color: "var(--background)" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        کد اینیت
      </Link>

      <nav className="hidden flex-1 items-center gap-1 sm:flex">
        {navLinks.map((link) =>
          SITE_RESTRICTED_TO_JOBS ? (
            <span
              key={link.href}
              aria-disabled="true"
              className="cursor-not-allowed px-3 py-1.5 text-[13px] font-medium text-[var(--color-neutral-300)] opacity-50"
            >
              {link.label}
            </span>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-[13px] font-medium text-[var(--color-neutral-300)] hover:text-[var(--background)]"
            >
              {link.label}
            </Link>
          ),
        )}
      </nav>

      <div className="hidden items-center gap-2 sm:flex">
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((isOpen) => !isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full font-medium text-white"
              style={{ background: "var(--color-scarlet-rose)" }}
            >
              {user ? user.charAt(0).toUpperCase() : "U"}
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 flex w-48 flex-col rounded-none border py-2 shadow-md"
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="px-3 py-2 text-sm">{user}</div>
                <div className="px-3 text-xs text-[var(--muted-foreground)]">
                  {role ?? "کاربر"}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="px-3 py-2 text-sm hover:bg-black/5"
                >
                  داشبورد
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-left text-sm hover:bg-black/5"
                >
                  خروج
                </button>
              </div>
            )}
          </div>
        ) : SITE_RESTRICTED_TO_JOBS ? null : (
          <>
            <Link
              href="/auth/login"
              className="border-2 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--background)]"
              style={{ borderColor: "var(--color-neutral-600)" }}
            >
              ورود
            </Link>
            <Link
              href="/auth/register"
              className="border-2 px-3.5 py-1.5 text-[13px] font-semibold text-white"
              style={{
                background: "var(--color-scarlet-rose)",
                borderColor: "var(--color-scarlet-rose)",
              }}
            >
              ثبت‌نام
            </Link>
          </>
        )}
      </div>

      {SITE_RESTRICTED_TO_JOBS ? null : (
        <>
          <button
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="flex h-9 w-9 items-center justify-center sm:hidden"
            style={{ color: "var(--background)" }}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
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
                fill="none"
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

          {menuOpen && (
            <div className="absolute left-0 right-0 top-full z-50 sm:hidden">
              <div
                className="border-t-2"
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex flex-col gap-2 px-4 py-3">
                  {navLinks.map((link) =>
                    SITE_RESTRICTED_TO_JOBS ? (
                      <span
                        key={link.href}
                        aria-disabled="true"
                        className="cursor-not-allowed text-sm opacity-50"
                      >
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 px-1">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                          style={{ background: "var(--color-scarlet-rose)" }}
                        >
                          {user ? user.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm">{user}</span>
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
                        className="px-2 py-2 text-left text-sm"
                      >
                        خروج
                      </button>
                    </div>
                  ) : SITE_RESTRICTED_TO_JOBS ? null : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm"
                      >
                        ورود
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setMenuOpen(false)}
                        className="text-sm"
                      >
                        ثبت‌نام
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </header>
  );
}
