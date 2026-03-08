import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  let env = {};
  try {
    env = loadEnv(mode, process.cwd(), '');
  } catch {
    // Fallback trong môi trường bị hạn chế quyền đọc file .env
  }

  const rawApiProxyTarget =
    env.VITE_API_PROXY_TARGET ||
    process.env.VITE_API_PROXY_TARGET ||
    'http://127.0.0.1:4000';
  const apiProxyTarget = rawApiProxyTarget.replace(
    '://localhost',
    '://127.0.0.1'
  );

  console.log('[vite] /api proxy target =', apiProxyTarget);

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});

