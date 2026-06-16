import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalog } from "../contexts/CatalogContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import SuitSVG from "../components/SuitSVG";
import { formatPrice } from "../utils/format";

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useCatalog();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const product = products.find((p) => Number(p.id) === Number(id));

  if (loading) {
    return (
      <div className="container-page py-20 text-center text-muted">
        Загрузка...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-20">
        <div className="card p-10 text-center">
          <h1 className="font-serif text-4xl">Товар не найден</h1>
          <Link to="/catalog" className="btn-primary mt-6 inline-block">
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  const color = product.color || "#1a1a2e";
  const accent = product.accent || "#d4af37";
  const pattern = product.pattern || "solid";
  const features = [
    "Ручной пошив",
    "Премиальная ткань",
    "Индивидуальные мерки",
    "Подкладка из вискозы",
  ];

  const order = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart({
      name: product.fullName,
      price: product.price,
      quantity: 1,
      productId: product.id,
    });
    navigate("/account?tab=cart");
  };

  return (
    <div className="container-page py-14">
      {/* Хлебные крошки */}
      <div className="mb-8 text-sm text-muted">
        <Link to="/catalog" className="hover:text-gold">Каталог</Link>
        <span className="mx-2">/</span>
        <span className="text-gold">{product.fullName}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* === ЛЕВАЯ КОЛОНКА — ФОТО === */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="card overflow-hidden p-6"
            style={{
              background: `radial-gradient(circle at top, ${accent}22, transparent 60%), linear-gradient(180deg, ${color}15, ${color}30)`,
            }}
          >
            {product.image ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-bg/50">
                <img
                  src={product.image}
                  alt={product.fullName}
                  className="h-full w-full object-cover"
                />
                {product.tag && (
                  <span className="absolute right-4 top-4 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-bg shadow-lg">
                    {product.tag}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center rounded-xl">
                <SuitSVG color={color} accent={accent} pattern={pattern} size={300} />
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div
                className="aspect-square rounded-lg border border-gold/20"
                style={{ background: color }}
              />
              <div
                className="aspect-square rounded-lg border border-gold/20"
                style={{ background: accent }}
              />
              <div className="flex aspect-square items-center justify-center rounded-lg border border-gold/20 bg-bg/40">
                <span className="text-xs uppercase tracking-wider text-gold">
                  {pattern}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === ПРАВАЯ КОЛОНКА — ИНФА === */}
        <div>
          <span className="badge">{product.style}</span>

          <h1 className="mt-5 font-serif text-5xl font-light leading-tight">
            {product.fullName}
          </h1>

          <p className="mt-5 text-lg leading-8 text-muted">
            {product.description}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wider text-muted">Ткань</p>
              <p className="mt-1 text-gold">{product.fabric}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wider text-muted">Срок пошива</p>
              <p className="mt-1 text-gold">14 дней</p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wider text-muted">Посадка</p>
              <p className="mt-1 text-gold">Slim fit</p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wider text-muted">Рейтинг</p>
              <p className="mt-1 text-gold">★ {product.rating}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gold/15 pt-6">
            <p className="font-serif text-5xl text-gold">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="mt-1 text-muted line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button onClick={order} className="btn-primary flex-1 sm:flex-none">
              Добавить в корзину
            </button>
            <Link to="/editor" className="btn-outline flex-1 sm:flex-none text-center">
              Кастомизировать
            </Link>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 font-serif text-2xl">Особенности</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f}
                  className="rounded-xl border border-gold/15 bg-white/5 px-4 py-3 text-sm"
                >
                  ✓ {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
