import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCatalog } from "../contexts/CatalogContext";
import { formatPrice } from "../utils/format";
import { getStorage, setStorage } from "../utils/storage";

const STATUS_META = {
  new: { label: "Новый", progress: 10 },
  paid: { label: "Оплачен", progress: 35 },
  shipped: { label: "Отправлен", progress: 70 },
  done: { label: "Выполнен", progress: 100 },
  cancelled: { label: "Отменён", progress: 0 },
};

const MEASUREMENT_FIELDS = [
  ["height", "Рост"],
  ["chest", "Грудь"],
  ["waist", "Талия"],
  ["hips", "Бёдра"],
  ["shoulders", "Плечи"],
  ["sleeve", "Рукав"],
  ["inseam", "Внутренний шов"],
  ["neck", "Шея"],
];

const EMPTY_PREFERENCES = {
  occasion: "",
  fit: "",
  budget: "",
  deadline: "",
  comment: "",
};

const TAB_IDS = new Set([
  "overview",
  "orders",
  "cart",
  "profile",
  "measurements",
  "preferences",
]);

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "К";
}

function formatDate(value) {
  if (!value) return "Дата не указана";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function money(value) {
  return formatPrice(Number(value || 0));
}

function getUserStorageKey(user) {
  return user?.id || user?.username || user?.email || "guest";
}

function getLocalOrdersKey(user) {
  return `maison_orders_${getUserStorageKey(user)}`;
}

function normalizeOrderDate(order) {
  return order?.created_at ? new Date(order.created_at).getTime() : 0;
}

function mergeOrders(remoteOrders, localOrders) {
  const orderMap = new Map();

  [...localOrders, ...remoteOrders].forEach((order) => {
    orderMap.set(String(order.id), order);
  });

  return Array.from(orderMap.values()).sort(
    (a, b) => normalizeOrderDate(b) - normalizeOrderDate(a)
  );
}

export default function AccountPage() {
  const {
    user,
    loading,
    updateProfile,
    updateMeasurements,
    updatePreferences,
  } = useAuth();
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { products } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const localOrdersKey = getLocalOrdersKey(user);

  const [tab, setTab] = useState(() => {
    const requestedTab = searchParams.get("tab");

    if (requestedTab && TAB_IDS.has(requestedTab)) {
      return requestedTab;
    }

    return cart.length > 0 ? "cart" : "overview";
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [measurements, setMeasurements] = useState({});
  const [preferences, setPreferences] = useState(EMPTY_PREFERENCES);

  useEffect(() => {
    const requestedTab = searchParams.get("tab");

    if (requestedTab && TAB_IDS.has(requestedTab) && requestedTab !== tab) {
      setTab(requestedTab);
    }
  }, [searchParams, tab]);

  useEffect(() => {
    if (!user) return;

    setProfile({
      username: user.username || user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setMeasurements(user.measurements || {});
    setPreferences({ ...EMPTY_PREFERENCES, ...(user.preferences || {}) });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let ignore = false;
    setOrdersLoading(true);
    setOrdersError("");
    const localOrders = getStorage(localOrdersKey, []);

    api
      .getOrders()
      .then((data) => {
        if (!ignore) {
          const remoteOrders = Array.isArray(data) ? data : [];
          setOrders(mergeOrders(remoteOrders, localOrders));
        }
      })
      .catch(() => {
        if (!ignore) {
          setOrders(localOrders);
          setOrdersError("Backend недоступен. Показываем локально сохранённые заказы.");
        }
      })
      .finally(() => {
        if (!ignore) setOrdersLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user, localOrdersKey]);

  const productsById = useMemo(() => {
    return new Map(products.map((product) => [Number(product.id), product]));
  }, [products]);

  const displayName = user?.name || user?.username || "Клиент";
  const completedMeasurements = MEASUREMENT_FIELDS.filter(([key]) =>
    String(measurements[key] || "").trim()
  ).length;
  const activeOrders = orders.filter((order) => !["done", "cancelled"].includes(order.status)).length;
  const lastOrder = orders[0];

  const tabs = [
    ["overview", "Обзор"],
    ["orders", `Заказы (${orders.length})`],
    ["cart", `Корзина (${cart.length})`],
    ["profile", "Профиль"],
    ["measurements", "Мерки"],
    ["preferences", "Пожелания"],
  ];

  const itemTitle = (item) => {
    const product = productsById.get(Number(item.product));
    return item.editor_data?.name || product?.fullName || `Позиция #${item.id}`;
  };

  const openTab = (nextTab) => {
    setTab(nextTab);

    if (nextTab === "overview") {
      setSearchParams({});
      return;
    }

    setSearchParams({ tab: nextTab });
  };

  const saveProfile = async () => {
    setNotice(null);

    if (!profile.username.trim()) {
      setNotice({ type: "error", text: "Логин не может быть пустым." });
      return;
    }

    try {
      await updateProfile(profile);
      setNotice({ type: "success", text: "Профиль сохранён." });
    } catch {
      setNotice({ type: "error", text: "Не удалось сохранить профиль." });
    }
  };

  const saveMeasurements = () => {
    updateMeasurements(measurements);
    setNotice({ type: "success", text: "Мерки сохранены для этого аккаунта." });
  };

  const savePreferences = () => {
    updatePreferences(preferences);
    setNotice({ type: "success", text: "Пожелания сохранены." });
  };

  const checkout = async () => {
    if (!cart.length) return;

    setCheckoutLoading(true);
    setNotice(null);

    try {
      const created = await api.createOrder({
        address: profile.address,
        items: cart.map((item) => ({
          product: item.productId ? Number(item.productId) : null,
          quantity: item.quantity || 1,
          price: Number(item.price),
          editor_data: {
            name: item.name,
            config: item.config || {},
            measurements,
            preferences,
            phone: profile.phone,
          },
        })),
      });

      setOrders((current) => [created, ...current]);
      clearCart();
      openTab("orders");
      setNotice({ type: "success", text: "Заказ оформлен и добавлен в историю." });
    } catch {
      const localOrder = {
        id: `LOCAL-${Date.now()}`,
        status: "new",
        total: total,
        address: profile.address,
        created_at: new Date().toISOString(),
        items: cart.map((item, index) => ({
          id: `${Date.now()}-${index}`,
          product: item.productId ? Number(item.productId) : null,
          quantity: item.quantity || 1,
          price: Number(item.price),
          editor_data: {
            name: item.name,
            config: item.config || {},
            measurements,
            preferences,
            phone: profile.phone,
          },
        })),
      };

      const existingLocalOrders = getStorage(localOrdersKey, []);
      const nextLocalOrders = mergeOrders([], [localOrder, ...existingLocalOrders]);
      setStorage(localOrdersKey, nextLocalOrders);
      setOrders((current) => mergeOrders(current, [localOrder]));
      clearCart();
      openTab("orders");
      setNotice({
        type: "success",
        text: "Backend сейчас не ответил, поэтому заказ сохранён локально и уже виден в истории.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-20 text-center text-muted">
        Загрузка аккаунта...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page py-20">
        <div className="card mx-auto max-w-xl p-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Аккаунт</p>
          <h1 className="mt-4 font-serif text-4xl">Войдите в личный кабинет</h1>
          <p className="mt-3 text-muted">
            После входа здесь появятся заказы, корзина, профиль, мерки и пожелания к пошиву.
          </p>
          <Link to="/auth" className="btn-primary mt-7">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold text-xl font-bold text-bg">
            {getInitials(displayName)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Личный кабинет</p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{displayName}</h1>
            <p className="mt-2 text-muted">{user.email || "Email не указан"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="card p-4">
            <p className="text-2xl font-semibold text-gold">{activeOrders}</p>
            <p className="mt-1 text-xs text-muted">Активных</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-semibold text-gold">{cart.length}</p>
            <p className="mt-1 text-xs text-muted">В корзине</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-semibold text-gold">{completedMeasurements}</p>
            <p className="mt-1 text-xs text-muted">Мерок</p>
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            notice.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-green-500/30 bg-green-500/10 text-green-300"
          }`}
        >
          {notice.text}
        </div>
      )}

      {ordersError && (
        <div className="mb-6 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold/90">
          {ordersError}
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2 border-b border-gold/15 pb-4">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => openTab(id)}
            className={tab === id ? "btn-primary px-4 py-2" : "btn-outline px-4 py-2"}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="card p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold">Быстрые действия</p>
                  <h2 className="mt-2 font-serif text-3xl">Что делаем дальше?</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/editor" className="btn-primary">
                    Создать костюм
                  </Link>
                  <Link to="/catalog" className="btn-outline">
                    Открыть каталог
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gold/15 bg-bg/50 p-4">
                  <p className="text-sm text-muted">Корзина</p>
                  <p className="mt-2 text-xl text-gold">{money(total)}</p>
                </div>
                <div className="rounded-xl border border-gold/15 bg-bg/50 p-4">
                  <p className="text-sm text-muted">Последний заказ</p>
                  <p className="mt-2 text-xl text-gold">
                    {lastOrder ? `#${lastOrder.id}` : "Пока нет"}
                  </p>
                </div>
                <div className="rounded-xl border border-gold/15 bg-bg/50 p-4">
                  <p className="text-sm text-muted">Профиль</p>
                  <p className="mt-2 text-xl text-gold">
                    {profile.phone ? "Заполнен" : "Нужен телефон"}
                  </p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold">Заказы</p>
                  <h2 className="mt-2 font-serif text-3xl">Последняя активность</h2>
                </div>
                <button onClick={() => openTab("orders")} className="btn-outline px-4 py-2">
                  Все заказы
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {ordersLoading ? (
                  <p className="text-muted">Загрузка заказов...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted">Заказов пока нет. Соберите костюм в конструкторе.</p>
                ) : (
                  orders.slice(0, 3).map((order) => {
                    const status = STATUS_META[order.status] || STATUS_META.new;
                    return (
                      <div
                        key={order.id}
                        className="rounded-xl border border-gold/15 bg-bg/50 p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row">
                          <div>
                            <p className="text-xs text-muted">
                              #{order.id} · {formatDate(order.created_at)}
                            </p>
                            <p className="mt-1 font-medium">
                              {order.items?.map(itemTitle).join(", ") || "Заказ"}
                            </p>
                          </div>
                          <div className="sm:text-right">
                            <p className="text-gold">{money(order.total)}</p>
                            <p className="text-sm text-muted">{status.label}</p>
                          </div>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gold"
                            style={{ width: `${status.progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">Контакты</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between gap-4">
                  <span className="text-muted">Телефон</span>
                  <span>{profile.phone || "Не указан"}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-muted">Адрес</span>
                  <span className="text-right">{profile.address || "Не указан"}</span>
                </p>
              </div>
              <button onClick={() => openTab("profile")} className="btn-outline mt-5 w-full">
                Редактировать
              </button>
            </div>

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">Мерки</p>
              <h3 className="mt-2 font-serif text-3xl">
                {completedMeasurements} из {MEASUREMENT_FIELDS.length}
              </h3>
              <p className="mt-3 text-sm text-muted">
                Чем больше мерок заполнено, тем точнее будет заказ из конструктора.
              </p>
              <button onClick={() => openTab("measurements")} className="btn-primary mt-5 w-full">
                Заполнить мерки
              </button>
            </div>
          </aside>
        </div>
      )}

      {tab === "orders" && (
        <section className="space-y-4">
          {ordersLoading ? (
            <div className="card p-10 text-center text-muted">Загрузка заказов...</div>
          ) : orders.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-muted">Заказов пока нет.</p>
              <Link to="/editor" className="btn-primary mt-6">
                Создать первый заказ
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const status = STATUS_META[order.status] || STATUS_META.new;
              return (
                <article key={order.id} className="card p-5">
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <p className="text-xs text-muted">
                        Заказ #{order.id} · {formatDate(order.created_at)}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl">
                        {order.items?.length ? `${order.items.length} поз.` : "Заказ"}
                      </h3>
                      {order.address && (
                        <p className="mt-1 text-sm text-muted">Адрес: {order.address}</p>
                      )}
                    </div>
                    <div className="md:text-right">
                      <p className="font-serif text-3xl text-gold">{money(order.total)}</p>
                      <p className="mt-1 text-sm text-muted">{status.label}</p>
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {(order.items || []).map((item) => (
                      <div key={item.id} className="rounded-xl border border-gold/15 bg-bg/50 p-4">
                        <p className="font-medium">{itemTitle(item)}</p>
                        <p className="mt-1 text-sm text-muted">
                          {item.quantity} шт. · {money(item.price)}
                        </p>
                        {item.editor_data?.config && Object.keys(item.editor_data.config).length > 0 && (
                          <p className="mt-2 text-xs text-muted">
                            Конфигурация сохранена в заказе.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}

      {tab === "cart" && (
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-muted">Корзина пуста.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/editor" className="btn-primary">
                    Создать костюм
                  </Link>
                  <Link to="/catalog" className="btn-outline">
                    В каталог
                  </Link>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">Количество: {item.quantity || 1}</p>
                    {item.config && (
                      <p className="mt-2 text-xs text-muted">
                        {[
                          item.config.fabric,
                          item.config.color,
                          item.config.pattern,
                          item.config.style,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <p className="text-gold">{money(item.price)}</p>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="btn-outline border-red-500/40 px-4 py-2 text-red-300"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="card h-fit p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Оформление</p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex justify-between gap-4">
                <span className="text-muted">Позиций</span>
                <span>{cart.length}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted">Телефон</span>
                <span>{profile.phone || "Не указан"}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted">Адрес</span>
                <span className="text-right">{profile.address || "Не указан"}</span>
              </p>
            </div>

            <div className="mt-6 border-t border-gold/15 pt-5">
              <p className="text-sm text-muted">Итого</p>
              <p className="mt-1 font-serif text-4xl text-gold">{money(total)}</p>
            </div>

            <button
              onClick={checkout}
              disabled={!cart.length || checkoutLoading}
              className="btn-primary mt-6 w-full"
            >
              {checkoutLoading ? "Оформляем..." : "Оформить заказ"}
            </button>
            <button
              onClick={clearCart}
              disabled={!cart.length || checkoutLoading}
              className="btn-ghost mt-3 w-full"
            >
              Очистить корзину
            </button>
          </aside>
        </section>
      )}

      {tab === "profile" && (
        <section className="card max-w-2xl p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Данные аккаунта</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Логин</label>
              <input
                className="input"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Телефон</label>
              <input
                className="input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Адрес</label>
              <input
                className="input"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
          </div>
          <button onClick={saveProfile} className="btn-primary mt-6">
            Сохранить профиль
          </button>
        </section>
      )}

      {tab === "measurements" && (
        <section className="card max-w-4xl p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">Мерки</p>
              <h2 className="mt-2 font-serif text-3xl">
                Заполнено {completedMeasurements} из {MEASUREMENT_FIELDS.length}
              </h2>
            </div>
            <button onClick={saveMeasurements} className="btn-primary">
              Сохранить мерки
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEASUREMENT_FIELDS.map(([key, label]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <div className="relative">
                  <input
                    className="input pr-12"
                    inputMode="decimal"
                    value={measurements[key] || ""}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, [key]: e.target.value })
                    }
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
                    см
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "preferences" && (
        <section className="card max-w-3xl p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Пожелания</p>
          <h2 className="mt-2 font-serif text-3xl">Техническое задание ателье</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Повод</label>
              <select
                className="input"
                value={preferences.occasion}
                onChange={(e) => setPreferences({ ...preferences, occasion: e.target.value })}
              >
                <option value="">Выберите</option>
                <option value="office">Офис</option>
                <option value="wedding">Свадьба</option>
                <option value="event">Мероприятие</option>
                <option value="daily">На каждый день</option>
              </select>
            </div>
            <div>
              <label className="label">Посадка</label>
              <select
                className="input"
                value={preferences.fit}
                onChange={(e) => setPreferences({ ...preferences, fit: e.target.value })}
              >
                <option value="">Выберите</option>
                <option value="slim">Slim</option>
                <option value="regular">Regular</option>
                <option value="relaxed">Свободная</option>
              </select>
            </div>
            <div>
              <label className="label">Бюджет</label>
              <input
                className="input"
                placeholder="Например: до 90 000"
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Нужен к дате</label>
              <input
                className="input"
                type="date"
                value={preferences.deadline}
                onChange={(e) => setPreferences({ ...preferences, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Комментарий</label>
            <textarea
              className="input min-h-32 resize-y"
              value={preferences.comment}
              onChange={(e) => setPreferences({ ...preferences, comment: e.target.value })}
              placeholder="Цвет, посадка, мероприятие, ограничения по ткани или любые детали."
            />
          </div>

          <button onClick={savePreferences} className="btn-primary mt-6">
            Сохранить пожелания
          </button>
        </section>
      )}
    </div>
  );
}
