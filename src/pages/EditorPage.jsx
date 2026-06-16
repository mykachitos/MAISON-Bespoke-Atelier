import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuitSVG from "../components/SuitSVG";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
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

export default function EditorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [fabric, setFabric] = useState(FABRICS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [styleType, setStyleType] = useState(SUIT_STYLES[0]);
  const [lining, setLining] = useState(LININGS[0]);
  const [buttons, setButtons] = useState(BUTTONS[0]);
  const [extras, setExtras] = useState([]);
  const [monogram, setMonogram] = useState("");
  const [added, setAdded] = useState(false);
  const [previewPulse, setPreviewPulse] = useState(false);

  const total = useMemo(() => {
    return (
      BASE_PRICE +
      fabric.price +
      pattern.price +
      styleType.price +
      lining.price +
      buttons.price +
      extras.reduce((sum, e) => sum + e.price, 0) +
      (monogram.trim() ? 2500 : 0)
    );
  }, [fabric, pattern, styleType, lining, buttons, extras, monogram]);

  const toggleExtra = (extra) => {
    setExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  useEffect(() => {
    setPreviewPulse(true);
    const timeoutId = setTimeout(() => setPreviewPulse(false), 280);
    return () => clearTimeout(timeoutId);
  }, [fabric, color, pattern, styleType, lining, buttons, extras, monogram]);

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
      name: `${styleType.name} · ${color.name} · ${fabric.name}`,
      price: total,
      quantity: 1,
      config: {
        fabric: fabric.name,
        color: color.name,
        pattern: pattern.name,
        style: styleType.name,
        lining: lining.name,
        buttons: buttons.name,
        extras: extras.map((e) => e.name),
        monogram,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const keyFacts = [
    styleType.name,
    pattern.name,
    extras.length ? `${extras.length} опции` : "Без опций",
  ];

  return (
    <div className="container-page py-12">
      <div className="mb-10 max-w-3xl">
        <span className="badge">Suit Editor</span>
        <h1 className="section-title mt-5">Соберите костюм без визуального шума</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          Более минималистичный экран, плоское мультяшное превью и понятные
          блоки настройки. Всё читается быстрее и не отвлекает от выбора.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="soft-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">
                  Preview
                </p>
                <h2 className="mt-2 font-serif text-3xl">{styleType.name}</h2>
              </div>
              <div
                className="h-12 w-12 rounded-2xl border border-white/10"
                style={{ background: color.hex }}
              />
            </div>

            <div className={`mt-6 rounded-[28px] border border-black/5 bg-[#f5f1ea] p-5 transition duration-300 ${previewPulse ? "scale-[0.985]" : "scale-100"}`}>
              <div className="flex h-[320px] items-center justify-center rounded-[22px] bg-[linear-gradient(180deg,#fbf7f0,#ede4d6)]">
                <SuitSVG
                  color={color.hex}
                  accent="#d5a84f"
                  lining={lining.color}
                  pattern={pattern.id}
                  styleType={styleType.id}
                  size={232}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {keyFacts.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gold/15 bg-gold/5 px-3 py-1 text-xs text-muted"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 border-t border-gold/10 pt-5">
              <p className="text-sm text-muted">Стоимость</p>
              <p className="mt-1 font-serif text-4xl text-gold">{formatPrice(total)}</p>
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
          <OptionBlock title="Цвет" subtitle={color.name}>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-7 lg:grid-cols-9">
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

          <OptionBlock title="Фасон" subtitle="Силуэт">
            <div className="grid gap-3 md:grid-cols-2">
              {SUIT_STYLES.map((item) => (
                <Choice
                  key={item.id}
                  active={styleType.id === item.id}
                  title={item.name}
                  desc={item.note}
                  price={item.price}
                  onClick={() => setStyleType(item)}
                />
              ))}
            </div>
          </OptionBlock>

          <OptionBlock title="Ткань" subtitle="Материал">
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

          <div className="grid gap-5 lg:grid-cols-3">
            <OptionBlock title="Узор" subtitle="Текстура">
              <div className="grid gap-3">
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
              </div>
            </OptionBlock>

            <OptionBlock title="Подкладка" subtitle="Внутри">
              <div className="grid gap-3">
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
              </div>
            </OptionBlock>

            <OptionBlock title="Пуговицы" subtitle="Акцент">
              <div className="grid gap-3">
                {BUTTONS.map((item) => (
                  <ChoiceCompact
                    key={item.id}
                    active={buttons.id === item.id}
                    title={item.name}
                    price={item.price}
                    onClick={() => setButtons(item)}
                  />
                ))}
              </div>
            </OptionBlock>
          </div>

          <OptionBlock title="Дополнительные опции" subtitle="По желанию">
            <div className="grid gap-3 md:grid-cols-2">
              {EXTRAS.map((item) => (
                <Choice
                  key={item.id}
                  active={extras.some((e) => e.id === item.id)}
                  title={item.name}
                  price={item.price}
                  checkbox
                  onClick={() => toggleExtra(item)}
                />
              ))}
            </div>
          </OptionBlock>

          <OptionBlock title="Монограмма" subtitle="Финальный штрих">
            <div className="relative max-w-md">
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
          </OptionBlock>
        </div>
      </div>
    </div>
  );
}

function OptionBlock({ title, subtitle, children }) {
  return (
    <section className="soft-card p-5 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl leading-none">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function ColorSwatch({ active, hex, name, onClick }) {
  return (
    <button
      onClick={onClick}
      title={name}
      className={`relative aspect-square rounded-full border transition ${active ? "scale-110 border-gold ring-2 ring-gold/30" : "border-black/10 hover:scale-105"}`}
      style={{ background: hex }}
    >
      {active && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          ✓
        </span>
      )}
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
          <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded border text-xs ${active ? "border-gold bg-gold text-bg" : "border-black/20 text-transparent"}`}>
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
