export const esc = (s)=> (s||"").replace(/[&<>"]/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
export const money = (n, currency="CAD")=> Number(n||0).toLocaleString(undefined,{style:"currency",currency});

export function getHashParam(key){
  const h = window.location.hash || "#/";
  const qIndex = h.indexOf("?");
  if (qIndex === -1) return "";
  const query = h.slice(qIndex+1);
  const params = new URLSearchParams(query);
  return params.get(key) ? decodeURIComponent(params.get(key)) : "";
}

export function getRef(){
  return getHashParam("ref") || "";
}

export function saveRefFromUrl(){
  const r = getRef();
  if (r) localStorage.setItem("ref", r);
}

export function getSavedRef(){
  return localStorage.getItem("ref") || "";
}

export function safeOpen(url){
  window.open(url, "_blank", "noopener,noreferrer");
}
