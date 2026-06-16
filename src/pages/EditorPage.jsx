import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SuitSVG from "../components/SuitSVG";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCatalog } from "../contexts/CatalogContext";
import { formatPrice } from "../utils/format";
import {
  BASE_PRICE,
  FABRICS,
  COLORS,
  PATTERNS,
  SUIT_STYLES,
  LININGS,
  BUTTONS,
  EXTRAS,
} from "../data/editorOptions";

const SECTIONS = [
  ["style", "Фасон"],
  ["fabric", "Ткань"],
  ["color", "Цвет"],
  ["details", "Детали"],
];

function mapProductToFabric(product) {
  const value = (product.fabric || "").toLowerCase();
  if (value.includes("бархат")) return FABRICS.find((item) => item.id === "velvet") || FABRICS[0];
  if (value.includes("кашемир")) return FABRICS.find((item) => item.id === "wool-cashmere") || FABRICS[0];
  if (value.includes("шелк")) return FABRICS.find((item) => item.id === "wool-silk") || FABRICS[0];
  if (value.includes("лен")) return FABRICS.find((item) => item.id === "linen") || FABRICS[0];
  if (value.includes("150")) return FABRICS.find((item) => item.id === "wool-150") || FABRICS[0];
  return FABRICS.find((item) => item.id === "wool-120") || FABRICS[0];
}

function mapProductToColor(product) {
  const exact = COLORS.find((item) => item.hex.toLowerCase() === String(product.color || "").toLowerCase());
  if (exact) return exact;

  const name = `${product.fullName || ""} ${product.style || ""}`.toLowerCase();
  if (name.includes("черн")) return COLORS.find((item) => item.id === "black") || COLORS[0];
  if (name.includes("графит")) return COLORS.find((item) => item.id === "graphite") || COLORS[0];
  if (name.includes("уголь")) return COLORS.find((item) => item.id === "charcoal") || COLORS[0];
  if (name.includes("светл")) return COLORS.find((item) => item.id === "gray-light") || COLORS[0];
  if (name.includes("син")) return COLORS.find((item) => item.id === "navy") || COLORS[0];
  if (name.includes("олив")) return COLORS.find((item) => item.id === "olive") || COLORS[0];
  return COLORS[0];
}

function mapProductToPattern(product) {
  return PATTERNS.find((item) => item.id === product.pattern) || PATTERNS[0];
}

function mapProductToStyle(product) {
  const name = `${product.fullName || ""} ${product.style || ""}`.toLowerCase();
  if (name.includes("смокинг")) return SUIT_STYLES.find((item) => item.id === "tuxedo") || SUIT_STYLES[0];
  if (name.includes("zombie") || name.includes("зомби")) {
    return SUIT_STYLES.find((item) => item.id === "double") || SUIT_STYLES[0];
  }
  return SUIT_STYLES.find((item) => item.id === "single-2") || SUIT_STYLES[0];
}

function mapProductToLining(product) {
  const name = `${product.fullName || ""}`.toLowerCase();
  if (name.includes("черн")) return LININGS.find((item) => item.id === "lining-black") || LININGS[0];
  if (name.includes("син")) return LININGS.find((item) => item.id === "lining-navy") || LININGS[0];
  if (name.includes("светл")) return LININGS.find((item) => item.id === "lining-gold") || LININGS[0];
  return LININGS[0];
}

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products } = useCatalog();

  const [fabric, setFabric] = useState(FABRICS[0]);
  const [color, setColor] = useState(COLORS[1]);
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [styleType, setStyleType] = useState(SUIT_STYLES[0]);
  const [lining, setLining] = useState(LININGS[0]);
  const [buttons, setButtons] = useState(BUTTONS[0]);
  const [extras, setExtras] = useState([]);
  const [monogram, setMonogram] = useState("");
  const [added, setAdded] = useState(false);
  const [previewPulse, setPreviewPulse] = useState(false);
  const appliedPresetRef = useRef("");

  const presetId = searchParams.get("preset");
  const presetProduct = products.find((item) => String(item.id) === String(presetId || ""));

  useEffect(() => {
    if (!presetProduct || appliedPresetRef.current === String(presetProduct.id)) return;

    setFabric(mapProductToFabric(presetProduct));
    setColor(mapProductToColor(presetProduct));
    setPattern(mapProductToPattern(presetProduct));
    setStyleType(mapProductToStyle(presetProduct));
    setLining(mapProductToLining(presetProduct));
    setButtons(BUTTONS[0]);
    setExtras([]);
    setMonogram("");
    appliedPresetRef.current = String(presetProduct.id);
  }, [presetProduct]);

  const total = useMemo(() => {
    return (
      BASE_PRICE +
      fabric.price +
      pattern.price +
      styleType.price +
      lining.price +
      buttons.price +
      extras.reduce((sum, item) => sum + item.price, 0) +
      (monogram.trim() ? 2500 : 0)
    );
  }, [fabric, pattern, styleType, lining, buttons, extras, monogram]);

  const extrasLabel = extras.length ? `${extras.length} доп.` : "Без доп. опций";

  const keyFacts = [
    styleType.name,
    fabric.name,
    color.name,
    extrasLabel,
  ];

  const toggleExtra = (extra) => {
    setExtras((prev) =>
      prev.some((item) => item.id === extra.id)
        ? prev.filter((item) => item.id !== extra.id)
        : [...prev, extra]
    );
  };

  useEffect(() => {
    setPreviewPulse(true);
    const timeoutId = setTimeout(() => setPreviewPulse(false), 260);
    return () => clearTimeout(timeoutId);
  }, [fabric, color, pattern, styleType, lining, buttons, extras, monogram, location.search]);

  const add = () => {
    if (added) {
      navigate("/account?tab=cart");
      return;
    }

    if (!user) {
      navigate("/auth");
      return;
    }

    addToCart({
      name: `${styleType.name} • ${color.name} • ${fabric.name}`,
      price: total,
      quantity: 1,
      productId: presetProduct?.id,
      config: {
        fabric: fabric.name,
        color: color.name,
        pattern: pattern.name,
        style: styleType.name,
        lining: lining.name,
        buttons: buttons.name,
        extras: extras.map((item) => item.name),
        monogram,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="container-page py-10">
      <section className="soft-card overflow-hidden">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 sm:p-9">
            <p className="text-xs uppercase tracking-[0.28em] text-gold/75">Онлайн-конструктор</p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.94] sm:text-6xl">
              Соберите костюм
              <br />
              под свой сценарий
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Выберите силуэт, ткань, цвет и детали. Экран устроен так, чтобы вы быстро
              понимали итоговый характер костюма, а не терялись в лишних эффектах.
            </p>

            {presetProduct && (
              <div className="mt-6 rounded-2xl border border-gold/10 bg-white/5 px-4 py-3 text-sm text-muted">
                Базой для настройки выбран костюм <span className="text-gold">{presetProduct.fullName}</span>.
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {SECTIONS.map(([id, label], index) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="rounded-full border border-gold/15 bg-white/5 px-4 py-2 text-sm text-muted transition hover:border-gold/35 hover:text-soft"
                >
                  {index + 1}. {label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gold/10 bg-[rgba(255,255,255,0.03)] p-7 sm:p-9 lg:border-l lg:border-t-0">
            <div className={`preview-stage flex min-h-[360px] items-center justify-center bg-[#efe6d8] px-5 py-6 transition duration-300 ${previewPulse ? "scale-[0.985]" : "scale-100"}`}>
              <SuitSVG
                color={color.hex}
                accent="#d2a14b"
                lining={lining.color}
                pattern={pattern.id}
                styleType={styleType.id}
                size={230}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[380px_1fr]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="soft-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Ваш костюм</p>
                <h2 className="mt-2 font-serif text-3xl leading-none">{styleType.name}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {presetProduct ? presetProduct.fullName : "Индивидуальная конфигурация"} • {fabric.name}
                </p>
              </div>
              <span
                className="block h-12 w-12 rounded-2xl border border-black/10"
                style={{ background: color.hex }}
              />
            </div>

            <div className="preview-stage mt-6 flex min-h-[250px] items-center justify-center bg-[#efe5d8] px-4 py-5">
              <SuitSVG
                size={172}
                color={color.hex}
                accent="#d2a14b"
                lining={lining.color}
                pattern={pattern.id}
                styleType={styleType.id}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {keyFacts.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gold/12 bg-white/5 px-3 py-1 text-xs text-muted"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gold/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Стоимость</p>
                  <p className="mt-1 font-serif text-4xl text-gold">{formatPrice(total)}</p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p>Пошив</p>
                  <p className="mt-1">4-6 недель</p>
                </div>
              </div>
            </div>

            <button
              onClick={add}
              className={`mt-6 w-full ${added ? "btn-primary !bg-green-500 !text-white" : "btn-primary"}`}
            >
              {added ? "Открыть корзину" : user ? "Добавить в корзину" : "Войти и заказать"}
            </button>
          </div>
        </aside>

        <div className="space-y-5">
          <OptionBlock id="style" title="Фасон" subtitle="Основа силуэта и посадки">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {SUIT_STYLES.map((item) => (
                <StyleCard
                  key={item.id}
                  item={item}
                  active={styleType.id === item.id}
                  color={color.hex}
                  pattern={pattern.id}
                  onClick={() => setStyleType(item)}
                />
              ))}
            </div>
          </OptionBlock>

          <OptionBlock id="fabric" title="Ткань" subtitle={fabric.name}>
            <div className="grid gap-3 md:grid-cols-2">
              {FABRICS.map((item) => (
                <Choice
                  key={item.id}
                  active={fabric.id === item.id}
                  title={item.name}
                  desc={item.desc}
                  price={item.price}
                  onClick={() => setFabric(item)}
                />
              ))}
            </div>
          </OptionBlock>

          <OptionBlock id="color" title="Цвет" subtitle={color.name}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
              {COLORS.map((item) => (
                <ColorSwatch
                  key={item.id}
                  active={item.id === color.id}
                  hex={item.hex}
                  name={item.name}
                  onClick={() => setColor(item)}
                />
              ))}
            </div>
          </OptionBlock>

          <OptionBlock id="details" title="Детали" subtitle="Узор, подкладка, пуговицы и опции">
            <div className="grid gap-5 lg:grid-cols-3">
              <MiniSection title="Узор">
                {PATTERNS.map((item) => (
                  <ChoiceCompact
                    key={item.id}
                    active={pattern.id === item.id}
                    title={item.name}
                    icon={item.icon}
                    price={item.price}
                    onClick={() => setPattern(item)}
                  />
                ))}
              </MiniSection>

              <MiniSection title="Подкладка">
                {LININGS.map((item) => (
                  <ChoiceCompact
                    key={item.id}
                    active={lining.id === item.id}
                    title={item.name}
                    color={item.color}
                    price={item.price}
                    onClick={() => setLining(item)}
                  />
                ))}
              </MiniSection>

              <MiniSection title="Пуговицы">
                {BUTTONS.map((item) => (
                  <ChoiceCompact
                    key={item.id}
                    active={buttons.id === item.id}
                    title={item.name}
                    price={item.price}
                    onClick={() => setButtons(item)}
                  />
                ))}
              </MiniSection>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {EXTRAS.map((item) => (
                <Choice
                  key={item.id}
                  active={extras.some((extra) => extra.id === item.id)}
                  title={item.name}
                  price={item.price}
                  checkbox
                  onClick={() => toggleExtra(item)}
                />
              ))}
            </div>

            <div className="mt-5 max-w-md">
              <label className="label">Монограмма</label>
              <div className="relative">
                <input
                  className="input pr-24"
                  placeholder="Например: I.P."
                  value={monogram}
                  onChange={(e) => setMonogram(e.target.value)}
                  maxLength={10}
                />
                {monogram.trim() && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gold">
                    +{formatPrice(2500)}
                  </span>
                )}
              </div>
            </div>
          </OptionBlock>
        </div>
      </div>
    </div>
  );
}

function OptionBlock({ id, title, subtitle, children }) {
  return (
    <section id={id} className="soft-card p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl leading-none">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function MiniSection({ title, children }) {
  return (
    <div className="rounded-[24px] border border-gold/10 bg-white/5 p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold/70">{title}</p>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function StyleCard({ item, active, color, pattern, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[24px] border p-4 text-left transition ${active ? "border-gold bg-gold/10" : "border-black/8 bg-white/30 hover:border-gold/30"}`}
    >
      <div className="rounded-[20px] bg-[#efe5d8] px-3 py-4">
        <SuitSVG size={112} color={color} accent="#d2a14b" pattern={pattern} styleType={item.id} />
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <p className={`font-medium ${active ? "text-gold" : "text-soft"}`}>{item.name}</p>
          {item.price > 0 && <span className="text-xs text-gold">+{formatPrice(item.price)}</span>}
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">{item.note}</p>
      </div>
    </button>
  );
}

function ColorSwatch({ active, hex, name, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[22px] border p-3 text-left transition ${active ? "border-gold bg-gold/10" : "border-black/8 bg-white/30 hover:border-gold/30"}`}
    >
      <span
        className={`relative block h-14 w-full rounded-2xl border border-black/10 ${active ? "ring-2 ring-gold/30" : ""}`}
        style={{ background: hex }}
      >
        {active && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
            ✓
          </span>
        )}
      </span>
      <span className="mt-3 block text-sm text-soft">{name}</span>
    </button>
  );
}

function Choice({ active, title, desc, price, checkbox, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-gold bg-gold/10" : "border-black/8 bg-white/30 hover:border-gold/30"}`}
    >
      <div className="flex items-start gap-3">
        {checkbox && (
          <span
            className={`mt-1 flex h-5 w-5 items-center justify-center rounded border text-xs ${active ? "border-gold bg-gold text-bg" : "border-black/20 text-transparent"}`}
          >
            ✓
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <p className={`font-medium ${active ? "text-gold" : "text-soft"}`}>{title}</p>
            {price > 0 && <span className="text-xs text-gold">+{formatPrice(price)}</span>}
          </div>
          {desc && <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>}
        </div>
      </div>
    </button>
  );
}

function ChoiceCompact({ active, title, icon, price, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${active ? "border-gold bg-gold/10" : "border-black/8 bg-white/30 hover:border-gold/30"}`}
    >
      <div className="flex items-center gap-3">
        {color ? (
          <span
            className="block h-8 w-8 rounded-full border border-black/10"
            style={{ background: color }}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-sm">
            {icon}
          </span>
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${active ? "text-gold" : "text-soft"}`}>{title}</p>
          {price > 0 && <p className="mt-1 text-xs text-gold">+{formatPrice(price)}</p>}
        </div>
      </div>
    </button>
  );
}
