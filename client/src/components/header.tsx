import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-pink-50 via-white to-pink-50 shadow-sm border-b border-pink-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto justify-between">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="gradient-text text-3xl font-bold font-heading cursor-pointer flex items-center">
                  <span className="mr-1">Nutri</span>Kor
                  <Sparkles className="h-5 w-5 ml-1 text-primary" />
                </div>
                <div className="ml-1 text-sm text-gray-500 hidden md:flex items-center">
                  <Heart className="h-3 w-3 mr-1 text-pink-400" />
                  <span>한국 프랜차이즈 영양정보</span>
                </div>
              </div>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-primary hover:text-primary/80 hover:bg-pink-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Desktop search bar */}
          <div className="hidden md:block w-full max-w-xl">
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
