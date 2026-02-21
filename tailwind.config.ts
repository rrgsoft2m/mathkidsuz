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
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#4F46E5",
                secondary: "#10B981",
                accent: "#F59E0B"
            },
            fontFamily: {
                sans: ["var(--font-baloo)"],
            }
        },
    },
    plugins: [],
};
export default config;
