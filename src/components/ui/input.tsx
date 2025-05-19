
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement, 
  React.ComponentProps<"input"> & { 
    glass?: boolean, 
    variant?: 'admin' | 'designer' | 'client' | 'default' 
  }
>(({ className, glass = false, variant = 'default', type, ...props }, ref) => {
  const variantClasses = {
    'admin': 'border-admin-100 focus:ring-admin-primary/50 focus:border-admin-primary/50',
    'designer': 'border-designer-100 focus:ring-designer-primary/50 focus:border-designer-primary/50',
    'client': 'border-client-100 focus:ring-client-primary/50 focus:border-client-primary/50',
    'default': 'border-input focus:ring-primary/50 focus:border-primary/50'
  };

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 md:text-sm hover:border-primary/50",
        glass && "bg-white/80 backdrop-blur-sm border",
        variant !== 'default' && variantClasses[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
