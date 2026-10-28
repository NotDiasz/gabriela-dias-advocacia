import { gsap, SplitText, type MotionOptions } from "./shared";
export function escuta({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#escuta");
  if (!section) return;
  const split = SplitText.create(section.querySelector(".manifesto-lines")!, {
    type: "lines",
    linesClass: "listening-line",
    aria: "none",
  });
  const period = section.querySelector(".manifesto-period")!;
  const drop = section.querySelector(".ink-drop")!;
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-escuta",
      trigger: section,
      start: "top top",
      end: mobile ? "+=70%" : "+=110%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .fromTo(
      section.querySelector("h2"),
      { opacity: 0.18 },
      { opacity: 1, duration: 0.8 },
      0,
    )
    .fromTo(
      split.lines,
      { opacity: 0.18 },
      { opacity: 1, duration: 0.7, stagger: 0.35, ease: "none" },
      0.1,
    )
    .fromTo(
      ".ink-object",
      { rotation: -9, y: 25 },
      { rotation: 9, y: -20, duration: 2, ease: "none" },
      0,
    )
    .set(period, { opacity: 0 }, 0)
    .fromTo(
      drop,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.15 },
      1.2,
    )
    .to(
      drop,
      {
        x: () => {
          const a = period.getBoundingClientRect();
          return (
            a.left +
            a.width / 2 -
            section.getBoundingClientRect().left -
            (drop as HTMLElement).offsetLeft -
            (drop as HTMLElement).offsetWidth / 2
          );
        },
        y: () => {
          const a = period.getBoundingClientRect();
          return (
            a.bottom -
            a.height * 0.3 -
            section.getBoundingClientRect().top -
            (drop as HTMLElement).offsetTop
          );
        },
        borderRadius: "50%",
        duration: 0.65,
        ease: "power3.in",
      },
      1.35,
    )
    .set(drop, { opacity: 0 }, 2)
    .set(period, { opacity: 1 }, 2)
    .to({}, { duration: 0.25 });
  return () => split.revert();
}
