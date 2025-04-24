import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Heart, Sparkles, Search, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { FavoritesList } from "@/components/favorites-list";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  
  // 좋아요 개수 로드 
  useEffect(() => {
    const loadFavoriteCount = () => {
      try {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavoriteCount(Array.isArray(parsedFavorites) ? parsedFavorites.length : 0);
        }
      } catch (error) {
        console.error("좋아요 개수를 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    
    // 초기 로드
    loadFavoriteCount();
    
    // localStorage 변경 이벤트 리스너
    const handleStorageChange = () => {
      loadFavoriteCount();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // 커스텀 이벤트 리스너 추가 (로컬스토리지 변경 감지를 위한)
    window.addEventListener("favoritesUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleStorageChange);
    };
  }, []);
  
  // 모바일 메뉴가 열리면 스크롤 막기
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
          
          {/* Desktop search bar and favorite button */}
          <div className="hidden md:flex w-full max-w-xl items-center gap-2">
            <div className="flex-1">
              <SearchBar />
            </div>
            
            {/* Favorites panel */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                  className="relative text-pink-600 border-pink-100 hover:bg-pink-50 hover:text-pink-700"
                >
                  <Heart className="h-5 w-5" />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg p-0">
                <FavoritesList onClose={() => document.body.click()} />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="w-full mt-4 mb-2 md:hidden bg-pink-50/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="text-pink-600 hover:bg-pink-100/50">
                    <Search className="h-4 w-4 mr-1" />
                    검색하기
                  </Button>
                </Link>
                
                <div className="text-sm text-gray-500">
                  {favoriteCount > 0 ? (
                    <span className="font-medium text-pink-600">{favoriteCount}개의 좋아요</span>
                  ) : (
                    <span>좋아요 없음</span>
                  )}
                </div>
              </div>
              
              <FavoritesList onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
