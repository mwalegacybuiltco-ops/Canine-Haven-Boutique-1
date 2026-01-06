export function esc(s=""){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

export function parseHash(){
  // supports: #/path?x=1
  const hash = (location.hash || "#/").slice(1); // remove leading #
  const [rawPath, rawQuery=""] = hash.split("?");
  const path = rawPath.startsWith("/") ? rawPath : "/" + rawPath;
  const params = new URLSearchParams(rawQuery);
  return { path, params };
}

export function saveRefFromUrl(){
  const url = new URL(location.href);
  const ref = url.hash.includes("ref=") ? new URLSearchParams(url.hash.split("?")[1] || "").get("ref") : null;
  if (ref) localStorage.setItem("ref", ref);
}

export function getSavedRef(){
  return localStorage.getItem("ref") || "";
}

export function generateAffiliateCode(name=""){
  const clean = name.toLowerCase().replace(/[^a-z0-9]+/g,"").slice(0,10);
  return clean ? `chb_${clean}` : `chb_${Math.random().toString(36).slice(2,8)}`;
}

export function setAffiliateCode(code){
  localStorage.setItem("affiliate_code", code);
}
export function getAffiliateCode(){
  return localStorage.getItem("affiliate_code") || "";
}

export async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(e){
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}
