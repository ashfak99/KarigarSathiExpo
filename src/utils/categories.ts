import data from '../../assets/data/categories.json';

export interface Subcategory {
  id: string;
  en: string;
  hi: string;
  icon: string;
}

export interface Category {
  id: string;
  en: string;
  hi: string;
  icon: string;
  subcategories: Subcategory[];
}

export const getCategories = (): Category[] => {
  return data.categories as Category[];
};

export const getCategoryById = (id: string): Category | undefined => {
  return getCategories().find((c) => c.id === id);
};

export const getSubcategoryById = (
  catId: string,
  subId: string
): Subcategory | undefined => {
  const cat = getCategoryById(catId);
  return cat?.subcategories.find((s) => s.id === subId);
};

/**
 * Category ka label user language ke hisaab se
 * EN user: "Electrical"
 * HI user: "Electrical (इलेक्ट्रिकल)"
 */
export const getCategoryLabel = (
  cat: Category,
  userLang: string
): string => {
  if (userLang === 'en') return cat.en;
  return `${cat.en} (${cat.hi})`;
};

export const getSubcategoryLabel = (
  sub: Subcategory,
  userLang: string
): string => {
  if (userLang === 'en') return sub.en;
  return `${sub.en} (${sub.hi})`;
};