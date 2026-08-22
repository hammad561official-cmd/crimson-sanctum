import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// Vite configuration for Crimson Sanctum.
// tsconfigPaths reads the "@/*" alias straight from tsconfig.json so the
// alias is defined in exactly one place instead of duplicated here.
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        target: 'es2022',
        // Split heavy 3D/animation vendors into their own chunks so the
        // initial JS payload (loading screen + hero shell) stays lean.
        // Actual 3D *scene* components are also dynamically imported
        // (React.lazy) at the component level — this chunking covers the
        // underlying libraries.
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                    motion: ['framer-motion'],
                    audio: ['howler'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        port: 5173,
        open: true,
    },
});
