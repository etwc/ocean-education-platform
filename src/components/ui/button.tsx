import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:bg-blue-500",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-sky-200 bg-white/70 text-slate-700 shadow-sm hover:bg-sky-50 hover:text-sky-700",
        ghost: "text-slate-500 hover:bg-sky-100/70 hover:text-sky-700",
        glass: "border border-white/70 bg-white/62 text-sky-800 shadow-lg shadow-sky-200/25 backdrop-blur-xl hover:bg-white",
        premium:
          "bg-[linear-gradient(135deg,#0ea5e9,#2563eb_58%,#6366f1)] text-white shadow-xl shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-blue-500/35",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
