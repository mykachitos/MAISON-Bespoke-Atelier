import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCatalog } from "../contexts/CatalogContext";
import { formatPrice } from "../utils/format";
import { getStorage, setStorage } from "../utils/storage";

const STATUS_META = {
  new: {
    label: "Новый",
    progress: 18,
    badge: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  },
  paid: {
    label: "Оплачен",
    progress: 42,
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  shipped: {
    label: "В пошиве",
    progress: 74,
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  },
  done: {
    label: "Готов",
    progress: 100,
    badge: "border-gold/30 bg-gold/10 text-gold",
  },
  cancelled: {
    label: "Отменен",
    progress: 0,
    badge: "border-red-500/30 bg-red-500/10 text-red-300",
  },
};

const MEASUREMENT_FIELDS = [
  ["height", "Рост"],
  ["chest", "Грудь"],
  ["waist", "Талия"],
  ["hips", "Бедра"],
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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getInitials(name) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "К"
  );
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

  return Array.from(orderMap.values()).sort((a, b) => normalizeOrderDate(b) - normalizeOrderDate(a));
}

export default function AccountPage() {
  const { user, loading, updateProfile, updateMeasurements, updatePreferences } = useAuth();
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { products } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const localOrdersKey = getLocalOrdersKey(user);

  const [tab, setTab] = useState(() => {
    const requestedTab = searchParams.get("tab");
    if (requestedTab && TAB_IDS.has(requestedTab)) return requestedTab;
    return cart.length > 0 ? "cart" : "overview";
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [notice, setNotice] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [security, setSecurity] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
    setSecurity({
      email: user.email || "",
      password: "",
      confirmPassword: "",
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
          setOrdersError("Сервер заказов сейчас недоступен. Показываем локально сохраненную историю.");
        }
      })
      .finally(() => {
        if (!ignore) setOrdersLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user, localOrdersKey]);

  const productsById = useMemo(
    () => new Map(products.map((product) => [Number(product.id), product])),
    [products]
  );

  const displayName = user?.name || user?.username || "Клиент";
  const completedMeasurements = MEASUREMENT_FIELDS.filter(([key]) =>
    String(measurements[key] || "").trim()
  ).length;
  const activeOrders = orders.filter((order) => !["done", "cancelled"].includes(order.status)).length;
  const paidOrders = orders.filter((order) => order.status === "paid").length;
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
      setNotice({ type: "success", text: "Профиль сохранен." });
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

  const persistLocalOrder = (localOrder) => {
    const existingLocalOrders = getStorage(localOrdersKey, []);
    const nextLocalOrders = mergeOrders([], [localOrder, ...existingLocalOrders]);
    setStorage(localOrdersKey, nextLocalOrders);
    setOrders((current) => mergeOrders(current, [localOrder]));
  };

  const closePaymentModal = () => {
    if (checkoutLoading) return;
    setPaymentModalOpen(false);
    setPaymentCode("");
    setPaymentError("");
    setPaymentStep("");
  };

  const checkout = async () => {
    if (!cart.length) return;

    setNotice(null);
    if (!profile.phone.trim()) {
      setNotice({ type: "error", text: "Перед оплатой укажите телефон в профиле." });
      openTab("profile");
      return;
    }

    setPaymentModalOpen(true);
    setPaymentCode("");
    setPaymentError("");
    setPaymentStep("");
    return;

    // eslint-disable-next-line no-unreachable
    setCheckoutLoading(true);
    setPaymentStep("Проверяем детали заказа...");
    setNotice(null);

    await wait(700);
    setPaymentStep("Имитируем оплату...");
    await wait(900);
    setPaymentStep("Оплата прошла. Формируем заказ...");
    await wait(700);

    const localOrder = {
      id: `PAID-${Date.now()}`,
      status: "paid",
      total,
      address: profile.address,
      created_at: new Date().toISOString(),
      payment_mode: "fake-success",
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
          payment_status: "paid",
        },
      })),
    };

    persistLocalOrder(localOrder);

    api
      .createOrder({
        address: profile.address,
        items: localOrder.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          editor_data: item.editor_data,
        })),
      })
      .catch(() => {});

    // eslint-disable-next-line no-unreachable
    clearCart();
    setPaymentStep("");
    setCheckoutLoading(false);
    openTab("orders");
    setNotice({ type: "success", text: "Оплата прошла успешно. Заказ добавлен в историю." });
  };

  const confirmDemoPayment = async () => {
    if (paymentCode.trim() !== "123") {
      setPaymentError("Для демонстрационной оплаты введите код 123.");
      return;
    }

    setCheckoutLoading(true);
    setPaymentError("");
    setPaymentStep("Подключаемся к Sber Pay Demo...");
    setNotice(null);

    await wait(700);
    setPaymentStep("Проверяем код подтверждения...");
    await wait(900);
    setPaymentStep("Оплата подтверждена. Формируем заказ...");
    await wait(700);

    const localOrder = {
      id: `PAID-${Date.now()}`,
      status: "paid",
      total,
      address: profile.address,
      created_at: new Date().toISOString(),
      payment_mode: "sber-demo",
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
          payment_status: "paid",
          payment_mode: "sber-demo",
        },
      })),
    };

    persistLocalOrder(localOrder);

    api
      .createOrder({
        address: profile.address,
        items: localOrder.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          editor_data: item.editor_data,
        })),
      })
      .catch(() => {});

    clearCart();
    setPaymentModalOpen(false);
    setPaymentCode("");
    setPaymentStep("");
    setCheckoutLoading(false);
    openTab("orders");
    setNotice({ type: "success", text: "Демо-оплата через Sber Pay прошла успешно. Заказ добавлен в историю." });
  };

  if (loading) {
    return <div className="container-page py-20 text-center text-muted">Загрузка аккаунта...</div>;
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
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-end">
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
          <StatCard value={activeOrders} label="Активных" />
          <StatCard value={paidOrders} label="Оплачено" />
          <StatCard value={completedMeasurements} label="Мерок" />
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
                <InfoTile label="Корзина" value={money(total)} />
                <InfoTile label="Последний заказ" value={lastOrder ? `#${lastOrder.id}` : "Пока нет"} />
                <InfoTile label="Профиль" value={profile.phone ? "Заполнен" : "Нужен телефон"} />
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

              <div className="mt-5 space-y-4">
                {ordersLoading ? (
                  <p className="text-muted">Загрузка заказов...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted">Заказов пока нет. Соберите костюм в конструкторе.</p>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <OrderCard key={order.id} order={order} itemTitle={itemTitle} compact />
                  ))
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
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoTile label="Всего заказов" value={String(orders.length)} />
            <InfoTile label="Оплачено" value={String(paidOrders)} />
            <InfoTile
              label="Последняя дата"
              value={lastOrder ? formatDate(lastOrder.created_at) : "Пока нет"}
            />
          </div>

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
            orders.map((order) => <OrderCard key={order.id} order={order} itemTitle={itemTitle} />)
          )}
        </section>
      )}

      {tab === "cart" && (
        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
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
                        {[item.config.fabric, item.config.color, item.config.pattern, item.config.style]
                          .filter(Boolean)
                          .join(" • ")}
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
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Оплата и оформление</p>

            <div className="mt-5 space-y-3 text-sm">
              <p className="flex justify-between gap-4">
                <span className="text-muted">Позиции</span>
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

            <div className="mt-6 rounded-2xl border border-gold/10 bg-white/5 p-4">
              <p className="text-sm text-muted">Итого</p>
              <p className="mt-1 font-serif text-4xl text-gold">{money(total)}</p>
              <p className="mt-2 text-xs text-muted">
                Ниже идет демонстрационная оплата: после нажатия заказ сразу считается успешно оплаченным.
              </p>
            </div>

            {paymentStep && (
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {paymentStep}
              </div>
            )}

            <button
              onClick={checkout}
              disabled={!cart.length || checkoutLoading}
              className="btn-primary mt-6 w-full"
            >
              {checkoutLoading ? "Оплачиваем..." : "Оплатить и оформить"}
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

      {paymentModalOpen && (
        <PaymentModal
          total={money(total)}
          phone={profile.phone}
          paymentCode={paymentCode}
          setPaymentCode={setPaymentCode}
          paymentError={paymentError}
          paymentStep={paymentStep}
          checkoutLoading={checkoutLoading}
          onClose={closePaymentModal}
          onConfirm={confirmDemoPayment}
        />
      )}

      {tab === "profile" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="card p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Основные данные</p>
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
                <label className="label">Телефон</label>
                <input
                  className="input"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
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

          <section className="card p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Почта и пароль</p>
            <div className="mt-6 grid gap-4">
              <div>
                <label className="label">Новая почта</label>
                <input
                  className="input"
                  type="email"
                  value={security.email}
                  onChange={(e) => setSecurity({ ...security, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Новый пароль</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Оставьте пустым, если менять не нужно"
                  value={security.password}
                  onChange={(e) => setSecurity({ ...security, password: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Повторите пароль</label>
                <input
                  className="input"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={async () => {
                setNotice(null);

                if (!security.email.trim()) {
                  setNotice({ type: "error", text: "Введите email." });
                  return;
                }

                if (security.password && security.password !== security.confirmPassword) {
                  setNotice({ type: "error", text: "Пароли не совпадают." });
                  return;
                }

                if (security.password && security.password.length < 6) {
                  setNotice({ type: "error", text: "Пароль должен быть не короче 6 символов." });
                  return;
                }

                try {
                  await updateProfile({
                    ...profile,
                    email: security.email,
                    password: security.password,
                  });
                  setProfile((current) => ({ ...current, email: security.email }));
                  setSecurity((current) => ({ ...current, password: "", confirmPassword: "" }));
                  setNotice({ type: "success", text: "Почта и пароль обновлены." });
                } catch {
                  setNotice({ type: "error", text: "Не удалось обновить почту или пароль." });
                }
              }}
              className="btn-primary mt-6"
            >
              Обновить доступ
            </button>
          </section>
        </div>
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
                    onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
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
          <h2 className="mt-2 font-serif text-3xl">Техническое задание для ателье</h2>

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

function PaymentModal({
  total,
  phone,
  paymentCode,
  setPaymentCode,
  paymentError,
  paymentStep,
  checkoutLoading,
  onClose,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-[#2cbf6f]/30 bg-[#0f2318] shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,#22c55e,#11845b)] px-6 py-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/75">Sber Pay Demo</p>
          <h3 className="mt-2 text-2xl font-semibold">Подтвердите оплату</h3>
          <p className="mt-2 text-sm text-white/80">
            Учебная версия оплаты для дипломной работы. Для успешного платежа введите код 123.
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">
            <p className="flex items-center justify-between gap-4">
              <span className="text-white/60">Сумма</span>
              <span className="text-xl font-semibold text-white">{total}</span>
            </p>
            <p className="mt-3 flex items-center justify-between gap-4">
              <span className="text-white/60">Телефон</span>
              <span>{phone || "Не указан"}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-[#2cbf6f]/20 bg-[#123122] p-4 text-sm text-[#b8f5d2]">
            Код для успешной оплаты: <span className="font-semibold text-white">123</span>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#8ee4b4]">
              Код подтверждения
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-lg tracking-[0.35em] text-white outline-none transition focus:border-[#2cbf6f]"
              inputMode="numeric"
              maxLength={3}
              placeholder="123"
              value={paymentCode}
              onChange={(e) => setPaymentCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
              disabled={checkoutLoading}
            />
          </div>

          {paymentError ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {paymentError}
            </div>
          ) : null}

          {paymentStep ? (
            <div className="rounded-2xl border border-[#2cbf6f]/30 bg-[#2cbf6f]/10 px-4 py-3 text-sm text-[#b8f5d2]">
              {paymentStep}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={checkoutLoading}
              className="btn-outline flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={checkoutLoading}
              className="flex-1 rounded-xl bg-[#22c55e] px-5 py-3 text-sm font-semibold text-[#062914] transition hover:bg-[#34d26c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checkoutLoading ? "Оплачиваем..." : "Оплатить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="card p-4">
      <p className="text-2xl font-semibold text-gold">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-gold/15 bg-bg/50 p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-xl text-gold">{value}</p>
    </div>
  );
}

function OrderCard({ order, itemTitle, compact = false }) {
  const status = STATUS_META[order.status] || STATUS_META.new;

  return (
    <article className="card overflow-hidden">
      <div className="border-b border-gold/10 bg-white/[0.02] p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-muted">Заказ #{order.id}</p>
              <span className={`rounded-full border px-3 py-1 text-xs ${status.badge}`}>
                {status.label}
              </span>
              {["fake-success", "sber-demo"].includes(order.payment_mode) && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1 text-xs text-emerald-200">
                  Онлайн-оплата
                </span>
              )}
            </div>
            <h3 className="mt-3 font-serif text-3xl leading-none">
              {order.items?.length ? `${order.items.length} позиций` : "Заказ"}
            </h3>
            <p className="mt-2 text-sm text-muted">{formatDate(order.created_at)}</p>
            {order.address && <p className="mt-1 text-sm text-muted">Адрес: {order.address}</p>}
          </div>

          <div className="md:text-right">
            <p className="font-serif text-3xl text-gold">{money(order.total)}</p>
            <p className="mt-2 text-sm text-muted">Этап пошива</p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gold" style={{ width: `${status.progress}%` }} />
        </div>
      </div>

      <div className={`grid gap-3 p-5 ${compact ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
        {(order.items || []).map((item) => (
          <div key={item.id} className="rounded-2xl border border-gold/12 bg-bg/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{itemTitle(item)}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.quantity} шт. • {money(item.price)}
                </p>
              </div>
              <span className="text-xs text-muted">#{item.id}</span>
            </div>

            {item.editor_data?.config && (
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  item.editor_data.config.fabric,
                  item.editor_data.config.color,
                  item.editor_data.config.pattern,
                  item.editor_data.config.style,
                ]
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((value) => (
                    <span
                      key={value}
                      className="rounded-full border border-gold/10 bg-white/5 px-3 py-1 text-xs text-muted"
                    >
                      {value}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
