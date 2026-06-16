import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import { CURATED_CATEGORIES, CURATED_PRODUCTS } from "../data/curatedCatalog";

const CatalogContext = createContext();

function mergeCategories(apiCategories) {
  const byId = new Map();

  [{ id: "all", label: "Все" }, ...CURATED_CATEGORIES, ...apiCategories].forEach((item) => {
    if (!item?.id) return;
    byId.set(item.id, item);
  });

  return Array.from(byId.values());
}

function mergeProducts(apiProducts) {
  const byId = new Map();

  [...CURATED_PRODUCTS, ...apiProducts].forEach((item) => {
    if (!item?.id) return;
    byId.set(Number(item.id), item);
  });

  return Array.from(byId.values()).sort((a, b) => Number(a.id) - Number(b.id));
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(CURATED_PRODUCTS);
  const [categories, setCategories] = useState(mergeCategories([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [prodsResult, catsResult] = await Promise.allSettled([
        api.getProducts(),
        api.getCategories(),
      ]);

      const apiProducts = prodsResult.status === "fulfilled" ? prodsResult.value : [];
      const apiCategories = catsResult.status === "fulfilled" ? catsResult.value : [];

      setProducts(mergeProducts(apiProducts));
      setCategories(mergeCategories(apiCategories));

      if (prodsResult.status === "rejected" || catsResult.status === "rejected") {
        setError("Часть каталога показана из локальной подборки. Сервер каталога сейчас недоступен.");
      }
    } catch (e) {
      setProducts(CURATED_PRODUCTS);
      setCategories(mergeCategories([]));
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addProduct = async (data) => {
    const created = await api.createProduct(data);
    setProducts((prev) => mergeProducts([...prev, created]));
    return created;
  };

  const updateProduct = async (id, data) => {
    const updated = await api.updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        reload: loadAll,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalog = () => useContext(CatalogContext);
