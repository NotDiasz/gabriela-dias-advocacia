import { gsap, MotionPathPlugin, type MotionOptions } from "./shared";
export function processo({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#como-funciona");
  if (!section) return;
  const route = section.querySelector<SVGPathElement>(".route-draw")!;
  const base = section.querySelector<SVGPathElement>(".route-base")!;
  if (mobile) {
    const path =
      "M100 40 C900 120 900 200 850 225 S30 350 120 400 S950 520 850 585";
    route.setAttribute("d", path);
    base.setAttribute("d", path);
  }
  const raw = MotionPathPlugin.getRawPath(route);
  MotionPathPlugin.cacheRawPathMeasurements(raw);
  const stops = [0, 0.31, 0.64, 1];
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-processo",
      trigger: ".process-journey",
      start: "top 70%",
      end: "bottom 45%",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline.fromTo(
    route,
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 3.6, ease: "none" },
    0,
  );
  const dot = section.querySelector(".route-dot")!;
  const state = { position: 0 };
  timeline.to(
    state,
    {
      position: 1,
      duration: 3.6,
      ease: "none",
      onUpdate: () => {
        // Hold near each waypoint, allowing its text to illuminate before moving on.
        const segment = Math.min(2, Math.floor(state.position * 3));
        const local = Math.min(
          1,
          Math.max(0, (state.position * 3 - segment - 0.12) / 0.76),
        );
        const position =
          stops[segment] + (stops[segment + 1] - stops[segment]) * local;
        const point = MotionPathPlugin.getPositionOnPath(raw, position);
        gsap.set(dot, { x: point.x, y: point.y });
      },
    },
    0,
  );
  section.querySelectorAll(".process-step").forEach((step, index) => {
    timeline.fromTo(
      step,
      { opacity: 0.35 },
      { opacity: 1, duration: 0.35, ease: "power3.out" },
      index * 1.05,
    );
  });
}
