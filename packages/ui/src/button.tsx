"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
  onclick?: Function;
}

export const Button = ({
  children,
  className,
  appName,
  onclick = (e: Function) => console.log(e),
}: ButtonProps) => {
  return (
    <button className={className} onClick={onclick}>
      {children}
    </button>
  );
};
