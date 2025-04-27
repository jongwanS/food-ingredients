# 한국 프랜차이즈 메뉴 영양 정보

이 프로젝트는 한국 프랜차이즈 메뉴의 정확한 영양 정보를 제공하는 웹 애플리케이션입니다. 사용자들이 다양한 프랜차이즈 레스토랑의 메뉴 영양 성분을 쉽게 검색하고 비교할 수 있도록 설계되었습니다.

## 주요 기능

- 100가지 이상의 프랜차이즈 메뉴 정보 제공
- 카테고리별 프랜차이즈 및 제품 분류
- 영양 성분별 필터링 기능
- 상세한 제품 영양 정보 제공
- 모바일 친화적 인터페이스

## 기술 스택

- React.js + TypeScript
- Tailwind CSS
- Express.js 백엔드
- 메모리 기반 데이터 스토리지

## 배포 정보

### Vercel에 배포하기

이 프로젝트는 Vercel 배포를 위해 최적화되어 있습니다.

1. Vercel 계정에 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. GitHub 저장소(jongwanS/food-ingredients)를 선택합니다.
4. 다음과 같이 설정을 변경합니다:
   - Framework Preset: Other (기타)
   - Build Command: `bash ./build.sh`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. "Deploy" 버튼을 클릭합니다.

### 서버 코드가 보이는 문제 해결

웹사이트에 서버 코드가 노출되는 문제가 발생하는 경우:

1. Vercel 대시보드에서 해당 프로젝트 설정으로 이동합니다.
2. "Settings" → "General" → "Build & Development Settings"에서 위의 설정이 제대로 적용되었는지 확인합니다.
3. "Settings" → "Git" → "Production Branch"가 `main`으로 설정되어 있는지 확인합니다.
4. "Deployments" 탭에서 최신 배포를 선택하고 "Redeploy"를 클릭하여 재배포합니다.

Vercel은 자동으로 프로젝트를 빌드하고 배포합니다. 배포가 완료되면 사용자에게 접근 가능한 URL이 제공됩니다.

## 개발자 정보

이 프로젝트는 [jongwanS](https://github.com/jongwanS)에 의해 개발되었습니다.

GitHub 저장소: [jongwanS/food-ingredients](https://github.com/jongwanS/food-ingredients)