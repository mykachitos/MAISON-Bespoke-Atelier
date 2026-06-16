const HISTORY = [
  [
    "2011",
    "Maison начинался как небольшая мастерская во Владивостоке. Сначала занимались подгонкой классических костюмов и частными заказами для постоянных клиентов.",
  ],
  [
    "2016",
    "Появилась собственная линейка деловых и свадебных моделей. К этому моменту мастерская уже работала не только для города, но и для клиентов по всему Приморью.",
  ],
  [
    "2026",
    "Сегодня это ателье с полноценной онлайн-витриной: каталог, конструктор и кабинет клиента помогают оформить заказ спокойнее и быстрее.",
  ],
];

const PRINCIPLES = [
  ["Посадка важнее шума", "Мы строим костюм от силуэта и реальной носки, а не от случайного вау-эффекта."],
  ["Спокойные ткани", "Предпочитаем материалы, которые выглядят дорого без лишнего блеска и не надоедают через сезон."],
  ["Понятный сервис", "Мерки, пожелания и история заказов сохраняются, чтобы не начинать каждый следующий заказ с нуля."],
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-page py-10">
        <div className="soft-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-xs uppercase tracking-[0.28em] text-gold/75">
                Maison Bespoke Atelier • Владивосток
              </p>
              <h1 className="mt-6 font-serif text-5xl leading-[0.92] sm:text-6xl">
                О мастерской,
                <br />
                которая выросла
                <br />
                из ремесла
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
                Мы не придумывали сначала красивую упаковку. Сначала были ткани, примерки,
                посадка и клиенты, которые возвращались снова. Уже потом появился сайт,
                каталог и конструктор.
              </p>
            </div>

            <div className="bg-[linear-gradient(180deg,#1a1c21,#111216)] p-8 sm:p-10">
              <div className="grid h-full gap-4">
                {[
                  ["Город", "Владивосток"],
                  ["Адрес", "ул. Жигура, 50"],
                  ["Формат", "Индивидуальный пошив и онлайн-конструктор"],
                  ["Фокус", "Деловые, свадебные и вечерние костюмы"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold/75">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold/75">История</p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Как Maison появился во Владивостоке
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              Нам всегда была ближе тихая уверенность, чем показная роскошь. Поэтому и история
              компании выглядит честно: от мастерской и клиентов по рекомендации к полноценному
              ателье с онлайн-сервисом.
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
        <div className="grid gap-5 lg:grid-cols-3">
          {PRINCIPLES.map(([title, text]) => (
            <div key={title} className="soft-card p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-gold/75">{title}</p>
              <h3 className="mt-3 font-serif text-3xl leading-none">{title}</h3>
              <p className="mt-4 text-base leading-8 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
