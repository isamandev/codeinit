"use client";

import { useState, type SubmitEvent as ReactSubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, setStoredSession, AuthApiError } from "@/entities/user";

import { Button, Field, FieldError, FieldLabel, Input } from "@/shared/ui";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = "وارد کردن نام و نام خانوادگی الزامی است";
    }

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
      const session = await signUp(name, email, password);
      setStoredSession(session);
      router.push("/dashboard");
    } catch (error) {
      setFormError(
        error instanceof AuthApiError
          ? error.message
          : "ثبت‌نام ناموفق بود، لطفا دوباره تلاش کنید",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted px-4 py-10 sm:py-16">
      <div className="w-full max-w-sm border border-border bg-card">
        <div className="border-b border-border px-6 py-6">
          <h1 className="text-2xl font-extrabold text-foreground">ثبت‌نام</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            برای ساخت حساب کاربری در CodeInit اطلاعات زیر را وارد کنید
          </p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {formError && (
              <div className="border-s-4 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel
                htmlFor="signup-name"
                className="text-xs font-bold tracking-normal text-foreground normal-case"
              >
                نام و نام خانوادگی
              </FieldLabel>
              <Input
                id="signup-name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                className="h-11 rounded-none border border-input bg-background px-3 text-sm aria-invalid:border-2 aria-invalid:border-destructive"
              />
              <FieldError errors={errors.name ? [{ message: errors.name }] : undefined} />
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel
                htmlFor="signup-email"
                className="text-xs font-bold tracking-normal text-foreground normal-case"
              >
                آدرس ایمیل
              </FieldLabel>
              <Input
                id="signup-email"
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
                htmlFor="signup-password"
                className="text-xs font-bold tracking-normal text-foreground normal-case"
              >
                رمز عبور
              </FieldLabel>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
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
              {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              حساب کاربری دارید؟{" "}
              <Link
                href="/auth/login"
                className="font-medium text-(--color-scarlet-rose) underline underline-offset-4"
              >
                وارد شوید
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
