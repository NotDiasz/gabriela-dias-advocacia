import { createIntroSound, type IntroSound } from "../intro-sound";
import { gsap, writeSignature } from "./shared";

declare global {
  interface Window {
    __gdIntroPlayed?: boolean;
    __gdIntroDone?: boolean;
  }
}

const finish = () => {
  window.__gdIntroDone = true;
  document.dispatchEvent(new Event("gd:intro-done"));
};

// The intro opens every full page load; navigating inside the site back to the
// home page does not replay it (the flags live as long as the document).
export function intro(reduced: boolean) {
  const root = document.querySelector<HTMLElement>("[data-intro]");
  if (!root) {
    finish();
    return;
  }
  if (window.__gdIntroPlayed) {
    root.hidden = true;
    return;
  }
  window.__gdIntroPlayed = true;
  const background = [
    ...document.querySelectorAll<HTMLElement>(
      "main > :not([data-intro]), .site-header, .skip-link, .footer-reveal",
    ),
  ];
  const previousInert = background.map((element) => element.inert);
  background.forEach((element) => {
    element.inert = true;
  });
  const gate = root.querySelector<HTMLElement>(".intro-gate")!;
  const seal = root.querySelector<HTMLElement>(".intro-seal")!;
  const skip = root.querySelector<HTMLButtonElement>("[data-intro-skip]")!;
  root.setAttribute("tabindex", "-1");
  root.focus({ preventScroll: true });

  // Browsers keep audio suspended until the visitor interacts with the page;
  // the sound starts right away when allowed, or joins at the first gesture.
  let sound: IntroSound | undefined = reduced ? undefined : createIntroSound();
  const unlock = () => sound?.resume();
  const gestures = ["pointerdown", "keydown", "touchstart"] as const;
  gestures.forEach((type) =>
    window.addEventListener(type, unlock, { once: true, passive: true }),
  );

  const close = () => {
    root.hidden = true;
    root.setAttribute("inert", "");
    gestures.forEach((type) => window.removeEventListener(type, unlock));
    sound?.dispose();
    sound = undefined;
    background.forEach((element, index) => {
      element.inert = previousInert[index];
    });
    if (root.contains(document.activeElement))
      (document.querySelector("#conteudo") as HTMLElement)?.focus({
        preventScroll: true,
      });
    finish();
  };
  const timeline = gsap.timeline({ paused: true, onComplete: close });
  if (reduced) timeline.to(root, { opacity: 0, duration: 0.3 }, 0.6);
  else {
    const writing = 4.2;
    timeline
      // The seal gives way by itself: a small press, then it lifts away.
      .call(() => sound?.seal(), undefined, 0)
      .to(seal, { scale: 0.94, duration: 0.14, ease: "power2.out" }, 0)
      .to(
        gate,
        { opacity: 0, y: -14, duration: 0.6, ease: "power3.inOut" },
        0.16,
      )
      .set(gate, { display: "none" }, 0.77)
      .call(() => root.classList.add("is-open"), undefined, 0.77)
      .add(
        writeSignature(root, writing, {
          move: (x, y) => sound?.pen(x, y),
          lift: () => sound?.lift(),
          dot: () => sound?.dot(),
        }),
        0.85,
      )
      .fromTo(
        ".intro-note",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.85 + writing * 0.86,
      )
      .to(
        root,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        0.85 + writing + 0.9,
      );
  }

  // The page sets up its pins and 3D while the seal is still on screen, so the
  // writing never competes with that work for frames.
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    document.removeEventListener("gd:motion-ready", start);
    window.clearTimeout(fallback);
    timeline.play();
  };
  document.addEventListener("gd:motion-ready", start);
  const fallback = window.setTimeout(start, 1600);
  if (document.body.dataset.motionReady) start();

  const onSkip = () => {
    timeline.progress(1);
    close();
  };
  skip.addEventListener("click", onSkip);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") onSkip();
    if (event.key === "Tab") {
      event.preventDefault();
      skip.focus();
    }
  };
  root.addEventListener("keydown", onKey);
  return () => {
    timeline.kill();
    window.clearTimeout(fallback);
    document.removeEventListener("gd:motion-ready", start);
    skip.removeEventListener("click", onSkip);
    root.removeEventListener("keydown", onKey);
    if (!root.hidden) close();
  };
}
