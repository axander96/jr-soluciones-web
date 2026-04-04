const adminPanel = document.getElementById("adminPanel");
const adminToggle = document.getElementById("adminToggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

adminToggle?.addEventListener("click", () => {
    const collapsed = adminPanel.classList.toggle("collapsed");
    adminToggle.setAttribute("aria-expanded", String(!collapsed));
});

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
    });
};

const observer = new IntersectionObserver(
    (entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
            setActiveLink(visible.target.id);
        }
    },
    {
        root: null,
        threshold: [0.25, 0.4, 0.6],
    }
);

sections.forEach((section) => observer.observe(section));
