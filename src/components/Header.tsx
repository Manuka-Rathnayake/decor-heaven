import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";

import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "./LogoutButton";
interface HeaderProps {
  onSearch?: (term: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-furniture-dark">
              Decor Haven
            </span>
          </Link>

          {/* Search Form - Desktop */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <LogoutButton />
            ) : (
              /* Designer Login */
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%]">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center py-4 border-b">
                    <span className="text-xl font-bold">Decor Haven</span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <form onSubmit={handleSearch} className="relative py-4">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-4 h-full"
                      type="submit"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="flex flex-col space-y-4 py-4">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="px-2 py-1 hover:bg-muted rounded-md"
                      >
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/products"
                        className="px-2 py-1 hover:bg-muted rounded-md"
                      >
                        Shop
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/about"
                        className="px-2 py-1 hover:bg-muted rounded-md"
                      >
                        About
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/contact"
                        className="px-2 py-1 hover:bg-muted rounded-md"
                      >
                        Contact
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/login"
                        className="px-2 py-1 hover:bg-muted rounded-md"
                      >
                        Designer Login
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="mt-auto border-t py-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-full">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          View Cart ({cartCount} items)
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="w-[350px] sm:w-[450px]"
                      >
                        <CartDrawer />
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
