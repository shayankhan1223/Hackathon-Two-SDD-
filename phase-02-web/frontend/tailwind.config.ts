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
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          light: "#DBEAFE",
        },
        success: {
          DEFAULT: "#10B981",
          hover: "#059669",
          light: "#D1FAE5",
        },
        error: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
          light: "#FEE2E2",
        },
      },
    },
  },
  plugins: [],
};

export default config;
