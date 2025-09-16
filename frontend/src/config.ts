// src/config.ts
const { VITE_BACKEND_API_URL, VITE_BFF_FLAG, VITE_BFF_API_URL } = import.meta.env;

const config = Object.freeze({
    apiUrl: VITE_BACKEND_API_URL,
    bffFlag: String(VITE_BFF_FLAG).toLowerCase() === 'true',
    bffApi: VITE_BFF_API_URL,
});

export default config;
