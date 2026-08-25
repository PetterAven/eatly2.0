import axios from 'axios';
import { router } from '@inertiajs/react';

const TAB_TOKEN_KEY = 'eatly.tab-token';
let configured = false;

export function getTabToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.sessionStorage.getItem(TAB_TOKEN_KEY);
}

export function storeTabToken(token: string): void {
    window.sessionStorage.setItem(TAB_TOKEN_KEY, token);
}

export function clearTabToken(): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(TAB_TOKEN_KEY);
    }
}

export function configureTabAuth(): void {
    if (typeof window === 'undefined' || configured) {
        return;
    }

    configured = true;

    // Axios interceptor for direct axios calls
    axios.interceptors.request.use((config) => {
        const token = getTabToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    axios.interceptors.response.use((response) => {
        const requestUrl = new URL(response.config.url ?? '', window.location.origin);

        if (requestUrl.pathname === '/logout') {
            clearTabToken();
        }

        return response;
    });

    // Inertia router interceptor for page visits and router actions
    router.on('before', (event) => {
        const token = getTabToken();

        if (token) {
            event.detail.visit.headers = {
                ...event.detail.visit.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    });
}
