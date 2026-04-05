import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
    getDownloadURL,
    getStorage,
    ref as storageRef,
    uploadBytes,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];

const isReady = (config) =>
    requiredKeys.every((key) => config?.[key] && !String(config[key]).includes("REPLACE_ME"));

let app = null;
let db = null;
let auth = null;
let storage = null;

export function initFirebase() {
    if (!isReady(firebaseConfig)) {
        return null;
    }

    if (!app) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
    }

    return { app, db, auth, storage };
}

export function getFirebaseStatus() {
    return isReady(firebaseConfig) ? "Firebase conectado" : "Firebase pendiente de configurar";
}

export function onFirebaseAuthChange(callback) {
    const services = initFirebase();

    if (!services?.auth) {
        callback(null);
        return () => {};
    }

    return onAuthStateChanged(services.auth, callback);
}

export async function loginWithEmail(email, password) {
    const services = initFirebase();

    if (!services?.auth) {
        throw new Error("Firebase no está configurado.");
    }

    return signInWithEmailAndPassword(services.auth, email, password);
}

export async function logout() {
    const services = initFirebase();

    if (!services?.auth) {
        return;
    }

    await firebaseSignOut(services.auth);
}

export async function loadSiteContent() {
    const services = initFirebase();

    if (!services?.db) {
        return null;
    }

    const snapshot = await getDoc(doc(services.db, "site", "home"));
    return snapshot.exists() ? snapshot.data() : null;
}

export function watchSiteContent(callback) {
    const services = initFirebase();

    if (!services?.db) {
        callback(null);
        return () => {};
    }

    return onSnapshot(doc(services.db, "site", "home"), (snapshot) => {
        callback(snapshot.exists() ? snapshot.data() : null);
    });
}

export async function saveSiteContent(payload) {
    const services = initFirebase();

    if (!services?.db) {
        throw new Error("Firebase no está configurado.");
    }

    await setDoc(
        doc(services.db, "site", "home"),
        {
            ...payload,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

export async function uploadSiteImage(file, path) {
    const services = initFirebase();

    if (!services?.storage) {
        throw new Error("Firebase Storage no está configurado.");
    }

    const fileRef = storageRef(services.storage, path);
    const result = await uploadBytes(fileRef, file);
    return getDownloadURL(result.ref);
}
