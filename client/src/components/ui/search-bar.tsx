import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ProductSearchResult } from "@/types";

interface SearchBarProps {
  className?: string;
  mobile?: boolean;
}

export function SearchBar({ className, mobile = false }: SearchBarProps) {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search suggestions based on the current search term
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['/api/search', { query: searchTerm }],
    queryFn: () => fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`).then(res => res.json()),
    enabled: searchTerm.length > 1,
  });

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: ProductSearchResult) => {
    navigate(`/product/${suggestion.id}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div 
      ref={searchRef}
      className={cn(
        "relative",
        mobile ? "w-full" : "w-full md:w-2/3 lg:w-1/2",
        className
      )}
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="메뉴 또는 프랜차이즈 검색 (예: 빅맥, 맥도날드)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.length > 1) {
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Search Suggestions */}
      {showSuggestions && searchTerm.length > 1 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="py-3 px-4 text-gray-500 text-sm">검색 중...</div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul className="py-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion: ProductSearchResult) => (
                <li 
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="font-bold">{suggestion.franchiseName || "프랜차이즈"}</span> - {suggestion.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-3 px-4 text-gray-500 text-sm">
              {searchTerm.length > 1 ? "검색 결과가 없습니다." : "검색어를 입력하세요."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
