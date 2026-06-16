import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Polyfill window.storage for local browser storage (replaces Claude artifact storage)
const store: Record<string, string> = {};
const storageLoad = () => {
  try {
    const raw = localStorage.getItem('baby_food_diary_store');
    if (raw) Object.assign(store, JSON.parse(raw));
  } catch {}
};
const storageSave = () => {
  try { localStorage.setItem('baby_food_diary_store', JSON.stringify(store)); } catch {}
};
storageLoad();

(window as any).storage = {
  get: async (key: string) => {
    const value = store[key];
    return value !== undefined ? { key, value } : null;
  },
  set: async (key: string, value: string) => {
    store[key] = value;
    storageSave();
    return { key, value };
  },
  delete: async (key: string) => {
    delete store[key];
    storageSave();
    return { key, deleted: true };
  },
  list: async (prefix?: string) => {
    const keys = Object.keys(store).filter(k => !prefix || k.startsWith(prefix));
    return { keys };
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
