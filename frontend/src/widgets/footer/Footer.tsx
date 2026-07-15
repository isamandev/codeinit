import React from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="site-footer border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="rtl:text-right">
            <h3 className="text-lg font-semibold">کد اینیت</h3>
            <p className="mt-2 text-sm text-gray-600">
              مرجع آموزش و پروژه‌های نمونه — شروعی مطمئن برای یادگیری و ساخت
              نرم‌افزارهای مدرن.
            </p>
          </div>

          <nav className="rtl:text-right" aria-label="لینک‌های سریع">
            <h4 className="text-sm font-medium">پیوندها</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-700 hover:underline">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-gray-700 hover:underline">
                  کتاب‌ها
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-700 hover:underline">
                  پست‌ها
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:underline">
                  تماس
                </Link>
              </li>
            </ul>
          </nav>

          <div className="rtl:text-right">
            <h4 className="text-sm font-medium">حقوقی</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-700 hover:underline">
                  شرایط استفاده
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 hover:underline">
                  سیاست حفظ حریم خصوصی
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-700 hover:underline">
                  راهنما
                </Link>
              </li>
            </ul>
          </div>

          <div className="rtl:text-right">
            <h4 className="text-sm font-medium">با ما در ارتباط باشید</h4>
            <p className="mt-3 text-sm text-gray-600">
              برای اخبار و به‌روزرسانی‌ها ما را دنبال کنید یا به ما پیام بزنید.
            </p>

            <div className="mt-4 flex items-center gap-3 flex-row-reverse">
              <a
                href="https://github.com/isamandev/codeinit"
                aria-label="GitHub"
                className="text-gray-600 hover:text-gray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.6 1.3 3.2 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.7.1-3.6 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.9.2 3.3.1 3.6.7.8 1.2 1.9 1.2 3.2 0 4.4-2.8 5.4-5.4 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0012 .5z" />
                </svg>
              </a>

              <a
                href="https://twitter.com/"
                aria-label="Twitter"
                className="text-gray-600 hover:text-gray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M22 5.9c-.6.3-1.2.6-1.9.7.7-.4 1.2-1.2 1.5-2-.6.4-1.3.6-2.1.8-.6-.6-1.4-1-2.3-1-1.8 0-3.3 1.6-3 3.3-2.5-.1-4.8-1.3-6.3-3-.8 1.3-.3 3 .9 3.9-.5 0-1-.1-1.4-.4 0 1.7 1.2 3.2 3 3.6-.5.1-1 .1-1.5.1-.4 0-.8 0-1.2-.1.8 2.4 3 4.1 5.6 4.1-2 1.6-4.4 2.5-7.1 2.5-.5 0-1 0-1.4-.1 2 1.2 4.4 2 6.9 2 8.2 0 12.8-7 12.8-13v-.6c.9-.6 1.6-1.3 2.2-2.2-.8.4-1.7.6-2.6.7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-4 text-sm text-gray-600 flex flex-col-reverse md:flex-row justify-between items-center rtl:text-right">
          <p className="mt-3 md:mt-0">
            © {year} کد اینیت — همه حقوق محفوظ است.
          </p>
          <p>ساخته شده با ❤️ در ایران</p>
        </div>
      </div>
    </footer>
  );
}
