import { parseHash, saveRefFromUrl } from "./utils.js";
import { render, afterRender } from "./views.js";

const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");

function closeSidebar(){
  sidebar?.classList.remove("open");
  backdrop?.classList.add("hidden");
}
function openSidebar(){
  sidebar?.classList.add("open");
  backdrop?.classList.remove("hidden");
}

menuBtn?.addEventListener("click", openSidebar);
closeMenuBtn?.addEventListener("click", closeSidebar);
backdrop?.addEventListener("click", closeSidebar);

// Close menu when clicking any sidebar link
document.querySelectorAll(".sidelink").forEach(a => a.addEventListener("click", closeSidebar));

/** Affiliate-only routes */
const AFFILIATE_ROUTES = new Set([
  "/affiliate",
  "/start-here",
  "/training",
  "/four-corners",
  "/team",
  "/payouts",
  "/stats",
]);

function applyRoleVisibility(){
  const role = localStorage.getItem("role") || "";
  const affiliateMenu = document.getElementById("affiliateMenu");
  if (affiliateMenu) affiliateMenu.style.display = role === "affiliate" ? "" : "none";
}

function enforceAccess(path){
  // Always allow login + shop + join + starterpack + community
  if (path === "/login" || path === "/shop" || path === "/join" || path === "/starterpack" || path === "/community") return true;

  const role = localStorage.getItem("role") || "";
  if (AFFILIATE_ROUTES.has(path) && role !== "affiliate") {
    // Not an affiliate? Kick them to login.
    location.hash = "#/login";
    return false;
  }
  return true;
}

function route(){
  saveRefFromUrl();

  const { path, params } = parseHash();

  // Guard first
  if (!enforceAccess(path)) return;

  // Render
  view.innerHTML = render(path, params);
  afterRender(path);

  // Apply menu visibility AFTER render
  applyRoleVisibility();
}

// ✅ Force login on first load
if (!location.hash || location.hash === "#/" || location.hash === "#") {
  location.hash = "#/login";
}

window.addEventListener("hashchange", route);
route();

