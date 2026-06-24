import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import MeasurementRequestSection from "../components/MeasurementRequestSection";
import SuitSVG from "../components/SuitSVG";
import { useCatalog } from "../contexts/CatalogContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80";

const HISTORY = [
  [
    "2011",
    "Небольшая мастерская во Владивостоке. Начинали с подгонки классических костюмов и точечного пошива для постоянных клиентов.",
  ],
  [
    "2016",
    "Появилась собственная линейка деловых и свадебных моделей. Заказы стали приходить не только из города, но и со всего Приморья.",
  ],
  [
    "2026",
    "Ателье выросло в полноценную цифровую витрину: каталог, конструктор и кабинет клиента работают как одна система.",
  ],
];

const FABRIC_HOUSES = [
  "Loro Piana",
  "Scabal",
  "Vitale Barberis Canonico",
  "Drapers",
  "Holland & Sherry",
  "Zegna",
];

const PROCESS = [
  ["1", "Выбираем сценарий", "Сначала понимаем, для чего нужен костюм: офис, свадьба, выступление или повседневный гардероб."],
  ["2", "Собираем модель", "Фасон, ткань, цвет, подкладка и детали подбираются спокойно, без случайных комбинаций."],
  ["3", "Фиксируем заказ", "Выбранная конфигурация, мерки и пожелания сохраняются в одном месте, чтобы к ним можно было вернуться."],
];

export default function HomePage() {
  const { products } = useCatalog();

  const hero = products.find((item) => item.id === 1001) || products[0];
  const business = products.find((item) => item.id === 1003) || products[1];
  const wedding = products.find((item) => item.id === 1004) || products[2];
  const tuxedo = products.find((item) => item.id === 1002) || products[3];
  const zombie = products.find((item) => item.id === 1011);
  const featured = [hero, business, wedding, tuxedo].filter(Boolean);

  return (
    <div>
      <section className="container-page py-8 sm:py-10">
        <div className="soft-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div
              className="relative min-h-[620px] overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(10,10,12,0.84) 0%, rgba(10,10,12,0.62) 42%, rgba(10,10,12,0.3) 100%), url(${HERO_IMAGE})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="flex h-full flex-col justify-between p-8 sm:p-10 lg:p-12">
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-gold/80">
                    Maison Bespoke Atelier • Владивосток
                  </p>
                  <h1 className="mt-6 font-serif text-5xl leading-[0.92] text-white sm:text-6xl xl:text-7xl">
                    Деловые и
                    <br />
                    свадебные костюмы
                    <br />
                    с индивидуальной посадкой
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-white/78">
                    Мы делаем спокойные, собранные костюмы без витринного шума. Можно выбрать
                    готовую модель, собрать свой вариант в конструкторе и сохранить все детали
                    в одном кабинете.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link to="/catalog" className="btn-primary px-6">
                      Смотреть костюмы
                    </Link>
                    <Link to="/editor" className="btn-outline border-white/35 px-6 text-white hover:bg-white/10">
                      Собрать свой вариант
                    </Link>
                  </div>
                </div>

                <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                  {[
                    ["4-6 недель", "Средний срок пошива"],
                    ["10+ моделей", "Основа каталога"],
                    ["Владивосток", "Мастерская и консультации"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/12 bg-black/20 p-4 backdrop-blur-sm">
                      <p className="font-serif text-2xl text-white">{value}</p>
                      <p className="mt-2 text-sm text-white/62">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="flex flex-col justify-between bg-[#111216] p-7 sm:p-9">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">О нас</p>
                <h2 className="mt-3 font-serif text-4xl leading-none text-white">
                  Ателье
                  <br />
                  с тихим
                  <br />
                  характером
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/68">
                  Нам ближе точная посадка, хорошая ткань и понятный сервис. Без лишней
                  театральности, зато с вниманием к тому, как костюм выглядит в реальной жизни.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ["Адрес", "Владивосток, ул. Жигура, 50"],
                  ["Формат", "Каталог, конструктор, корзина и кабинет"],
                  ["Фокус", "Деловые, свадебные и вечерние модели"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold/75">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Пошив костюмов</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Не просто красивая вещь, а рабочий костюм под конкретную задачу
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Деловой костюм должен держать форму весь день, свадебный — выглядеть чисто на фото
              и вживую, вечерний — собирать силуэт без перегруза. Мы отталкиваемся именно от этого,
              а не от случайных визуальных эффектов.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-[1.05fr_0.95fr]">
            <article
              className="soft-card min-h-[280px] overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(14,15,18,0.1), rgba(14,15,18,0.62)), url(${wedding?.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="flex h-full items-end p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/65">{wedding?.style}</p>
                  <h3 className="mt-2 font-serif text-3xl text-white">{wedding?.fullName}</h3>
                </div>
              </div>
            </article>

            <div className="soft-card flex flex-col justify-between p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold/75">Фирменный силуэт</p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Чистая линия плеч, спокойная талия и длина без перегиба. Именно на этом строится
                  большая часть наших моделей.
                </p>
              </div>

              <div className="preview-stage mt-6 flex items-center justify-center bg-[#efe5d7] px-4 py-5">
                <SuitSVG
                  size={188}
                  color={business?.color || "#313740"}
                  accent={business?.accent || "#a73a3f"}
                  pattern={business?.pattern || "solid"}
                  styleType={business?.category === "tuxedo" ? "tuxedo" : "single-2"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MeasurementRequestSection />

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Каталог</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Основные модели</h2>
          </div>
          <Link to="/catalog" className="btn-outline hidden sm:inline-flex">
            Весь каталог
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-gold/10 bg-[rgba(255,255,255,0.02)]">
        <div className="container-page py-16">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Ткани и отделка</p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                Работаем с тканями, которые держат форму и читаются дорого
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                Для витрины и для конструктора мы держим спокойный диапазон: шерсть, шерсть с шелком,
                шерсть с кашемиром, лен для лета и более плотные варианты для делового гардероба.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {FABRIC_HOUSES.map((item) => (
                <div key={item} className="soft-card flex min-h-[120px] items-end p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Fabric house</p>
                    <h3 className="mt-3 font-serif text-3xl leading-none">{item}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold/75">История компании</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Как мастерская из Владивостока выросла в Maison
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Сначала были постоянные клиенты и подгонка готовых вещей. Потом пошив, затем
              собственная линейка моделей и только после этого сайт. То есть всё строилось от
              ремесла, а не наоборот.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {HISTORY.map(([year, text]) => (
              <div key={year} className="soft-card p-6">
                <p className="text-xs uppercase tracking-[0.26em] text-gold/75">{year}</p>
                <p className="mt-4 text-base leading-8 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Как мы работаем</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">От задачи к ткани и деталям</h2>
          </div>
          <Link to="/editor" className="btn-outline hidden sm:inline-flex">
            Открыть конструктор
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-5 md:grid-cols-3">
            {PROCESS.map(([step, title, text]) => (
              <div key={step} className="soft-card p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Шаг {step}</p>
                <h3 className="mt-3 font-serif text-3xl leading-none">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{text}</p>
              </div>
            ))}
          </div>

          {zombie && (
            <div className="soft-card border-green-500/20 bg-[linear-gradient(180deg,rgba(99,115,75,0.18),rgba(21,28,18,0.32))] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-green-300/80">Секретный костюм</p>
              <h3 className="mt-3 font-serif text-4xl leading-none">{zombie.fullName}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Да, мы оставили одну пасхалку в каталоге. Она не для офиса, а для съемок,
                вечеринок и более странных идей, которым нужен отдельный характер.
              </p>
              <div className="preview-stage mt-6 flex items-center justify-center bg-[#e6ead7] px-4 py-5">
                <SuitSVG
                  size={180}
                  color={zombie.color}
                  accent={zombie.accent}
                  pattern={zombie.pattern}
                  styleType="double"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
