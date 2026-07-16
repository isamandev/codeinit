import React from "react";
import clsx from "clsx";

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  variant?: "primary" | "ghost";
  // legacy compatibility with older `type` prop used across the codebase
  type?:
    | "primary"
    | "secondary"
    | "tertiary"
    | React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export function Button({
  className,
  variant,
  type,
  children,
  ...rest
}: ButtonProps) {
  const base =
    "min-h-full p-2 border-2 rounded-2xl font-semibold drop-shadow-xs hover:drop-shadow-md transition-all duration-200";
  const legacyMap: Record<string, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    tertiary: "btn-tertiary",
  };

  const modernBase = "px-3 py-2 rounded text-sm";

  // If provided a legacy semantic `type` like 'primary', use the legacy styles.
  if (type === "primary" || type === "secondary" || type === "tertiary") {
    return (
      <button className={clsx(base, legacyMap[type], className)} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <button
      className={clsx(
        modernBase,
        variant === "primary" ? "bg-blue-600 text-white" : "bg-transparent",
        className,
      )}
      type={type as React.ButtonHTMLAttributes<HTMLButtonElement>["type"]}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
