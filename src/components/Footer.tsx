
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Decor Haven</h3>
            <p className="text-sm text-muted-foreground">
              Bringing elegant and affordable furniture pieces to transform your living spaces.
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=sofas" className="text-muted-foreground hover:text-primary transition-colors">
                  Sofas
                </Link>
              </li>
              <li>
                <Link to="/products?category=tables" className="text-muted-foreground hover:text-primary transition-colors">
                  Tables
                </Link>
              </li>
              <li>
                <Link to="/products?category=chairs" className="text-muted-foreground hover:text-primary transition-colors">
                  Chairs
                </Link>
              </li>
              <li>
                <Link to="/products?category=beds" className="text-muted-foreground hover:text-primary transition-colors">
                  Beds
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Designer Portal
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-sm text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Decor Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
