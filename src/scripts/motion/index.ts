import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./shared";
import { intro } from "./intro";
import { hero } from "./hero";
import { background } from "./background";
import { escuta } from "./escuta";
import { clareza } from "./clareza";
import { marca } from "./marca";
import { areas } from "./areas";
import { sobre } from "./sobre";
import { processo } from "./processo";
import { numeros } from "./numeros";
import { palavra } from "./palavra";
import { faq } from "./faq";
import { depoimentos } from "./depoimentos";
import { contato } from "./contato";
import { rodape } from "./rodape";

let dispose: (() => void) | undefined;
let generation = 0;

function navigation() {
  const button = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
  const nav = document.querySelector<HTMLElement>("#main-nav")!;
  const setOpen = (open: boolean) => {
    button.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) nav.querySelector("a")?.focus();
  };
  const onToggle = () =>
    setOpen(button.getAttribute("aria-expanded") !== "true");
  const onKey = (event: KeyboardEvent) => {
    if (button.getAttribute("aria-expanded") !== "true") return;
    if (event.key === "Escape") {
      setOpen(false);
      button.focus();
    }
    if (event.key === "Tab") {
      const controls = [button, ...nav.querySelectorAll<HTMLElement>("a")];
      const index = controls.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls.at(-1)?.focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        button.focus();
      }
    }
  };
  const onLink = (event: Event) => {
    if ((event.target as Element).closest("a")) setOpen(false);
  };
  button.addEventListener("click", onToggle);
  document.addEventListener("keydown", onKey);
  nav.addEventListener("click", onLink);
  return () => {
    setOpen(false);
    button.removeEventListener("click", onToggle);
    document.removeEventListener("keydown", onKey);
    nav.removeEventListener("click", onLink);
  };
}

async function initialize() {
  dispose?.();
  const current = ++generation;
  const cleanupNav = navigation();
  const media = gsap.matchMedia();
  let lenis: Lenis | undefined;
  let ticker: ((time: number) => void) | undefined;
  const context = gsap.context(() => {}, document.body);
  // The intro only draws paths, so it starts before fonts and images settle.
  const cleanupIntro = intro(
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  dispose = () => {
    generation++;
    cleanupIntro?.();
    media.revert();
    context.revert();
    cleanupNav();
    if (ticker) gsap.ticker.remove(ticker);
    lenis?.destroy();
    delete document.body.dataset.motionReady;
  };
  await document.fonts.ready;
  await Promise.all(
    [...document.querySelectorAll<HTMLImageElement>(".hero img")].map((image) =>
      image.decode().catch(() => {}),
    ),
  );
  if (current !== generation) return;
  const ready = () => {
    if (current !== generation) return;
    ScrollTrigger.refresh();
    document.body.dataset.motionReady = "true";
    document.dispatchEvent(new Event("gd:motion-ready"));
    if (location.hash) {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      requestAnimationFrame(() =>
        target?.scrollIntoView({ behavior: "instant" }),
      );
    }
  };
  context.add(() => {
    media.add(
      {
        desktop: "(min-width: 900px)",
        mobile: "(max-width: 899px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (matchContext) => {
        const { mobile, reduced } = matchContext.conditions!;
        const cleanups: Array<(() => void) | undefined> = [];
        if (reduced) {
          cleanups.push(areas({ mobile: true }));
          ready();
          // Static, accessible layout. No pin, smooth scrolling, scrub or animated WebGL.
          return () => cleanups.reverse().forEach((cleanup) => cleanup?.());
        }
        lenis = new Lenis({
          duration: 1.15,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -25 },
        });
        lenis.on("scroll", ScrollTrigger.update);
        ticker = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        const options = { mobile };
        // Keep the order of the pins while yielding between layout-heavy setups.
        // The intro covers this short preparation and the main thread can paint.
        const tasks = [
          () => cleanups.push(hero(options)),
          background,
          () => cleanups.push(escuta(options)),
          () => cleanups.push(clareza(options)),
          () => cleanups.push(marca(options)),
          () => cleanups.push(areas(options)),
          sobre,
          () => processo(options),
          () => cleanups.push(numeros(options)),
          () => cleanups.push(palavra(options)),
          () => cleanups.push(faq()),
          () => cleanups.push(depoimentos(options)),
          () => contato(options),
          rodape,
        ];
        let timer = 0;
        let cancelled = false;
        const runNext = () => {
          if (cancelled || current !== generation) return;
          const task = tasks.shift();
          if (!task) {
            ready();
            return;
          }
          matchContext.add(() => {
            task();
          });
          timer = window.setTimeout(runNext, 32);
        };
        timer = window.setTimeout(runNext, 32);
        return () => {
          cancelled = true;
          window.clearTimeout(timer);
          cleanups.reverse().forEach((cleanup) => cleanup?.());
          if (ticker) gsap.ticker.remove(ticker);
          lenis?.destroy();
          lenis = undefined;
        };
      },
    );
  });
}

document.addEventListener("astro:page-load", initialize);
document.addEventListener("astro:before-swap", () => {
  dispose?.();
  dispose = undefined;
});
document.addEventListener("astro:before-preparation", () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(
    ".page-curtain",
    { yPercent: 100, visibility: "visible" },
    { yPercent: 0, duration: 0.4, ease: "power3.inOut" },
  );
});
document.addEventListener("astro:after-swap", () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(
    ".page-curtain",
    { yPercent: 0, visibility: "visible" },
    {
      yPercent: -100,
      duration: 0.75,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(".page-curtain", { visibility: "hidden" });
      },
    },
  );
});
