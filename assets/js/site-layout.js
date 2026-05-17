/**
 * Injects shared site header & footer. Requires mount nodes:
 * <div id="site-header-mount"></div>
 * <div id="site-footer-mount"></div>
 * Load after the Lucide UMD script; calls lucide.createIcons() after injection.
 */
(function () {
  var HEADER =
    '<header class="sticky top-0 z-50 border-b border-white/10 bg-primary/95 backdrop-blur-md">' +
    '<nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8" aria-label="Hoofdmenu">' +
    '<a href="index.html" class="flex shrink-0 items-center gap-2">' +
    '<picture>' +
    '<source srcset="assets/img/chefs-atalier-logo.webp" type="image/webp" />' +
    '<img src="assets/img/chefs-atalier-logo.webp" alt="Chefs Atelier" class="h-10 w-auto md:h-12" width="130" height="48" />' +
    "</picture>" +
    "</a>" +
    '<div class="hidden items-center gap-1 lg:flex lg:gap-2">' +
    '<div class="relative">' +
    '<button type="button" id="ervaringen-toggle" class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-cream/90 transition hover:bg-white/10 hover:text-cream" aria-expanded="false" aria-controls="ervaringen-dropdown" aria-haspopup="true">' +
    "Ervaringen " +
    '<i data-lucide="chevron-down" class="h-4 w-4"></i>' +
    "</button>" +
    '<div id="ervaringen-dropdown" class="absolute left-0 top-full z-50 mt-1 hidden min-w-[14rem] rounded-xl border border-white/10 bg-[#281732] py-2 shadow-xl" role="menu">' +
    '<a href="experience-menu.html" class="block px-4 py-2 text-sm text-cream/90 hover:bg-white/10" role="menuitem">Experience Menu</a>' +
    '<a href="borrel.html" class="block px-4 py-2 text-sm text-cream/90 hover:bg-white/10" role="menuitem">Borrel</a>' +
    '<a href="shared-dining.html" class="block px-4 py-2 text-sm text-cream/90 hover:bg-white/10" role="menuitem">Shared Dining</a>' +
    '<a href="avond-experience.html" class="block px-4 py-2 text-sm text-cream/90 hover:bg-white/10" role="menuitem">Avond Experience</a>' +
    '<div class="my-1.5 border-t border-white/10" role="separator"></div>' +
    '<p class="px-4 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-secondary/80">Extra&apos;s</p>' +
    '<a href="maak-de-avond-compleet.html" class="block px-4 py-1.5 text-sm text-cream/65 hover:bg-white/10 hover:text-cream/90" role="menuitem">Maak de avond compleet</a>' +
    '<a href="wine-pairing.html" class="block px-4 pb-2.5 pt-1.5 text-sm text-cream/65 hover:bg-white/10 hover:text-cream/90" role="menuitem">Wine pairing</a>' +
    "</div>" +
    "</div>" +
    '<a href="over-ons.html" class="rounded-lg px-3 py-2 text-sm font-medium text-cream/90 transition hover:bg-white/10">Over ons</a>' +
    '<a href="contact.html" class="rounded-lg px-3 py-2 text-sm font-medium text-cream/90 transition hover:bg-white/10">Contact</a>' +
    "</div>" +
    '<div class="flex items-center gap-2 md:gap-3">' +
    '<a href="index.html#contact" class="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-primary shadow-lg shadow-black/20 transition hover:bg-secondary/90 sm:px-4 md:px-5">' +
    '<i data-lucide="phone" class="h-4 w-4 shrink-0"></i>' +
    "<span>Bel me terug</span>" +
    "</a>" +
    '<button type="button" id="mobile-menu-toggle" class="inline-flex rounded-lg p-2 text-cream lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu openen">' +
    '<i data-lucide="menu" class="h-6 w-6" id="icon-menu"></i>' +
    '<i data-lucide="x" class="hidden h-6 w-6" id="icon-close"></i>' +
    "</button>" +
    "</div>" +
    "</nav>" +
    '<div id="mobile-menu" class="hidden border-t border-white/10 bg-primary px-4 py-4 lg:hidden">' +
    '<div class="flex flex-col gap-1">' +
    '<p class="text-xs font-semibold uppercase tracking-wider text-secondary">Ervaringen</p>' +
    '<a href="experience-menu.html" class="rounded-lg py-2 pl-2 text-cream/90">Experience Menu</a>' +
    '<a href="borrel.html" class="rounded-lg py-2 pl-2 text-cream/90">Borrel</a>' +
    '<a href="shared-dining.html" class="rounded-lg py-2 pl-2 text-cream/90">Shared Dining</a>' +
    '<a href="avond-experience.html" class="rounded-lg py-2 pl-2 text-cream/90">Avond Experience</a>' +
    '<p class="mt-3 pl-2 text-[10px] font-semibold uppercase tracking-wider text-secondary/80">Extra&apos;s</p>' +
    '<a href="maak-de-avond-compleet.html" class="rounded-lg py-1.5 pl-4 text-sm text-cream/65">Maak de avond compleet</a>' +
    '<a href="wine-pairing.html" class="rounded-lg py-1.5 pl-4 text-sm text-cream/65">Wine pairing</a>' +
    '<hr class="my-2 border-white/10" />' +
    '<a href="over-ons.html" class="rounded-lg py-2 font-medium">Over ons</a>' +
    '<a href="contact.html" class="rounded-lg py-2 font-medium">Contact</a>' +
    "</div>" +
    "</div>" +
    "</header>";

  var instagramHref = "https://www.instagram.com/chefs.atelier.aan.huis/";
  var instagramSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">' +
    '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>' +
    '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>' +
    '<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>' +
    "</svg>";

  var FOOTER =
    '<footer class="border-t border-white/10 bg-[#1a0f22] py-12 md:py-16">' +
    '<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">' +
    '<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">' +
    "<div>" +
    '<picture>' +
    '<source srcset="assets/img/chefs-atalier-logo.webp" type="image/webp" />' +
    '<img src="assets/img/chefs-atalier-logo.webp" alt="Chefs Atelier" class="mb-4 h-10 w-auto opacity-90" width="108" height="40" />' +
    "</picture>" +
    '<p class="text-sm text-cream/60">KVK: [nummer volgt]</p>' +
    '<div class="mt-4 flex gap-3">' +
    '<a href="' +
    instagramHref +
    '" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream transition hover:bg-secondary hover:text-primary" aria-label="Instagram @chefs.atelier.aan.huis">' +
    instagramSvg +
    "</a>" +
    "</div>" +
    "</div>" +
    "<div>" +
    '<p class="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">Pagina&apos;s</p>' +
    '<ul class="space-y-2 text-sm text-cream/75">' +
    '<li><a href="index.html" class="hover:text-secondary">Home</a></li>' +
    '<li><a href="experience-menu.html" class="hover:text-secondary">Experience Menu</a></li>' +
    '<li><a href="borrel.html" class="hover:text-secondary">Borrel</a></li>' +
    '<li><a href="shared-dining.html" class="hover:text-secondary">Shared Dining</a></li>' +
    '<li><a href="avond-experience.html" class="hover:text-secondary">Avond Experience</a></li>' +
    '<li><a href="maak-de-avond-compleet.html" class="hover:text-secondary">Maak de avond compleet</a></li>' +
    '<li><a href="wine-pairing.html" class="hover:text-secondary">Wine pairing</a></li>' +
    "</ul>" +
    "</div>" +
    "<div>" +
    '<p class="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">Meer</p>' +
    '<ul class="space-y-2 text-sm text-cream/75">' +
    '<li><a href="over-ons.html" class="hover:text-secondary">Over ons</a></li>' +
    '<li><a href="contact.html" class="hover:text-secondary">Contact</a></li>' +
    '<li><a href="terms.html" class="hover:text-secondary">Algemene voorwaarden</a></li>' +
    '<li><a href="privacy.html" class="hover:text-secondary">Privacybeleid</a></li>' +
    "</ul>" +
    "</div>" +
    '<div class="flex flex-col justify-end md:col-span-2 lg:col-span-1">' +
    '<p class="text-sm text-cream/50">Made with 💖 in Utrecht</p>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</footer>";

  function bindSiteChrome() {
    var toggle = document.getElementById("ervaringen-toggle");
    var dropdown = document.getElementById("ervaringen-dropdown");
    if (toggle && dropdown) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = dropdown.classList.toggle("hidden") === false;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", function () {
        dropdown.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
      });
      dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    var mobBtn = document.getElementById("mobile-menu-toggle");
    var mobMenu = document.getElementById("mobile-menu");
    var iconMenu = document.getElementById("icon-menu");
    var iconClose = document.getElementById("icon-close");
    if (mobBtn && mobMenu) {
      mobBtn.addEventListener("click", function () {
        mobMenu.classList.toggle("hidden");
        var isOpen = !mobMenu.classList.contains("hidden");
        mobBtn.setAttribute("aria-expanded", isOpen);
        mobBtn.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
        if (iconMenu && iconClose) {
          iconMenu.classList.toggle("hidden", isOpen);
          iconClose.classList.toggle("hidden", !isOpen);
        }
      });
    }
  }

  function mount() {
    var hm = document.getElementById("site-header-mount");
    var fm = document.getElementById("site-footer-mount");
    if (hm) hm.outerHTML = HEADER;
    if (fm) fm.outerHTML = FOOTER;
    if (typeof lucide !== "undefined") lucide.createIcons();
    bindSiteChrome();
  }

  mount();
})();
