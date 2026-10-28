import { gsap } from "./shared";
export function background() {
  if (!document.querySelector(".hero")) return;
  gsap.to(document.body, {
    backgroundColor: "#241A17",
    ease: "none",
    scrollTrigger: {
      trigger: "#escuta",
      start: "top bottom",
      end: "top 15%",
      scrub: 1,
    },
  });
}
