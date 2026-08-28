/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07080D",
        surface: {
          50: "#1A1D2B",
          100: "#141724",
          200: "#0F111C",
          300: "#0B0D16",
          DEFAULT: "#0F111C",
        },
        girionix: {
          cyan: "#00F0FF",
          purple: "#9D4EDD",
          neon: "#7928CA",
          emerald: "#10B981",
          rose: "#FF007A",
          amber: "#F59E0B",
          blue: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(157, 78, 221, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(255, 0, 122, 0.35)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'mesh-dark': 'radial-gradient(at 10% 20%, rgba(157, 78, 221, 0.08) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(0, 240, 255, 0.08) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
