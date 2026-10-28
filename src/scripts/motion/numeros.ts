import { gsap, type MotionOptions } from "./shared";

export function numeros({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#numeros");
  if (!section) return;
  const panels = [...section.querySelectorAll<HTMLElement>(".number-panel")];
  const counter = section.querySelector("[data-number-counter]")!;
  const ink = section.querySelector(".numbers-ink")!;
  const dot = section.querySelector<HTMLElement>(".number-period")!;
  section.dataset.animated = "true";
  gsap.set(panels.slice(1), { opacity: 0, y: 65 });
  const origin = () => {
    const bounds = section.getBoundingClientRect();
    const point = dot.getBoundingClientRect();
    const x = point.left + point.width / 2 - bounds.left;
    const y =
      point.top +
      point.height / 2 -
      bounds.top -
      Number(gsap.getProperty(panels.at(-1)!, "y"));
    const radius =
      Math.hypot(
        Math.max(x, bounds.width - x),
        Math.max(y, bounds.height - y),
      ) + 2;
    return { x, y, radius };
  };
  const circle = (expanded: boolean) => {
    const { x, y, radius } = origin();
    return `circle(${expanded ? radius : 0}px at ${x}px ${y}px)`;
  };
  const timeline = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onUpdate: function () {
      counter.textContent = String(
        Math.min(4, Math.floor(this.time() / 1.5) + 1),
      ).padStart(2, "0");
    },
    scrollTrigger: {
      id: "gd-numeros",
      trigger: section,
      start: "top top",
      end: mobile ? "+=150%" : "+=340%",
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });
  panels.forEach((panel, index) => {
    const start = index * 1.5;
    timeline.addLabel(`number-${index + 1}`, start);
    if (index) timeline.to(panel, { opacity: 1, y: 0, duration: 0.35 }, start);
    panel
      .querySelectorAll<HTMLElement>(".digit-strip")
      .forEach((strip, digit) => {
        timeline.fromTo(
          strip,
          { y: 0 },
          {
            y: () =>
              -Number(strip.dataset.turns) * strip.parentElement!.clientHeight,
            duration: 0.68 + digit * 0.07,
            ease: "power2.out",
          },
          start,
        );
      });
    if (index < panels.length - 1)
      timeline.to(panel, { opacity: 0, y: -65, duration: 0.35 }, start + 1.4);
  });
  timeline
    .to(
      section.querySelector(".numbers-progress > span"),
      { scaleX: 1, duration: 5.8, ease: "none" },
      0,
    )
    .fromTo(
      dot,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.25 },
      5.65,
    )
    .addLabel("ink", 6)
    .fromTo(
      ink,
      { clipPath: () => circle(false) },
      { clipPath: () => circle(true), duration: 1.15, ease: "power2.inOut" },
      "ink",
    )
    .to(
      [
        section.querySelector(".numbers-heading"),
        section.querySelector(".numbers-footer"),
      ],
      { opacity: 0, y: -15, duration: 0.4 },
      "ink+=.3",
    )
    .to({}, { duration: 0.2 });
  return () => {
    delete section.dataset.animated;
    counter.textContent = "01";
  };
}
