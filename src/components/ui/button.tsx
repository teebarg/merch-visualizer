import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap text-background",
                "font-normal overflow-hidden outline-none transition-transform-colors-opacity motion-reduce:transition-none",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});
Button.displayName = "Button";

export { Button };
