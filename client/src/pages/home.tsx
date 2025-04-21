import { CategoryGrid } from "@/components/category-grid";
import { FilterBar } from "@/components/ui/filter-bar";

export default function Home() {
  return (
    <>
      <FilterBar />
      
      <h1 className="text-3xl font-heading font-bold mb-6">카테고리</h1>
      
      <CategoryGrid />
    </>
  );
}
