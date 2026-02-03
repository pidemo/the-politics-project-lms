console.log("prevnext.js loaded");

/**
 * Pre-process Prev/Next links before Finsweet initialization
 * Updates hrefs for links with data-wg-notranslate to prefix with /cy
 */
(function () {
  function updatePrevNextLinks() {
    const prevNext = document.querySelector("#prev-next");
    if (!prevNext) {
      console.log("prevnext.js: #prev-next element not found");
      return;
    }

    // Find all <a> tags inside #prev-next that have data-wg-notranslate attribute
    const linksToUpdate = prevNext.querySelectorAll('a[data-wg-notranslate]');
    
    if (linksToUpdate.length === 0) {
      console.log("prevnext.js: No links with data-wg-notranslate found");
      return;
    }

    console.log(`prevnext.js: Found ${linksToUpdate.length} links to update`);

    linksToUpdate.forEach((link) => {
      const currentHref = link.getAttribute("href");
      
      // Skip if href is empty, starts with http/https, or already starts with /cy/
      if (!currentHref || 
          currentHref.startsWith("http://") || 
          currentHref.startsWith("https://") ||
          currentHref.startsWith("/cy/") ||
          currentHref.startsWith("#") ||
          currentHref.startsWith("?")) {
        return;
      }

      // Only update if href starts with /
      if (currentHref.startsWith("/")) {
        const newHref = "/cy" + currentHref;
        link.setAttribute("href", newHref);
        console.log(`prevnext.js: Updated href from "${currentHref}" to "${newHref}"`);
      }
    });

    // Initialize Finsweet Attributes Prev Next after updating hrefs
    function initializeFinsweet() {
      if (typeof fsAttributes !== "undefined" && fsAttributes.prevNext) {
        fsAttributes.prevNext.init();
        console.log("prevnext.js: Finsweet Prev Next initialized after href updates");
      } else {
        // Wait a bit for Finsweet to load, then try again
        setTimeout(() => {
          if (typeof fsAttributes !== "undefined" && fsAttributes.prevNext) {
            fsAttributes.prevNext.init();
            console.log("prevnext.js: Finsweet Prev Next initialized after delay");
          } else {
            console.warn("prevnext.js: fsAttributes.prevNext not available - Finsweet may auto-initialize");
          }
        }, 100);
      }
    }

    initializeFinsweet();
  }

  // Run as early as possible, but ensure DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updatePrevNextLinks);
  } else {
    // DOM is already ready, run immediately
    updatePrevNextLinks();
  }
})();
