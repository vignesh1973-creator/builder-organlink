import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Phone, Mail } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-medical-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Emergency: +1-800-ORGAN</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>support@organlink.org</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Saving lives, one match at a time</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-medical-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">OrganLink</span>
              <p className="text-xs text-gray-500 leading-tight">Connecting Lives</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-medical-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-medical-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/organ-info" className="text-gray-600 hover:text-medical-600 font-medium transition-colors">
              Organ Info
            </Link>
            <Link to="/faqs" className="text-gray-600 hover:text-medical-600 font-medium transition-colors">
              FAQs
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-medical-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Login Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/login">Admin</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/hospital/login">Hospital</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/organization/login">Organization</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-600 hover:text-medical-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-medical-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/organ-info"
                className="text-gray-600 hover:text-medical-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Organ Info
              </Link>
              <Link
                to="/faqs"
                className="text-gray-600 hover:text-medical-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-medical-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin Login
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/hospital/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Hospital Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/organization/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Organization Login
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
