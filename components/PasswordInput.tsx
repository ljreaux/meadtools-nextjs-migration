import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface RevealableInputProps extends React.ComponentProps<"input"> {
  revealable?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, RevealableInputProps>(
  ({ className, type = "password", ...props }, ref) => {
    const [isRevealed, setIsRevealed] = React.useState(false);

    const toggleVisibility = () => setIsRevealed((prev) => !prev);

    return (
      <div className={cn("relative w-full", className)}>
        <input
          type={isRevealed ? "text" : type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 -translate-x-1/2 text-sm text-muted-foreground focus:outline-none"
          >
            {!isRevealed ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
