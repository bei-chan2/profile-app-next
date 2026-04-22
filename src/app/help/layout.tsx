import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
