import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-accent to-[#F97316] text-white hover:from-accent/90 hover:to-[#F97316]/90 shadow-md",
        secondary:
          "border-transparent bg-gradient-to-r from-secondary to-[#F97316] text-white hover:from-secondary/90 hover:to-[#F97316]/90 shadow-md",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-[#DC2626] text-white hover:from-destructive/90 hover:to-[#DC2626]/90 shadow-md",
        outline: "text-foreground border-2 border-border hover:border-accent hover:bg-accent/10 hover:text-accent",
        amber: "border-transparent bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md",
        red: "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md",
        orange: "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

