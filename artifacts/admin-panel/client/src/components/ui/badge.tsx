import * as React from "react";
import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TransactionStatus;
  variant?: 'default' | 'outline';
}

function Badge({ className, status, variant = 'default', ...props }: BadgeProps) {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50",
    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50",
    rejected: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors shadow-sm",
        status ? statusStyles[status] : "bg-primary/10 text-primary-foreground border-primary/20",
        variant === 'outline' && "bg-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
