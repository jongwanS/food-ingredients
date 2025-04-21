import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from '@/hooks/use-search-params';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  mobile?: boolean;
}

export function SearchBar({ className, placeholder = "메뉴 이름 또는 프랜차이즈로 검색", mobile = false }: SearchBarProps) {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || '');
  const [, setLocation] = useLocation();

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

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      </div>
    </form>
  );
}