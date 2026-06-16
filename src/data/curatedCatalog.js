const IMG_HEATHERED_NAVY =
  "https://themoderngroom.com/cdn/shop/files/TMG_HeatheredNavy-Hero_300x.jpg?v=1713982097";
const IMG_MIDNIGHT_BLUE =
  "https://themoderngroom.com/cdn/shop/files/TMG_MidnightBlue-Hero_300x.jpg?v=1713992411";
const IMG_LIGHT_GREY =
  "https://themoderngroom.com/cdn/shop/files/TMG_LightGray-Hero_300x.jpg?v=1713982136";
const IMG_CHARCOAL =
  "https://themoderngroom.com/cdn/shop/files/TMG_Charcoal-Hero_300x.jpg?v=1713982038";
const IMG_BLACK_SUIT =
  "https://themoderngroom.com/cdn/shop/files/TMG_Black-Hero_300x.jpg?v=1713981801";
const IMG_BLACK_TUX =
  "https://themoderngroom.com/cdn/shop/files/TMG_BlackTuxedo-Hero_300x.jpg?v=1713981674";
const IMG_TAN =
  "https://themoderngroom.com/cdn/shop/files/TMG_Tan-Hero_300x.jpg?v=1713981949";

export const CURATED_CATEGORIES = [
  { id: "classic", label: "Классика" },
  { id: "wedding", label: "Свадебные" },
  { id: "business", label: "Деловые" },
  { id: "casual", label: "Повседневные" },
  { id: "tuxedo", label: "Смокинги" },
  { id: "secret", label: "Секретные" },
];

export const CURATED_PRODUCTS = [
  {
    id: 1001,
    category: "classic",
    fullName: "Темно-синий городской",
    fabric: "Итальянская шерсть Super 130's",
    style: "Классика",
    description:
      "Спокойный темно-синий костюм для города: чистая линия лацкана, аккуратная посадка и универсальный характер на каждый день.",
    price: 89000,
    oldPrice: 98000,
    rating: 4.9,
    color: "#18253a",
    accent: "#c9a84c",
    pattern: "solid",
    tag: "Bestseller",
    image: IMG_HEATHERED_NAVY,
  },
  {
    id: 1002,
    category: "tuxedo",
    fullName: "Черный вечерний смокинг",
    fabric: "Шерсть с сатиновыми деталями",
    style: "Смокинг",
    description:
      "Черный смокинг для вечера и церемоний: строгий силуэт, контрастная сорочка и классическая подача black tie.",
    price: 124000,
    oldPrice: 137000,
    rating: 5,
    color: "#111216",
    accent: "#d7b56a",
    pattern: "solid",
    tag: "Evening",
    image: IMG_BLACK_TUX,
  },
  {
    id: 1003,
    category: "business",
    fullName: "Офисный темно-синий",
    fabric: "Шерсть Super 120's",
    style: "Деловой",
    description:
      "Собранный деловой вариант для офиса и встреч: темный тон, уверенная посадка и спокойная фактура без лишнего блеска.",
    price: 76500,
    oldPrice: 83000,
    rating: 4.8,
    color: "#313740",
    accent: "#a73a3f",
    pattern: "pinstripe",
    tag: "Office",
    image: IMG_MIDNIGHT_BLUE,
  },
  {
    id: 1004,
    category: "wedding",
    fullName: "Светлый свадебный",
    fabric: "Тонкая шерсть с сатиновыми деталями",
    style: "Свадебный",
    description:
      "Светлый костюм для свадебного образа с мягким тоном ткани, аккуратной линией плеч и спокойной посадкой.",
    price: 118000,
    oldPrice: 129000,
    rating: 4.9,
    color: "#d8d2c4",
    accent: "#f0e7d0",
    pattern: "solid",
    tag: "Wedding",
    image: IMG_LIGHT_GREY,
  },
  {
    id: 1005,
    category: "business",
    fullName: "Графитовый деловой",
    fabric: "Шерсть с микротекстурой",
    style: "Деловой",
    description:
      "Графитовый костюм для плотного рабочего графика: строгий, чистый и универсальный, когда нужен один надежный вариант на неделю.",
    price: 81200,
    oldPrice: 88400,
    rating: 4.7,
    color: "#3b4047",
    accent: "#b8b0a2",
    pattern: "stripes",
    tag: "New",
    image: IMG_CHARCOAL,
  },
  {
    id: 1006,
    category: "classic",
    fullName: "Угольная классика",
    fabric: "Британская шерсть с сухой фактурой",
    style: "Классика",
    description:
      "Темный классический костюм с более традиционным настроением: плотный цвет, сдержанная ткань и уверенная посадка.",
    price: 84500,
    oldPrice: 91000,
    rating: 4.8,
    color: "#2b2f34",
    accent: "#d4af72",
    pattern: "checks",
    tag: "Tailored",
    image: IMG_BLACK_SUIT,
  },
  {
    id: 1007,
    category: "wedding",
    fullName: "Синий церемониальный",
    fabric: "Шерсть с шелком",
    style: "Свадебный",
    description:
      "Насыщенный синий костюм для церемоний и торжественных выходов, когда хочется более заметный, но все еще собранный образ.",
    price: 109000,
    oldPrice: 120000,
    rating: 4.9,
    color: "#244b7a",
    accent: "#d7c497",
    pattern: "solid",
    tag: "Ceremony",
    image: IMG_MIDNIGHT_BLUE,
  },
  {
    id: 1008,
    category: "tuxedo",
    fullName: "Noir Black Tie",
    fabric: "Смесовая шерсть с атласом",
    style: "Смокинг",
    description:
      "Более акцентный black tie вариант: глубокий черный цвет, четкий торс и формальная подача для вечернего дресс-кода.",
    price: 132000,
    oldPrice: 145000,
    rating: 5,
    color: "#101114",
    accent: "#c9a84c",
    pattern: "solid",
    tag: "Signature",
    image: IMG_BLACK_TUX,
  },
  {
    id: 1009,
    category: "casual",
    fullName: "Светлый летний",
    fabric: "Лен с хлопком",
    style: "Повседневный",
    description:
      "Легкий костюм для теплого сезона и неформальных событий, когда нужен более свободный, летний характер.",
    price: 64800,
    oldPrice: 71000,
    rating: 4.6,
    color: "#607999",
    accent: "#ead8ae",
    pattern: "windowpane",
    tag: "Summer",
    image: IMG_TAN,
  },
  {
    id: 1010,
    category: "casual",
    fullName: "Weekend Tailoring",
    fabric: "Мягкая шерсть с кашемиром",
    style: "Повседневный",
    description:
      "Неформальный костюм с мягкой фактурой и спокойным тоном для выходных, поездок и smart casual сценариев.",
    price: 73800,
    oldPrice: 80200,
    rating: 4.7,
    color: "#4c5d42",
    accent: "#d8bf86",
    pattern: "herringbone",
    tag: "Weekend",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 1011,
    category: "secret",
    fullName: "Zombie Night Shift",
    fabric: "Шерсть с театральной отделкой",
    style: "Секретный",
    description:
      "Пасхалка для своих: стилизованный зелено-графитовый костюм для съемок, вечеринок и странных идей после полуночи.",
    price: 66666,
    oldPrice: 77777,
    rating: 4.6,
    color: "#60734b",
    accent: "#c7d96b",
    pattern: "pinstripe",
    tag: "Secret",
    image:
      "https://static.wikia.nocookie.net/fnaf-fanon-animatronics/images/4/4b/Regular_Zombie.png/revision/latest?cb=20191224075216&path-prefix=ru",
  },
];
