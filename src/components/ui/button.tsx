import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = ({ className, asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants, className)}
      {...props}
    />
  );
};