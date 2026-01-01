import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    base: './',
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'lucide-react',
          '@google/genai',
          '@reown/appkit',
          '@reown/appkit-adapter-wagmi',
          '@reown/appkit-adapter-solana',
          '@wagmi/core',
          '@wagmi/core/chains',
          'viem',
          '@solana/web3.js'
        ]
      }
    }
  };
});
