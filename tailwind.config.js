/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF9F5',
        card: '#FFF2EA',
        button: '#EB9088',
        buttonsecondary: '#FCEFED',
        textheader: '#db6c63',
        text: '#2F2F2F',
        popup: '#FCEFE8',
        accent: {
          teal: '#6BBBAE',
          blue: '#BDD7F2',
          pink: '#FDB4A0',
          orange: '#FBC48D',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

