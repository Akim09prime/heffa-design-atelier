
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 button-modern",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-[1.02]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all hover:shadow-lg hover:scale-[1.02]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "relative bg-blue-600 text-white hover:bg-blue-700 overflow-hidden shadow-lg transition-all hover:shadow-blue-500/20 hover:scale-[1.02] after:content-[''] after:absolute after:h-full after:w-full after:top-0 after:left-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent hover:after:left-[100%] after:transition-all after:duration-500",
        glass: "border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white/90 transition-all shadow hover:shadow-lg hover:scale-[1.02]",
        // Admin specific buttons
        admin: "bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:shadow-lg hover:scale-[1.02]",
        "admin-outline": "border border-accent bg-transparent text-accent-foreground hover:bg-accent/10 transition-all",
        // Client specific buttons
        client: "bg-[#84C21E] text-white hover:bg-[#67981A] transition-all hover:shadow-lg hover:scale-[1.02]",
        "client-outline": "border border-[#84C21E] bg-transparent text-[#84C21E] hover:bg-[#F2FCE2] transition-all",
        // Designer specific buttons
        designer: "bg-[#3b5bdb] text-white hover:bg-[#364fc7] transition-all hover:shadow-lg hover:scale-[1.02]",
        "designer-outline": "border border-[#3b5bdb] bg-transparent text-[#3b5bdb] hover:bg-[#edf2ff] transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Add ripple effect on click
    const createRipple = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const button = event.currentTarget;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      
      const rect = button.getBoundingClientRect();
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');
      
      const ripple = button.getElementsByClassName('ripple')[0];
      
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={(event) => {
          createRipple(event);
          if (props.onClick) props.onClick(event);
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
