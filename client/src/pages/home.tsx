import { CategoryGrid } from "@/components/category-grid";
import { FilterBar } from "@/components/ui/filter-bar";
import { SearchBar } from "@/components/ui/search-bar";

export default function Home() {
  return (
    <>
      {/* 히어로 섹션 */}
      <div className="mb-8 p-8 bg-gradient-to-r from-primary/5 to-primary/20 rounded-2xl">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
            당신의 건강한 식단 선택을 도와드립니다
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            다양한 프랜차이즈 메뉴의 영양성분을 검색하고 비교해보세요
          </p>
          <SearchBar className="max-w-xl mx-auto" />
        </div>
      </div>
      
      <FilterBar />
      
      <h2 className="text-3xl font-heading font-bold mb-6">카테고리</h2>
      
      <CategoryGrid />
    </>
  );
}
