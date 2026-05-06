(() => {
  const SELECTOR = ".blur-up";

  function loadOne(wrapper) {
    const img = wrapper.querySelector(".blur-up__img");
    if (!img) return;
    if (img.dataset.loaded === "true") return;

    const src = img.getAttribute("data-src");
    if (!src) return;

    img.dataset.loaded = "true";
    img.src = src;

    img.addEventListener(
      "load",
      () => {
        wrapper.classList.add("is-loaded");
      },
      { once: true }
    );
  }

  function init() {
    const wrappers = Array.from(document.querySelectorAll(SELECTOR));
    if (wrappers.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      wrappers.forEach(loadOne);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const wrapper = entry.target;
          io.unobserve(wrapper);
          loadOne(wrapper);
        }
      },
      { rootMargin: "200px 0px" }
    );

    wrappers.forEach((w) => io.observe(w));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

