console.log("Welsh Attribute Logic");
/**
 * Weglot Unified Script:
 * 1. Safely waits for Weglot to load.
 * 2. Injects 'data-wg-notranslate' before translation begins.
 * 3. Switches language to Welsh if the CMS field triggers it.
 */
var checkWeglot = setInterval(function () {
  if (typeof Weglot !== "undefined") {
    clearInterval(checkWeglot);

    // Subscribe to the initialization event
    // The docs confirm this runs BEFORE the page is translated
    Weglot.on("initialized", function () {
      try {
        applyBypassAttributes();
      } catch (e) {
        console.error("Error applying bypass attributes:", e);
      }

      try {
        handleAutoRedirect();
      } catch (e) {
        console.error("Error handling redirect:", e);
      }
    });

    // If Weglot is already initialized by the time this script runs,
    // we run the logic manually.
    if (Weglot.initialized) {
      try {
        applyBypassAttributes();
      } catch (e) {
        console.error("Error applying bypass attributes:", e);
      }

      try {
        handleAutoRedirect();
      } catch (e) {
        console.error("Error handling redirect:", e);
      }
    }
  }
}, 100);

function applyBypassAttributes() {
  // Find all elements where the CMS field "notranslate" is "true"
  const nodesToExclude = document.querySelectorAll('[data-notranslate="true"]');

  nodesToExclude.forEach((node) => {
    // Apply official Weglot bypass attribute
    node.setAttribute("data-wg-notranslate", "");
  });

  if (nodesToExclude.length > 0) {
    console.log(`Weglot: Applied bypass to ${nodesToExclude.length} elements.`);
  }
}

function handleAutoRedirect() {
  const isWelsh = document.body.getAttribute("data-is-welsh");

  // If URL contains ?noredirect, skip switching language
  const params = new URLSearchParams(window.location.search);
  if (params.has("noredirect")) {
    return;
  }

  // Check if CMS field says this page should be Welsh
  if (isWelsh === "true" || isWelsh === true) {
    // Only switch if we aren't already in Welsh ('cy')
    if (Weglot.getCurrentLang() !== "cy") {
      Weglot.switchTo("cy");
    }
  }
}
