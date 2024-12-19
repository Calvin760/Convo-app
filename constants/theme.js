// theme.js
const theme = {
    colors: {
        primary: "#1DA1F2", // Main brand color (e.g., Twitter blue)
        secondary: "#14171A", // Dark mode background
        accent: "#FFAD1F", // Highlight or accent color
        lightGrey: "#D3D3D3",
        background: {
            light: "#FFFFFF", // Light mode background
            dark: "#000000", // Dark mode background
            card: "#F5F8FA", // Card or post background
        },
        text: {
            primary: "#14171A", // Main text
            secondary: "#657786", // Subtext
            link: "#1DA1F2", // Hyperlink color
            light: "#FFFFFF", // Text on dark backgrounds
        },
        danger: "#E0245E", // For error messages or alerts
        success: "#17BF63", // For success messages
        warning: "#FFCC00", // For warnings
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        fontSizes: {
            small: "12px",
            medium: "16px",
            large: "20px",
            xLarge: "24px",
        },
        fontWeights: {
            regular: 400,
            medium: 500,
            bold: 700,
            extraBold: '800',
        },
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
    },
    borderRadius: {
        small: "4px",
        medium: "8px",
        large: "16px",
    },
    shadows: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
        hover: "0 8px 12px rgba(0, 0, 0, 0.15)",
        inset: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
    },
};

export default theme;
