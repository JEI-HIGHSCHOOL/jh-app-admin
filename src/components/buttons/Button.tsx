import React from "react";
import { ImSpinner2 } from "react-icons/im";

import clsxm from "@/lib/helpers/clsxm";

enum ButtonVariant {
  "primary",
  "outline",
  "ghost",
  "light",
  "dark",
}

type ButtonProps = {
  isLoading?: boolean;
  variant?: keyof typeof ButtonVariant;
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = "primary",
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={clsxm(
          "inline-flex items-center rounded px-4 py-2 font-semibold",
          "focus:outline-none focus-visible:ring focus-visible:ring-[#E3611D]",
          "shadow-sm",
          "transition duration-200 ease-in",
          [
            variant === "primary" && [
              "bg-[#E3611D] text-white",
              "border border-[#E3611D]",
              "hover:bg-orange-500 hover:text-white",
              "active:bg-[#E3611D]",
              "disabled:bg-[#E3611D] disabled:hover:bg-[#E3611D]",
            ],
            variant === "outline" && [
              "text-[#E3611D]",
              "border border-[#E3611D]",
              "hover:bg-orange-50 active:bg-orange-100 disabled:bg-orange-100",
            ],
            variant === "ghost" && [
              "text-black",
              "shadow-none",
              "hover:bg-gray-200 active:bg-gray-200 disabled:bg-gray-100",
            ],
            variant === "light" && [
              "bg-white text-dark ",
              "border border-gray-300",
              "hover:text-dark",
              "active:bg-white/80 disabled:bg-gray-200",
            ],
            variant === "dark" && [
              "bg-gray-900 text-white",
              "border border-gray-600",
              "active:bg-gray-700 disabled:bg-gray-700",
            ],
          ],
          "disabled:cursor-not-allowed",
          isLoading &&
            "relative text-transparent hover:text-transparent disabled:cursor-wait",
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              {
                "text-white": ["primary", "dark"].includes(variant),
                "text-black": ["light"].includes(variant),
                "text-primary-500": ["outline", "ghost"].includes(variant),
              }
            )}
          >
            <ImSpinner2 className="animate-spin" />
          </div>
        )}
        {children}
      </button>
    );
  }
);

export default Button;
