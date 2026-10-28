/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#7F011F',
          dark: '#650019',
          light: '#941B34',
          soft: '#FBF0F2',
          hover: '#6E011B',
        },
        sand: {
          DEFAULT: '#F5EBD0',
          light: '#FAF5E8',
          tint: '#EFE3C3',
          dark: '#E2D3B3',
        },
        surface: {
          DEFAULT: '#FFFCF6',
          card: '#FFFFFF',
          muted: '#F8F4EC',
        },
        border: {
          DEFAULT: '#E6DCCB',
          light: '#F0E8D9',
          dark: '#D5C7B0',
        },
        charcoal: {
          DEFAULT: '#282326',
          muted: '#77716D',
          light: '#9E9894',
        },
        success: {
          DEFAULT: '#2D6A4F',
          light: '#E8F5E9',
          dark: '#1B4332',
        },
        error: {
          DEFAULT: '#8B1E1E',
          light: '#FDECEC',
          dark: '#641010',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(40, 35, 38, 0.04)',
        'card': '0 4px 20px -2px rgba(40, 35, 38, 0.06)',
        'elevated': '0 10px 30px -4px rgba(101, 0, 25, 0.08)',
        'dropdown': '0 8px 24px -4px rgba(40, 35, 38, 0.12)',
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '10px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
}
