import React from "react";
import Spinner from "../common/Spinner.tsx";

type ButtonProps = {
    variant?: "primary" | "secondary" | "danger";
    children: React.ReactNode;
    onClick?: () => void;
    isPending: boolean;
    type?: "submit" | "button"
};


function Button({variant = "primary", children, onClick, isPending,type}: ButtonProps) {
    return (
        <button className={`btn btn-${variant}`} onClick={onClick} disabled={isPending} type={type}
                name="submit">
            {
                isPending ? <Spinner/> : children
            }
        </button>);
}

export default Button;