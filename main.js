/* ===== CAVI · site vitrine (v2) =====
   Pour ajouter ou modifier un article : éditez la liste PRODUCTS ci-dessous.
   - img    : nom de la photo (dans le même dossier que index.html)
   - tags   : "perles", "franges" et/ou "colores" (pour les filtres)
   - color  : nom de la couleur affiché
   - swatch : couleur du rond (code CSS, ex. "#6b1e2e")
   - price  : texte du prix, par exemple "15 000 FCFA". Laissez "" pour « Prix sur WhatsApp ».
   - badge  : petit label sur la photo ("Nouveau", "Coup de cœur"...). Laissez "" pour ne rien afficher.
*/
const WHATSAPP_MESSAGE = "https://wa.me/message/IMAPV7M3BM4NE1";
const WHATSAPP_CATALOGUE = "https://wa.me/c/22541425441";

const PRODUCTS = [
  { id: 1, name: "Sac Bordeaux Perlé", color: "Bordeaux", swatch: "#6b1e2e", tags: ["perles"], img: "p-bordeaux.jpg", pos: "50% 55%", badge: "Nouveau", price: "",
    desc: "Maille épaisse, anse tressée et perles nacrées éparpillées. Un sac chic qui ne passe pas inaperçu." },
  { id: 2, name: "Sac Émeraude Perlé", color: "Vert émeraude", swatch: "#0f6b4f", tags: ["perles"], img: "p-emeraude.jpg", pos: "50% 60%", badge: "Nouveau", price: "",
    desc: "Un vert profond, des perles de tailles variées et une anse tressée. Parfait pour sublimer une tenue." },
  { id: 3, name: "Cabas Rose Fuchsia", color: "Rose fuchsia", swatch: "#e0157a", tags: ["colores"], img: "p-fuchsia.jpg", pos: "50% 55%", badge: "", price: "",
    desc: "Un cabas aux côtes bien marquées, d’un rose vif qui donne de la bonne humeur à chaque sortie." },
  { id: 4, name: "Sac Rose et Blanc Nœud Perlé", color: "Rose et blanc", swatch: "linear-gradient(135deg,#f2a3c4 50%,#fff 50%)", tags: ["colores","perles"], img: "p-rose-blanc.jpg", pos: "50% 50%", badge: "Coup de cœur", price: "",
    desc: "Deux fils mêlés, une anse torsadée et un joli nœud en perles. Doux, girly et très photogénique." },
  { id: 5, name: "Pochette Bleue à Franges", color: "Bleu", swatch: "#1494c9", tags: ["franges","colores"], img: "p-bleu-franges.jpg", pos: "50% 50%", badge: "", price: "",
    desc: "Une pochette d’un bleu éclatant avec anse tressée et franges libres. Le style qui bouge avec vous." },
  { id: 6, name: "Pochette Caramel à Franges", color: "Caramel", swatch: "#b8651f", tags: ["franges"], img: "p-caramel-franges.jpg", pos: "50% 50%", badge: "", price: "",
    desc: "Une teinte caramel chaude, des franges et une anse tressée. Facile à assortir avec tout." },
  { id: 7, name: "Sac Vert Éclat", color: "Vert", swatch: "#3fae2a", tags: ["perles","colores"], img: "p-vert.jpg", pos: "50% 55%", badge: "", price: "",
    desc: "Un vert vif, une anse arrondie et des perles posées en cascade. Léger et très tendance." }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const priceText = p => p.price ? p.price : "Prix sur WhatsApp";

/* ----- filtres : un seul actif à la fois (catégorie OU couleur) ----- */
let state = { type: "all", value: "all" };
const grid = $("#grid");

function visible() {
  if (state.type === "tag") return PRODUCTS.filter(p => p.tags.includes(state.value));
  if (state.type === "color") return PRODUCTS.filter(p => p.id === Number(state.value));
  return PRODUCTS;
}

function renderSwatches() {
  $("#swatches").innerHTML = PRODUCTS.map(p =>
    `<button class="sw" type="button" data-id="${p.id}" aria-label="${p.color}"><i style="background:${p.swatch}"></i>${p.color.replace("Vert émeraude","Émeraude")}</button>`).join("");
}

function syncControls() {
  $$(".chip").forEach(c => {
    const on = state.type === "all" ? c.dataset.filter === "all" : (state.type === "tag" && c.dataset.filter === state.value);
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-selected", String(on));
  });
  $$(".sw").forEach(s => s.classList.toggle("is-active", state.type === "color" && s.dataset.id === state.value));
}

function renderGrid() {
  const list = visible();
  grid.classList.toggle("grid--bento", state.type === "all");
  grid.innerHTML = list.map(p => `
    <article class="card" data-id="${p.id}">
      <button class="card__media" type="button" aria-label="Voir ${p.name}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" style="object-position:${p.pos}" loading="lazy">
        <span class="card__quick">Aperçu rapide</span>
      </button>
      <div class="card__info">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__color"><i style="background:${p.swatch}"></i>${p.color}</p>
        <p class="card__price">${priceText(p)}</p>
      </div>
      <a class="btn btn--dark" href="${WHATSAPP_MESSAGE}" target="_blank" rel="noopener">Commander</a>
    </article>`).join("") + `
    <div class="tile">
      <img src="logo.png" alt="">
      <b>Plus de modèles</b>
      <span>Découvrez tout le catalogue CAVI sur WhatsApp.</span>
      <a class="btn btn--gold" href="${WHATSAPP_CATALOGUE}" target="_blank" rel="noopener">Voir le catalogue</a>
    </div>`;
  $$(".card, .tile", grid).forEach((c, i) => setTimeout(() => c.classList.add("in"), 70 * i));
  syncControls();
}

$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  state = b.dataset.filter === "all" ? { type: "all", value: "all" } : { type: "tag", value: b.dataset.filter };
  renderGrid();
});
$("#swatches").addEventListener("click", e => {
  const b = e.target.closest(".sw");
  if (!b) return;
  state = (state.type === "color" && state.value === b.dataset.id) ? { type: "all", value: "all" } : { type: "color", value: b.dataset.id };
  renderGrid();
});

/* ----- aperçu rapide avec flèches ----- */
const modal = $("#modal");
let lastFocus = null, current = 0;
function fillModal(i) {
  current = (i + PRODUCTS.length) % PRODUCTS.length;
  const p = PRODUCTS[current];
  $("#m-img").src = p.img;
  $("#m-img").alt = p.name;
  $("#m-img").style.objectPosition = p.pos;
  $("#m-name").textContent = p.name;
  $("#m-color").textContent = p.color;
  $("#m-dot").style.background = p.swatch;
  $("#m-desc").textContent = p.desc;
  $("#m-price").textContent = priceText(p);
  $("#m-hint").textContent = p.name;
  const badge = $("#m-badge");
  badge.textContent = p.badge;
  badge.style.display = p.badge ? "inline-block" : "none";
  $("#m-copy").textContent = "Copier";
}
function openModal(id) {
  const i = PRODUCTS.findIndex(x => x.id === Number(id));
  if (i < 0) return;
  lastFocus = document.activeElement;
  fillModal(i);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal__x").focus();
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
grid.addEventListener("click", e => {
  const media = e.target.closest(".card__media");
  if (media) openModal(media.closest(".card").dataset.id);
});
modal.addEventListener("click", e => { if (e.target.hasAttribute("data-close")) closeModal(); });
$("#m-prev").addEventListener("click", () => fillModal(current - 1));
$("#m-next").addEventListener("click", () => fillModal(current + 1));
document.addEventListener("keydown", e => {
  if (!modal.classList.contains("open")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") fillModal(current - 1);
  if (e.key === "ArrowRight") fillModal(current + 1);
});
$("#m-copy").addEventListener("click", async e => {
  try { await navigator.clipboard.writeText($("#m-hint").textContent); e.target.textContent = "Copié ✓"; }
  catch { e.target.textContent = "Sélectionnez le nom"; }
});

/* ----- menu mobile ----- */
const burger = $("#burger"), nav = $("#nav"), header = $("#header");
function setMenu(open) {
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
window.addEventListener("scroll", () => header.classList.toggle("is-stuck", window.scrollY > 10), { passive: true });

/* ----- apparition au défilement ----- */
const revealEls = $$(".section__head, .why__item, .steps li, .about__in, .mosaic a, .label, .swatches, .filters");
revealEls.forEach(el => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("in"));
}

$("#year").textContent = new Date().getFullYear();
renderSwatches();
renderGrid();
