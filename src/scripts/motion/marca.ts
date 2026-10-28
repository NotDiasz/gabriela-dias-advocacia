import { gsap, type MotionOptions } from "./shared";
export function marca({ mobile }: MotionOptions) {
  const section = document.querySelector<HTMLElement>("#marca");
  if (!section) return;
  const progress = { value: 0 };
  const colorName = section.querySelector("[data-color-name]")!;
  const colorHex = section.querySelector("[data-color-hex]")!;
  const colors = [
    ["MARFIM", "#F4EEE6"],
    ["NUDE", "#E7D3C7"],
    ["BORDÔ", "#7A1F2B"],
    ["CAFÉ", "#241A17"],
  ];
  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "gd-marca",
      trigger: section,
      start: "top top",
      end: mobile ? "+=150%" : "+=350%",
      pin: true,
      scrub: 1.1,
      invalidateOnRefresh: true,
    },
  });
  // The clarity section ends on plain coffee; the same coffee doors cover this
  // section on arrival and part while it rises, so there is no visible seam.
  const doors = gsap.timeline({
    scrollTrigger: {
      id: "gd-marca-portas",
      trigger: section,
      start: mobile ? "top bottom" : "top 75%",
      end: "top top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  doors
    .to(".door-left", { clipPath: "inset(0 100% 0 0)", ease: "power3.inOut" }, 0)
    .to(".door-right", { clipPath: "inset(0 0 0 100%)", ease: "power3.inOut" }, 0);
  timeline
    .addLabel("presenca", 0)
    .addLabel("nude", 1)
    .addLabel("bordo", 2)
    .addLabel("cafe", 3)
    .addLabel("travessia", 4);
  timeline
    .to(
      progress,
      {
        value: 1,
        duration: 4.7,
        ease: "none",
        onUpdate: () => {
          document.dispatchEvent(
            new CustomEvent("gd:brand-progress", { detail: progress.value }),
          );
          const time = progress.value * 4.7;
          const index = time < 0.55 ? 0 : time < 1.55 ? 1 : time < 2.55 ? 2 : 3;
          colorName.textContent = colors[index][0];
          colorHex.textContent = colors[index][1];
          section.style.color = index >= 2 ? "#F4EEE6" : "#241A17";
        },
      },
      0,
    )
    .to(".brand-outline", { xPercent: -45, duration: 4.7, ease: "none" }, 0)
    .to(
      ".brand-progress>span",
      { scaleX: 1, duration: 4.7, ease: "none" },
      0,
    );
  section.querySelectorAll(".brand-color-layer").forEach((layer, index) => {
    timeline.to(
      layer,
      {
        clipPath: "polygon(0% 0%, 150% 0%, 150% 100%, -10% 100%)",
        duration: 0.85,
        ease: "power3.inOut",
      },
      index + 0.55,
    );
  });
  timeline
    .to(
      ".brand-ring",
      {
        scale: mobile ? 4 : 6,
        yPercent: 55,
        duration: 1,
        ease: "power2.in",
      },
      "travessia",
    )
    // The ring first comes towards the camera; only then the coffee opens
    // from inside it and takes the screen.
    .to(
      ".brand-iris",
      {
        clipPath: "circle(90% at 50% 55%)",
        duration: 0.45,
        ease: "power2.in",
      },
      "travessia+=.55",
    )
    .to(".brand-ring", { opacity: 0, duration: 0.2 }, "travessia+=.8")
    .to(
      [".brand-top", ".brand-bottom"],
      { opacity: 0, duration: 0.35 },
      "travessia",
    );
  return () => {
    section.style.removeProperty("color");
    colorName.textContent = "MARFIM";
    colorHex.textContent = "#F4EEE6";
  };
}
