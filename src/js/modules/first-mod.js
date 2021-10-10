const toggleSubMenu = (element) => {
  const OPEN_CLASS = "open";
  const SUBMENU_SELECTOR = ".j-submenu";

  const submenu = document.querySelector(SUBMENU_SELECTOR);
  submenu.classList.toggle(OPEN_CLASS);
};

const toggleMobileMenu = (element) => {
  const OPEN_CLASS = "open";
  const SUBMENU_SELECTOR = ".j-mobilemenu";
  element.classList.toggle(OPEN_CLASS);
  const submenu = document.querySelector(SUBMENU_SELECTOR);
  submenu.classList.toggle(OPEN_CLASS);
};

const clearSearch = (element) => {
  const input = element.parentElement.querySelector("input");
  input.value = "";
};
