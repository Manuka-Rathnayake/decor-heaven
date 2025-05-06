
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  children: ReactNode;
}

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="w-80 h-full bg-white border-r p-4 flex flex-col gap-6">
      {children}
    </div>
  );
};

const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-neutral-dark">{title}</h3>
      <div className="space-y-2">{children}</div>
      <Separator />
    </div>
  );
};

Sidebar.Section = SidebarSection;

export default Sidebar;
