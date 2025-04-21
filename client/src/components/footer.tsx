import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <div className="text-primary text-xl font-bold font-heading cursor-pointer">
                <span className="text-secondary">Nutri</span>Kor
              </div>
            </Link>
            <p className="text-sm text-gray-500 mt-1">한국 프랜차이즈 영양정보 서비스</p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>© {new Date().getFullYear()} NutriKor. 모든 권리 보유.</p>
            <p className="mt-1">영양 정보는 각 프랜차이즈의 공식 자료를 기반으로 제공됩니다.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
