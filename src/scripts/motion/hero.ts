import { gsap, type MotionOptions } from "./shared";

export function hero({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>(".hero");
  if (!section) return;
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-hero",
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  const syllables = section.querySelectorAll(".arc-syllable");
  syllables.forEach((syllable, index) => {
    const offset = index - (syllables.length - 1) / 2;
    timeline.to(
      syllable,
      {
        x: offset * (mobile ? 12 : 25),
        y: -90 - Math.abs(offset) * 20,
        rotation: offset * 8,
        opacity: 0,
        duration: 0.65,
        ease: "power3.in",
      },
      0,
    );
  });
  timeline
    .to(
      ".hero-dias",
      {
        scale: 1.4,
        letterSpacing: ".06em",
        opacity: 0.4,
        duration: 1,
        ease: "none",
      },
      0,
    )
    .to(
      ".hero-portrait-wrap",
      {
        clipPath: "ellipse(45% 47% at 50% 50%)",
        scale: 0.72,
        y: mobile ? -20 : -35,
        duration: 0.55,
        ease: "power3.inOut",
      },
      0,
    )
    .to(".cameo-outline", { opacity: 1, duration: 0.2 }, 0.3)
    .to(
      ".hero-portrait-wrap",
      {
        y: mobile ? -180 : -230,
        scale: 0.5,
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
      },
      0.55,
    )
    .to(
      [".hero-bottom", ".hero-note", ".hero-location"],
      { opacity: 0, y: -20, duration: 0.4 },
      0.05,
    );
  if (mobile) return;
  const layers = [
    section.querySelector(".hero-arc")!,
    section.querySelector(".hero-dias")!,
    section.querySelector(".hero-portrait")!,
  ];
  const xSetters = layers.map((layer) =>
    gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3.out" }),
  );
  const ySetters = layers.map((layer) =>
    gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3.out" }),
  );
  const rotate = gsap.quickTo(layers[0], "rotation", {
    duration: 1.2,
    ease: "power3.out",
  });
  const onMove = (event: PointerEvent) => {
    const x = event.clientX / innerWidth - 0.5;
    const y = event.clientY / innerHeight - 0.5;
    [18, 35, 9].forEach((depth, index) => {
      xSetters[index](x * depth);
      ySetters[index](y * depth);
    });
    rotate(x * 3);
  };
  const onLeave = () => {
    xSetters.forEach((set) => set(0));
    ySetters.forEach((set) => set(0));
    rotate(0);
  };
  section.addEventListener("pointermove", onMove);
  section.addEventListener("pointerleave", onLeave);
  return () => {
    section.removeEventListener("pointermove", onMove);
    section.removeEventListener("pointerleave", onLeave);
  };
}
