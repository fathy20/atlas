import type { DbProduct } from "@/contexts/DataContext";

/**
 * Clean and normalize text for URL slugs
 */
const cleanSlugText = (text: string): string => {
  return text
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '') // Keep alphanumeric, spaces, Arabic, and hyphens
    .replace(/\s+/g, '-')                   // Replace spaces with hyphens
    .replace(/-+/g, '-')                    // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '')                // Remove leading/trailing hyphens
    .toLowerCase();
};

/**
 * Generate SEO-friendly slug with keywords
 * Combines product slug with meta keywords for better SEO
 */
export const generateSeoSlug = (product: DbProduct): string => {
  const baseSlug = product.slug;
  
  // Get keywords (prefer Arabic, fallback to English)
  const keywords = (product as any)?.meta_keywords_ar || (product as any)?.meta_keywords || '';
  
  if (!keywords) {
    return baseSlug;
  }
  
  // Split keywords, clean them, and take first 3-4 keywords
  const keywordList = keywords
    .split(',')
    .map(k => cleanSlugText(k))
    .filter(k => k.length > 0)
    .slice(0, 4) // Limit to 4 keywords to avoid too long URLs
    .join('-');
  
  // Combine base slug with keywords
  return keywordList ? `${baseSlug}-${keywordList}` : baseSlug;
};

/**
 * Extract base slug from SEO slug
 * Used to find product by slug even if keywords are appended
 */
export const extractBaseSlug = (seoSlug: string): string => {
  // The base slug is everything before the first keyword
  // We'll try to match against existing products
  return seoSlug;
};

/**
 * Find product by SEO slug or base slug
 */
export const findProductBySlug = (products: DbProduct[], urlSlug: string): DbProduct | undefined => {
  // First try exact match
  let product = products.find(p => p.slug === urlSlug);
  
  if (product) {
    return product;
  }
  
  // If not found, try to match by checking if the URL slug starts with any product slug
  product = products.find(p => urlSlug.startsWith(p.slug + '-'));
  
  if (product) {
    return product;
  }
  
  // Last resort: try to find by checking if product slug is contained in URL
  return products.find(p => urlSlug.includes(p.slug));
};
