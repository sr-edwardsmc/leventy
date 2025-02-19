"use client";
import { forwardRef, InputHTMLAttributes, Ref, useState } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  isChecked?: boolean;
  disabled?: boolean;
  className?: string;
}

const Checkbox = forwardRef(
  (props: CheckboxProps, ref: Ref<HTMLInputElement>) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const { id, label, disabled, className } = props;
    return (
      <div>
        <label
          htmlFor={id}
          className="flex cursor-pointer select-none items-center"
        >
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              disabled={disabled}
              className="sr-only"
              onClick={() => setIsChecked(!isChecked)}
              {...props}
            />
            <div
              className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                isChecked ? "border-primary bg-gray dark:bg-transparent" : ""
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-sm ${
                  isChecked ? "bg-primary" : ""
                }`}
              ></span>
            </div>
          </div>
          <span>{label}</span>
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
