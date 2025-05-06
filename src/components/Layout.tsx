
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-dark">
            <span className="text-purple">Furnish</span>It 3D
          </h1>
          <nav className="flex gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple transition-colors">
              About
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple transition-colors">
              Gallery
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple transition-colors">
              Help
            </button>
          </nav>
        </div>
      </header> */}
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
};

export default Layout;
