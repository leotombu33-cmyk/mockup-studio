/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        linen: '#FAF8F5',
        paper: '#FDFCFB',
        sand: '#F2EFE9',
        ink: '#2C2A29',
        mute: '#5D5A58',
        brand: '#C86F53',
        'brand-deep': '#A04B33',
        veil: '#E6E1DA',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.04)',
        lift: '0 16px 40px rgba(44,42,41,0.10)',
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
}
