module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [
    require("flowbite/plugin")
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      fontWeight: {
        '570': 570,
      },
      aspectRatio: {
        cinema: "21/9",
        card: "4/3",
      },
      colors: {
        primary: "var(--zmp-primary-color)",
        secondary: "var(--zmp-secondary-color)",
      },
      zIndex: {
        max: "10000",
      },
      border: {
        "border-b-1": "border-bottom-width: 1px",
      },
    },
  },
};
