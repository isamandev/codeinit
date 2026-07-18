"use client";

import { useMemo, useState } from "react";
import { mockJobs, type Job, type JobPosition, type JobType } from "@/entities/job";
import { Button } from "@/shared/ui";
import { usePushNotifications } from "@/shared/hooks/usePushNotifications";

type TypeFilterValue = "all" | JobType;
type PositionFilterValue = "all" | JobPosition;

const TYPE_FILTER_LABELS: Record<TypeFilterValue, string> = {
  all: "تمام موضع‌ها",
  remote: "دورکاری",
  fulltime: "تمام‌وقت",
  startup: "استارت‌آپ",
  contract: "قراردادی",
};

const POSITION_FILTER_LABELS: Record<PositionFilterValue, string> = {
  all: "تمام سطح‌ها",
  junior: "جونیور",
  midlevel: "میان‌سطح",
  senior: "سنیور",
};

export default function JobsPage() {
  const [activeType, setActiveType] = useState<TypeFilterValue>("all");
  const [activePosition, setActivePosition] =
    useState<PositionFilterValue>("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const { isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  const cities = useMemo(
    () => ["all", ...new Set(mockJobs.map((job) => job.city))],
    [],
  );

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job: Job) => {
      if (activeType !== "all" && job.type !== activeType) return false;
      if (activePosition !== "all" && job.position !== activePosition)
        return false;
      if (activeCity !== "all" && job.city !== activeCity) return false;
      return true;
    });
  }, [activeType, activePosition, activeCity]);

  return (
    <div dir="rtl" className="text-right">
      <section className="border-b-2 border-border bg-card px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-heading text-3xl sm:text-4xl">
            شغل‌های مهندسی Frontend
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            فرصت‌های کاری با شرکت‌های برتر فناوری را کاوش کنید
          </p>
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl sm:text-2xl">موضع‌های باز</h2>
            <span className="text-xs text-muted-foreground">
              {filteredJobs.length} شغل
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">
                نوع کار
              </label>
              <select
                value={activeType}
                onChange={(event) =>
                  setActiveType(event.target.value as TypeFilterValue)
                }
                dir="rtl"
                className="w-full border border-border bg-background p-2 text-sm"
              >
                {(Object.keys(TYPE_FILTER_LABELS) as TypeFilterValue[]).map(
                  (value) => (
                    <option key={value} value={value}>
                      {TYPE_FILTER_LABELS[value]}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">
                سطح
              </label>
              <select
                value={activePosition}
                onChange={(event) =>
                  setActivePosition(event.target.value as PositionFilterValue)
                }
                dir="rtl"
                className="w-full border border-border bg-background p-2 text-sm"
              >
                {(
                  Object.keys(POSITION_FILTER_LABELS) as PositionFilterValue[]
                ).map((value) => (
                  <option key={value} value={value}>
                    {POSITION_FILTER_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-wider text-muted-foreground uppercase">
                مکان
              </label>
              <select
                value={activeCity}
                onChange={(event) => setActiveCity(event.target.value)}
                dir="rtl"
                className="w-full border border-border bg-background p-2 text-sm"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === "all" ? "تمام مکان‌ها" : city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 border border-border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-lg text-primary">{job.icon}</span>
                  <div className="flex-1">
                    <p className="mb-1 text-xs tracking-wider text-primary uppercase">
                      {job.company}
                    </p>
                    <h3 className="font-heading text-lg leading-tight">
                      {job.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-foreground">
                  {job.description}
                </p>

                <p className="text-xs text-muted-foreground">
                  {job.location}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-accent px-2 py-1 text-xs text-accent-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex justify-end gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
                  <span>{job.posted} 📅</span>
                  <span>{job.salary} 💰</span>
                </div>

                <Button
                  className="mt-2 self-start"
                  nativeButton={false}
                  render={
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  مشاهده موضع ←
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t-2 border-border pt-6 text-right">
            <p className="text-muted-foreground">
              آنچه را که دنبالش هستید پیدا نمی‌کنید؟{" "}
              <button
                type="button"
                onClick={isSubscribed ? unsubscribe : subscribe}
                className="font-semibold text-primary hover:underline"
              >
                {isSubscribed
                  ? "لغو اشتراک هشدارها"
                  : "برای هشدارها مشترک شوید"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
