"use client";

import React, { useRef, useState } from "react";

export default function DraggableScroller({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(event: React.PointerEvent) {
    const element = ref.current;
    if (!element) return;
    isDownRef.current = true;
    setDragging(true);
    startXRef.current = event.clientX;
    scrollLeftRef.current = element.scrollLeft;
    (event.target as Element)?.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    const element = ref.current;
    if (!element || !isDownRef.current) return;
    const deltaX = event.clientX - startXRef.current;
    element.scrollLeft = scrollLeftRef.current - deltaX;
  }

  function endDrag(event?: React.PointerEvent) {
    isDownRef.current = false;
    setDragging(false);
    try {
      if (event?.pointerId)
        (event.target as Element)?.releasePointerCapture?.(event.pointerId);
    } catch {}
  }

  function onClickCapture(event: React.MouseEvent) {
    if (dragging) event.stopPropagation();
  }

  return (
    <div
      ref={ref}
      className={`flex gap-4 ${className} no-scrollbar overflow-x-auto py-2`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      {children}
    </div>
  );
}
