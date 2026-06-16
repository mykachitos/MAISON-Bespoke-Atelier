import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import EditorPage from "./pages/EditorPage";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/AuthPage";

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-soft">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:id" element={<ProductPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h2 className="section-title">Страница не найдена</h2>
      <p className="mt-4 text-muted">Проверьте адрес или вернитесь в каталог.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<SiteLayout />} />
    </Routes>
  );
}
