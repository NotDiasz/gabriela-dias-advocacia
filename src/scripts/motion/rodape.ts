import { gsap, writeSignature } from "./shared";
export function rodape() {
  const footer = document.querySelector<HTMLElement>(".footer-signature");
  if (!footer) return;
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-rodape",
      trigger: ".footer-reveal",
      start: "top 95%",
      end: "clamp(bottom bottom)",
      scrub: 1,
    },
  });
  timeline.add(writeSignature(footer, 2), 0);
}
