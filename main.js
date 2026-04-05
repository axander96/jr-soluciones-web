import {
    getFirebaseStatus,
    loginWithEmail,
    logout,
    onFirebaseAuthChange,
    saveSiteContent,
    watchSiteContent,
    uploadSiteImage,
} from "./firebase.js";
import { adminConfig } from "./firebase-config.js";

const adminPanel = document.getElementById("adminPanel");
const adminToggle = document.getElementById("adminToggle");
const firebaseStatus = document.getElementById("firebaseStatus");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminEditBtn = document.getElementById("adminEditBtn");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const adminModal = document.getElementById("adminModal");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginFeedback = document.getElementById("adminLoginFeedback");
const adminEditor = document.getElementById("adminEditor");
const adminFields = document.getElementById("adminFields");
const adminSaveFeedback = document.getElementById("adminSaveFeedback");
const adminSaveBtn = document.getElementById("adminSaveBtn");
const editorUser = document.getElementById("editorUser");
const adminSaveInlineBtn = document.getElementById("adminSaveInlineBtn");
const adminCloseEditBtn = document.getElementById("adminCloseEditBtn");
const editBar = document.getElementById("editBar");
const editBarStatus = document.getElementById("editBarStatus");
const siteToast = document.getElementById("siteToast");
const ownerMapHrefInput = document.getElementById("ownerMapHrefInput");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
const contentCacheKey = "jr-soluciones-web:site-home";
const isEditWindow = new URLSearchParams(window.location.search).get("edit") === "1";

const defaults = {
    brandTitle: "JR Soluciones",
    brandLogo: "img/logo-placeholder.svg",
    navInicio: "Inicio",
    navHistoria: "Historia",
    navColecciones: "Colecciones",
    navNosotros: "Nosotros",
    heroEyebrow: "Diseño, comodidad y calidad",
    heroTitle: "JR Soluciones",
    heroDescription:
        "Amueblamos tus espacios con estilo, durabilidad y atención cercana. Encuentra muebles para tu hogar, oficina o negocio con el toque elegante que distingue a la marca.",
    qrKicker: "Llévatelo con",
    qrOffer: "0% de inicial",
    heroImage: "img/hero-placeholder.svg",
    qrImage: "img/qr-placeholder.svg",
    feature1Title: "Sofá modular",
    feature1Description: "Confort amplio para salas modernas y familiares.",
    feature1Image: "img/product-1.svg",
    feature2Title: "Juego de comedor",
    feature2Description: "Una opción elegante para reuniones y comidas.",
    feature2Image: "img/product-2.svg",
    feature3Title: "Silla ejecutiva",
    feature3Description: "Diseñada para jornadas cómodas en oficina.",
    feature3Image: "img/product-3.svg",
    feature4Title: "Centro de TV",
    feature4Description: "Organización y estilo para tu entretenimiento.",
    feature4Image: "img/product-4.svg",
    story1Title: "Origen",
    story1Description: "Un emprendimiento construido paso a paso, con enfoque en la calidad y el servicio.",
    story1Image: "img/story-1.svg",
    story2Title: "Crecimiento",
    story2Description: "La variedad de estilos y colecciones fue aumentando para responder a más necesidades.",
    story2Image: "img/story-2.svg",
    collection1Title: "Sala Estilo Urbano",
    collection1Description: "Sofás y mesas auxiliares pensadas para espacios modernos.",
    collection1Image: "img/collection-1.svg",
    collection2Title: "Comedor Premium",
    collection2Description: "Piezas elegantes para compartir en familia o en negocios.",
    collection2Image: "img/collection-2.svg",
    collection3Title: "Oficina Pro",
    collection3Description: "Escritorios, sillas y soporte para productividad diaria.",
    collection3Image: "img/collection-3.svg",
    collection4Title: "Descanso Confort",
    collection4Description: "Opciones de dormitorio pensadas para descansar mejor.",
    collection4Image: "img/collection-4.svg",
    historyTitle: "La historia de un negocio con visión familiar",
    historyDescription:
        "JR Soluciones nace con la idea de ofrecer muebles funcionales, bonitos y accesibles para familias que buscan transformar sus espacios sin complicaciones. Con el tiempo, la marca fue creciendo gracias al trato cercano, la confianza y el gusto por los detalles.",
    historyEyebrow: "Historia",
    collectionsTitle: "Productos seleccionados para cada espacio",
    collectionsDescription:
        "Aquí puedes mostrar imágenes, nombre y descripción de cada producto. Dejé ejemplos visuales para que luego cambies cada tarjeta por tus fotografías reales.",
    collectionsEyebrow: "Colecciones",
    aboutTitle: "Misión, visión y valores",
    aboutEyebrow: "Nosotros",
    ownerTitle: "Propietario",
    missionTitle: "Misión",
    missionDescription:
        "Ofrecer muebles de calidad y una atención cercana que ayude a cada cliente a amueblar su espacio ideal.",
    visionTitle: "Visión",
    visionDescription:
        "Ser una mueblería reconocida por su estilo, confianza y capacidad de adaptarse a las necesidades del mercado.",
    valuesTitle: "Valores",
    valuesDescription: "Honestidad, compromiso, buen gusto, responsabilidad y servicio personalizado.",
    ownerName: "Juan Rodríguez",
    ownerRole: "Propietario y Gerente General",
    ownerContactTitle: "Contacto",
    ownerVisitTitle: "Visítanos",
    ownerPhone: "+1 (809) 555-0123",
    ownerPhoneHref: "tel:+18095550123",
    ownerWhatsApp: "https://wa.me/18095550123",
    ownerFacebook: "",
    ownerInstagram: "",
    ownerAddressHref: "https://www.google.com/maps/search/?api=1&query=Calle%20Principal%20%23123%2C%20Santo%20Domingo%2C%20Rep%C3%BAblica%20Dominicana",
    ownerAddress: "Calle Principal #123, Santo Domingo, República Dominicana",
    ownerImage: "img/owner-placeholder.svg",
    footerText: "Desarrollado por AR Multimedia Services",
};

const fieldGroups = [
    {
        title: "Navegación",
        fields: [
            { key: "navInicio", label: "Inicio", type: "text" },
            { key: "navHistoria", label: "Historia", type: "text" },
            { key: "navColecciones", label: "Colecciones", type: "text" },
            { key: "navNosotros", label: "Nosotros", type: "text" },
            { key: "footerText", label: "Pie de página", type: "text", wide: true },
        ],
    },
    {
        title: "Marca",
        fields: [
            { key: "brandTitle", label: "Nombre de la marca", type: "text" },
            { key: "brandLogo", label: "Logo principal", type: "image" },
        ],
    },
    {
        title: "Inicio",
        fields: [
            { key: "heroEyebrow", label: "Texto superior", type: "text" },
            { key: "heroTitle", label: "Título principal", type: "text" },
            { key: "heroDescription", label: "Descripción corta", type: "textarea", wide: true },
            { key: "heroImage", label: "Imagen principal", type: "image" },
            { key: "qrKicker", label: "Texto del QR", type: "text" },
            { key: "qrOffer", label: "Oferta del QR", type: "text" },
            { key: "qrImage", label: "Imagen QR", type: "image" },
        ],
    },
    {
        title: "Productos destacados",
        fields: [
            { key: "feature1Title", label: "Producto 1 Título", type: "text" },
            { key: "feature1Description", label: "Producto 1 descripción", type: "textarea" },
            { key: "feature1Image", label: "Producto 1 imagen", type: "image" },
            { key: "feature2Title", label: "Producto 2 Título", type: "text" },
            { key: "feature2Description", label: "Producto 2 descripción", type: "textarea" },
            { key: "feature2Image", label: "Producto 2 imagen", type: "image" },
            { key: "feature3Title", label: "Producto 3 Título", type: "text" },
            { key: "feature3Description", label: "Producto 3 descripción", type: "textarea" },
            { key: "feature3Image", label: "Producto 3 imagen", type: "image" },
            { key: "feature4Title", label: "Producto 4 título", type: "text" },
            { key: "feature4Description", label: "Producto 4 descripción", type: "textarea" },
            { key: "feature4Image", label: "Producto 4 imagen", type: "image" },
        ],
    },
    {
        title: "Historia",
        fields: [
            { key: "historyEyebrow", label: "Etiqueta", type: "text" },
            { key: "historyTitle", label: "Título de la sección", type: "text", wide: true },
            { key: "historyDescription", label: "Texto de la sección", type: "textarea", wide: true },
            { key: "story1Title", label: "Historia 1 título", type: "text" },
            { key: "story1Description", label: "Historia 1 texto", type: "textarea", wide: true },
            { key: "story1Image", label: "Historia 1 imagen", type: "image" },
            { key: "story2Title", label: "Historia 2 título", type: "text" },
            { key: "story2Description", label: "Historia 2 texto", type: "textarea", wide: true },
            { key: "story2Image", label: "Historia 2 imagen", type: "image" },
        ],
    },
    {
        title: "Colecciones",
        fields: [
            { key: "collectionsEyebrow", label: "Etiqueta", type: "text" },
            { key: "collectionsTitle", label: "Título de la sección", type: "text", wide: true },
            { key: "collectionsDescription", label: "Texto de la sección", type: "textarea", wide: true },
            { key: "collection1Title", label: "Colección 1 Título", type: "text" },
            { key: "collection1Description", label: "Colección 1 texto", type: "textarea" },
            { key: "collection1Image", label: "Colección 1 imagen", type: "image" },
            { key: "collection2Title", label: "Colección 2 Título", type: "text" },
            { key: "collection2Description", label: "Colección 2 texto", type: "textarea" },
            { key: "collection2Image", label: "Colección 2 imagen", type: "image" },
            { key: "collection3Title", label: "Colección 3 Título", type: "text" },
            { key: "collection3Description", label: "Colección 3 texto", type: "textarea" },
            { key: "collection3Image", label: "Colección 3 imagen", type: "image" },
            { key: "collection4Title", label: "Colección 4 Título", type: "text" },
            { key: "collection4Description", label: "Colección 4 texto", type: "textarea" },
            { key: "collection4Image", label: "Colección 4 imagen", type: "image" },
        ],
    },
    {
        title: "Nosotros",
        fields: [
            { key: "aboutEyebrow", label: "Etiqueta", type: "text" },
            { key: "aboutTitle", label: "Título de la sección", type: "text", wide: true },
            { key: "missionTitle", label: "Misión Título", type: "text" },
            { key: "missionDescription", label: "Misión texto", type: "textarea", wide: true },
            { key: "visionTitle", label: "Visión Título", type: "text" },
            { key: "visionDescription", label: "Visión texto", type: "textarea", wide: true },
            { key: "valuesTitle", label: "Valores Título", type: "text" },
            { key: "valuesDescription", label: "Valores texto", type: "textarea", wide: true },
        ],
    },
    {
        title: "Propietario",
        fields: [
            { key: "ownerTitle", label: "Título de la sección", type: "text", wide: true },
            { key: "ownerName", label: "Nombre", type: "text" },
            { key: "ownerRole", label: "Cargo", type: "text" },
            { key: "ownerContactTitle", label: "Título contacto", type: "text" },
            { key: "ownerPhone", label: "Teléfono", type: "text" },
            { key: "ownerVisitTitle", label: "Título visita", type: "text" },
            { key: "ownerFacebook", label: "Facebook", type: "text" },
            { key: "ownerInstagram", label: "Instagram", type: "text" },
            { key: "ownerAddress", label: "Dirección", type: "textarea", wide: true },
            {
                key: "ownerAddressHref",
                label: "URL Google Map",
                type: "text",
                wide: true,
                helper:
                    "Pega aquí el enlace de Google Maps. Al tocar la dirección en la página, se abrirá este enlace.",
            },
            { key: "ownerImage", label: "Foto del propietario", type: "image" },
        ],
    },
];

const binders = Object.fromEntries(
    Array.from(document.querySelectorAll("[data-bind]")).map((node) => [node.dataset.bind, node])
);
const srcBinders = Object.fromEntries(
    Array.from(document.querySelectorAll("[data-src-bind]")).map((node) => [node.dataset.srcBind, node])
);
const hrefBinders = Object.fromEntries(
    Array.from(document.querySelectorAll("[data-bind-href]")).map((node) => [node.dataset.bindHref, node])
);

let currentData = { ...defaults };
let currentUser = null;
let isSaving = false;
let toastTimer = null;

const readCachedContent = () => {
    try {
        const cached = window.localStorage.getItem(contentCacheKey);
        if (!cached) {
            return null;
        }

        const parsed = JSON.parse(cached);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
};

const writeCachedContent = (data) => {
    try {
        window.localStorage.setItem(contentCacheKey, JSON.stringify(data));
    } catch {
        // Ignore storage quota or privacy mode issues.
    }
};

const normalizePhone = (value) => String(value ?? "").replace(/[^0-9]/g, "");

const escapeHtml = (value) =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const showToast = (message, tone = "success") => {
    if (!siteToast) {
        return;
    }

    window.clearTimeout(toastTimer);
    siteToast.textContent = message;
    siteToast.classList.toggle("is-error", tone === "error");
    siteToast.hidden = false;

    requestAnimationFrame(() => {
        siteToast.classList.add("is-visible");
    });

    toastTimer = window.setTimeout(() => {
        siteToast.classList.remove("is-visible");
        window.setTimeout(() => {
            siteToast.hidden = true;
        }, 240);
    }, 2800);
};

const applyContent = (data = {}) => {
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== "string") {
            return;
        }

        const textNode = binders[key];
        if (textNode) {
            textNode.textContent = value;
        }

        const srcNode = srcBinders[key];
        if (srcNode) {
            srcNode.src = value;
        }

        const hrefNode = hrefBinders[key];
        if (hrefNode) {
            if (value) {
                hrefNode.href = value;
                hrefNode.dataset.emptyHref = "false";
            } else {
                hrefNode.setAttribute("href", "#");
                hrefNode.dataset.emptyHref = "true";
            }
        }
    });

    if (ownerMapHrefInput instanceof HTMLInputElement) {
        ownerMapHrefInput.value = data.ownerAddressHref ?? "";
    }
};

ownerMapHrefInput?.addEventListener("input", () => {
    currentData.ownerAddressHref = ownerMapHrefInput.value.trim();
    currentData = normalizeContactData(currentData);
    writeCachedContent(currentData);
    applyContent(currentData);
    syncEditor(currentData);
});

const normalizeContactData = (data = {}) => {
    const phoneValue = String(data.ownerPhone ?? defaults.ownerPhone);
    const phoneDigits = normalizePhone(phoneValue);

    return {
        ...data,
        ownerPhone: phoneValue,
        ownerPhoneHref: `tel:${phoneDigits}`,
        ownerWhatsApp: `https://wa.me/${phoneDigits}`,
        ownerVisitTitle: "Visítanos",
        ownerFacebook: String(data.ownerFacebook ?? ""),
        ownerInstagram: String(data.ownerInstagram ?? ""),
        ownerAddressHref: String(
            data.ownerAddressHref ??
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    String(data.ownerAddress ?? defaults.ownerAddress)
                )}`
        ),
    };
};

const renderAdminPreview = () => {};

const inlineFileInput = document.createElement("input");
inlineFileInput.type = "file";
inlineFileInput.accept = "image/*";
inlineFileInput.hidden = true;
document.body.appendChild(inlineFileInput);

let activeInlineImageKey = "";

const setInlineEditing = (enabled) => {
    document.body.classList.toggle("inline-editing", enabled);
    if (editBar) {
        editBar.hidden = !enabled;
    }
    if (adminPanel) {
        adminPanel.hidden = enabled || isEditWindow;
    }

    Object.entries(binders).forEach(([key, node]) => {
        if (!(node instanceof HTMLElement)) {
            return;
        }

        if (node.tagName === "IMG") {
            node.classList.toggle("editable-media", enabled);
            return;
        }

        node.classList.toggle("editable-text", enabled);
        if (enabled) {
            node.setAttribute("contenteditable", "true");
            node.setAttribute("spellcheck", "true");
            node.dataset.inlineKey = key;
        } else {
            node.removeAttribute("contenteditable");
            node.removeAttribute("spellcheck");
            delete node.dataset.inlineKey;
        }
    });
};

const syncInlineField = (key, value) => {
    currentData[key] = value;
    writeCachedContent(currentData);
    syncEditor(currentData);
};

document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("inline-editing")) {
        return;
    }

    if (!(event.target instanceof Element)) {
        return;
    }

    const socialLink = event.target.closest("[data-edit-link-key]");
    if (socialLink instanceof HTMLAnchorElement) {
        if (socialLink.dataset.emptyHref === "true" && !document.body.classList.contains("inline-editing")) {
            event.preventDefault();
            return;
        }

        const editKey = socialLink.dataset.editLinkKey;
        if (!editKey || editKey === "ownerWhatsApp") {
            return;
        }

        event.preventDefault();
        const friendlyName = editKey === "ownerFacebook" ? "Facebook" : "Instagram";
        const nextValue = window.prompt(`Pega el enlace de ${friendlyName}`, currentData[editKey] ?? "");
        if (nextValue === null) {
            return;
        }

        currentData[editKey] = nextValue.trim();
        currentData = normalizeContactData(currentData);
        writeCachedContent(currentData);
        applyContent(currentData);
        syncEditor(currentData);
        showToast(`${friendlyName} actualizado. No olvides guardar.`);
        return;
    }

    const image = event.target.closest("[data-src-bind]");
    if (!(image instanceof HTMLImageElement)) {
        return;
    }

    event.preventDefault();
    activeInlineImageKey = image.dataset.srcBind || "";
    inlineFileInput.value = "";
    inlineFileInput.click();
});

inlineFileInput.addEventListener("change", async () => {
    if (!activeInlineImageKey || !inlineFileInput.files?.[0]) {
        return;
    }

    const file = inlineFileInput.files[0];

    try {
        adminSaveFeedback.textContent = "Subiendo imagen...";
        const path = `site/${activeInlineImageKey}/${Date.now()}-${file.name}`;
        const url = await uploadSiteImage(file, path);
        currentData[activeInlineImageKey] = url;
        currentData = normalizeContactData(currentData);
        writeCachedContent(currentData);
        applyContent(currentData);
        syncEditor(currentData);
        adminSaveFeedback.textContent = "Imagen lista. Recuerda guardar los cambios.";
        showToast("Imagen actualizada. No olvides guardar.");
    } catch {
        adminSaveFeedback.textContent = "No se pudo subir la imagen.";
        showToast("No se pudo subir la imagen.", "error");
    } finally {
        activeInlineImageKey = "";
    }
});

document.addEventListener("input", (event) => {
    if (!document.body.classList.contains("inline-editing")) {
        return;
    }

    const node = event.target;
    if (!(node instanceof HTMLElement)) {
        return;
    }

    const key = node.dataset.inlineKey;
    if (!key) {
        return;
    }

    const value =
        node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement ? node.value.trim() : node.innerText.trim();
    currentData[key] = value;

    if (key === "ownerPhone") {
        currentData = normalizeContactData(currentData);
    }

    writeCachedContent(currentData);
    syncEditor(currentData);
});

const isInlineTextNode = (node) =>
    node instanceof HTMLElement &&
    node.dataset.bind &&
    !node.matches("img") &&
    !node.matches("a[href^='tel:']") ? true : true;

const updateInlineTextState = (enabled) => {
    binders.heroTitle?.setAttribute("contenteditable", enabled ? "true" : "false");
    binders.heroDescription?.setAttribute("contenteditable", enabled ? "true" : "false");
    binders.qrKicker?.setAttribute("contenteditable", enabled ? "true" : "false");
    binders.qrOffer?.setAttribute("contenteditable", enabled ? "true" : "false");

    Object.entries(binders).forEach(([key, node]) => {
        if (!(node instanceof HTMLElement)) {
            return;
        }

        if (node.tagName === "IMG") {
            node.classList.toggle("editable-media", enabled);
            return;
        }

        if (key === "ownerPhone" || key === "ownerWhatsApp" || key === "brandTitle" || key.endsWith("Title") || key.endsWith("Description") || key.endsWith("Role") || key.endsWith("Address")) {
            node.setAttribute("contenteditable", enabled ? "true" : "false");
            node.classList.toggle("editable-text", enabled);
            node.spellcheck = enabled;
        }
    });

    if (enabled) {
        binders.ownerPhone?.setAttribute("contenteditable", "true");
        binders.ownerPhone?.classList.add("editable-text");
        binders.ownerPhone?.setAttribute("data-inline-key", "ownerPhone");
        binders.ownerWhatsApp?.setAttribute("contenteditable", "true");
        binders.ownerWhatsApp?.classList.add("editable-text");
        binders.ownerWhatsApp?.setAttribute("data-inline-key", "ownerWhatsApp");
    } else {
        binders.ownerPhone?.removeAttribute("contenteditable");
        binders.ownerPhone?.classList.remove("editable-text");
        binders.ownerWhatsApp?.removeAttribute("contenteditable");
        binders.ownerWhatsApp?.classList.remove("editable-text");
    }
};

const setEditMode = (enabled) => {
    setInlineEditing(enabled);
};

const syncInlineFromDom = () => {
    adminFields.querySelectorAll("[data-field-key]").forEach((field) => {
        const key = field.dataset.fieldKey;
        if (typeof key === "string") {
            currentData[key] = field.value.trim();
        }
    });
};

const syncEditor = (data = {}) => {
    adminFields.querySelectorAll("[data-field-key]").forEach((field) => {
        const key = field.dataset.fieldKey;
        field.value = data[key] ?? "";
    });

    adminFields.querySelectorAll("[data-preview-key]").forEach((preview) => {
        const key = preview.dataset.previewKey;
        preview.src = data[key] ?? defaults[key] ?? "";
    });
};

const buildEditor = () => {
    adminFields.innerHTML = "";

    fieldGroups.forEach((group) => {
        const groupCard = document.createElement("section");
        groupCard.className = "editor-group";

        const title = document.createElement("h3");
        title.textContent = group.title;
        groupCard.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "editor-grid";

        group.fields.forEach((field) => {
            const wrapper = document.createElement("label");
            wrapper.className = `editor-field${field.wide ? " editor-field--wide" : ""}`;

            const caption = document.createElement("span");
            caption.textContent = field.label;
            wrapper.appendChild(caption);

            if (field.type === "image") {
                const preview = document.createElement("img");
                preview.className = "editor-preview";
                preview.dataset.previewKey = field.key;
                preview.alt = field.label;
                preview.src = currentData[field.key] ?? defaults[field.key] ?? "";

                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.dataset.uploadKey = field.key;
                input.disabled = true;

                const helper = document.createElement("small");
                helper.textContent = "Sube una imagen y se guardará automáticamente en Firebase Storage.";

                wrapper.append(preview, input, helper);
            } else {
                const control =
                    field.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
                if (field.type !== "textarea") {
                    control.type = "text";
                }
                control.dataset.fieldKey = field.key;
                wrapper.appendChild(control);
            }

            if (field.helper && field.type !== "image") {
                const helper = document.createElement("small");
                helper.className = "editor-help";
                helper.textContent = field.helper;
                wrapper.appendChild(helper);
            }

            grid.appendChild(wrapper);
        });

        groupCard.appendChild(grid);
        adminFields.appendChild(groupCard);
    });
};

const setModalMode = (mode) => {
    const isLogin = mode === "login";
    adminModal.dataset.mode = mode;
    adminLoginForm.hidden = !isLogin;
    adminLoginForm.classList.toggle("is-visible", isLogin);
    adminModal.hidden = false;
};

const closeModal = () => {
    adminModal.hidden = true;
    delete adminModal.dataset.mode;
    adminLoginFeedback.textContent = "";
    adminSaveFeedback.textContent = "";
};

const updateAdminUI = () => {
    const isAdmin = Boolean(currentUser && currentUser.email === adminConfig.adminEmail);
    adminLoginBtn.hidden = isAdmin;
    adminEditBtn.hidden = !isAdmin;
    adminLogoutBtn.hidden = !isAdmin;
    firebaseStatus.textContent = isAdmin
        ? `sesión activa: ${currentUser.email}`
        : getFirebaseStatus();

    adminEditor.querySelectorAll("input, textarea, button").forEach((control) => {
        if (control.closest(".admin-login")) {
            return;
        }

        control.disabled = !isAdmin || isSaving;
    });

    if (adminSaveBtn) {
        adminSaveBtn.textContent = isSaving ? "Guardando..." : "Guardar cambios";
    }

    if (adminSaveInlineBtn) {
        adminSaveInlineBtn.textContent = isSaving ? "Guardando..." : "Guardar cambios";
        adminSaveInlineBtn.disabled = isSaving;
    }
};

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
    });
};

adminToggle?.addEventListener("click", () => {
    const collapsed = adminPanel.classList.toggle("collapsed");
    adminToggle.setAttribute("aria-expanded", String(!collapsed));
});

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

adminLoginBtn?.addEventListener("click", () => {
    setModalMode("login");
});

adminEditBtn?.addEventListener("click", () => {
    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.set("edit", "1");
    window.open(targetUrl.toString(), "_blank", "noopener");
    closeModal();
});

adminSaveInlineBtn?.addEventListener("click", (event) => saveEditorChanges(event));

adminCloseEditBtn?.addEventListener("click", () => {
    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.delete("edit");
    window.location.href = targetUrl.toString();
});

adminLogoutBtn?.addEventListener("click", async () => {
    await logout();
    closeModal();
});

adminModal?.addEventListener("click", (event) => {
    if (event.target.matches("[data-admin-close]")) {
        closeModal();
    }
});

adminLoginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminLoginFeedback.textContent = "Iniciando sesión...";

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    try {
        const credential = await loginWithEmail(email, password);
        adminLoginFeedback.textContent = "";
        adminLoginForm.reset();
        if (credential?.user?.email === adminConfig.adminEmail) {
            editorUser.textContent = `sesión: ${credential.user.email}`;
        }
        closeModal();
    } catch (error) {
        adminLoginFeedback.textContent = "No se pudo iniciar sesión. Revisa correo y contraseña.";
    }
});

const saveEditorChanges = async (event) => {
    event?.preventDefault?.();

    if (!currentUser || currentUser.email !== adminConfig.adminEmail || isSaving) {
        return;
    }

    isSaving = true;
    updateAdminUI();
    adminSaveFeedback.textContent = "Guardando cambios...";

        const updated = { ...currentData };

    adminFields.querySelectorAll("[data-field-key]").forEach((field) => {
        updated[field.dataset.fieldKey] = field.value.trim();
    });

    currentData = normalizeContactData(updated);

    try {
        await saveSiteContent(currentData);
        writeCachedContent(currentData);
        applyContent(currentData);
        syncEditor(currentData);
        renderAdminPreview(currentData);
        adminSaveFeedback.textContent = "Cambios guardados correctamente.";
        showToast("Cambios guardados correctamente.");
    } catch (error) {
        adminSaveFeedback.textContent = "No se pudieron guardar los cambios.";
        showToast("No se pudieron guardar los cambios.", "error");
    } finally {
        isSaving = false;
        updateAdminUI();
    }
};

adminEditor?.addEventListener("submit", saveEditorChanges);

adminFields?.addEventListener("change", async (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
        return;
    }

    const uploadKey = input.dataset.uploadKey;
    if (!uploadKey || !input.files?.[0]) {
        return;
    }

    if (!currentUser || currentUser.email !== adminConfig.adminEmail) {
        input.value = "";
        return;
    }

    const file = input.files[0];
    const preview = adminFields.querySelector(`[data-preview-key="${uploadKey}"]`);

    try {
        adminSaveFeedback.textContent = "Subiendo imagen...";
        const path = `site/${uploadKey}/${Date.now()}-${file.name}`;
        const url = await uploadSiteImage(file, path);
        currentData[uploadKey] = url;
        currentData = normalizeContactData(currentData);
        writeCachedContent(currentData);
        input.dataset.uploadedUrl = url;
        input.value = "";
        if (preview) {
            preview.src = url;
        }
        renderAdminPreview(currentData);
        adminSaveFeedback.textContent = "Imagen lista. Recuerda guardar los cambios.";
    } catch (error) {
        adminSaveFeedback.textContent = "No se pudo subir la imagen.";
    }
});

adminFields?.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
        return;
    }

    const fieldKey = input.dataset.fieldKey;
    if (!fieldKey) {
        return;
    }

    currentData[fieldKey] = input.value;
    currentData = normalizeContactData(currentData);
    applyContent(currentData);
    renderAdminPreview(currentData);
});

firebaseStatus.textContent = getFirebaseStatus();
buildEditor();
syncEditor(defaults);
currentData = normalizeContactData(defaults);
applyContent(currentData);
renderAdminPreview(currentData);
if (isEditWindow && adminPanel) {
    adminPanel.hidden = true;
}
if (isEditWindow) {
    setEditMode(false);
    setModalMode("login");
}

const cachedContent = readCachedContent();
if (cachedContent) {
    currentData = normalizeContactData({ ...defaults, ...cachedContent });
    applyContent(currentData);
    syncEditor(currentData);
    renderAdminPreview(currentData);
}

watchSiteContent((data) => {
    if (!data) {
        currentData = normalizeContactData({ ...defaults });
        applyContent(currentData);
        syncEditor(currentData);
        renderAdminPreview(currentData);
        writeCachedContent(currentData);
        return;
    }

    currentData = normalizeContactData({ ...defaults, ...data });
    applyContent(currentData);
    syncEditor(currentData);
    renderAdminPreview(currentData);
    writeCachedContent(currentData);
});

onFirebaseAuthChange((user) => {
    currentUser = user;
    updateAdminUI();

    if (user && user.email === adminConfig.adminEmail) {
        editorUser.textContent = `sesión: ${user.email}`;
        currentData = normalizeContactData(currentData);
        syncEditor(currentData);
        closeModal();
    } else if (user) {
        editorUser.textContent = `Cuenta no autorizada: ${user.email}`;
        closeModal();
        adminSaveFeedback.textContent = "Ese correo no tiene permiso para editar.";
    } else {
        editorUser.textContent = "Sin sesión";
        closeModal();
    }
});

onFirebaseAuthChange((user) => {
    if (!isEditWindow) {
        return;
    }

    if (user && user.email === adminConfig.adminEmail) {
        setEditMode(true);
        closeModal();
        return;
    }

    setEditMode(false);
    setModalMode("login");
});



