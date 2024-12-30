import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const HoverHamburgerMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {/* Icon switches based on `group-data-[state=open]` */}
    <span className="flex items-center">
      <Menu
        className="w-5 h-5 transition-opacity duration-200 group-data-[state=open]:hidden"
        aria-hidden="true"
      />
      <X
        className="w-5 h-5 hidden transition-opacity duration-200 group-data-[state=open]:block"
        aria-hidden="true"
      />
    </span>
    {children}
  </NavigationMenuPrimitive.Trigger>
));
HoverHamburgerMenuTrigger.displayName = "HoverHamburgerMenuTrigger";

export { HoverHamburgerMenuTrigger };
