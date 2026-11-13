// Theme preference and the FAQ accordion are kept dependency-free for easy embedding.
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeIcon.textContent = isDark ? "☾" : "☼";
  themeLabel.textContent = isDark ? "Dark" : "Light";
  localStorage.setItem("gtm-theme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("gtm-theme");
setTheme(savedTheme === "dark");
themeToggle.addEventListener("click", () => setTheme(!document.body.classList.contains("dark-mode")));

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.closest(".faq-item");
    const isOpen = item.classList.contains("is-open");
    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("is-open");
      faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      faqItem.querySelector(".faq-question span").textContent = "+";
    });
    if (!isOpen) {
      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
      question.querySelector("span").textContent = "−";
    }
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isVisible = mainNav.classList.toggle("is-visible");
  menuToggle.setAttribute("aria-expanded", String(isVisible));
});
