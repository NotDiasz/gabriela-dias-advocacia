import { gsap, SplitText, type MotionOptions } from "./shared";
export function clareza({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#clareza");
  if (!section) return;
  const split = SplitText.create(section.querySelector(".clarity-words")!, {
    type: "words",
    aria: "none",
  });
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-clareza",
      trigger: section,
      start: "top top",
      end: mobile ? "+=90%" : "+=140%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .fromTo(
      split.words,
      { filter: "blur(12px)", opacity: 0.15 },
      {
        filter: "blur(0px)",
        opacity: 1,
        stagger: 0.055,
        duration: 0.45,
        ease: "none",
      },
      0,
    )
    .fromTo(
      ".key-object",
      { rotation: -30, y: 35 },
      { rotation: 0, y: 0, duration: 1.6, ease: "none" },
      0,
    )
    .to(
      ".key-object",
      { rotation: 90, duration: 0.6, ease: "power3.inOut" },
      1.65,
    )
    .to(".clarity-content", { opacity: 0, scale: 0.97, duration: 0.55 }, 2.15);
  return () => split.revert();
}
