import { useState, FormEvent, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from '@/hooks/use-search-params';
import { useQuery } from '@tanstack/react-query';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  mobile?: boolean;
}

export function SearchBar({ className, placeholder = "메뉴 이름 또는 프랜차이즈로 검색", mobile = false }: SearchBarProps) {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  
  // 프랜차이즈 데이터 가져오기
  const { data: franchises } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => fetch('/api/franchises').then(res => res.json()),
  });
  
  // 카테고리 데이터 가져오기
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  });
  
  // 검색어 입력에 따른 추천 검색어 생성
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const newSuggestions: string[] = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    // 프랜차이즈 이름 기반 추천
    if (franchises && franchises.length > 0) {
      franchises.forEach((franchise: any) => {
        if (franchise.name.toLowerCase().includes(searchTermLower)) {
          newSuggestions.push(franchise.name);
        }
      });
    }
    
    // 카테고리 이름 기반 추천
    if (categories && categories.length > 0) {
      categories.forEach((category: any) => {
        if (category.nameKorean.toLowerCase().includes(searchTermLower)) {
          newSuggestions.push(category.nameKorean);
        }
      });
    }
    
    // 중복 제거 및 최대 5개까지만 표시
    const uniqueSuggestions = Array.from(new Set(newSuggestions)).slice(0, 5);
    setSuggestions(uniqueSuggestions);
    setShowSuggestions(uniqueSuggestions.length > 0);
  }, [searchTerm, franchises, categories]);
  
  // 외부 클릭 시 추천 검색어 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // 기존 필터 유지
      const filters = {
        calorieRange: searchParams.get('calorieRange') || '',
        proteinRange: searchParams.get('proteinRange') || '',
        carbsRange: searchParams.get('carbsRange') || '',
        fatRange: searchParams.get('fatRange') || ''
      };
      
      // URL 쿼리 생성
      let query = `?q=${encodeURIComponent(searchTerm.trim())}`;
      
      // 필터 조건 추가
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      // 검색 결과 페이지로 이동
      setLocation(`/search${query}`);
    }
  };

  // 추천 검색어 클릭 처리
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    
    // 즉시 검색 실행
    const filters = {
      calorieRange: searchParams.get('calorieRange') || '',
      proteinRange: searchParams.get('proteinRange') || '',
      carbsRange: searchParams.get('carbsRange') || '',
      fatRange: searchParams.get('fatRange') || ''
    };
    
    let query = `?q=${encodeURIComponent(suggestion.trim())}`;
    
    // 필터 조건 추가
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query += `&${key}=${encodeURIComponent(value)}`;
      }
    });
    
    // 검색 결과 페이지로 이동
    setLocation(`/search${query}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="pr-10 pl-4 py-2 border-2 border-primary/20 focus:border-primary/50 rounded-full"
        />
        <Button 
          type="submit"
          size="icon" 
          variant="ghost" 
          className="absolute right-0 top-0 h-full rounded-r-full text-primary/80 hover:text-primary hover:bg-primary/5"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {/* 추천 검색어 목록 */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-md shadow-lg overflow-hidden"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="px-4 py-2 text-gray-700 hover:bg-pink-50 cursor-pointer flex items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search className="h-4 w-4 mr-2 text-pink-400" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}