// src/utils/storage.js
export const load = (key, fallback = null) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('storage.load', e);
        return fallback;
    }
};

export const save = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('storage.save', e);
    }
};
