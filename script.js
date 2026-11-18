document.addEventListener("DOMContentLoaded", () => {
  // Accordion behavior for syllabus modules and FAQ
  const accordions = document.querySelectorAll("[data-accordion]");

  accordions.forEach((group) => {
    const items = group.querySelectorAll("article");

    items.forEach((item) => {
      const trigger = item.querySelector("button");
      const body = item.querySelector(".module-body, .faq-body");
      if (!trigger || !body) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          const otherBtn = other.querySelector("button");
          const otherBody = other.querySelector(".module-body, .faq-body");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          if (otherBody) otherBody.hidden = true;
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          body.hidden = false;
        }
      });
    });
  });

  // Guard placeholder checkout link so clicking before replacing href shows a clear hint
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutHelper = document.getElementById("checkout-helper");

  if (checkoutBtn && checkoutHelper) {
    checkoutBtn.addEventListener("click", (event) => {
      const href = checkoutBtn.getAttribute("href") || "";
      if (href.includes("[LINK_DO_CHECKOUT_PIX]")) {
        event.preventDefault();
        checkoutHelper.hidden = false;
      }
    });
  }
});
