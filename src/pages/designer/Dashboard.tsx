
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/designer/Sidebar";
import { cn } from "@/lib/utils";
import DesignerHeader from "@/components/designer/DesignerHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { products } from "@/data/products";

const DesignerDashboard = () => {
  const { designer } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: DollarSign
    },
    {
      title: "Products",
      value: products.length.toString(),
      description: "5 added this week",
      icon: Package
    },
    {
      title: "Orders",
      value: "126",
      description: "+12.2% from last month",
      icon: ShoppingCart
    },
    {
      title: "Customers",
      value: "573",
      description: "+4.5% from last month",
      icon: Users
    }
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
      )}>
        <DesignerHeader collapsed={collapsed} />
        
        <main className={cn(
          "flex-1 p-6 overflow-y-auto",
          collapsed ? "ml-16" : "ml-64",
          "transition-all duration-300 ease-in-out"
        )}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Welcome, {designer?.name}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your store today.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                    <span>{stat.description}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  You received 12 orders this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* For simplicity, we'll just show placeholder content */}
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium">Order #{12345 + index}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(120 + index * 30).toFixed(2)}</p>
                        <p className={`text-xs ${
                          index % 3 === 0 ? "text-amber-500" : "text-green-500"
                        }`}>
                          {index % 3 === 0 ? "Processing" : "Completed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Updates</CardTitle>
                <CardDescription>
                  Products with low inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .filter(p => p.stock <= 5)
                    .slice(0, 5)
                    .map(product => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-secondary overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-destructive">
                            Only {product.stock} left in stock
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesignerDashboard;
