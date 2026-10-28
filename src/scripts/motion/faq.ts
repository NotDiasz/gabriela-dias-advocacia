import { gsap, ScrollTrigger } from "./shared";
export function faq() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;
  gsap.from(items, {
    opacity: 0.4,
    y: 14,
    stagger: 0.08,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".faq-list",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
  const onToggle = () => ScrollTrigger.refresh();
  items.forEach((item) => item.addEventListener("toggle", onToggle));
  return () =>
    items.forEach((item) => item.removeEventListener("toggle", onToggle));
}
