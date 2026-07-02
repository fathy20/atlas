import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Types matching DB schema
export type DbProduct = Tables<"products">;
export type DbCategory = Tables<"categories">;
export type DbBrand = Tables<"brands">;
export type DbSeoSetting = Tables<"seo_settings">;
export type DbRobotsRule = Tables<"robots_rules">;
export type DbSitemapPage = Tables<"sitemap_pages">;

interface DataContextType {
  products: DbProduct[];
  categories: DbCategory[];
  brands: DbBrand[];
  seoSettings: DbSeoSetting[];
  robotsRules: DbRobotsRule[];
  sitemapPages: DbSitemapPage[];
  loading: boolean;
  // Products
  addProduct: (product: Omit<DbProduct, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<DbProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Categories
  addCategory: (category: Omit<DbCategory, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<DbCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSeoSetting: (id: string, updates: Partial<DbSeoSetting>) => Promise<void>;
  // Refresh
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [brands, setBrands] = useState<DbBrand[]>([]);
  const [seoSettings, setSeoSettings] = useState<DbSeoSetting[]>([]);
  const [robotsRules, setRobotsRules] = useState<DbRobotsRule[]>([]);
  const [sitemapPages, setSitemapPages] = useState<DbSitemapPage[]>([]);
  const [loading, setLoading] = useState(true);
  const currentFetchIdRef = useRef(0);

  const fetchAll = useCallback(async () => {
    const myFetchId = ++currentFetchIdRef.current;
    
    // 1. Fetch initial essential data + first 36 products (Pages 1, 2, 3) for super fast load
    const [pRes, cRes, bRes, sRes, rRes, smRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }).range(0, 35),
      supabase.from("categories").select("*").order("created_at"),
      supabase.from("brands").select("*").order("created_at"),
      supabase.from("seo_settings").select("*").order("page_path"),
      supabase.from("robots_rules").select("*"),
      supabase.from("sitemap_pages").select("*").order("priority", { ascending: false }),
    ]);

    if (currentFetchIdRef.current !== myFetchId) return;

    if (pRes.data) setProducts(pRes.data);
    if (cRes.data) setCategories(cRes.data);
    if (bRes.data) setBrands(bRes.data);
    if (sRes.data) setSeoSettings(sRes.data);
    if (rRes.data) setRobotsRules(rRes.data);
    if (smRes.data) setSitemapPages(smRes.data);
    setLoading(false);

    // 2. Progressive background streaming for remaining products (in chunks of 36)
    // Avoids heavy single requests / statement timeouts while ensuring all products load
    let from = 36;
    const step = 36;
    while (true) {
      if (currentFetchIdRef.current !== myFetchId) break;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, from + step - 1);

      if (currentFetchIdRef.current !== myFetchId || error || !data || data.length === 0) break;

      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data.filter(p => !existingIds.has(p.id));
        if (newItems.length === 0) return prev;
        return [...prev, ...newItems];
      });

      if (data.length < step) break;
      from += step;
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addProduct = useCallback(async (product: Omit<DbProduct, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase.from("products").insert(product).select("id");
    if (error) {
      console.error("Add product error:", error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error("لم يتم إنشاء المنتج. تحقق من تسجيل الدخول وصلاحية الأدمن.");
    }
    await fetchAll();
  }, [fetchAll]);

  const updateProduct = useCallback(async (id: string, updates: Partial<DbProduct>) => {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select("id");
    if (error) {
      console.error("Update product error:", error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error("لم يتم تحديث المنتج. تحقق من تسجيل الدخول وصلاحية الأدمن.");
    }
    await fetchAll();
  }, [fetchAll]);

  const deleteProduct = useCallback(async (id: string) => {
    const { data, error } = await supabase.from("products").delete().eq("id", id).select("id");
    if (error) {
      console.error("Delete product error:", error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error("لم يتم حذف المنتج. تحقق من تسجيل الدخول وصلاحية الأدمن.");
    }
    await fetchAll();
  }, [fetchAll]);

  const addCategory = useCallback(async (category: Omit<DbCategory, "id" | "created_at" | "updated_at">) => {
    await supabase.from("categories").insert(category);
    await fetchAll();
  }, [fetchAll]);

  const updateCategory = useCallback(async (id: string, updates: Partial<DbCategory>) => {
    await supabase.from("categories").update(updates).eq("id", id);
    await fetchAll();
  }, [fetchAll]);

  const deleteCategory = useCallback(async (id: string) => {
    await supabase.from("categories").delete().eq("id", id);
    await fetchAll();
  }, [fetchAll]);

  const updateSeoSetting = useCallback(async (id: string, updates: Partial<DbSeoSetting>) => {
    await supabase.from("seo_settings").update(updates).eq("id", id);
    await fetchAll();
  }, [fetchAll]);

  return (
    <DataContext.Provider value={{
      products, categories, brands, seoSettings, robotsRules, sitemapPages, loading,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      updateSeoSetting, refresh: fetchAll,
    }}>
      {children}
    </DataContext.Provider>
  );
};
