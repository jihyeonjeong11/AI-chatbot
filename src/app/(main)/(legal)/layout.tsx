import { ReactNode } from "react";
import { Lines } from "@/app/(main)/(coming-soon)/coming-soon";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 from-green-200 to-blue-100 shadow-md">
      <Lines />
      <div className="relative z-20 mx-auto container prose dark:prose-invert py-12 ">
        {children}
      </div>
    </div>
  );
}
