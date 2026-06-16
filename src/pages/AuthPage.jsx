import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username) return setError("Введите логин.");
    if (form.password.length < 6) return setError("Пароль должен быть не короче 6 символов.");

    try {
      setSubmitting(true);

      if (mode === "login") {
        await login(username, form.password);
      } else {
        if (!email) return setError("Введите email.");
        if (form.password !== form.confirm) return setError("Пароли не совпадают.");
        await register(username, email, form.password);
      }

      navigate("/account");
    } catch {
      setError(
        mode === "login"
          ? "Не удалось войти. Проверьте логин и пароль."
          : "Не удалось создать аккаунт. Возможно, логин уже занят."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="card w-full max-w-md p-8 shadow-gold">
        <div className="mb-7 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Личный кабинет</p>
          <h1 className="mt-3 font-serif text-4xl">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Войдите в существующий аккаунт или создайте новый, чтобы сохранить заказы,
            мерки и пожелания.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="label">Логин</label>
          <input
            className="input"
            autoComplete="username"
            placeholder="Введите логин"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        {mode === "register" && (
          <div className="mb-4">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="label">Пароль</label>
          <input
            className="input"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Минимум 6 символов"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {mode === "register" && (
          <div className="mb-6">
            <label className="label">Повторите пароль</label>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="Повторите пароль"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>
        )}

        <button className="btn-primary w-full" disabled={submitting}>
          {submitting
            ? "Подождите..."
            : mode === "login"
            ? "Войти"
            : "Создать аккаунт"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="btn-ghost mt-4 w-full"
        >
          {mode === "login"
            ? "Нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </button>
      </form>
    </div>
  );
}
