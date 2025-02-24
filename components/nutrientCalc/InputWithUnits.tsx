import { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const InputWithUnits = ({
  value,
  text,
  disabled,
  handleChange,
  className,
}: {
  value: number | string;
  text: string;
  disabled?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      <Input
        disabled={disabled}
        value={value}
        readOnly={disabled}
        onChange={handleChange}
        inputMode="decimal"
        onFocus={(e) => e.target.select()}
      />
      <p className="absolute top-1/2 -translate-y-1/2 right-2 text-muted-foreground">
        {text}
      </p>
    </div>
  );
};

export default InputWithUnits;
