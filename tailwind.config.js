/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                // Custom color palette
                'app-bg': 'var(--background)',
                'app-foreground': 'var(--foreground)',
                'app-primary': 'var(--primary)',
                'app-primary-light': 'var(--primary-light)',
                'app-secondary': 'var(--secondary)',
                'app-accent': 'var(--accent)',
                'app-card': 'var(--card-bg)',
                'app-sidebar': 'var(--sidebar-bg)',
                'app-success': 'var(--success)',
                'app-warning': 'var(--warning)',

                // Semantic colors using the app colors
                'neutral': {
                    50: 'var(--accent)',
                    100: 'var(--secondary)',
                    200: 'var(--secondary)',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: 'var(--foreground)',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827'
                },
                'primary': {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: 'var(--primary)',
                    600: 'var(--primary-light)',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e'
                }
            },
        },
    },
    plugins: [],
} 