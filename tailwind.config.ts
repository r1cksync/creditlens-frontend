import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
        muted: "#F5F5F5",
        "muted-foreground": "#525252",
        border: "#000000",
        "border-light": "#E5E5E5",
        card: "#FFFFFF",
        "card-foreground": "#000000",
        ring: "#000000",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        "7xl": ["6rem", { lineHeight: "1" }],
        "8xl": ["8rem", { lineHeight: "1" }],
        "9xl": ["10rem", { lineHeight: "1" }],
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
      },
      borderWidth: {
        hairline: "1px",
        thin: "1px",
        medium: "2px",
        thick: "4px",
        ultra: "8px",
      },
      boxShadow: {
        none: "none",
        DEFAULT: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
      },
    },
  },
  plugins: [],
};

export default config;
