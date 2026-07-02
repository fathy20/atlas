import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  // SEO
  updateSeoSetting: (id: string, updates: Partial<DbSeoSetting>) => Promise<void>;
  // Refresh
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
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

  const fetchAll = useCallback(async () => {
    // Fetch all data in parallel for maximum performance
    const [pRes, cRes, bRes, sRes, rRes, smRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("created_at"),
      supabase.from("brands").select("*").order("created_at"),
      supabase.from("seo_settings").select("*").order("page_path"),
      supabase.from("robots_rules").select("*"),
      supabase.from("sitemap_pages").select("*").order("priority", { ascending: false }),
    ]);

    if (pRes.data) setProducts(pRes.data);
    if (cRes.data) setCategories(cRes.data);
    if (bRes.data) setBrands(bRes.data);
    if (sRes.data) setSeoSettings(sRes.data);
    if (rRes.data) setRobotsRules(rRes.data);
    if (smRes.data) setSitemapPages(smRes.data);
    setLoading(false);
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
