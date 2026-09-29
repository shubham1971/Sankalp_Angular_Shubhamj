/**
 * Centralised Angular dev-server proxy configuration.
 *
 * The frontend only ever calls RELATIVE paths (e.g. "/api/..."). The Vite-based
 * Angular dev server forwards those requests here to the real backend.
 * Change ONLY the BACKEND target below when your API moves.
 *
 * `secure: false` is required because your backend runs on HTTPS with a
 * self-signed localhost certificate.
 */
const BACKEND_TARGET = 'https://localhost:7131';

const proxyOptions = {
  changeOrigin: true,
  secure: false,
  logLevel: 'debug'
};

export default {
  // ---- All REST API calls ---------------------------------------------
  '/api': {
    target: BACKEND_TARGET,
    ...proxyOptions
  },

  // ---- Gallery / uploaded images (served by the backend) ---------------
  '/uploads': {
    target: BACKEND_TARGET,
    ...proxyOptions
  },
  '/static': {
    target: BACKEND_TARGET,
    ...proxyOptions
  },
  '/images': {
    target: BACKEND_TARGET,
    ...proxyOptions
  }
};