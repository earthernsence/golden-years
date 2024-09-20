import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gy: 
          `bg-transparent text-foreground border-muted-foreground
                  dark:text-muted-foreground
                  hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/25`,
        executive: 
          `bg-transparent text-gy-text-light border-gy-text-light
                  dark:text-gy-text-dark dark:border-gy-text-dark
                  hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/25`,
        team: 
          `bg-transparent text-sky-500 border-sky-500
                  dark:text-sky-600 dark:border-sky-600
                  hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/25`
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
