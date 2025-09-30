'use client';

import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
    />
  );
});

export { Button };