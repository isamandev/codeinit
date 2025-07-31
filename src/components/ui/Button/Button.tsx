"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
}

const Button = ({ children, type }: ButtonProps) => {
  const basicStyles =
    "min-h-full p-2 border-2 rounded-2xl font-semibold drop-shadow-xs hover:drop-shadow-md transition-all duration-200";
  const typeStyles = {
    primary:
      "border-blue-700 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    secondary: "border-gray-300 text-gray-700 hover:bg-gray-50",
    tertiary: "border-transparent text-gray-500 hover:bg-gray-100",
  };
  return (
    <button
      className={cn(basicStyles, type ? typeStyles[type] : typeStyles.primary)}
      onClick={() => {}}
    >
      {children}
    </button>
  );
};

export default Button;
