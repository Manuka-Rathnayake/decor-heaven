
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
};

export default Layout;
