import * as React from "react";

import { cn } from "@/lib/utils";

const badgeClass =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

const badgePrimary =
  "border-transparent bg-primary text-primary-foreground hover:bg-primary/80";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

function Badge({ className, ...props }: BadgeProps) {
  return <div className={cn(badgeClass, badgePrimary, className)} {...props} />;
}

export { Badge };
