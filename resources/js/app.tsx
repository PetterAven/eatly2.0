import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Busca dinámicamente tus componentes dentro de la carpeta pages
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        
        // Mapea correctamente si el componente está suelto o en un subdirectorio
        const page = pages[`./pages/${name}.tsx`] || pages[`./pages/${name}/index.tsx`];
        
        if (!page) {
            throw new Error(`No se pudo encontrar la página: ./pages/${name}.tsx en el directorio.`);
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