// Paste your Google Form EMBED URLs here.
// How to get them:
// Google Form -> Send -> <> embed -> copy the src from the iframe.
// Example src ends with: .../viewform?embedded=true
//
// OPTIONAL (recommended): Use a "pre-filled link" template so the app can auto-fill affiliateId.
// Google Form -> 3 dots -> Get pre-filled link -> fill example values -> copy link.
// If you paste that link as the TEMPLATE below, we will swap {AFFILIATE_ID} and {SPONSOR_ID}.

export const CONFIG = {
  brandName: "Canine Haven Boutique",

  // Basic embed links (paste iframe src):
  customerFormEmbedUrl: "PASTE_CUSTOMER_FORM_EMBED_SRC_HERE",
  affiliateFormEmbedUrl: "PASTE_AFFILIATE_FORM_EMBED_SRC_HERE",

  // Prefill templates (optional; use instead of embed for auto-fill):
  customerFormPrefillTemplate: "",
  affiliateFormPrefillTemplate: "",

  // Your simple read-only stats page (Google Sheet published view OR Looker Studio link)
  affiliateStatsUrl: "PASTE_YOUR_STATS_PAGE_LINK_HERE",

  currency: "CAD"
};
