import { useEffect, useState } from "react";

import { getStorage, setStorage } from "../utils/storage";

const COOKIE_CONSENT_KEY = "cookie-consent";

export default function CookieBanner() {
  const [consent, setConsent] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setConsent(getStorage(COOKIE_CONSENT_KEY, null));
    setIsReady(true);
  }, []);

  function handleConsent(value) {
    setStorage(COOKIE_CONSENT_KEY, value);
    setConsent(value);
  }

  if (!isReady || consent) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="container-page">
        <div className="pointer-events-auto reveal-up overflow-hidden rounded-[28px] border border-gold/20 bg-bg/95 shadow-gold backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.18),transparent_34%)]" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="badge mb-3 inline-flex">Cookies</span>
              <h3 className="font-serif text-2xl text-soft sm:text-3xl">
                Мы используем cookies
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
                Они помогают сохранять вход в аккаунт, корзину и настройки сайта,
                чтобы пользоваться ателье было удобнее.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleConsent("essential")}
                className="btn-outline"
              >
                Только необходимые
              </button>
              <button
                type="button"
                onClick={() => handleConsent("accepted")}
                className="btn-primary"
              >
                Принять
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
