import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText, MotionPathPlugin);
export { gsap, ScrollTrigger, DrawSVGPlugin, SplitText, MotionPathPlugin };
export type MotionOptions = { mobile: boolean };

type PenHooks = {
  move?: (x: number, y: number) => void;
  lift?: () => void;
  dot?: () => void;
};

export function writeSignature(
  root: Element,
  duration = 2.2,
  hooks: PenHooks = {},
) {
  const pens = [...root.querySelectorAll<SVGPathElement>(".signature-pen")];
  const nib = root.querySelector<SVGCircleElement>(".signature-nib");
  const dot = root.querySelector(".signature-dot");
  const label = root.querySelector(".signature-label");
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  // A wide stroke runs along each glyph inside its mask, uncovering the ink in
  // the direction of the outline. Time is shared by length so long flourishes
  // take longer, and each letter starts before the previous one lifts.
  const lengths = pens.map((pen) => pen.getTotalLength());
  const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
  const writing = duration * 0.78;
  let start = 0;
  let active = -1;
  pens.forEach((pen, index) => {
    const share = (writing * lengths[index]) / total;
    timeline.fromTo(
      pen,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: share * 1.7,
        ease: "power1.inOut",
        onStart: () => {
          active = index;
        },
        onUpdate: nib
          ? function (this: gsap.core.Tween) {
              if (active !== index) return;
              const point = pen.getPointAtLength(
                lengths[index] * Math.min(1, this.ratio * 1.15),
              );
              nib.setAttribute("cx", String(point.x));
              nib.setAttribute("cy", String(point.y));
              hooks.move?.(point.x, point.y);
            }
          : undefined,
      },
      start,
    );
    start += share;
  });
  if (nib)
    timeline
      .fromTo(nib, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to(nib, { opacity: 0, duration: 0.3 }, writing)
      .call(() => hooks.lift?.(), undefined, writing);
  const drop = duration * 0.78;
  // SVG transforms scale from the corner unless told otherwise.
  if (dot) gsap.set(dot, { transformOrigin: "50% 50%" });
  const ripples = [
    ...root.querySelectorAll<SVGCircleElement>(".signature-ripple"),
  ];
  if (dot && ripples.length) {
    // The dot of the i as a drop of ink: it falls, stretched by the fall,
    // flattens as it meets the paper, settles round, and the ink opens out.
    const fall = 0.42;
    const impact = drop + fall;
    timeline
      .fromTo(
        dot,
        { y: -150, opacity: 0, scaleX: 0.7, scaleY: 1.6 },
        { y: 0, opacity: 1, scaleX: 0.8, scaleY: 1.35, duration: fall, ease: "power2.in" },
        drop,
      )
      .to(dot, { scaleX: 1.45, scaleY: 0.6, duration: 0.07, ease: "power1.out" }, impact)
      .to(dot, { scaleX: 1, scaleY: 1, duration: 0.55, ease: "power3.out" }, impact + 0.07)
      .call(
        () => {
          const box = (dot as SVGGraphicsElement).getBBox();
          ripples.forEach((ripple) => {
            ripple.setAttribute("cx", String(box.x + box.width / 2));
            ripple.setAttribute("cy", String(box.y + box.height / 2));
          });
          hooks.dot?.();
        },
        undefined,
        impact,
      );
    ripples.forEach((ripple, index) =>
      timeline.fromTo(
        ripple,
        { attr: { r: 4 }, opacity: 0.55, strokeWidth: 2.2 },
        { attr: { r: 30 + index * 16 }, opacity: 0, strokeWidth: 0.3, duration: 1.1 + index * 0.3, ease: "power2.out" },
        impact + index * 0.12,
      ),
    );
  } else if (dot)
    timeline
      .fromTo(
        dot,
        { y: -35, opacity: 0, scaleY: 1.15 },
        { y: 0, opacity: 1, scaleY: 1, duration: 0.4 },
        drop,
      )
      .call(() => hooks.dot?.(), undefined, drop + 0.32);
  if (label)
    timeline.fromTo(
      label,
      { opacity: 0, letterSpacing: ".18em" },
      { opacity: 1, letterSpacing: ".5em", duration: 0.55 },
      duration * 0.78,
    );
  return timeline;
}
