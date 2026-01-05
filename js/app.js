import { renderHome, renderJoin, renderStats } from "./routes.js";

const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const installBtn = document.getElementById("installBtn");

function openMenu(){ sidebar.classList.add("open"); backdrop.classList.remove("hidden"); }
function closeMenu(){ sidebar.classList.remove("open"); backdrop.classList.add("hidden"); }

menuBtn?.addEventListener("click", openMenu);
closeMenuBtn?.addEventListener("click", closeMenu);
backdrop?.addEventListener("click", closeMenu);
document.querySelectorAll(".sidelink").forEach(a=>a.addEventListener("click", closeMenu));

// PWA install prompt
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});
installBtn?.addEventListener("click", async ()=>{
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

// Service worker
if ("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  });
}

function route(){
  const hash = window.location.hash || "#/";
  if (hash.startsWith("#/join")) return renderJoin(view);
  if (hash.startsWith("#/stats")) return renderStats(view);
  return renderHome(view);
}

window.addEventListener("hashchange", route);
window.addEventListener("hashchange", route);

// FORCE LOGIN FIRST (must happen BEFORE first route())
if (!location.hash || location.hash === "#/" || location.hash === "#") {
  location.hash = "#/login";
} else {
  route();
}

// If we changed the hash to #/login, the hashchange event will call route()

route();
