import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src/',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                dashboard: resolve(__dirname, 'src/dashboard.html'),
                details: resolve(__dirname, 'src/vehicle-details.html')
            }
        }
    }
});