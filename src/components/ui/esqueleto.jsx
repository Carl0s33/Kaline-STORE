import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utilitarios"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "h-4 w-full",
        circle: "rounded-full",
        rectangle: "rounded-md",
        text: "h-4 w-full rounded",
        title: "h-6 w-3/4 rounded",
        subtitle: "h-4 w-1/2 rounded",
        button: "h-10 w-24 rounded-md",
        avatar: "h-10 w-10 rounded-full",
        image: "aspect-video w-full rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Esqueleto({ className, variant, ...props }) {
  return (
    <div
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Esqueleto }
