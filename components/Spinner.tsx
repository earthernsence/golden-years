import { Loader } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "text-muted-foreground animate-spin",
  {
    variants: {
      size: {
        default: "size-4",
        sm: "size-2",
        lg: "size-6",
        icon: "size-10"
      }
    },
    defaultVariants: {
      size: "default",
    }
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {};

const Spinner = ({
  size,
}: SpinnerProps) => (
  <Loader className={cn(spinnerVariants({ size }))} />
);

export default Spinner;