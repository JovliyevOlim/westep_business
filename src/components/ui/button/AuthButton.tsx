import React from "react";
import Spinner from "../../common/Spinner";

type ButtonProps = {
    variant?: "primary" | "secondary" | "danger" | "success";
    children: React.ReactNode;
    onClick?: () => void;
    isPending?: boolean;
    type?: "submit" | "button";
    size?: "sm" | "lg";
    className?: string;
    disabled?: boolean;
};

function CommonButton({
                          variant = "primary",
                          children,
                          onClick,
                          isPending = false,
                          type = "button",
                          size,
                          className = "",
                          disabled,
                      }: ButtonProps) {
    const baseStyle =
        "flex items-center justify-center gap-2 w-full h-[48px] md:h-[54px] rounded-full font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed";

    const variants: Record<string, string> = {
        primary: "bg-brand-500 text-white hover:bg-brand-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        disabled: "bg-gray-400 text-white cursor-not-allowed"    };

    const sizes: Record<string, string> = {
        sm: "px-3 py-1 text-sm",
        lg: "px-6 py-3 text-lg",
        default: "px-4 py-2",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`${baseStyle} ${
                disabled ? variants.disabled : variants[variant || "primary"]
            } ${sizes[size || "default"]} ${className}`}
        >
            {isPending && <Spinner/>}
            {children}
        </button>
    );
}

export default CommonButton;