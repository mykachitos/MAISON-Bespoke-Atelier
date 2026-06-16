export const BASE_PRICE = 35000;

// === ТКАНИ (теперь только тип ткани, без цвета) ===
export const FABRICS = [
  {
    id: "wool-120",
    name: "Шерсть Super 120's",
    desc: "Классика для офиса. Износостойкая, держит форму.",
    price: 0,
  },
  {
    id: "wool-150",
    name: "Шерсть Super 150's",
    desc: "Тонкая премиальная шерсть с шелковистым блеском.",
    price: 8000,
  },
  {
    id: "wool-cashmere",
    name: "Шерсть + кашемир",
    desc: "Невероятная мягкость и тепло. Топ для зимы.",
    price: 15000,
  },
  {
    id: "wool-silk",
    name: "Шерсть + шёлк",
    desc: "Лёгкий перелив, элегантность для торжеств.",
    price: 18000,
  },
  {
    id: "linen",
    name: "Лён + хлопок",
    desc: "Дышащая ткань для летних образов.",
    price: 5000,
  },
  {
    id: "velvet",
    name: "Бархат",
    desc: "Глубокая фактура для смокингов и вечерних образов.",
    price: 20000,
  },
];

// === ЦВЕТА (отдельный выбор — 20+ вариантов) ===
export const COLORS = [
  // Тёмные
  { id: "midnight", name: "Полуночный синий", hex: "#0f1a2e" },
  { id: "navy", name: "Тёмно-синий", hex: "#1a2238" },
  { id: "royal", name: "Королевский синий", hex: "#1e3a8a" },
  { id: "black", name: "Чёрный", hex: "#0a0a0a" },
  { id: "charcoal", name: "Угольный", hex: "#2c2c2c" },
  { id: "graphite", name: "Графит", hex: "#36454f" },
  { id: "anthracite", name: "Антрацит", hex: "#3d3d3d" },

  // Серые
  { id: "gray-light", name: "Светло-серый", hex: "#9ca3af" },
  { id: "gray-medium", name: "Серый", hex: "#6b7280" },
  { id: "silver", name: "Серебристый", hex: "#bdc3c7" },

  // Коричневые / бежевые
  { id: "brown-dark", name: "Тёмно-коричневый", hex: "#3d2817" },
  { id: "chocolate", name: "Шоколадный", hex: "#5c3a21" },
  { id: "tobacco", name: "Табачный", hex: "#8b5a2b" },
  { id: "camel", name: "Кэмел", hex: "#c19a6b" },
  { id: "beige", name: "Бежевый", hex: "#c9b896" },
  { id: "cappuccino", name: "Капучино", hex: "#967259" },
  { id: "ivory", name: "Слоновая кость", hex: "#f5ecd9" },

  // Тёмные с характером
  { id: "bordeaux", name: "Бордо", hex: "#5c1a1b" },
  { id: "wine", name: "Винный", hex: "#722f37" },
  { id: "burgundy", name: "Бургунди", hex: "#800020" },
  { id: "emerald", name: "Изумруд", hex: "#1f3d2e" },
  { id: "forest", name: "Тёмно-зелёный", hex: "#2d4a2b" },
  { id: "olive", name: "Оливковый", hex: "#556b2f" },

  // Необычные
  { id: "plum", name: "Сливовый", hex: "#4b2840" },
  { id: "teal", name: "Бирюзовый", hex: "#1f4e5f" },
];

// === УЗОРЫ ===
export const PATTERNS = [
  { id: "solid", name: "Однотонный", icon: "▢", price: 0 },
  { id: "stripes", name: "Тонкая полоска", icon: "▦", price: 3000 },
  { id: "pinstripe", name: "Мел-полоска", icon: "║", price: 4000 },
  { id: "checks", name: "Клетка", icon: "▤", price: 5000 },
  { id: "windowpane", name: "Виндоупэйн", icon: "⊞", price: 6000 },
  { id: "herringbone", name: "Ёлочка", icon: "≋", price: 5500 },
];

// === ФАСОНЫ ===
export const SUIT_STYLES = [
  {
    id: "single-2",
    name: "Однобортный (2 пуг.)",
    note: "Универсальная классика",
    price: 0,
  },
  {
    id: "single-3",
    name: "Однобортный (3 пуг.)",
    note: "Винтажный силуэт",
    price: 2000,
  },
  {
    id: "double",
    name: "Двубортный",
    note: "Статусный, для широких плеч",
    price: 6000,
  },
  {
    id: "three-piece",
    name: "Тройка с жилетом",
    note: "Пиджак + жилет + брюки",
    price: 10000,
  },
  {
    id: "tuxedo",
    name: "Смокинг",
    note: "Атласные лацканы, для торжеств",
    price: 12000,
  },
];

// === ПОДКЛАДКА ===
export const LININGS = [
  { id: "lining-black", name: "Чёрная", color: "#1a1a1a", price: 0 },
  { id: "lining-navy", name: "Синяя", color: "#1a2238", price: 0 },
  { id: "lining-burgundy", name: "Бордовая", color: "#5c1a1b", price: 1500 },
  { id: "lining-gold", name: "Золотая", color: "#c9a84c", price: 3000 },
  { id: "lining-emerald", name: "Изумрудная", color: "#1f3d2e", price: 2500 },
  { id: "lining-purple", name: "Пурпурная", color: "#4b2840", price: 2500 },
];

// === ПУГОВИЦЫ ===
export const BUTTONS = [
  { id: "btn-horn", name: "Рог", price: 0 },
  { id: "btn-mop", name: "Перламутр", price: 2500 },
  { id: "btn-wood", name: "Дерево", price: 1500 },
  { id: "btn-metal", name: "Металл", price: 2000 },
  { id: "btn-gold", name: "Золочёные", price: 5000 },
];

// === ДОПОЛНИТЕЛЬНО ===
export const EXTRAS = [
  { id: "extra-pocket", name: "Накладные карманы", price: 1500 },
  { id: "extra-ticket", name: "Билетный карман", price: 1200 },
  { id: "extra-pick", name: "Отделочная строчка", price: 2000 },
  { id: "extra-pochette", name: "Платок-паше в подарок", price: 0 },
  { id: "extra-trousers", name: "Вторые брюки", price: 12000 },
  { id: "extra-monogram-sleeve", name: "Расстёгивающиеся манжеты", price: 3500 },
];