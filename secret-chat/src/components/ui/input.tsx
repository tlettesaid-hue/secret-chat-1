import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-green-500/30 bg-black px-3 py-2 
          text-sm text-green-400 placeholder:text-green-500/40 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }