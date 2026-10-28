import { gsap, ScrollTrigger, type MotionOptions } from "./shared";
export function areas({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#atuacao");
  if (!section) return;
  const cards = [...section.querySelectorAll<HTMLElement>(".area-card")];
  const cylinder = section.querySelector<HTMLElement>(".areas-cylinder")!;
  const stage = section.querySelector<HTMLElement>(".areas-stage")!;
  const counter = section.querySelector("[data-area-count]")!;
  const prev = section.querySelector<HTMLButtonElement>("[data-area-prev]")!;
  const next = section.querySelector<HTMLButtonElement>("[data-area-next]")!;
  let active = 0;
  let trigger: ScrollTrigger | undefined;
  const update = (value: number) => {
    active = value;
    counter.textContent = `0${active + 1}`;
    prev.disabled = active === 0;
    next.disabled = active === 3;
    cards.forEach((card, index) => {
      if (!mobile) card.inert = index !== active;
    });
  };
  if (!mobile) {
    // Four equal faces around a real cylinder, rather than a stack of translated cards.
    const radius = 340;
    cards.forEach((card, index) =>
      gsap.set(card, {
        transform: `translateX(-50%) rotateY(${index * 90}deg) translateZ(${radius}px)`,
        transformOrigin: "50% 50%",
      }),
    );
    gsap.set(cylinder, { z: -radius });
    const rotation = { value: 0 };
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "gd-areas",
        trigger: section,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    timeline.to(cylinder, { rotationY: -270, duration: 3, ease: "none" }, 0).to(
      rotation,
      {
        value: 3,
        duration: 3,
        ease: "none",
        onUpdate: () => {
          const index = Math.min(3, Math.round(rotation.value));
          update(index);
          cards.forEach((card, i) => {
            card.style.filter = `brightness(${1 - Math.min(1, Math.abs(rotation.value - i)) * 0.7})`;
          });
        },
      },
      0,
    );
    trigger = timeline.scrollTrigger;
  }
  const go = (index: number) => {
    const value = Math.max(0, Math.min(3, index));
    if (trigger)
      window.scrollTo({
        top: trigger.start + (value / 3) * (trigger.end - trigger.start),
        behavior: "smooth",
      });
    else {
      stage.scrollTo({
        left: cards[value].offsetLeft - cards[0].offsetLeft,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  };
  const onScroll = () => {
    if (mobile)
      update(
        Math.max(
          0,
          Math.min(
            3,
            Math.round(stage.scrollLeft / (cards[0].offsetWidth + 20)),
          ),
        ),
      );
  };
  const onPrev = () => go(active - 1);
  const onNext = () => go(active + 1);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      go(active + (event.key === "ArrowRight" ? 1 : -1));
    }
  };
  stage.addEventListener("scroll", onScroll, { passive: true });
  stage.addEventListener("keydown", onKey);
  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);
  update(0);
  return () => {
    stage.removeEventListener("scroll", onScroll);
    stage.removeEventListener("keydown", onKey);
    prev.removeEventListener("click", onPrev);
    next.removeEventListener("click", onNext);
    cards.forEach((card) => {
      card.inert = false;
      card.style.removeProperty("filter");
    });
  };
}
