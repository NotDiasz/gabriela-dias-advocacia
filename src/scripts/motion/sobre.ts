import { gsap, writeSignature } from "./shared";
export function sobre() {
  const section = document.querySelector<HTMLElement>("#sobre");
  if (!section) return;
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-sobre",
      trigger: section,
      start: "top 70%",
      end: "bottom 65%",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .fromTo(
      ".about-curtain",
      { scaleX: 1 },
      { scaleX: 0, duration: 0.9, ease: "power3.inOut" },
      0,
    )
    .fromTo(
      ".about-portrait",
      { yPercent: -7, scale: 1.12 },
      { yPercent: 5, scale: 1.04, duration: 2, ease: "none" },
      0,
    )
    .add(writeSignature(section.querySelector(".about-signature")!, 1.3), 0.65);
}
