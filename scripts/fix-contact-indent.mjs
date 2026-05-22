import fs from "node:fs/promises";

const path = "index.html";
let html = await fs.readFile(path, "utf8");
html = html.replace(
  /^\s+<h3 class="text-lg font-semibold text-cream">Stuur je aanvraag<\/h3>/m,
  '              <h3 class="text-lg font-semibold text-cream">Stuur je aanvraag</h3>'
);
html = html.replace(
  "    </script>\n      <script src=\"assets/js/contact-form.js\"></script>",
  "    </script>\n    <script src=\"assets/js/contact-form.js\"></script>"
);
await fs.writeFile(path, html);
console.log("Fixed indentation");
