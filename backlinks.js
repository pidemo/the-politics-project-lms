const programmesBackLinksWrapper = document.querySelector(
  "#related-programmes"
);
const schemesOfWorkBackLinksWrapper = document.querySelector(
  "#related-schemes-of-work"
);

const setBackLinks = (element, path) => {
  // Get slugs and names elements
  const slugsElement = element.querySelector(".backlinks-slugs");
  const namesElement = element.querySelector(".backlinks-names");
  const template = element.querySelector(".tag");
  if (!slugsElement || !namesElement || !template) return;

  // Get slugs and names
  const slugs = slugsElement.innerHTML.split(",");
  const names = namesElement.innerHTML.split(",");

  // Remove parent if no slugs or names
  if (slugsElement.innerHTML === "" || namesElement.innerHTML === "") {
    element.remove();
    return;
  }

  // Create backlinks
  slugs.forEach((slug, index) => {
    const backlink = template.cloneNode(true);
    backlink.classList.remove("is-hidden-onload");
    backlink.innerHTML = names[index];
    backlink.href = `/${path}/${slug}`;
    element.appendChild(backlink);
  });

  // Make parent wrapper visible
  const parentWrapper = element.parentElement;
  if (parentWrapper) {
    parentWrapper.classList.remove("is-hidden-onload");
  }

  // Remove template items
  slugsElement.remove();
  namesElement.remove();
  template.remove();
};

if (programmesBackLinksWrapper) {
  setBackLinks(programmesBackLinksWrapper, "lms-programmes");
}

if (schemesOfWorkBackLinksWrapper) {
  setBackLinks(schemesOfWorkBackLinksWrapper, "schemes-of-work");
}
