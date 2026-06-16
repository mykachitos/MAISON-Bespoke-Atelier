import { Link } from "react-router-dom";
import SuitSVG from "./SuitSVG";
import { formatPrice } from "../utils/format";

export default function ProductCard({ product }) {
  const color = product.color || "#1a1a2e";
  const accent = product.accent || "#d4af37";
  const pattern = product.pattern || "solid";

  return (
    <Link to={`/catalog/${product.id}`} className="product-card group block overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe4d8]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.fullName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,#f2eadf,#e8dece)]">
            <SuitSVG color={color} accent={accent} pattern={pattern} size={170} />
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/88 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#2c3137]">
            {product.style}
          </span>
          {product.tag && (
            <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg">
              {product.tag}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-[30px] leading-none text-soft">{product.fullName}</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted">{product.fabric}</p>
          </div>
          <span className="text-xs text-muted">★ {product.rating}</span>
        </div>

        <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-muted">
          {product.description}
        </p>

        <div className="flex items-end justify-between gap-4 border-t border-gold/10 pt-4">
          <div>
            <p className="text-lg font-semibold text-gold">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="mt-1 text-xs text-muted line-through">{formatPrice(product.oldPrice)}</p>
            )}
          </div>
          <span className="text-sm text-soft transition group-hover:text-gold">Подробнее</span>
        </div>
      </div>
    </Link>
  );
}
