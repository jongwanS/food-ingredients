import axios from 'axios';

const API_BASE_URL = '/data';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  calories: number;
  servingSize: string;
  foodWeight: string;
  ingredients: string[];
  allergens: string[];
  additives: string[];
  brandId: number;
  brandName: string;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  sugar: number;
  fiber: number;
  cholesterol: number;
  saturatedFat: number;
  transFat: number;
}

export interface BrandMenu {
  id: number;
  name: string;
  menuCount: number;
  menus: MenuItem[];
}

// 즐겨찾기 관련 함수
export const getFavorites = (): string[] => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = (menuId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(menuId)) {
    favorites.push(menuId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (menuId: string): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(id => id !== menuId);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
};

export const isFavorite = (menuId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(menuId);
};

// API 호출 함수
export const getBrands = async (): Promise<BrandMenu[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mcdonalds.json`);
    return [{
      id: 1,
      name: '맥도날드',
      menuCount: response.data.length,
      menus: response.data.map((item: any) => {
        const energyPer100g = parseFloat(item['에너지(kcal)']);
        
        return {
          id: item.식품코드,
          name: item.식품명,
          description: item.식품명,
          image: '',
          calories: energyPer100g,
          servingSize: '100g',
          foodWeight: item.식품중량,
          ingredients: [],
          allergens: [],
          additives: [],
          brandId: 1,
          brandName: '맥도날드',
          protein: parseFloat(item['단백질(g)']) || 0,
          fat: parseFloat(item['지방(g)']) || 0,
          carbs: parseFloat(item['탄수화물(g)']) || 0,
          sodium: parseFloat(item['나트륨(mg)']) || 0,
          sugar: parseFloat(item['당류(g)']) || 0,
          fiber: parseFloat(item['식이섬유(g)']) || 0,
          cholesterol: parseFloat(item['콜레스테롤(mg)']) || 0,
          saturatedFat: parseFloat(item['포화지방산(g)']) || 0,
          transFat: parseFloat(item['트랜스지방산(g)']) || 0
        };
      })
    }];
  } catch (error) {
    console.error('브랜드 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
};

export const getBrandMenus = async (brandId: number): Promise<BrandMenu> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mcdonalds.json`);
    return {
      id: brandId,
      name: '맥도날드',
      menuCount: response.data.length,
      menus: response.data.map((item: any) => {
        const energyPer100g = parseFloat(item['에너지(kcal)']);
        
        return {
          id: item.식품코드,
          name: item.식품명,
          description: item.식품명,
          image: '',
          calories: energyPer100g,
          servingSize: '100g',
          foodWeight: item.식품중량,
          ingredients: [],
          allergens: [],
          additives: [],
          brandId: brandId,
          brandName: '맥도날드',
          protein: parseFloat(item['단백질(g)']) || 0,
          fat: parseFloat(item['지방(g)']) || 0,
          carbs: parseFloat(item['탄수화물(g)']) || 0,
          sodium: parseFloat(item['나트륨(mg)']) || 0,
          sugar: parseFloat(item['당류(g)']) || 0,
          fiber: parseFloat(item['식이섬유(g)']) || 0,
          cholesterol: parseFloat(item['콜레스테롤(mg)']) || 0,
          saturatedFat: parseFloat(item['포화지방산(g)']) || 0,
          transFat: parseFloat(item['트랜스지방산(g)']) || 0
        };
      })
    };
  } catch (error) {
    console.error('브랜드 메뉴를 가져오는데 실패했습니다:', error);
    return {
      id: brandId,
      name: '맥도날드',
      menuCount: 0,
      menus: []
    };
  }
};

export const getMenuDetail = async (menuId: string): Promise<MenuItem> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mcdonalds.json`);
    const item = response.data.find((item: any) => item.식품코드 === menuId);
    if (!item) {
      throw new Error('메뉴를 찾을 수 없습니다.');
    }
    
    const energyPer100g = parseFloat(item['에너지(kcal)']);
    
    return {
      id: item.식품코드,
      name: item.식품명,
      description: item.식품명,
      image: '',
      calories: energyPer100g,
      servingSize: '100g',
      foodWeight: item.식품중량,
      ingredients: [],
      allergens: [],
      additives: [],
      brandId: 1,
      brandName: '맥도날드',
      protein: parseFloat(item['단백질(g)']) || 0,
      fat: parseFloat(item['지방(g)']) || 0,
      carbs: parseFloat(item['탄수화물(g)']) || 0,
      sodium: parseFloat(item['나트륨(mg)']) || 0,
      sugar: parseFloat(item['당류(g)']) || 0,
      fiber: parseFloat(item['식이섬유(g)']) || 0,
      cholesterol: parseFloat(item['콜레스테롤(mg)']) || 0,
      saturatedFat: parseFloat(item['포화지방산(g)']) || 0,
      transFat: parseFloat(item['트랜스지방산(g)']) || 0
    };
  } catch (error) {
    console.error('메뉴 상세 정보를 가져오는데 실패했습니다:', error);
    throw error;
  }
};

export const searchMenus = async (query: string): Promise<MenuItem[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mcdonalds.json`);
    return response.data
      .filter((item: any) => 
        item.식품명.toLowerCase().includes(query.toLowerCase())
      )
      .map((item: any) => {
        const energyPer100g = parseFloat(item['에너지(kcal)']);
        
        return {
          id: item.식품코드,
          name: item.식품명,
          description: item.식품명,
          image: '',
          calories: energyPer100g,
          servingSize: '100g',
          foodWeight: item.식품중량,
          ingredients: [],
          allergens: [],
          additives: [],
          brandId: 1,
          brandName: '맥도날드',
          protein: parseFloat(item['단백질(g)']) || 0,
          fat: parseFloat(item['지방(g)']) || 0,
          carbs: parseFloat(item['탄수화물(g)']) || 0,
          sodium: parseFloat(item['나트륨(mg)']) || 0,
          sugar: parseFloat(item['당류(g)']) || 0,
          fiber: parseFloat(item['식이섬유(g)']) || 0,
          cholesterol: parseFloat(item['콜레스테롤(mg)']) || 0,
          saturatedFat: parseFloat(item['포화지방산(g)']) || 0,
          transFat: parseFloat(item['트랜스지방산(g)']) || 0
        };
      });
  } catch (error) {
    console.error('메뉴 검색에 실패했습니다:', error);
    return [];
  }
}; 