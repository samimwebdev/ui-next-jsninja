import tailwindcssAnimate from 'tailwindcss-animate'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Extended color palette for ninja theme
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },

        // Custom ninja colors
        ninja: {
          gold: 'hsl(42 100% 65%)',
          orange: 'hsl(18 100% 68%)',
          navy: 'hsl(215 32% 15%)',
          blue: 'hsl(199 95% 58%)',
          purple: 'hsl(270 80% 70%)',
          green: 'hsl(142 80% 50%)',
          'dark-navy': 'hsl(215 35% 8%)',
          'light-gold': 'hsl(42 90% 88%)',
        },

        'ninja-gold': {
          light: '#b45309', // Darker for light mode
          DEFAULT: '#f59e0b',
          dark: '#fbbf24', // Lighter for dark mode
        },
        'ninja-orange': {
          light: '#c2410c', // Darker for light mode
          DEFAULT: '#f97316',
          dark: '#fb923c', // Lighter for dark mode
        },

        // Or add amber variants for links
        link: {
          light: '#b45309', // Dark amber for light mode
          DEFAULT: '#f59e0b',
          dark: '#fbbf24', // Light gold for dark mode
        },

        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // Enhanced animations for ninja theme
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

        // Ninja-specific animations
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.6s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite alternate',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },

      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        // Ninja-specific keyframes
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px hsl(42 100% 65% / 0.3)' },
          to: { boxShadow: '0 0 30px hsl(42 100% 65% / 0.6)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px hsl(42 100% 65% / 0.3)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 20px hsl(42 100% 65% / 0.6)',
            transform: 'scale(1.02)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      // Background gradients
      backgroundImage: {
        'gradient-ninja-primary':
          'linear-gradient(135deg, hsl(42 100% 65%) 0%, hsl(18 100% 68%) 100%)',
        'gradient-ninja-reverse':
          'linear-gradient(135deg, hsl(18 100% 68%) 0%, hsl(42 100% 65%) 100%)',
        'gradient-ninja-dark':
          'linear-gradient(135deg, hsl(215 35% 8%) 0%, hsl(215 28% 16%) 100%)',
        'gradient-sunset':
          'linear-gradient(135deg, hsl(42 100% 65%) 0%, hsl(18 100% 68%) 50%, hsl(340 100% 70%) 100%)',
        'gradient-ocean':
          'linear-gradient(135deg, hsl(199 95% 58%) 0%, hsl(270 80% 70%) 100%)',
        'gradient-forest':
          'linear-gradient(135deg, hsl(142 80% 50%) 0%, hsl(160 70% 45%) 100%)',
        'gradient-cyber':
          'linear-gradient(135deg, hsl(280 80% 70%) 0%, hsl(199 95% 58%) 100%)',
        'gradient-ninja-animated':
          'linear-gradient(45deg, hsl(42 100% 65%), hsl(18 100% 68%), hsl(199 95% 58%), hsl(270 80% 70%))',

        // New gradients for authentication and hero sections
        'gradient-auth-light':
          'linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(240 5% 96%) 30%, hsl(42 100% 95%) 100%)',
        'gradient-auth-dark':
          'linear-gradient(135deg, hsl(220 13% 9%) 0%, hsl(215 28% 12%) 30%, hsl(42 50% 15%) 100%)',
        'gradient-auth-light-enhanced':
          'linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(220 30% 95%) 25%, hsl(42 80% 92%) 75%, hsl(18 60% 90%) 100%)',
        'gradient-auth-dark-enhanced':
          'linear-gradient(135deg, hsl(222 84% 5%) 0%, hsl(220 13% 9%) 25%, hsl(215 28% 12%) 75%, hsl(42 20% 8%) 100%)',
        'gradient-hero-overlay':
          'linear-gradient(135deg, transparent 0%, hsl(var(--primary) / 0.05) 50%, transparent 100%)',
      },

      // Box shadows for glow effects
      boxShadow: {
        'glow-ninja-gold': '0 0 20px hsl(42 100% 65% / 0.5)',
        'glow-ninja-orange': '0 0 20px hsl(18 100% 68% / 0.5)',
        'glow-ninja-blue': '0 0 20px hsl(199 95% 58% / 0.5)',
        'glow-ninja-purple': '0 0 20px hsl(270 80% 70% / 0.5)',
        'glow-soft': '0 0 15px hsl(42 100% 65% / 0.3)',
        'glow-strong': '0 0 30px hsl(42 100% 65% / 0.7)',
      },

      // Typography enhancements
      fontFamily: {
        sans: ['Hind Siliguri', 'Helvetica', 'sans-serif'],
      },

      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Backdrop blur utilities
      backdropBlur: {
        xs: '2px',
      },

      // Custom z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Screen breakpoints
      screens: {
        xs: '475px',
        '3xl': '1680px',
      },

      // Container customization
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },

  plugins: [
    tailwindcssAnimate,

    // Custom plugin for ninja utilities
    plugin(({ addUtilities }) => {
      const newUtilities = {
        // Text gradient utilities
        '.text-gradient-ninja': {
          background:
            'linear-gradient(135deg, hsl(42 100% 65%) 0%, hsl(18 100% 68%) 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-cyber': {
          background:
            'linear-gradient(135deg, hsl(199 95% 58%) 0%, hsl(270 80% 70%) 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-rainbow': {
          background:
            'linear-gradient(45deg, hsl(42 100% 65%), hsl(18 100% 68%), hsl(340 100% 70%), hsl(270 80% 70%), hsl(199 95% 58%))',
          'background-size': '200% 200%',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          animation: 'gradientShift 3s ease infinite',
        },

        // Glass effect utilities (fixed rgba -> hsla)
        '.glass-ninja': {
          background: 'hsla(42, 100%, 65%, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid hsla(42, 100%, 65%, 0.2)',
        },
        '.glass-dark': {
          background: 'hsla(215, 35%, 8%, 0.7)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid hsla(215, 25%, 22%, 0.5)',
        },

        // Border gradient utilities
        '.border-gradient-ninja': {
          border: '2px solid transparent',
          background:
            'linear-gradient(hsl(var(--background)), hsl(var(--background))) padding-box, linear-gradient(135deg, hsl(42 100% 65%), hsl(18 100% 68%)) border-box',
        },

        // Custom component classes
        '.btn-ninja-primary': {
          background:
            'linear-gradient(135deg, hsl(42 100% 65%) 0%, hsl(18 100% 68%) 100%)',
          color: 'hsl(215 32% 15%)',
          fontWeight: '600',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px hsl(42 100% 65% / 0.5)',
          },
        },
        '.btn-ninja-primary-large': {
          background:
            'linear-gradient(135deg, hsl(42 100% 65%) 0%, hsl(18 100% 68%) 100%)',
          color: 'hsl(215 32% 15%)',
          fontWeight: '600',
          padding: '1.75rem 3rem',
          borderRadius: '9999px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px hsl(42 100% 65% / 0.5)',
          },
        },
        '.btn-ninja-secondary': {
          background: 'transparent',
          border: '2px solid transparent',
          backgroundImage:
            'linear-gradient(hsl(var(--background)), hsl(var(--background))), linear-gradient(135deg, hsl(42 100% 65%), hsl(18 100% 68%))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          color: 'hsl(42 100% 65%)',
          fontWeight: '600',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            background:
              'linear-gradient(135deg, hsl(42 100% 65%) 0%, hsl(18 100% 68%) 100%)',
            color: 'hsl(215 32% 15%)',
            transform: 'scale(1.05)',
          },
        },
      }

      addUtilities(newUtilities)
    }),
  ],
} satisfies Config
