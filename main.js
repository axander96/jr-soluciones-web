import {
    getFirebaseStatus,
    loadSiteContent,
    loginWithEmail,
    logout,
    onFirebaseAuthChange,
    saveSiteContent,
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
const editorUser = document.getElementById("editorUser");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const defaults = {
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
    ownerPhone: "+1 (809) 555-0123",
    ownerPhoneHref: "tel:+18095550123",
    ownerWhatsApp: "https://wa.me/18095550123",
    ownerAddress: "Calle Principal #123, Santo Domingo, República Dominicana",
    ownerImage: "img/owner-placeholder.svg",
};

const fieldGroups = [
    {
        title: "Inicio",
        fields: [
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
            { key: "feature1Title", label: "Producto 1 título", type: "text" },
            { key: "feature1Description", label: "Producto 1 descripción", type: "textarea" },
            { key: "feature1Image", label: "Producto 1 imagen", type: "image" },
            { key: "feature2Title", label: "Producto 2 título", type: "text" },
            { key: "feature2Description", label: "Producto 2 descripción", type: "textarea" },
            { key: "feature2Image", label: "Producto 2 imagen", type: "image" },
            { key: "feature3Title", label: "Producto 3 título", type: "text" },
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
            { key: "collection1Title", label: "Colección 1 título", type: "text" },
            { key: "collection1Description", label: "Colección 1 texto", type: "textarea" },
            { key: "collection1Image", label: "Colección 1 imagen", type: "image" },
            { key: "collection2Title", label: "Colección 2 título", type: "text" },
            { key: "collection2Description", label: "Colección 2 texto", type: "textarea" },
            { key: "collection2Image", label: "Colección 2 imagen", type: "image" },
            { key: "collection3Title", label: "Colección 3 título", type: "text" },
            { key: "collection3Description", label: "Colección 3 texto", type: "textarea" },
            { key: "collection3Image", label: "Colección 3 imagen", type: "image" },
            { key: "collection4Title", label: "Colección 4 título", type: "text" },
            { key: "collection4Description", label: "Colección 4 texto", type: "textarea" },
            { key: "collection4Image", label: "Colección 4 imagen", type: "image" },
        ],
    },
    {
        title: "Nosotros",
        fields: [
            { key: "missionTitle", label: "Misión título", type: "text" },
            { key: "missionDescription", label: "Misión texto", type: "textarea", wide: true },
            { key: "visionTitle", label: "Visión título", type: "text" },
            { key: "visionDescription", label: "Visión texto", type: "textarea", wide: true },
            { key: "valuesTitle", label: "Valores título", type: "text" },
            { key: "valuesDescription", label: "Valores texto", type: "textarea", wide: true },
        ],
    },
    {
        title: "Propietario",
        fields: [
            { key: "ownerName", label: "Nombre", type: "text" },
            { key: "ownerRole", label: "Cargo", type: "text" },
            { key: "ownerPhone", label: "Teléfono", type: "text" },
            { key: "ownerWhatsApp", label: "WhatsApp", type: "text" },
            { key: "ownerAddress", label: "Dirección", type: "textarea", wide: true },
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

const normalizePhone = (value) => String(value ?? "").replace(/[^0-9]/g, "");

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
            hrefNode.href = value;
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

            grid.appendChild(wrapper);
        });

        groupCard.appendChild(grid);
        adminFields.appendChild(groupCard);
    });
};

const setModalMode = (mode) => {
    const isLogin = mode === "login";
    const isEditor = mode === "editor";
    adminLoginForm.hidden = !isLogin;
    adminEditor.hidden = !isEditor;
    adminModal.hidden = false;
};

const closeModal = () => {
    adminModal.hidden = true;
    adminLoginFeedback.textContent = "";
    adminSaveFeedback.textContent = "";
};

const updateAdminUI = () => {
    const isAdmin = Boolean(currentUser && currentUser.email === adminConfig.adminEmail);
    adminLoginBtn.hidden = isAdmin;
    adminEditBtn.hidden = !isAdmin;
    adminLogoutBtn.hidden = !isAdmin;
    firebaseStatus.textContent = isAdmin
        ? `Sesión activa: ${currentUser.email}`
        : getFirebaseStatus();

    adminFields.querySelectorAll("[data-upload-key]").forEach((input) => {
        input.disabled = !isAdmin;
    });
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
    syncEditor(currentData);
    setModalMode("editor");
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
            editorUser.textContent = `Sesión: ${credential.user.email}`;
            syncEditor(currentData);
            setModalMode("editor");
        } else {
            closeModal();
        }
    } catch (error) {
        adminLoginFeedback.textContent = "No se pudo iniciar sesión. Revisa correo y contraseña.";
    }
});

adminEditor?.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminSaveFeedback.textContent = "Guardando cambios...";

    const updated = { ...currentData };

    adminFields.querySelectorAll("[data-field-key]").forEach((field) => {
        updated[field.dataset.fieldKey] = field.value.trim();
    });

    updated.ownerPhone = updated.ownerPhone || defaults.ownerPhone;
    updated.ownerPhoneHref = `tel:${normalizePhone(updated.ownerPhone)}`;
    updated.ownerWhatsApp = updated.ownerWhatsApp || `https://wa.me/${normalizePhone(updated.ownerPhone)}`;

    try {
        await saveSiteContent(updated);
        currentData = { ...defaults, ...updated };
        applyContent(currentData);
        syncEditor(currentData);
        adminSaveFeedback.textContent = "Cambios guardados correctamente.";
    } catch (error) {
        adminSaveFeedback.textContent = "No se pudieron guardar los cambios.";
    }
});

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
        input.dataset.uploadedUrl = url;
        input.value = "";
        if (preview) {
            preview.src = url;
        }
        adminSaveFeedback.textContent = "Imagen lista. Recuerda guardar los cambios.";
    } catch (error) {
        adminSaveFeedback.textContent = "No se pudo subir la imagen.";
    }
});

firebaseStatus.textContent = getFirebaseStatus();
buildEditor();
syncEditor(defaults);
applyContent(defaults);

loadSiteContent()
    .then((data) => {
        if (data) {
            currentData = { ...defaults, ...data };
            applyContent(currentData);
            syncEditor(currentData);
            firebaseStatus.textContent = "Contenido cargado desde Firestore";
        } else {
            firebaseStatus.textContent = "Firebase listo, sin contenido guardado";
        }
    })
    .catch(() => {
        firebaseStatus.textContent = "Firebase listo, pero no se pudo leer el contenido";
    });

onFirebaseAuthChange((user) => {
    currentUser = user;
    updateAdminUI();

    if (user && user.email === adminConfig.adminEmail) {
        editorUser.textContent = `Sesión: ${user.email}`;
        syncEditor(currentData);
        if (!adminModal.hidden && adminLoginForm.hidden) {
            setModalMode("editor");
        }
    } else if (user) {
        editorUser.textContent = `Cuenta no autorizada: ${user.email}`;
        closeModal();
        adminSaveFeedback.textContent = "Ese correo no tiene permiso para editar.";
    } else {
        editorUser.textContent = "Sin sesión";
        closeModal();
    }
});
