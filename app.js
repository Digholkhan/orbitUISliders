const sliders = [
  {id:"aurora",name:"Aurora 3D",type:"3d",tag:"01",desc:"Depth, blur & parallax",react:"AuroraSlider"},
  {id:"stack",name:"Card stack",type:"3d",tag:"02",desc:"Layered card interaction",react:"CardStack"},
  {id:"focus",name:"Focus ring",type:"3d",tag:"03",desc:"A cinematic spotlight",react:"FocusSlider"},
  {id:"editorial",name:"Editorial",type:"minimal",tag:"04",desc:"Bold type, quiet motion",react:"EditorialSlider"},
  {id:"product",name:"Product orbit",type:"minimal",tag:"05",desc:"Showcase every angle",react:"ProductSlider"},
  {id:"testimonial",name:"Testimonials",type:"content",tag:"06",desc:"Stories worth sharing",react:"TestimonialSlider"},
  {id:"marquee",name:"Marquee",type:"content",tag:"07",desc:"Keep things moving",react:"MarqueeSlider"},
  {id:"reveal",name:"Image reveal",type:"content",tag:"08",desc:"A little mystery",react:"RevealSlider"}
];
const slideCopy = {
  aurora:[["Move","with intent."],["Find","your flow."],["Make","it memorable."]],
  stack:[["Good","ideas stack."],["Layer","the moment."],["Keep","exploring."]],
  editorial:[["FORM","& function."],["QUIET","& bold."],["TYPE","& texture."]],
  testimonial:[["The details are not the details. They make the design."],["A small motion can change how a product feels."],["Make the useful thing feel unmistakably yours."]],
  product:[["OBJECT / 01 — CERAMIC"],["OBJECT / 02 — SCULPTURE"],["OBJECT / 03 — VESSEL"]],
  marquee:[["MOVE ✦ MAKE ✦ MOVE"],["BUILD ✦ PLAY ✦ REPEAT"],["CLICK ✦ SWIPE ✦ SMILE"]],
  focus:[["FOCUS / 01"],["FOCUS / 02"],["FOCUS / 03"]],
  reveal:[["Less","noise."],["More","signal."],["Your","story."]]
};
let selected = sliders[0], activeFilter = "all", activeTab = "code", slideIndex = 0, autoplayTimer, dragStart = null;
const $ = selector => document.querySelector(selector);

function visualMarkup(id, stage = false, index = 0) {
  const cls = stage ? `stage-${id}` : `card-visual visual-${id}`;
  const prefix = stage ? "stage-" : "";
  const copy = slideCopy[id][index];
  const common = {
    aurora:`<div class="${cls}"><div class="${prefix}orbit"></div><div class="${prefix}orbit"></div><div class="${prefix}card"><small>FEATURED / 0${index + 1}</small><strong>${copy[0]}<br><em>${copy[1]}</em></strong></div>${stage ? controls() : ""}</div>`,
    stack:`<div class="${cls}"><div class="${prefix}card stack-card">01 <b>${copy[0]}<br>${copy[1]}</b></div><div class="${prefix}card stack-card">02 <b>Good<br>ideas<br>stack.</b></div><div class="${prefix}card stack-card">03 <b>Good<br>ideas<br>stack.</b></div>${stage ? controls() : ""}</div>`,
    editorial:`<div class="${cls}"><div class="editorial-word">${copy[0]}<br><i>${copy[1]}</i></div><div class="editorial-image"></div><span class="editorial-label">ISSUE / 02${index + 4}</span>${stage ? controls() : ""}</div>`,
    testimonial:`<div class="${cls}"><span class="quote-mark">“</span><div class="quote">${copy[0]}</div><div class="avatar"></div>${stage ? controls() : ""}</div>`,
    product:`<div class="${cls}"><div class="product-disc"></div><span class="product-name">${copy[0]}</span>${stage ? controls() : ""}</div>`,
    marquee:`<div class="${cls}"><span class="marquee-text">${copy[0]}</span>${stage ? controls() : ""}</div>`,
    focus:`<div class="${cls}"><div class="focus-ring"></div><div class="focus-line"></div>${stage ? controls() : ""}</div>`,
    reveal:`<div class="${cls}"><div class="reveal-block"><small>CHAPTER / 0${index + 1}</small><strong>${copy[0]}<br>${copy[1]}</strong></div><div class="reveal-strip"></div>${stage ? controls() : ""}</div>`
  };
  return common[id];
}
function controls() {
  return `<div class="stage-controls"><button class="stage-prev" aria-label="Previous slide">←</button><div class="stage-dots">${[0,1,2].map(i => `<button class="stage-dot ${i === slideIndex ? "active" : ""}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`).join("")}</div><button class="stage-next" aria-label="Next slide">→</button></div>`;
}
function renderCards() {
  const query = $("#searchInput").value.toLowerCase();
  const visible = sliders.filter(s => (activeFilter === "all" || s.type === activeFilter) && `${s.name} ${s.desc}`.toLowerCase().includes(query));
  $("#sliderGrid").innerHTML = visible.map(s => `<article class="component-card" data-id="${s.id}"><div class="card-link">${visualMarkup(s.id)}</div><div class="card-title"><h3>${s.name}</h3><span>${s.tag} / ${s.type.toUpperCase()}</span></div><p class="card-desc">${s.desc}</p></article>`).join("");
  document.querySelectorAll(".component-card").forEach(card => card.addEventListener("click", () => selectSlider(card.dataset.id)));
}
function renderStage() {
  const stage = $("#previewStage");
  stage.classList.remove("stage-changing");
  void stage.offsetWidth;
  stage.classList.add("stage-changing");
  stage.innerHTML = visualMarkup(selected.id, true, slideIndex);
  document.querySelectorAll(".stage-prev").forEach(button => button.addEventListener("click", () => moveSlide(-1)));
  document.querySelectorAll(".stage-next").forEach(button => button.addEventListener("click", () => moveSlide(1)));
  document.querySelectorAll(".stage-dot").forEach(button => button.addEventListener("click", () => { slideIndex = Number(button.dataset.slide); renderStage(); restartAutoplay(); }));
}
function moveSlide(direction) {
  slideIndex = (slideIndex + direction + 3) % 3;
  renderStage();
  restartAutoplay();
}
function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => moveSlide(1), 5000);
}
function selectSlider(id) {
  selected = sliders.find(s => s.id === id) || sliders[0];
  slideIndex = 0;
  $("#previewName").textContent = selected.name.toUpperCase();
  $("#selectedType").textContent = `${selected.type.toUpperCase()} · DRAG / SWIPE / CLICK`;
  renderStage();
  activeTab = "code";
  document.querySelectorAll(".code-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === activeTab));
  renderCode();
  restartAutoplay();
  $("#playground").scrollIntoView({behavior:"smooth",block:"start"});
}
const snippets = {
  vanilla: s => `<!-- ${s.name} slider -->\n<div class="luma-slider" data-slider="${s.id}">\n  <div class="luma-track">\n    <article class="luma-slide is-active">Slide one</article>\n    <article class="luma-slide">Slide two</article>\n    <article class="luma-slide">Slide three</article>\n  </div>\n  <button class="luma-prev" aria-label="Previous slide">←</button>\n  <button class="luma-next" aria-label="Next slide">→</button>\n</div>\n\n<script>\n  const slider = new LumaSlider('[data-slider="${s.id}"]', {\n    loop: true, autoplay: 5000, transition: 'smooth'\n  });\n</script>`,
  react: s => `import { ${s.react} } from '@luma-motion/sliders';\nimport '@luma-motion/sliders/styles.css';\n\nexport default function Showcase() {\n  return <${s.react} items={slides} loop autoplay={5000} transition="smooth" />;\n}`
};
function renderCode() {
  const code = activeTab === "code" ? snippets.vanilla(selected) : activeTab === "usage" ? `<span class="comment">// 1. Install the package</span>\n<span class="tag">npm install @luma-motion/sliders</span>\n\n<span class="comment">// 2. Add the markup and initialize</span>\n<span class="comment">// 3. Drag, swipe, click arrows, or use ← →</span>\n<span class="comment">// 4. Luma respects prefers-reduced-motion</span>` : `<span class="tag">loop</span> <span class="comment">boolean · default: false</span>\n<span class="tag">autoplay</span> <span class="comment">number | false · default: false</span>\n<span class="tag">transition</span> <span class="comment">'smooth' | 'spring'</span>\n<span class="tag">onChange</span> <span class="comment">(index: number) =&gt; void</span>`;
  $("#codeBody").innerHTML = activeTab === "code" ? `<pre>${escapeHTML(code)}</pre><div class="snippet-switch"><button class="snippet-choice active" data-snippet="vanilla">Vanilla JS</button><button class="snippet-choice" data-snippet="react">React</button></div>` : `<pre>${code}</pre>`;
  $("#codeLanguage").textContent = activeTab === "code" ? "VANILLA JS · CSS" : activeTab === "usage" ? "SETUP GUIDE" : "API REFERENCE";
  document.querySelectorAll(".snippet-choice").forEach(button => button.addEventListener("click", () => { document.querySelectorAll(".snippet-choice").forEach(item => item.classList.remove("active")); button.classList.add("active"); $("#codeBody pre").textContent = snippets[button.dataset.snippet](selected); }));
}
function escapeHTML(text) { return text.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => { activeFilter = button.dataset.filter; document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button)); renderCards(); }));
$("#searchInput").addEventListener("input", renderCards);
document.querySelectorAll(".code-tab").forEach(button => button.addEventListener("click", () => { activeTab = button.dataset.tab; document.querySelectorAll(".code-tab").forEach(item => item.classList.toggle("active", item === button)); renderCode(); }));
$("#copyCode").addEventListener("click", async () => { const text = $("#codeBody pre").textContent; await navigator.clipboard.writeText(text); const button = $("#copyCode"); const old = button.innerHTML; button.innerHTML = "Copied! <span>✓</span>"; setTimeout(() => button.innerHTML = old, 1500); });
$("#themeToggle").addEventListener("click", () => document.body.classList.toggle("dark"));
$("#previewStage").addEventListener("pointerdown", event => { dragStart = event.clientX; });
$("#previewStage").addEventListener("pointerup", event => { if (dragStart === null) return; const distance = event.clientX - dragStart; if (Math.abs(distance) > 35) moveSlide(distance < 0 ? 1 : -1); dragStart = null; });
$("#previewStage").addEventListener("keydown", event => { if (event.key === "ArrowRight") moveSlide(1); if (event.key === "ArrowLeft") moveSlide(-1); });
renderCards();
selectSlider("aurora");
$("#previewStage").tabIndex = 0;
