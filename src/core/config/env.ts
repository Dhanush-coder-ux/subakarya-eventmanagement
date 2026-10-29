export const env = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.subakarya.com/v1',
  appName: 'Subakarya',
  appVersion: '1.0.0',
};

