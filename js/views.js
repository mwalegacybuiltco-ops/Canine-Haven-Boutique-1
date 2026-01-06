import { CONFIG } from "./config.js";
import { PRODUCTS } from "./products.js";
import { esc, money, saveRefFromUrl, getSavedRef, generateAffiliateCode, setAffiliateCode, getAffiliateCode, copyText } from "./utils.js";

function heroCard(){
  return `
    <div class="card">
      <div class="badge">🐾 Canine Haven Boutique</div>
      <div class="h1" style="margin-top:10px">Premium dog couture + simple Square checkout.</div>
      <div class="p">Affiliates share the app link and earn commissions with clean tracking.</div>
      <div style="margin-top:12px" class="iframeWrap">
        <img src="assets/hero-malinois.png" alt="Hero" style="width:100%;height:auto;display:block">
      </div>
    </div>
  `;
}

function productCard(p){
  const squareOk = (p.squareLink||"").startsWith("http");
  return `
    <div class="card product">
      <img src="${esc(p.image||"")}" alt="${esc(p.name)}">
      <div class="row spread" style="margin-top:10px">
        <div class="h2">${esc(p.emoji||"🐾")} ${esc(p.name)}</div>
        <div class="price">${money(p.price, CONFIG.currency)}</div>
      </div>
      <div class="p">${esc(p.description||"")}</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-buy="${esc(p.id)}" ${squareOk ? "" : "disabled"}>Buy</button>
      </div>
      ${!squareOk ? `<div class="p" style="margin-top:10px;color:rgba(212,175,55,.85)">Admin: paste a Square link into <b>js/products.js</b>.</div>` : ""}
    </div>
  `;
}

function shopView(params){
  const cat = params.get("cat") || "";
  const filtered = cat ? PRODUCTS.filter(p=> (p.category||"") === cat) : PRODUCTS;
  const title = cat ? `Shop: ${esc(cat)}` : "Shop: All products";
  return `
    ${heroCard()}
    <div class="card" style="margin-top:12px">
      <div class="row spread">
        <div class="h1">${title}</div>
        <a class="ghost" href="#/join">Join</a>
      </div>
      <div class="p">Tap <b>Buy</b> to open Square checkout in a secure tab.</div>
    </div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin-top:12px">
      ${filtered.map(productCard).join("")}
    </div>
  `;
}

ffunction loginView(){
  return `
    <div class="loginScreen">
      <div class="loginWrap">
        <img src="assets/login-screen.png" alt="Login" class="loginImg">
        <button class="hotspot hsCustomer" data-login="customer" aria-label="Customer"></button>
        <button class="hotspot hsAffiliate" data-login="affiliate" aria-label="Affiliate"></button>
        <button class="hotspot hsProducts" data-login="shop" aria-label="Products"></button>
      </div>
    </div>
  `;
}


function iframeEmbed(url){
  if (!url || !url.startsWith("http")){
    return `<div class="notice">Admin: paste your Google Form iframe <b>src</b> into <b>js/config.js</b>.</div>`;
  }
  return `<div class="iframeWrap"><iframe src="${esc(url)}" loading="lazy"></iframe></div>`;
}

function joinView(){
  const ref = getSavedRef();
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">Join</div>
        <span class="badge">${ref ? `Referral: ${esc(ref)}` : "No referral detected"}</span>
      </div>
      <div class="p">Choose customer or affiliate. Submits to your Google Sheets.</div>
      <div class="row" style="margin-top:12px">
        <button class="btn" data-join="customer">I’m a Customer</button>
        <button class="btn btnGold" data-join="affiliate">I’m an Affiliate</button>
      </div>
      <hr>
      <div id="joinFormHost"></div>
    </div>
  `;
}

function starterPackView(){
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">Affiliate Starter Pack</div>
        <span class="badge">$140 activation</span>
      </div>
      <div class="p">Pay activation, then submit the affiliate form.</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-pay-starter>Pay $140 Starter Pack</button>
        <a class="ghost" href="#/join">Open Affiliate Form</a>
      </div>
    </div>
  `;
}

function affiliateView(){
  const myCode = getAffiliateCode();
  const ref = getSavedRef();
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">My Affiliate Link</div>
        <span class="badge">${myCode ? "Code saved" : "No code yet"}</span>
      </div>
      <div class="p">Generate your code once, then copy your app link and share it.</div>
      <label>Your name (for code generation)</label>
      <input class="input" id="affName" placeholder="Example: Jess Smith">
      <div class="row" style="margin-top:10px">
        <button class="btn" data-gen-code>Generate My Code</button>
        <button class="ghost" disabled>Sponsor: ${esc(ref||"—")}</button>
      </div>
      <hr>
      <div class="card">
        <div class="row spread">
          <div class="h2" id="myCodeText">${esc(myCode || "—")}</div>
          <button class="ghost" data-copy-code ${myCode ? "" : "disabled"}>Copy</button>
        </div>
        <div class="p" style="margin-top:8px">Your App Share Link</div>
        <div class="row spread" style="gap:8px;margin-top:8px;flex-wrap:wrap">
          <div class="pill" id="myLinkText" style="max-width:100%;overflow-wrap:anywhere">${esc(myCode ? `${location.origin}${location.pathname}#/login?ref=${myCode}` : "—")}</div>
          <button class="btn btnGold" data-copy-link ${myCode ? "" : "disabled"}>Copy Link</button>
        </div>
      </div>
    </div>
  `;
}

function simplePage(title, body){
  return `<div class="card"><div class="h1">${title}</div><div class="p">${body}</div></div>`;
}

function teamView(){
  const myCode = getAffiliateCode();
  const myLink = myCode ? `${location.origin}${location.pathname}#/login?ref=${myCode}` : "";
  return `
    <div class="card">
      <div class="h1">Team Builder 🐺</div>
      <div class="p">Share your recruit link. Sponsor is captured from your link.</div>
      <hr>
      <div class="pill" style="overflow-wrap:anywhere">${esc(myLink || "Generate your code in My Link first.")}</div>
      <div class="row" style="margin-top:10px">
        <button class="btn btnGold" data-copy-team ${myCode ? "" : "disabled"}>Copy recruit link</button>
      </div>
    </div>
  `;
}

function statsView(){
  const url = CONFIG.affiliateStatsUrl;
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">Stats 📊</div><span class="badge">Read-only</span>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-open-stats ${url && url.startsWith("http") ? "" : "disabled"}>View My Stats</button>
      </div>
      ${(!url || !url.startsWith("http")) ? `<div class="p" style="margin-top:10px;color:rgba(212,175,55,.85)">Admin: paste your stats link into <b>js/config.js</b>.</div>` : ""}
    </div>
  `;
}

function communityView(){
  const url = CONFIG.facebookGroupUrl;
  return `
    <div class="card">
      <div class="h1">Community 👥</div>
      <div class="p">Support, wins, questions, and accountability.</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-open-group ${url && url.startsWith("http") ? "" : "disabled"}>Open Facebook Group</button>
      </div>
      ${(!url || !url.startsWith("http")) ? `<div class="p" style="margin-top:10px;color:rgba(212,175,55,.85)">Admin: paste your group link into <b>js/config.js</b>.</div>` : ""}
    </div>
  `;
}

export function render(path, params){
  saveRefFromUrl();
  switch(path){
    case "/login": return loginView();
    case "/shop": return shopView(params);
    case "/join": return joinView();
    case "/starterpack": return starterPackView();
    case "/affiliate": return affiliateView();
    case "/start-here": return simplePage("Start Here ✅","Post your dog + one product. CTA: “Want the app link?” Then DM people your link.");
    case "/training": return simplePage("Training 🎓","Branding, marketing, and simple systems—kept beginner friendly.");
    case "/four-corners": return simplePage("Four Corners 🧭","Add people, start convos, post with intention, engage like a human.");
    case "/team": return teamView();
    case "/payouts": return simplePage("Payouts 💰","Bi-weekly payouts. $50 minimum. Under rolls over.");
    case "/stats": return statsView();
    case "/community": return communityView();
    default: return shopView(params);
  }
}

export function afterRender(path){
  const topbar = document.getElementById("topbar");
  const footerEl = document.getElementById("footer");
  if (path === "/login"){ topbar?.classList.add("hidden"); footerEl?.classList.add("hidden"); }
  else { topbar?.classList.remove("hidden"); footerEl?.classList.remove("hidden"); }

  document.querySelectorAll("[data-login]").forEach(el=>{
    el.addEventListener("click", ()=>{
      const mode = el.getAttribute("data-login");
      if (mode === "customer") localStorage.setItem("role","customer");
      if (mode === "affiliate") location.hash = "#/affiliate";

      if (mode === "shop") location.hash = "#/shop";
      if (mode === "customer") location.hash = "#/join";
      if (mode === "affiliate") location.hash = "#/join";
    });
  });

  document.querySelectorAll("[data-join]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const which = btn.getAttribute("data-join");
      if (which === "customer") localStorage.setItem("role","customer");
      if (which === "affiliate") localStorage.setItem("role","affiliate");
      const host = document.getElementById("joinFormHost");
      if (!host) return;
      host.innerHTML = iframeEmbed(which === "customer" ? CONFIG.customerFormEmbedUrl : CONFIG.affiliateFormEmbedUrl);
      host.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  document.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-buy");
      const p = PRODUCTS.find(x=>x.id===id);
      if (p?.squareLink?.startsWith("http")) window.open(p.squareLink, "_blank", "noopener,noreferrer");
    });
  });

  document.querySelector("[data-pay-starter]")?.addEventListener("click", ()=>{
    const link = CONFIG.starterPackSquarePayLink;
    if (link && link.startsWith("http")) window.open(link, "_blank", "noopener,noreferrer");
    else alert("Admin: paste your starter pack Square payment link into js/config.js");
  });

  document.querySelector("[data-gen-code]")?.addEventListener("click", ()=>{
    const name = (document.getElementById("affName")?.value || "").trim();
    const code = generateAffiliateCode(name);
    setAffiliateCode(code);
    document.getElementById("myCodeText")?.textContent = code;
    document.getElementById("myLinkText")?.textContent = `${location.origin}${location.pathname}#/login?ref=${code}`;
    alert("Saved! Your affiliate code is now stored on this device.");
  });

  document.querySelector("[data-copy-code]")?.addEventListener("click", async ()=>{
    const code = getAffiliateCode(); if (!code) return;
    await copyText(code); alert("Copied your affiliate code.");
  });

  document.querySelector("[data-copy-link]")?.addEventListener("click", async ()=>{
    const code = getAffiliateCode(); if (!code) return;
    const link = `${location.origin}${location.pathname}#/login?ref=${code}`;
    await copyText(link); alert("Copied your app referral link.");
  });

  document.querySelector("[data-copy-team]")?.addEventListener("click", async ()=>{
    const code = getAffiliateCode(); if (!code) return;
    const link = `${location.origin}${location.pathname}#/login?ref=${code}`;
    await copyText(link); alert("Copied your recruit link.");
  });

  document.querySelector("[data-open-stats]")?.addEventListener("click", ()=>{
    const url = CONFIG.affiliateStatsUrl;
    if (url && url.startsWith("http")) window.open(url, "_blank", "noopener,noreferrer");
  });

  document.querySelector("[data-open-group]")?.addEventListener("click", ()=>{
    const url = CONFIG.facebookGroupUrl;
    if (url && url.startsWith("http")) window.open(url, "_blank", "noopener,noreferrer");
  });
}
