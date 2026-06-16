import { useMemo, useState } from "react";
import { useCatalog } from "../contexts/CatalogContext";
import ProductCard from "../components/ProductCard";

export default function CatalogPage() {
  const { products, categories, loading, error } = useCatalog();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q) ||
          p.style?.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));

    return list;
  }, [products, category, query, sort]);

  const lead = filtered[0];

  return (
    <div>
      <section className="container-page py-12">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <span className="badge">Каталог</span>
            <h1 className="section-title mt-5 max-w-3xl">
              Подборка костюмов для работы, церемоний и спокойного повседневного гардероба
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Здесь собраны модели, которые легко читать по фото: с понятным характером,
              внятной посадкой и без случайного визуального шума.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [`${products.length}`, "моделей"],
              [categories.length - 1, "категорий"],
              ["Mix", "готовые образы и конструктор"],
            ].map(([value, label]) => (
              <div key={label} className="soft-card px-5 py-4 text-center">
                <p className="font-serif text-3xl text-gold">{value}</p>
                <p className="mt-2 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_220px]">
          <input
            className="input !h-14 !rounded-2xl !border-gold/10 !bg-white/5 px-5"
            placeholder="Поиск по модели, ткани или стилю..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="input !h-14 !rounded-2xl !border-gold/10 !bg-white/5 px-5"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={category === c.id ? "filter-pill active" : "filter-pill"}
            >
              {c.label}
            </button>
          ))}
        </div>

        {error && !loading && (
          <div className="soft-card mb-8 p-5 text-center text-gold/90">{error}</div>
        )}

        {!loading && lead && (
          <div className="soft-card mb-10 grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
            <div className="aspect-[5/4] overflow-hidden bg-[#ece5d8]">
              {lead.image ? (
                <img src={lead.image} alt={lead.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,#f2eadf,#e8dece)]" />
              )}
            </div>
            <div className="flex flex-col justify-between p-7">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold/75">{lead.style}</p>
                <h2 className="mt-3 font-serif text-5xl leading-none">{lead.fullName}</h2>
                <p className="mt-5 text-base leading-8 text-muted">{lead.description}</p>
              </div>
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-gold/10 pt-5">
                <div>
                  <p className="text-sm text-muted">{lead.fabric}</p>
                  <p className="mt-1 font-serif text-4xl text-gold">
                    {lead.price.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <span className="text-sm text-muted">★ {lead.rating}</span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="soft-card p-10 text-center text-muted">Загрузка каталога...</div>
        ) : filtered.length === 0 ? (
          <div className="soft-card p-10 text-center text-muted">
            Ничего не найдено. Попробуйте другой запрос или категорию.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                className="reveal-up"
                style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
