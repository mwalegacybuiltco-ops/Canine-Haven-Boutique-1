export function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
export function money(n, currency="CAD"){
  const v = Number(n || 0);
  try { return new Intl.NumberFormat(undefined,{style:"currency",currency}).format(v); }
  catch { return `$${v.toFixed(2)}`; }
}
export function parseHash(){
  const raw = (location.hash || "#/").replace(/^#/, "");
  const [pathPart, queryPart=""] = raw.split("?");
  const path = pathPart.startsWith("/") ? pathPart : "/"+pathPart;
  const params = new URLSearchParams(queryPart);
  return { path, params };
}
export function saveRefFromUrl(){
  const h = location.hash || "";
  const m = h.match(/[?&]ref=([^&]+)/);
  if (m && m[1]) localStorage.setItem("ref", decodeURIComponent(m[1]));
}
export function getSavedRef(){ return localStorage.getItem("ref") || ""; }
export function generateAffiliateCode(name){
  const base = (name || "AFFILIATE").trim().toUpperCase().replace(/[^A-Z0-9]+/g,"").slice(0,10);
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4);
  return `${base || "AFF"}${rand}`;
}
export function setAffiliateCode(code){ localStorage.setItem("affiliate_code", code); }
export function getAffiliateCode(){ return localStorage.getItem("affiliate_code") || ""; }
export async function copyText(text){
  try { await navigator.clipboard.writeText(text); }
  catch {
    const t = document.createElement("textarea");
    t.value = text; document.body.appendChild(t);
    t.select(); document.execCommand("copy");
    document.body.removeChild(t);
  }
}
