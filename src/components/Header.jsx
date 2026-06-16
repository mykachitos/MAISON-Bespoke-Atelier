import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const displayName = user?.name || user?.username || "Аккаунт";

  const navClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 text-sm transition ${
      isActive ? "bg-gold/10 text-gold" : "text-muted hover:bg-white/5 hover:text-soft"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-bg/90 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center gap-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xl text-gold">
            ✦
          </div>
          <div>
            <span className="block font-serif text-2xl font-semibold tracking-[0.25em] text-gold">
              MAISON
            </span>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">
              Bespoke Atelier
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={navClass}>Главная</NavLink>
          <NavLink to="/catalog" className={navClass}>Каталог</NavLink>
          <NavLink to="/editor" className={navClass}>Конструктор</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Link to="/account" className="btn-outline hidden sm:inline-flex">
                {displayName.split(" ")[0]}
              </Link>

              <Link to="/account?tab=cart" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 text-lg text-muted hover:bg-white/5 hover:text-gold">
                <span className="text-sm font-semibold">К</span>
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-bg">
                    {cart.length}
                  </span>
                )}
              </Link>

              <button onClick={logout} className="btn-ghost hidden md:inline-flex">
                Выйти
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
}
