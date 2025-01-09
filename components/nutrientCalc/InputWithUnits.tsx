import { ChangeEvent } from "react";
import { Input } from "../ui/input";

const InputWithUnits = ({
  value,
  text,
  disabled,
  handleChange,
}: {
  value: number | string;
  text: string;
  disabled?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="relative">
      <Input
        disabled={disabled}
        value={value}
        readOnly={disabled}
        onChange={handleChange}
        inputMode="numeric"
        onFocus={(e) => e.target.select()}
      />
      <p className="absolute top-1/2 -translate-y-1/2 right-2 text-muted-foreground">
        {text}
      </p>
    </div>
  );
};

export default InputWithUnits;
