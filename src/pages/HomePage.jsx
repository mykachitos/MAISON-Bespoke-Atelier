import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SuitSVG from "../components/SuitSVG";
import { useCatalog } from "../contexts/CatalogContext";

const HISTORY = [
  [
    "2011",
    "Небольшая мастерская на Жигуре во Владивостоке. Начинали с подгонки классических костюмов и точечного пошива для постоянных клиентов.",
  ],
  [
    "2016",
    "Появилась собственная линейка деловых и свадебных моделей. Заказы стали приходить не только из города, но и со всего Приморья.",
  ],
  [
    "2026",
    "Ателье выросло в полноценную витрину: каталог, конструктор, корзина и личный кабинет работают как единая система, но с тем же вниманием к посадке и деталям.",
  ],
];

const VALUES = [
  ["Точная посадка", "Сначала смотрим, как вещь сидит, и только потом говорим о декоративных деталях."],
  ["Спокойные ткани", "Без лишнего блеска и случайных решений: материалы под сезон, сценарий и реальную носку."],
  ["Нормальный сервис", "Общаемся понятно, сохраняем мерки и пожелания, чтобы следующий заказ не начинался с нуля."],
];

export default function HomePage() {
  const { products } = useCatalog();

  const hero = products.find((item) => item.id === 1001) || products[0];
  const ceremony = products.find((item) => item.id === 1004) || products[1];
  const business = products.find((item) => item.id === 1003) || products[2];
  const zombie = products.find((item) => item.id === 1011);
  const featured = [hero, ceremony, business].filter(Boolean);
  const moreLooks = products
    .filter((item) => item && !featured.some((pick) => pick.id === item.id) && item.id !== 1011)
    .slice(0, 4);

  return (
    <div>
      <section className="container-page py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="soft-card overflow-hidden">
            <div className="grid h-full lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-gold/75">
                    Maison Bespoke Atelier • Владивосток
                  </p>
                  <h1 className="mt-6 font-serif text-5xl leading-[0.94] sm:text-6xl xl:text-7xl">
                    Костюмы,
                    <br />
                    которые выглядят
                    <br />
                    спокойно и сильно
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-8 text-muted">
                    Здесь не пытаются впечатлить шумом. Это витрина ателье из Владивостока,
                    где можно выбрать готовую модель, собрать свой вариант в конструкторе и
                    оформить заказ без лишних экранов.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/catalog" className="btn-primary px-6">
                    Смотреть каталог
                  </Link>
                  <Link to="/editor" className="btn-outline px-6">
                    Открыть конструктор
                  </Link>
                </div>
              </div>

              <div
                className="min-h-[420px] bg-[#ddd3c4]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(15, 16, 18, 0.08), rgba(15, 16, 18, 0.48)), url(${hero?.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </div>
          </div>

          <div className="grid gap-6">
            <article className="soft-card p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.24em] text-gold/75">О нас</p>
              <h2 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
                Ателье с
                <br />
                владивостокским
                <br />
                характером
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted">
                Maison начинался как небольшая городская мастерская. Нам всегда были ближе
                тихая уверенность, хорошая посадка и вещи, которые не выходят из гардероба
                через один сезон.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Город", "Владивосток, ул. Жигура, 50"],
                  ["Фокус", "Деловые, свадебные и повседневные костюмы"],
                  ["Формат", "Каталог, конструктор, корзина и кабинет"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-gold/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold/70">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr]">
              <article
                className="soft-card min-h-[260px] overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(14,15,18,0.06), rgba(14,15,18,0.68)), url(${ceremony?.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="flex h-full items-end p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/65">
                      {ceremony?.style}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl text-white">{ceremony?.fullName}</h3>
                  </div>
                </div>
              </article>

              <div className="soft-card flex flex-col justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/75">
                    Фирменный силуэт
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Чистая линия плеч, спокойная талия и аккуратная длина. Именно так выглядит
                    основа большинства наших моделей.
                  </p>
                </div>

                <div className="preview-stage mt-6 flex items-center justify-center bg-[#eee3d4] px-4 py-5">
                  <SuitSVG
                    size={190}
                    color={business?.color || "#313740"}
                    accent={business?.accent || "#a73a3f"}
                    pattern={business?.pattern || "solid"}
                    styleType="single-2"
                  />
                </div>
              </div>
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
              Мы не строили образ бренда вокруг пафоса. Сначала появились постоянные клиенты,
              потом собственные модели, потом удобный сайт. В основе все равно осталось то же:
              хороший крой, честная ткань и понятный сервис.
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
            <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Что выбирают чаще</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Основные модели</h2>
          </div>
          <Link to="/catalog" className="btn-outline hidden sm:inline-flex">
            Весь каталог
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-gold/10 bg-[rgba(255,255,255,0.02)]">
        <div className="container-page py-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Как мы работаем</p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                Сначала сценарий жизни, потом ткань и детали
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                Поэтому в каталоге и конструкторе нет случайной пестроты. Мы собираем витрину
                так, чтобы костюм можно было представить в реальной носке: на работе, на
                церемонии, на встречах или в поездке.
              </p>
            </div>

            {zombie && (
              <div className="soft-card border-green-500/20 bg-[linear-gradient(180deg,rgba(99,115,75,0.18),rgba(21,28,18,0.32))] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-green-300/80">
                  Секретный костюм
                </p>
                <h3 className="mt-3 font-serif text-4xl leading-none">{zombie.fullName}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Небольшая пасхалка в каталоге. Не для офиса, а для съёмок, вечеринок и любых
                  ситуаций, где нужен чуть более странный характер.
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {moreLooks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {VALUES.map(([title, text]) => (
            <div key={title} className="soft-card p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-gold/75">{title}</p>
              <p className="mt-4 text-base leading-8 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
