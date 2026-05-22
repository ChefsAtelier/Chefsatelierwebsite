import fs from "node:fs/promises";

const path = "index.html";
let html = await fs.readFile(path, "utf8");
html = html.replace(/\r\n/g, "\n");

const newForm = `              <h3 class="text-lg font-semibold text-cream">Stuur je aanvraag</h3>
              <p class="mt-2 text-sm text-cream/65">Vul het formulier in en we nemen binnen 24 uur contact met je op.</p>
              <form id="callback-form" class="mt-6" action="#" method="post" novalidate>
                <input type="hidden" name="access_key" value="10ad5dc4-71c6-40f0-9543-fbcf51c822b5" />
                <input type="hidden" name="subject" value="Contactaanvraag — Chefs Atelier" />
                <input type="hidden" name="from_name" value="Chefs Atelier website" />
                <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />
                <div id="callback-fields" class="space-y-4">
                  <div>
                    <label for="naam" class="block text-sm font-medium text-cream/90">Naam <span class="text-secondary">*</span></label>
                    <input
                      type="text"
                      id="naam"
                      name="naam"
                      required
                      autocomplete="name"
                      placeholder="Je volledige naam"
                      class="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label for="gewenste-datum" class="block text-sm font-medium text-cream/90">Gewenste datum <span class="text-secondary">*</span></label>
                    <div class="mt-1.5 flex gap-2">
                      <input
                        type="text"
                        id="gewenste-datum"
                        name="gewenste_datum"
                        required
                        autocomplete="off"
                        placeholder="dd-mm-jjjj"
                        class="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                      />
                      <div class="relative shrink-0">
                        <button
                          type="button"
                          id="gewenste-datum-open"
                          class="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-white/15 bg-white/5 text-cream transition hover:border-secondary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                          title="Kies een datum"
                          aria-label="Open kalender"
                        >
                          <i data-lucide="calendar" class="h-5 w-5"></i>
                        </button>
                        <input
                          type="date"
                          id="gewenste-datum-picker"
                          class="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                          tabindex="-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label for="aantal-personen" class="block text-sm font-medium text-cream/90">Aantal personen <span class="text-secondary">*</span></label>
                    <input
                      type="text"
                      id="aantal-personen"
                      name="aantal_personen"
                      required
                      inputmode="numeric"
                      pattern="[0-9]*"
                      autocomplete="off"
                      placeholder="Bijv. 12"
                      class="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium text-cream/90">Telefoonnummer <span class="text-secondary">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      inputmode="tel"
                      autocomplete="tel"
                      placeholder="+31 6 12 34 56 78"
                      class="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-cream/90">Mailadres <span class="text-secondary">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autocomplete="email"
                      placeholder="jouw@email.nl"
                      class="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label for="gelegenheid" class="block text-sm font-medium text-cream/90">Gelegenheid (optioneel)</label>
                    <input
                      type="text"
                      id="gelegenheid"
                      name="gelegenheid"
                      placeholder="Bijv. verjaardag, jubileum, zakelijk diner"
                      class="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
                  <div>
                    <label for="msg" class="block text-sm font-medium text-cream/90">Korte toelichting (optioneel)</label>
                    <textarea
                      id="msg"
                      name="msg"
                      rows="3"
                      placeholder="Vertel ons kort over je wensen…"
                      class="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    ></textarea>
                  </div>`;

const h3Start = html.indexOf('<h3 class="text-lg font-semibold text-cream">Laat je telefoonnummer achter</h3>');
const submitIdx = html.indexOf('id="callback-submit"');
const btnStart = submitIdx === -1 ? -1 : html.lastIndexOf("<button", submitIdx);
if (h3Start === -1 || btnStart === -1) throw new Error("Form block markers not found");
html = html.slice(0, h3Start) + newForm + "\n              " + html.slice(btnStart);

const scriptStart = html.indexOf("      (function () {\n        var form = document.getElementById(\"callback-form\");");
const scriptEnd = html.indexOf("      })();\n", scriptStart);
if (scriptStart === -1 || scriptEnd === -1) throw new Error("Contact form script block not found");
html = html.slice(0, scriptStart) + html.slice(scriptEnd + "      })();\n".length);

if (!html.includes("assets/js/contact-form.js")) {
  html = html.replace(
    "</body>",
    '    <script src="assets/js/contact-form.js"></script>\n  </body>'
  );
}

await fs.writeFile(path, html);
console.log("Updated index.html contact form");
