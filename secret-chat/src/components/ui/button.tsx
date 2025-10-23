import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 
          disabled:pointer-events-none disabled:opacity-50
          ${variant === "default" ? "bg-green-500 text-black hover:bg-green-600" : ""}
          ${variant === "outline" ? "border border-green-500/30 text-green-400 hover:bg-green-500/10" : ""}
          ${size === "default" ? "h-10 px-4 py-2" : ""}
          ${size === "sm" ? "h-9 rounded-md px-3" : ""}
          ${size === "lg" ? "h-11 rounded-md px-8" : ""}
          ${size === "icon" ? "h-10 w-10" : ""}
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }