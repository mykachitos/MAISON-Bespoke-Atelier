import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl text-gold">♦</span>
            <div>
              <p className="font-serif text-2xl tracking-[0.25em] text-gold">MAISON</p>
              <p className="text-xs uppercase tracking-[0.25em] text-muted">Bespoke Atelier</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted">
            Индивидуальный пошив мужских костюмов премиального уровня. От выбора ткани до
            финальной примерки.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-gold">Навигация</h4>
          <div className="space-y-3 text-sm">
            <Link className="block text-muted transition hover:text-gold" to="/">
              Главная
            </Link>
            <Link className="block text-muted transition hover:text-gold" to="/catalog">
              Каталог
            </Link>
            <Link className="block text-muted transition hover:text-gold" to="/editor">
              Конструктор
            </Link>
            <Link className="block text-muted transition hover:text-gold" to="/account">
              Кабинет
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-gold">Контакты</h4>
          <div className="space-y-3 text-sm text-muted">
            <p>Владивосток, ул. Жигура, 50</p>
            <p>
              <a href="tel:+74232000000" className="transition hover:text-gold">
                +7 (423) 200-00-00
              </a>
            </p>
            <p>
              <a href="mailto:info@maison.ru" className="transition hover:text-gold">
                info@maison.ru
              </a>
            </p>
            <p>Пн-Сб: 10:00-20:00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Maison Bespoke Atelier
      </div>
    </footer>
  );
}
