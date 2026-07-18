"use client";

import { useState, type SubmitEvent as ReactSubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, setStoredSession, AuthApiError } from "@/entities/user";

import { Button, Field, FieldError, FieldLabel, Input, Separator } from "@/shared/ui";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: FieldErrors = {};

    if (!email.trim()) {
      nextErrors.email = "وارد کردن ایمیل الزامی است";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "ایمیل وارد شده معتبر نیست";
    }

    if (!password) {
      nextErrors.password = "وارد کردن رمز عبور الزامی است";
    } else if (password.length < 6) {
      nextErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: ReactSubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const session = await signIn(email, password);
      setStoredSession(session);
      router.push(session.user.role === "ADMIN" ? "/panel" : "/dashboard");
    } catch (error) {
      setFormError(
        error instanceof AuthApiError
          ? error.message
          : "ورود ناموفق بود، لطفا دوباره تلاش کنید",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGithubClick() {
    setFormError("ورود با گیت‌هاب به‌زودی فعال می‌شود");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted px-4 py-10 sm:py-16">
      <div className="w-full max-w-sm border border-border bg-card">
        <div className="border-b border-border px-6 py-6">
          <h1 className="text-2xl font-extrabold text-foreground">ورود</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            برای دسترسی به CodeInit اطلاعات حساب خود را وارد کنید
          </p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {formError && (
              <div className="border-s-4 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel
                htmlFor="signin-email"
                className="text-xs font-bold tracking-normal text-foreground normal-case"
              >
                آدرس ایمیل
              </FieldLabel>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                className="h-11 rounded-none border border-input bg-background px-3 text-sm aria-invalid:border-2 aria-invalid:border-destructive"
              />
              <FieldError errors={errors.email ? [{ message: errors.email }] : undefined} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel
                htmlFor="signin-password"
                className="text-xs font-bold tracking-normal text-foreground normal-case"
              >
                رمز عبور
              </FieldLabel>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                className="h-11 rounded-none border border-input bg-background px-3 text-sm aria-invalid:border-2 aria-invalid:border-destructive"
              />
              <FieldError
                errors={errors.password ? [{ message: errors.password }] : undefined}
              />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-none bg-(--color-scarlet-rose) text-sm font-bold tracking-normal text-white hover:bg-(--color-rich-coral) disabled:opacity-60"
            >
              {isSubmitting ? "در حال ورود..." : "ورود"}
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs tracking-normal text-muted-foreground">یا ادامه با</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGithubClick}
              className="h-11 w-full rounded-none gap-2 text-sm font-bold tracking-normal normal-case"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-4"
              >
                <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.6 1.3 3.2 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.7.1-3.6 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.9.2 3.3.1 3.6.7.8 1.2 1.9 1.2 3.2 0 4.4-2.8 5.4-5.4 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0012 .5z" />
              </svg>
              گیت‌هاب
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              حساب کاربری ندارید؟{" "}
              <Link
                href="/auth/register"
                className="font-medium text-(--color-scarlet-rose) underline underline-offset-4"
              >
                ثبت‌نام کنید
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
