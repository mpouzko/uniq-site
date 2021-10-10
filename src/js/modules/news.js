const MAIN_SELECTOR = ".j-news";
const ITEM_SELECTOR = ".j-item";
const INDICATOR_SELECTOR = ".j-indicator";
const DOT_SELECTOR = ".j-dot";
const ACTIVE_CLASS = "active";
const LIST_ITEM_SELECTOR = ".j-list-item";
class News {
  constructor(element) {
    this.element = element;
    this.length = element.querySelectorAll(ITEM_SELECTOR).length;
    this.bindEvents();
    for (let i = 0; i < 3; i++) {
      this.element
        .querySelectorAll(LIST_ITEM_SELECTOR)
        [i].classList.add(ACTIVE_CLASS);
    }
  }

  bindEvents() {
    this.element.querySelectorAll(DOT_SELECTOR).forEach((node, index) => {
      node.addEventListener("click", () => this.switchSlide(index));
    });

    this.element.querySelectorAll(LIST_ITEM_SELECTOR).forEach((node, index) => {
      node.addEventListener("click", () => this.switchSlide(index));
    });
  }

  switchSlide(index) {
    console.log(index);
    this.updateIndicator(index);
    this.switchMainSlide(index);
    this.updateRibbon(index);
  }

  updateIndicator(index) {
    this.element
      .querySelector(DOT_SELECTOR + "." + ACTIVE_CLASS)
      .classList.toggle(ACTIVE_CLASS);
    this.element
      .querySelectorAll(DOT_SELECTOR)
      [index].classList.add(ACTIVE_CLASS);
  }

  switchMainSlide(index) {
    this.element
      .querySelector(ITEM_SELECTOR + "." + ACTIVE_CLASS)
      .classList.toggle(ACTIVE_CLASS);
    this.element
      .querySelectorAll(ITEM_SELECTOR)
      [index].classList.add(ACTIVE_CLASS);
  }

  getActiveIndexes(index) {
    if (index == 0) return [0, 1, 2];
    if (index == this.length - 1) return [index - 2, index - 1, index];
    return [index - 1, index, index + 1];
  }

  updateRibbon(index) {
    if (this.length < 4) return;
    const items = this.element.querySelectorAll(LIST_ITEM_SELECTOR);
    const activeIndexes = this.getActiveIndexes(index);
    items.forEach((item, idx) => {
      if (activeIndexes.includes(idx)) {
        item.classList.add(ACTIVE_CLASS);
      } else {
        item.classList.remove(ACTIVE_CLASS);
      }
    });
  }
}

//init
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(MAIN_SELECTOR).forEach((node) => new News(node));
});
