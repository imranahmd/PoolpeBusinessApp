// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      animation: {
        'slide-in-left': 'slide-in-left 1.5s ease-out',
        'slide-up': 'slideUp 1s ease-out',
        'line': 'line 2s ease-in-out forwards',
        'fade-left-right': 'fade-left-right 1s ease-out forwards',
        'blink': 'blink 6.5s step-end infinite alternate',
        'typewriter': 'typewriter 2s steps(11) infinite, blink 0.7s step-end infinite',
      },
      keyframes: {
        'typewriter': {
          to: {
            left: "100%"
          }
        },

      
        'fade-left-right': {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInWord: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        line: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },

        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '100%': { borderColor: '#000F3B' },
        },
        
      },
    },
  },
  plugins: [],
};
