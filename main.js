/* ===== CAVI · site vitrine =====
   Pour ajouter ou modifier un article : éditez la liste PRODUCTS ci-dessous.
   - img   : chemin de la photo dans le dossier 
   - tags  : "perles", "franges" et/ou "colores" (pour les filtres)
   - price : texte du prix, par exemple "15 000 FCFA". Laissez "" pour afficher « Prix sur WhatsApp ».
   - badge : petit label sur la photo ("Nouveau", "Coup de cœur"...). Laissez "" pour ne rien afficher.
*/
const WHATSAPP_MESSAGE = "https://wa.me/message/IMAPV7M3BM4NE1";

const PRODUCTS = [
  { id: 1, name: "Sac Bordeaux Perlé", color: "Bordeaux", tags: ["perles"], img: "p-bordeaux.jpg", pos: "50% 55%", badge: "Nouveau", price: "",
    desc: "Maille épaisse, anse tressée et perles nacrées éparpillées. Un sac chic qui ne passe pas inaperçu." },
  { id: 2, name: "Sac Émeraude Perlé", color: "Vert émeraude", tags: ["perles"], img: "p-emeraude.jpg", pos: "50% 60%", badge: "Nouveau", price: "",
    desc: "Un vert profond, des perles de tailles variées et une anse tressée. Parfait pour sublimer une tenue." },
  { id: 3, name: "Cabas Rose Fuchsia", color: "Rose fuchsia", tags: ["colores"], img: "p-fuchsia.jpg", pos: "50% 55%", badge: "", price: "",
    desc: "Un cabas aux côtes bien marquées, d’un rose vif qui donne de la bonne humeur à chaque sortie." },
  { id: 4, name: "Sac Rose et Blanc Nœud Perlé", color: "Rose et blanc", tags: ["colores","perles"], img: "p-rose-blanc.jpg", pos: "50% 50%", badge: "Coup de cœur", price: "",
    desc: "Deux fils mêlés, une anse torsadée et un joli nœud en perles. Doux, girly et très photogénique." },
  { id: 5, name: "Pochette Bleue à Franges", color: "Bleu", tags: ["franges","colores"], img: "p-bleu-franges.jpg", pos: "50% 50%", badge: "", price: "",
    desc: "Une pochette d’un bleu éclatant avec anse tressée et franges libres. Le style qui bouge avec vous." },
  { id: 6, name: "Pochette Caramel à Franges", color: "Caramel", tags: ["franges"], img: "p-caramel-franges.jpg", pos: "50% 50%", badge: "", price: "",
    desc: "Une teinte caramel chaude, des franges et une anse tressée. Facile à assortir avec tout." },
  { id: 7, name: "Sac Vert Éclat", color: "Vert", tags: ["perles","colores"], img: "p-vert.jpg", pos: "50% 55%", badge: "", price: "",
    desc: "Un vert vif, une anse arrondie et des perles posées en cascade. Léger et très tendance." }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ----- grille d'articles ----- */
const grid = $("#grid");
function priceText(p) { return p.price ? p.price : "Prix sur WhatsApp"; }

function renderGrid(filter = "all") {
  const list = PRODUCTS.filter(p => filter === "all" || p.tags.includes(filter));
  grid.innerHTML = list.map(p => `
    <article class="card" data-id="${p.id}">
      <button class="card__media" type="button" aria-label="Voir ${p.name}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" style="object-position:${p.pos}" loading="lazy">
        <span class="card__quick">Aperçu rapide</span>
      </button>
      <div class="card__info">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__color">${p.color}</p>
        <p class="card__price">${priceText(p)}</p>
      </div>
      <a class="btn btn--dark" href="${WHATSAPP_MESSAGE}" target="_blank" rel="noopener">Commander</a>
    </article>`).join("") + `
    <div class="tile">
      <img src="logo.png" alt="">
      <b>Plus de modèles</b>
      <span>Découvrez tout le catalogue sur WhatsApp.</span>
      <a class="btn btn--gold" href="https://wa.me/c/22541425441" target="_blank" rel="noopener">Voir le catalogue</a>
    </div>`;
  $$(".card, .tile", grid).forEach((c, i) => setTimeout(() => c.classList.add("in"), 60 * i));
}

$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  $$(".chip").forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-selected", "false"); });
  b.classList.add("is-active");
  b.setAttribute("aria-selected", "true");
  renderGrid(b.dataset.filter);
});

/* ----- aperçu rapide ----- */
const modal = $("#modal");
let lastFocus = null;
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p) return;
  lastFocus = document.activeElement;
  $("#m-img").src = p.img;
  $("#m-img").alt = p.name;
  $("#m-img").style.objectPosition = p.pos;
  $("#m-name").textContent = p.name;
  $("#m-color").textContent = p.color;
  $("#m-desc").textContent = p.desc;
  $("#m-price").textContent = priceText(p);
  $("#m-hint").textContent = p.name;
  const badge = $("#m-badge");
  badge.textContent = p.badge;
  badge.style.display = p.badge ? "inline-block" : "none";
  $("#m-copy").textContent = "Copier";
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
document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
$("#m-copy").addEventListener("click", async e => {
  const text = $("#m-hint").textContent;
  try { await navigator.clipboard.writeText(text); e.target.textContent = "Copié ✓"; }
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

/* ----- en-tête : ombre au défilement + hauteur pour le menu mobile ----- */
function onScroll() { header.classList.toggle("is-stuck", window.scrollY > 10); }
function setHeaderHeight() { document.documentElement.style.setProperty("--hh", header.getBoundingClientRect().bottom + "px"); }
window.addEventListener("scroll", () => { onScroll(); setHeaderHeight(); }, { passive: true });
window.addEventListener("resize", setHeaderHeight);
onScroll(); setHeaderHeight();

/* ----- apparition au défilement ----- */
const revealEls = $$(".section__head, .why__item, .steps li, .split__text, .about__in, .more, .filters");
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
renderGrid();
