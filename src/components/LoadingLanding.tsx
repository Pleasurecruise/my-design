import { useEffect, useState } from "react";
import english from "../content/loading.json";
import chinese from "../content/loading.zh.json";
import { getInitialLocale } from "../lib/locale";
import { loadingDestination } from "../lib/loading";
import "../styles/loading.css";

const animations = ["ring", "dots", "bars", "wave", "pulse", "bouncing-dots"];

export default function LoadingLanding() {
  const [locale] = useState(getInitialLocale);
  const copy = locale === "zh" ? chinese : english;
  const [animation] = useState(() => animations[Math.floor(Math.random() * animations.length)]);
  const segments = animation === "wave" ? 5 : animation === "pulse" ? 1 : 3;

  useEffect(() => {
    document.title = copy.title;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", loadingDestination);
  }, [copy.title, locale]);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => window.location.replace(loadingDestination),
      reducedMotion ? 200 : 1800,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="loading-landing">
      <span className="loading-accessible" role="status">
        {copy.status}
      </span>
      <a className="loading-link" href={loadingDestination} aria-label={copy.continue}>
        {animation === "ring" ? (
          <svg
            className="loading-animation loading-ring"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 12.0004C20.9999 13.901 20.3981 15.7528 19.2809 17.2904C18.1637 18.8279 16.5885 19.9723 14.7809 20.5596C12.9733 21.1469 11.0262 21.1468 9.21864 20.5594C7.41109 19.9721 5.83588 18.8276 4.71876 17.29C3.60165 15.7523 2.99999 13.9005 3 11.9999C3.00001 10.0993 3.60171 8.24755 4.71884 6.70994C5.83598 5.17233 7.4112 4.02785 9.21877 3.44052C11.0263 2.85319 12.9734 2.85316 14.781 3.44044"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className={`loading-animation loading-${animation}`} aria-hidden="true">
            {Array.from({ length: segments }, (_, index) => (
              <span
                key={index}
                style={{ animationDelay: `${index * (animation === "wave" ? 100 : 200)}ms` }}
              />
            ))}
          </span>
        )}
      </a>
    </main>
  );
}
