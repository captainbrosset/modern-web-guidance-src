/**
 * Instant Navigation Script
 * Uses Speculation Rules API for instant page loads on hover/mousedown.
 */

(function () {
  const supportSpeculationRules =
    HTMLScriptElement.supports &&
    HTMLScriptElement.supports("speculationrules");

  if (supportSpeculationRules) {
    // Inject speculation rules for all same-origin links
    const specScript = document.createElement("script");
    specScript.type = "speculationrules";
    specScript.textContent = JSON.stringify({
      prerender: [
        {
          source: "document",
          where: {
            and: [
              { href_matches: "/*" }, // Match all paths
              { not: { href_matches: "/logout" } }, // Exclude logout to avoid accidental logout
            ],
          },
          eagerness: "moderate", // Prerender on hover/mousedown
        },
      ],
      prefetch: [
        {
          source: "document",
          where: {
             and: [
              { href_matches: "/*" }, 
              { not: { href_matches: "/logout" } },
            ],
          },
          eagerness: "moderate",
        },
      ],
    });
    document.head.appendChild(specScript);
    console.log("Speculation rules injected for instant navigation.");
  } else {
    // Fallback for browsers that don't support speculation rules (older Chrome, Safari, Firefox)
    // Simple hover prefetcher
    const prefetchLink = (href) => {
      if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      document.head.appendChild(link);
    };

    const handleInteraction = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.includes("logout")) return;
      
      prefetchLink(href);
    };

    document.addEventListener("mouseover", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    console.log("Fallback prefetcher initialized.");
  }
})();
