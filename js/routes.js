import { PRODUCTS } from "./products.js";
import { CONFIG } from "./config.js";
import { esc, money, saveRefFromUrl, getSavedRef, safeOpen } from "./utils.js";

const emojiFallback = (cat)=> ({
  "Custom Apparel":"👕",
  "Collars and Tags":"🏷️",
  "Toys":"🧸",
  "Leashes and Harnesses":"🦮",
  "Blankets and Beds":"🛏️",
  "Outerwear and Shoes":"🥾"
}[cat] || "🐾");

function productCard(p){
  const em = p.emoji || emojiFallback(p.category);
  const squareOk = p.squareLink && p.squareLink.startsWith("http");
  const storeOk  = p.storeLink && p.storeLink.startsWith("http");
  return `
    <div class="card product">
      <img src="${esc(p.image||"")}" alt="${esc(p.name)}">
      <div class="row spread" style="margin-top:10px">
        <div class="h2">${esc(em)} ${esc(p.name)}</div>
        <div class="price">${money(p.price, CONFIG.currency)}</div>
      </div>
      <div class="p">${esc(p.description||"")}</div>
      <div class="pills" style="margin-top:10px">
        <span class="pill">${esc(p.category||"")}</span>
        <span class="pill">Square checkout</span>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn" data-buy="${esc(p.id)}" ${squareOk ? "" : "disabled"}>Buy</button>
        <button class="ghost" data-view="${esc(p.id)}" ${storeOk ? "" : "disabled"}>View</button>
      </div>
      ${!squareOk ? `<div class="p" style="margin-top:10px">Paste your Square link for this product in <b>js/products.js</b>.</div>` : ``}
    </div>
  `;
}

function getCategoryFromHash(){
  const h = window.location.hash || "#/";
  const m = h.match(/cat=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function embedUrl(prefillTemplate, embedUrl, affiliateId){
  if (prefillTemplate && prefillTemplate.includes("{AFFILIATE_ID}")){
    return prefillTemplate.replaceAll("{AFFILIATE_ID}", encodeURIComponent(affiliateId||""));
  }
  if (prefillTemplate && prefillTemplate.includes("{SPONSOR_ID}")){
    return prefillTemplate.replaceAll("{SPONSOR_ID}", encodeURIComponent(affiliateId||""));
  }
  // fallback: embed url without prefill
  return embedUrl;
}

export function renderHome(root){
  saveRefFromUrl();
  const affiliateId = getSavedRef();
  const cat = getCategoryFromHash();
  const filtered = cat ? PRODUCTS.filter(p=> (p.category||"") === cat) : PRODUCTS;

  const hero = `
    <div class="card heroCard">
      <img src="assets/hero.png" alt="Canine Haven Boutique">
      <div class="heroOverlay">
        <div class="heroTitle">Welcome Dog Lovers</div>
        <div class="heroSub">Shop and earn with Canine Haven Boutique</div>
        <div class="pills" style="margin-top:10px">
          <span class="badge">Gold • Black • Purple</span>
          ${affiliateId ? `<span class="badge">Affiliate: ${esc(affiliateId)}</span>` : `<span class="badge">No affiliate selected</span>`}
        </div>
        <div class="heroBtns">
          <button class="btn" id="heroCustomer">I’m a Customer</button>
          <button class="ghost" id="heroAffiliate">I’m an Affiliate</button>
          <button class="ghost" id="heroShop">View Products</button>
        </div>
      </div>
    </div>
  `;

  root.innerHTML = `
    <div class="grid">
      ${hero}
      <div class="card">
        <div class="row spread">
          <div>
            <div class="h1">${cat ? esc(cat) : "Featured Products"}</div>
            <div class="p">Paste your <b>Square payment links</b> into product cards. Links open safely in a new tab (PWA-safe).</div>
          </div>
          <div class="pills">
            <span class="pill">Affiliate tracking via ?ref=YOURID</span>
          </div>
        </div>
      </div>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        ${filtered.map(productCard).join("")}
      </div>
    </div>
  `;

  root.querySelector("#heroCustomer").addEventListener("click", ()=> location.hash = "#/join?mode=customer");
  root.querySelector("#heroAffiliate").addEventListener("click", ()=> location.hash = "#/join?mode=affiliate");
  root.querySelector("#heroShop").addEventListener("click", ()=> location.hash = "#/");
  root.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-buy");
      const p = PRODUCTS.find(x=>x.id===id);
      if (p?.squareLink && p.squareLink.startsWith("http")) safeOpen(p.squareLink);
    });
  });
  root.querySelectorAll("[data-view]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-view");
      const p = PRODUCTS.find(x=>x.id===id);
      if (p?.storeLink && p.storeLink.startsWith("http")) safeOpen(p.storeLink);
    });
  });
}

export function renderJoin(root){
  saveRefFromUrl();
  const affiliateId = getSavedRef();
  const h = window.location.hash || "#/join";
  const mode = (h.includes("mode=affiliate") ? "affiliate" : (h.includes("mode=customer") ? "customer" : ""));
  const customerUrl = embedUrl(CONFIG.customerFormPrefillTemplate, CONFIG.customerFormEmbedUrl, affiliateId);
  const affiliateUrl = embedUrl(CONFIG.affiliateFormPrefillTemplate, CONFIG.affiliateFormEmbedUrl, affiliateId);

  root.innerHTML = `
    <div class="grid">
      <div class="card">
        <div class="h1">Join</div>
        <div class="p">Choose your path. Forms are embedded and submit directly to April’s Google Sheets.</div>
        <div class="pills" style="margin-top:10px">
          <span class="badge">powered by legacybuilt tech</span>
          ${affiliateId ? `<span class="badge">Affiliate: ${esc(affiliateId)}</span>` : `<span class="pill">Tip: open with #/?ref=YOURID to auto-fill</span>`}
        </div>
        <hr>
        <div class="row" style="flex-wrap:wrap">
          <button class="${mode==='customer'?'btn':'ghost'}" id="btnCustomer">I’m a Customer</button>
          <button class="${mode==='affiliate'?'btn':'ghost'}" id="btnAffiliate">I’m an Affiliate</button>
        </div>
      </div>

      <div class="card">
        <div class="h2">${mode==='affiliate' ? "Affiliate Form" : mode==='customer' ? "Customer Form" : "Select a form above"}</div>
        <div class="p">If you don’t see the form, paste your embed URLs in <b>js/config.js</b>.</div>
        <div class="iframeWrap" style="margin-top:12px">
          ${mode==='affiliate' ? `<iframe src="${esc(affiliateUrl)}" title="Affiliate Form" loading="lazy"></iframe>` :
            mode==='customer' ? `<iframe src="${esc(customerUrl)}" title="Customer Form" loading="lazy"></iframe>` :
            `<div class="p" style="padding:14px">Tap Customer or Affiliate to load the form.</div>`}
        </div>
      </div>
    </div>
  `;

  root.querySelector("#btnCustomer").addEventListener("click", ()=> location.hash = "#/join?mode=customer");
  root.querySelector("#btnAffiliate").addEventListener("click", ()=> location.hash = "#/join?mode=affiliate");
}

export function renderStats(root){
  root.innerHTML = `
    <div class="grid">
      <div class="card">
        <div class="h1">Affiliate Stats</div>
        <div class="p">This is a simple read-only stats page link (Google Sheet published view or Looker Studio).</div>
        <div class="row" style="margin-top:12px;flex-wrap:wrap">
          <button class="btn" id="openStats">Open Stats Page</button>
          <a class="ghost" href="#/join">Back to Join</a>
        </div>
      </div>
      <div class="card">
        <div class="h2">Link not set yet?</div>
        <div class="p">Paste your stats URL in <b>js/config.js</b> → <b>affiliateStatsUrl</b>.</div>
      </div>
    </div>
  `;
  root.querySelector("#openStats").addEventListener("click", ()=>{
    if (CONFIG.affiliateStatsUrl && CONFIG.affiliateStatsUrl.startsWith("http")) safeOpen(CONFIG.affiliateStatsUrl);
    else alert("Paste your affiliateStatsUrl into js/config.js first.");
  });
}
