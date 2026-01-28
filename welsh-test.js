/**
 * Safe Weglot Wrapper
 * This checks for the Weglot object every 100ms until it's found.
 */
var checkWeglot = setInterval(function () {
  if (typeof Weglot !== "undefined") {
    // Once Weglot is found, stop checking
    clearInterval(checkWeglot);
    // Now it's safe to use Weglot.on
    initializeMyCode();
  }
}, 100);

function initializeMyCode() {
  // Check if it's already initialized or wait for it
  if (Weglot.initialized) {
    runCustomLogic();
  } else {
    Weglot.on("initialized", runCustomLogic);
  }
}

function runCustomLogic() {
  // Option 2: Auto redirect to Welsh page
  // Check the attribute immediately
  const isWelsh = document.body.getAttribute("data-is-welsh");
  // Only switch if `testing=true` is in the URL
  const urlParams = new URLSearchParams(window.location.search);
  if (
    (isWelsh === "true" || isWelsh === true) &&
    urlParams.get("testing") === "true"
  ) {
    Weglot.switchTo("cy");
  }
}
