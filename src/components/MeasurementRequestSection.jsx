import { useState } from "react";

import { api } from "../api/client";

const INITIAL_FORM = {
  full_name: "",
  phone: "",
  email: "",
  preferred_time: "",
  wishes: "",
};

export default function MeasurementRequestSection() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setIsSuccess(false);

    try {
      await api.createMeasurementRequest(formData);
      setFormData(INITIAL_FORM);
      setIsSuccess(true);
    } catch (_err) {
      setError("Не удалось отправить заявку. Попробуйте еще раз чуть позже.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container-page py-16">
      <div className="soft-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative overflow-hidden border-b border-gold/10 bg-[linear-gradient(180deg,rgba(201,168,76,0.12),rgba(10,10,12,0.06))] p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div className="absolute right-[-60px] top-[-40px] h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.24em] text-gold/75">Пожелания</p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                Хотите записаться на мерки? Оставьте свои данные
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted">
                Напишите, как с вами связаться, когда удобно приехать и какие есть пожелания по костюму.
                Мы посмотрим заявку и свяжемся с вами для записи.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  ["Что можно указать", "Желаемую дату, повод, стиль и любые детали по посадке."],
                  ["Как это работает", "Заявка сразу попадает в бэк и видна в админке со всеми присланными данными."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-gold/10 bg-black/10 p-4">
                    <p className="text-sm font-semibold text-soft">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 lg:p-12">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="measurement-full-name">
                  Имя
                </label>
                <input
                  id="measurement-full-name"
                  name="full_name"
                  type="text"
                  className="input"
                  placeholder="Как к вам обращаться"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="measurement-phone">
                  Телефон
                </label>
                <input
                  id="measurement-phone"
                  name="phone"
                  type="tel"
                  className="input"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="measurement-email">
                  Email
                </label>
                <input
                  id="measurement-email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="Если удобнее писать на почту"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="measurement-preferred-time">
                  Когда удобно
                </label>
                <input
                  id="measurement-preferred-time"
                  name="preferred_time"
                  type="text"
                  className="input"
                  placeholder="Например: будни после 18:00 или суббота утром"
                  value={formData.preferred_time}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="measurement-wishes">
                  Пожелания
                </label>
                <textarea
                  id="measurement-wishes"
                  name="wishes"
                  className="input min-h-32 resize-y"
                  placeholder="Напишите, какой костюм нужен, к какому событию и что важно по стилю или посадке"
                  value={formData.wishes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
            {isSuccess ? (
              <p className="mt-4 text-sm text-gold">
                Заявка отправлена. Мы свяжемся с вами, чтобы согласовать мерки.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="submit" className="btn-primary min-w-[220px]" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем..." : "Отправить заявку"}
              </button>
              <p className="text-sm leading-6 text-muted">
                Оставляя данные, вы отправляете их только для связи по записи на мерки.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
