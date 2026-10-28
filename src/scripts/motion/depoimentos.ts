import { gsap, type MotionOptions } from "./shared";

// Letters received: the testimonials arrive as a loose stack; scrolling takes
// the top one and lays it down in a fan, uncovering the next, until all of
// them are open side by side. On phones the cards are a swipeable row instead.
export function depoimentos({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#depoimentos");
  if (!section || mobile) return;
  const cards = [...section.querySelectorAll<HTMLElement>(".review-card")];
  const counter = section.querySelector("[data-review-index]");
  const count = cards.length;
  const middle = (count - 1) / 2;
  const tilt = [-2.5, 3, -1.5, 2, -3, 1.5];
  const spacing = () => {
    const width = cards[0].offsetWidth;
    const room = section.clientWidth * 0.86 - width;
    return Math.min(width + 26, room / Math.max(1, count - 1));
  };

  cards.forEach((card, index) => {
    gsap.set(card, {
      x: index * 7,
      y: index * 5,
      rotation: tilt[index % tilt.length],
      zIndex: count - index,
    });
  });
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-depoimentos",
      trigger: section,
      start: "top top",
      end: "+=230%",
      pin: true,
      scrub: 0.9,
      invalidateOnRefresh: true,
    },
    onUpdate() {
      if (!counter) return;
      const shown = Math.min(count, Math.floor(this.progress() * count) + 1);
      counter.textContent = String(shown).padStart(2, "0");
    },
  });
  cards.forEach((card, index) => {
    const offset = index - middle;
    timeline
      .to(
        card,
        { y: -34, scale: 1.035, duration: 0.3, ease: "power2.out" },
        index,
      )
      .set(card, { zIndex: count + index }, index + 0.3)
      .to(
        card,
        {
          x: () => offset * spacing(),
          y: Math.abs(offset) * 16,
          rotation: offset * 2.2,
          scale: 1,
          duration: 0.75,
          ease: "power3.inOut",
        },
        index + 0.3,
      );
  });
  timeline.to({}, { duration: 0.4 });
  return () => {
    gsap.set(cards, { clearProps: "transform,zIndex" });
    if (counter) counter.textContent = "01";
  };
}
