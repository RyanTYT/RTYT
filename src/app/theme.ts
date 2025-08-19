export const theme = {
    // Color palette
    colors: {
        primary: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
        },
        slate: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
        },
        emerald: {
            500: "#10b981",
            600: "#059669",
        },
        amber: {
            500: "#f59e0b",
        },
        white: "#ffffff",
        transparent: "transparent",
    },

    // Typography scale
    typography: {
        fontFamily: {
            sans: ["Inter", "system-ui", "sans-serif"],
            mono: ["JetBrains Mono", "monospace"],
        },
        fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
            "5xl": "3rem",
            "6xl": "3.75rem",
        },
        fontWeight: {
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
        },
        lineHeight: {
            tight: "1.25",
            normal: "1.5",
            relaxed: "1.625",
        },
    },

    // Spacing scale
    spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
    },

    // Border radius
    borderRadius: {
        sm: "0.125rem",
        base: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
    },

    // Shadows
    shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },

    // Transitions
    transitions: {
        fast: "150ms ease-in-out",
        normal: "300ms ease-in-out",
        slow: "500ms ease-in-out",
    },
};

// Component style generators
export const createStyles = (theme?: any) => ({
    // Layout utilities
    layout: {
        container: `max-w-7xl mx-auto px-6`,
        article: `max-w-3xl mx-auto px-4 py-16`,
        section: `py-20`,
        grid: {
            twoMd: `grid md:grid-cols-2 gap-8`,
            twoLg: `grid lg:grid-cols-2 gap-12`,
            three: `grid lg:grid-cols-3 gap-12`,
            responsive: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`,
        },
    },

    // Typography components
    typography: {
        h1: `text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight`,
        h2: `text-3xl lg:text-4xl font-bold text-slate-900 mb-4`,
        h3: `text-2xl font-bold text-slate-900 mb-6`,
        h4: `text-xl font-semibold text-slate-900`,
        h5: `text-sm font-semibold text-slate-900`,
        body: `text-slate-700 leading-relaxed`,
        bodyTight: `text-slate-700`,
        bodyLarge: `text-xl text-slate-600 leading-relaxed`,
        muted: `text-slate-600`,
        small: `text-sm text-slate-500`,
    },

    // Interactive components
    buttons: {
        primary: `inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors duration-300 group cursor-pointer`,
        secondary: `inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-300 cursor-pointer`,
        ghost: `inline-flex items-center justify-center px-4 py-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors duration-300 cursor-pointer`,
    },

    // Card components
    cards: {
        base: `bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300`,
        interactive: `group relative bg-white border border-slate-200 rounded-lg p-6 hover:shadow-xl transition-all duration-500 hover:border-sky-300 cursor-pointer`,
        elevated: `bg-white rounded-2xl p-8 shadow-xl border border-slate-200`,
    },

    // Link components
    links: {
        primary: `text-sky-600 hover:text-sky-700 transition-colors duration-300`,
        secondary: `text-slate-600 hover:text-sky-600 transition-colors duration-300`,
        muted: `text-slate-500 hover:text-slate-700 transition-colors duration-300`,
        footer: `text-slate-400 hover:text-white-700 transition-colors duration-300`,
    },

    // Form components
    inputs: {
        base: `w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors duration-300`,
        textarea: `w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none transition-colors duration-300`,
    },

    // Status components
    badges: {
        default: `px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full font-medium`,
        primary: `px-3 py-1 bg-sky-100 text-sky-800 text-sm rounded-full font-medium`,
        success: `px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full font-medium`,
        warning: `px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium`,
    },

    // Tags and labels
    tags: {
        default: `px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded font-medium`,
        // category: `px-2 py-1 text-xs text-slate-700 font-medium rounded-full bg-blue-100 border border-blue-200 shadow-lg`,
        category_default: `px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full font-medium border border-blue-200`,
        category: `px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium border border-blue-200`,
        secondary: `px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium`,
        with_icon: `inline-flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-full text-sm font-medium mb-6`,
    },

    // Navigation components
    navigation: {
        bar: `relative z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0`,
        link: `text-slate-600 hover:text-sky-600 transition-colors duration-300 font-medium`,
        linkActive: `text-sky-600 font-medium`,
        brand: `text-xl font-bold text-slate-900`,
    },

    // Utility classes
    utilities: {
        dot: `w-2 h-2 rounded-full`,
        dotPrimary: `w-2 h-2 bg-sky-600 rounded-full mr-3`,
        dotList: `w-2 h-2 bg-slate-600 rounded-full mr-3`,
        dotSuccess: `w-2 h-2 bg-emerald-600 rounded-full mr-3`,
        flexCenter: `inline-flex items-center justify-center`,
        flexBetween: `flex items-center justify-between`,
        textCenter: `text-center`,
        srOnly: `sr-only`,
        backgroundOverlay: `absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`,
    },
});

// Responsive utilities
export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
};

// Animation utilities
export const animations = {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    slideDown: "animate-slide-down",
    scaleIn: "animate-scale-in",
    spin: "animate-spin",
};

// Icon utilities
export const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
};

export default theme;
