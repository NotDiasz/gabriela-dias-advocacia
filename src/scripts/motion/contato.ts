import { gsap, type MotionOptions } from "./shared";
export function contato({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>(".contact-section");
  if (!section) return;
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-contato",
      trigger: section,
      start: mobile ? "top -80px" : "top top",
      end: mobile ? "+=65%" : "+=90%",
      pin: true,
      scrub: 0.9,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .addLabel("chegada", 0)
    .addLabel("abrir", 0.8)
    .addLabel("convite", 1.4)
    .addLabel("lacre", 2.3)
    .fromTo(
      ".envelope-arrival",
      { y: 12, rotation: -2, opacity: 1 },
      { y: 0, rotation: 0, opacity: 1, duration: 0.8 },
      "chegada",
    )
    .fromTo(".contact-card", { y: 250 }, { y: 250, duration: 0.1 }, 0)
    .to(".contact-seal", { opacity: 0, scale: 0.8, duration: 0.3 }, "abrir")
    .to(
      ".envelope-flap",
      { rotationX: 180, duration: 0.7, ease: "power3.inOut" },
      "abrir",
    )
    .set(".envelope-flap", { zIndex: 1 }, "abrir+=.4")
    .to(
      ".contact-card",
      { y: 0, duration: 0.9, ease: "power3.inOut" },
      "convite",
    )
    .fromTo(
      ".contact-seal",
      { y: -50, scale: 1.6, rotation: -12, opacity: 0 },
      {
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.in",
        immediateRender: false,
      },
      "lacre",
    );
}
