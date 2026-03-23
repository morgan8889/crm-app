import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is passed via ...props
    <label
      ref={ref}
      className={cn("text-sm font-medium text-gray-700 leading-none", className)}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
