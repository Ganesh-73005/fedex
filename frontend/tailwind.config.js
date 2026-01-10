/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'var(--radius-xl)',
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    hover: 'hsl(var(--primary-hover))',
                    light: 'hsl(var(--primary-light))',
                    muted: 'hsl(var(--primary-muted))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                    light: 'hsl(var(--success-light))'
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))',
                    light: 'hsl(var(--warning-light))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                    light: 'hsl(var(--destructive-light))'
                },
                info: {
                    DEFAULT: 'hsl(var(--info))',
                    foreground: 'hsl(var(--info-foreground))',
                    light: 'hsl(var(--info-light))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                nav: {
                    DEFAULT: 'hsl(var(--nav-bg))',
                    foreground: 'hsl(var(--nav-foreground))',
                    accent: 'hsl(var(--nav-accent))',
                    muted: 'hsl(var(--nav-muted))'
                },
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                    6: 'hsl(var(--chart-6))'
                }
            },
            boxShadow: {
                'card': 'var(--shadow-card)',
                'card-hover': 'var(--shadow-card-hover)',
                'enterprise': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
                'enterprise-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'slide-in-right': {
                    from: { transform: 'translateX(100%)' },
                    to: { transform: 'translateX(0)' }
                },
                'slide-in-left': {
                    from: { transform: 'translateX(-100%)' },
                    to: { transform: 'translateX(0)' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'scale-in': {
                    from: { transform: 'scale(0.95)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' }
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(11, 95, 255, 0.4)' },
                    '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(11, 95, 255, 0)' },
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(11, 95, 255, 0)' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-in-left': 'slide-in-left 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
                'pulse-ring': 'pulse-ring 2s infinite',
                'shimmer': 'shimmer 2s linear infinite'
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
