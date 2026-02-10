"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
}

const Button = ({ children, type = "primary", onClick }: ButtonProps) => {
  const basicStyles =
    "min-h-full p-2 border-2 rounded-2xl font-semibold drop-shadow-xs hover:drop-shadow-md transition-all duration-200";
  const typeStyles: Record<string, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    tertiary: "btn-tertiary",
  };

  return (
    <button className={cn(basicStyles, typeStyles[type])} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
