console.log("prevnext.js loaded");

/**
 * Pre-process Prev/Next links before Finsweet initialization
 * Updates hrefs for links with data-wg-notranslate to prefix with /cy
 * Then initializes Finsweet Attributes CMS PrevNext (always, regardless of links found)
 */
(function () {
  function updateLinks() {
    const prevNext = document.querySelector("#prev-next");

    if (!prevNext) {
      console.log("prevnext.js: #prev-next element not found");
      return false;
    }

    // Find links that have data-wg-notranslate OR are inside an element with data-wg-notranslate
    const linksToUpdate = [];

    // Get all links in #prev-next
    const allLinks = prevNext.querySelectorAll("a");

    allLinks.forEach((link) => {
      // Check if link itself has the attribute
      if (link.hasAttribute("data-wg-notranslate")) {
        linksToUpdate.push(link);
        return;
      }

      // Check if any parent has the attribute
      const parentWithAttr = link.closest("[data-wg-notranslate]");
      if (parentWithAttr) {
        linksToUpdate.push(link);
        return;
      }
    });

    if (linksToUpdate.length === 0) {
      console.log(
        "prevnext.js: No links with data-wg-notranslate found - skipping link updates",
      );
      return false;
    }

    console.log(`prevnext.js: Found ${linksToUpdate.length} links to update`);

    linksToUpdate.forEach((link) => {
      const currentHref = link.getAttribute("href");

      // Skip if href is empty, starts with http/https, or already starts with /cy/
      if (
        !currentHref ||
        currentHref.startsWith("http://") ||
        currentHref.startsWith("https://") ||
        currentHref.startsWith("/cy/") ||
        currentHref.startsWith("#") ||
        currentHref.startsWith("?")
      ) {
        return;
      }

      // Only update if href starts with /
      if (currentHref.startsWith("/")) {
        const newHref = "/cy" + currentHref;
        link.setAttribute("href", newHref);
        console.log(
          `prevnext.js: Updated href from "${currentHref}" to "${newHref}"`,
        );
      }
    });

    console.log("prevnext.js: Links updated successfully");
    return true;
  }

  function initializeFinsweet() {
    // Initialize FinsweetAttributes array for callbacks (optional, for logging)
    window.FinsweetAttributes ||= [];

    // Register callback to know when CMS PrevNext is ready (optional, for logging)
    window.FinsweetAttributes.push([
      "cmsprevnext",
      (result) => {
        console.log("prevnext.js: Finsweet CMS PrevNext initialized!", result);
      },
    ]);

    // With fs-attributes-preventload="true", we need to manually call init()
    // Wait a bit for Finsweet to load, then initialize
    function tryInit() {
      if (
        typeof window.fsAttributes !== "undefined" &&
        typeof window.fsAttributes.init === "function"
      ) {
        window.fsAttributes.init();
        console.log("prevnext.js: Called fsAttributes.init()");
      } else {
        // Retry after a short delay
        setTimeout(tryInit, 100);
      }
    }

    // Start trying to initialize after a small delay to let Finsweet load
    setTimeout(tryInit, 50);
  }

  // Update links first (if any), then initialize Finsweet (always)
  // Run as early as possible, but ensure DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      updateLinks(); // Update links if they exist
      initializeFinsweet(); // Always initialize Finsweet
    });
  } else {
    // DOM is already ready, run immediately
    updateLinks(); // Update links if they exist
    initializeFinsweet(); // Always initialize Finsweet
  }
})();
