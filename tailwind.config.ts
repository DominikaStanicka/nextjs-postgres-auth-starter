import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  theme: {
    extend: {
      colors: {
        customBlue: "#6661F0",
        customPurple: "#A867F8",
        customViolet: "#8E37EA",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
