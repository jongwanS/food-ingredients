import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto justify-between">
            <Link href="/">
              <div className="text-primary text-3xl font-bold font-heading cursor-pointer">
                <span className="text-secondary">Nutri</span>Kor
              </div>
            </Link>
            <div className="ml-2 text-sm text-gray-500 hidden md:block">한국 프랜차이즈 영양정보</div>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Desktop search bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="w-full mt-4 mb-2 md:hidden">
              <SearchBar mobile />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
