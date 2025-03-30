"use client";

import { ReactNode } from "react";

interface ButtonProps {
  size: "lg" | "sm";
  className?: string;
  varient: "primary" | "outlined";
  onClick?: () => void;
  children: ReactNode;
}

export const Button = ({
  size,
  varient,
  className,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`${className} ${varient === "primary" ? "bg-primary" : ""} ${size === "lg" ? "px-4 py-2" : "px-2 py-1"} `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
