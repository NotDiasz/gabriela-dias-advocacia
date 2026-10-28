import { gsap, type MotionOptions } from "./shared";

export function palavra({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#palavra");
  if (!section) return;
  const track = section.querySelector<HTMLElement>(".letters-track")!;
  const letters = [
    ...track.querySelectorAll<HTMLElement>(".commitment-letter"),
  ];
  section.dataset.animated = "true";
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-palavra",
      trigger: section,
      start: "top top",
      end: mobile ? "+=150%" : "+=300%",
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .to(
      track,
      {
        xPercent: -100,
        x: () => section.clientWidth,
        duration: 4.6,
        ease: "none",
      },
      0.2,
    )
    .to(
      section.querySelector(".word-progress > span"),
      { scaleX: 1, duration: 5, ease: "none" },
      0,
    );
  letters.forEach((letter, index) => {
    const angle = index % 2 ? -4 : 4;
    const center = 0.2 + index * 1.15;
    gsap.set(letter, { rotation: index ? angle : 0, y: index ? 18 : 0 });
    if (index)
      timeline.to(
        letter,
        { rotation: 0, y: 0, duration: 0.65, ease: "power2.out" },
        center - 0.65,
      );
    if (index < letters.length - 1)
      timeline.to(
        letter,
        { rotation: -angle, y: 18, duration: 0.65, ease: "power2.in" },
        center + 0.1,
      );
  });
  return () => {
    delete section.dataset.animated;
  };
}
