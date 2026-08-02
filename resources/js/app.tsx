import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Eatly';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

        let page =
            pages[`./pages/${name}.tsx`] || pages[`./pages/${name}/index.tsx`];

        if (!page) {
            const normalizedTarget = name.toLowerCase().replace(/\/index$/, '');
            const matchingKey = Object.keys(pages).find((key) => {
                const normalizedKey = key
                    .replace('./pages/', '')
                    .replace(/\.tsx$/, '')
                    .toLowerCase();
                return (
                    normalizedKey === normalizedTarget ||
                    normalizedKey === `${normalizedTarget}/index`
                );
            });

            if (matchingKey) {
                page = pages[matchingKey];
            }
        }

        if (!page) {
            throw new Error(
                `[Inertia] No se pudo encontrar la página: "${name}" en el directorio ./pages/`,
            );
        }

        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#f59e0b', // Color ámbar característico de Eatly
    },
});
