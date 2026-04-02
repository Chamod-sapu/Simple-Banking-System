/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677ff',
          hover: '#4096ff',
          active: '#0958d9',
        },
        sidebar: '#001529',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        premium: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable core preflight to avoid conflicts with Ant Design
  },
}
