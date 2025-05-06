import { ShoppingBag, LogOut, LayoutDashboard, Boxes } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, designer } = useAuth();

  // const navigation = [
  //   { name: 'Products', href: '/designer/products', icon: ShoppingBag },
  //   { name: '3D Viewer', href: '/designer/viewer', icon: Boxes },
  //   { name: 'Create Designer', href: '/designer/create-designer', icon: LayoutDashboard }, // Always visible
  // ];
  const navigation = [
    { name: "Products", href: "/designer/products", icon: ShoppingBag },
    { name: "3D Viewer", href: "/designer/viewer", icon: Boxes },
    ...(designer?.role === "admin"
      ? [
          {
            name: "Add Designer",
            href: "/designer/create-designer",
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-10",
        "h-screen bg-sidebar border-r flex flex-col",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed ? (
          <Link to="/designer/products" className="font-bold text-xl">
            Decor Haven
          </Link>
        ) : (
          <Link to="/designer/products" className="mx-auto font-bold text-xl">
            DH
          </Link>
        )}
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0 h-5 w-5",
                  pathname === item.href
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
              />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t flex flex-col space-y-2">
        {!collapsed && (
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {designer?.name?.charAt(0)}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{designer?.name}</p>
              <p className="text-xs text-sidebar-foreground/70">
                {designer?.role}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className={cn("justify-start", collapsed && "justify-center")}
          onClick={async () => {
            try {
              await logout();
              toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
              });
              navigate("/");
            } catch (error: any) {
              console.error("Logout error:", error);
              toast({
                title: "Error",
                description: "Failed to log out. Please try again.",
                variant: "destructive",
              });
            }
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn("justify-start", collapsed && "justify-center")}
          onClick={toggleSidebar}
        >
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

// import { LogOut, ShoppingBag, Boxes } from "lucide-react";
// import { Link, useLocation, useNavigate} from "react-router-dom";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/hooks/useAuth";
// import { toast } from "@/components/ui/use-toast";

// const Sidebar = () => {
//   const { pathname } = useLocation();
//   return (
//     <div className={cn(
//       "h-screen bg-sidebar border-r flex flex-col",
//       collapsed ? "w-16" : "w-64",
//       "transition-all duration-300 ease-in-out"
//     )}>
//       <div className="flex items-center justify-between h-16 px-4 border-b">
//           <Link to="/designer/products" className="font-bold text-xl">
//             Decor Haven
//           </Link>
//       </div>

//      <ul>
//           <li>
//             <Link to="/designer/create-designer">Create Designer</Link>
//           </li>
//         </ul>

//         <Button
//           variant="outline"
//           size="sm"
//           className={cn("justify-start", collapsed && "justify-center")}
//           onClick={async () => {
//             try {
//               await logout();
//               toast({
//                 title: "Logged out",
//                 description: "You have been successfully logged out.",
//               });
//               navigate("/");
//             } catch (error: any) {
//               console.error("Logout error:", error);
//               toast({
//                 title: "Error",
//                 description: "Failed to log out. Please try again.",
//                 variant: "destructive",
//               });
//             }
//           }}
//         >
//           <LogOut className="h-4 w-4" />
//           {!collapsed && <span className="ml-2">Sign Out</span>}
//         </Button>
//       </div>
//   );
// };

// export default Sidebar;
