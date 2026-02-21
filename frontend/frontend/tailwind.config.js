/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'cyber-dark': 'var(--bg-primary)',
        'cyber-darker': 'var(--bg-tertiary)',
        'cyber-card': 'var(--bg-secondary)',

        // Accent colors (Indigo Sapphire theme)
        'neon-indigo': 'var(--accent-indigo)',
        'neon-sapphire': 'var(--accent-sapphire)',
        'neon-violet': 'var(--accent-violet)',
        'neon-blue': 'var(--accent-blue)',

        // Text colors
        'slate': {
          400: '#94a3b8',
          500: '#64748b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
        'glow-sapphire': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
        'glow-danger': '0 0 20px rgba(244, 63, 94, 0.4)',
      },
    },
  },
  plugins: [],
};
