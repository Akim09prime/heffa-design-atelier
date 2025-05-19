
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 button-modern",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-lg hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-lg hover:scale-[1.02]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass bg-white/70 text-foreground shadow-glass backdrop-blur-sm hover:bg-white/90 hover:shadow-lg hover:scale-[1.02]",
        "glass-primary": "glass bg-primary/70 backdrop-blur-sm text-primary-foreground shadow-glass hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]",
        
        // Admin specific buttons
        admin: "bg-admin-primary text-white shadow-soft hover:bg-admin-accent hover:shadow-admin-glow transition-all hover:scale-[1.02]",
        "admin-outline": "border border-admin-primary bg-transparent text-admin-primary hover:bg-admin-primary/10 transition-all",
        "admin-glass": "glass border-admin-100 bg-white/70 text-admin-primary shadow-glass backdrop-blur-sm hover:bg-white/90 hover:shadow-admin-glow hover:scale-[1.02]",
        
        // Designer specific buttons
        designer: "bg-designer-primary text-white shadow-soft hover:bg-designer-accent hover:shadow-glow transition-all hover:scale-[1.02]",
        "designer-outline": "border border-designer-primary bg-transparent text-designer-primary hover:bg-designer-primary/10 transition-all",
        "designer-glass": "glass border-designer-100 bg-white/70 text-designer-primary shadow-glass backdrop-blur-sm hover:bg-white/90 hover:shadow-glow hover:scale-[1.02]",
        
        // Client specific buttons
        client: "bg-client-primary text-white shadow-soft hover:bg-client-accent hover:shadow-client-glow transition-all hover:scale-[1.02]",
        "client-outline": "border border-client-primary bg-transparent text-client-primary hover:bg-client-primary/10 transition-all",
        "client-glass": "glass border-client-100 bg-white/70 text-client-primary shadow-glass backdrop-blur-sm hover:bg-white/90 hover:shadow-client-glow hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-full",
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
