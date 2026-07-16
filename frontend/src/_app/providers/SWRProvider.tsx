"use client";

import { SWRConfig } from "swr";
import React from "react";
import { fetcher } from "@/shared/lib";

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
