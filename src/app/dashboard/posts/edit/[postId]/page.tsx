"use client";

import React from "react";

type Props = { params: { postId: string } };

export default function Page({ params }: Props) {
  return <div>Edit Post {params.postId}</div>;
}
