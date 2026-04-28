import emailIcon from "bootstrap-icons/icons/envelope.svg?raw";
import facebookIcon from "bootstrap-icons/icons/facebook.svg?raw";
import githubIcon from "bootstrap-icons/icons/github.svg?raw";
import linkedinIcon from "bootstrap-icons/icons/linkedin.svg?raw";

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const iconMarkup = {
  email: emailIcon,
  facebook: facebookIcon,
  github: githubIcon,
  linkedin: linkedinIcon,
};

document.querySelectorAll("[data-icon]").forEach((target) => {
  const iconName = target.getAttribute("data-icon");
  target.innerHTML = iconMarkup[iconName] ?? "";
});

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav?.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    siteNav?.classList.remove("is-open");
  });
});
