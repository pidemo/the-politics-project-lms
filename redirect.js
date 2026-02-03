console.log("redirect.js loaded");

/**
 * Weglot Redirect Script:
 * Switches language to Welsh if the CMS field triggers it.
 */
var checkWeglot = setInterval(function () {
  if (typeof Weglot !== "undefined") {
    clearInterval(checkWeglot);

    // Subscribe to the initialization event
    // The docs confirm this runs BEFORE the page is translated
    Weglot.on("initialized", function () {
      handleAutoRedirect();
    });

    // If Weglot is already initialized by the time this script runs,
    // we run the logic manually.
    if (Weglot.initialized) {
      handleAutoRedirect();
    }
  }
}, 100);

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
