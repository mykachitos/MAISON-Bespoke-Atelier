const REMOTE_API_URL = "https://maison-bespoke-atelier-backend.onrender.com/api";
const LOCAL_API_URL = "http://127.0.0.1:8000/api";
const isBrowser = typeof window !== "undefined";
const isLocalHost =
  isBrowser && ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_URL = (
  process.env.REACT_APP_API_URL || (isLocalHost ? LOCAL_API_URL : REMOTE_API_URL)
).replace(/\/$/, "");

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || JSON.stringify(err));
  }

  return res.status === 204 ? null : res.json();
}

export const api = {
  getProducts: () => request("/catalog/products/"),
  getProduct: (id) => request(`/catalog/products/${id}/`),
  getCategories: () => request("/catalog/categories/"),
  createProduct: (data) =>
    request("/catalog/products/", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    request(`/catalog/products/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/catalog/products/${id}/`, { method: "DELETE" }),

  register: (data) => request("/auth/register/", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login/", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me/"),
  updateMe: (data) => request("/auth/me/", { method: "PATCH", body: JSON.stringify(data) }),

  getOrders: () => request("/orders/"),
  createOrder: (data) => request("/orders/", { method: "POST", body: JSON.stringify(data) }),
};
