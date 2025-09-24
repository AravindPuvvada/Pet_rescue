// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         // Light Mode Palette
//         light: {
//           primary: '#C4D8E2',     // Soft Sky Blue
//           secondary: '#3B5C67',   // Deep Teal Blue
//           accent: '#D7742E',      // Rusty Orange
//           neutral: '#E9DED1',     // Warm Cream Beige
//           text: '#4A3933',        // Charcoal Brown
//         },
//         // Dark Mode Palette
//         dark: {
//           background: '#2B1E1A',  // Charcoal Brown deepened
//           primary: '#2A4048',     // Deep Teal Blue darkened
//           secondary: '#DCE9F0',   // Soft Sky Blue lightened
//           accent: '#C36220',      // Rusty Orange deeper
//           neutral: '#BFAFA2',     // Warm Beige muted
//         }
//       },
//       animation: {
//         'theme-transition': 'theme-transition 0.3s ease-in-out',
//       },
//       keyframes: {
//         'theme-transition': {
//           '0%': { opacity: '0.8' },
//           '100%': { opacity: '1' },
//         }
//       }
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // User Side Palette
        light: {
          primary: '#C4D8E2',
          secondary: '#3B5C67',
          accent: '#D7742E',
          neutral: '#E9DED1',
          text: '#4A3933',
        },
        dark: {
          background: '#2B1E1A',
          primary: '#2A4048',
          secondary: '#DCE9F0',
          accent: '#C36220',
          neutral: '#BFAFA2',
        },

        // Admin Side Palette
        adminLight: {
          background: '#FDF8F5',
          card: '#FFF6F0',
          primary: '#A67C52',
          secondary: '#5B4438',
          accent: '#F78F3F',
          text: '#3E2F25',
        },
        adminDark: {
          background: '#1F1A17',
          card: '#2B2622',
          primary: '#A67C52',
          secondary: '#E5C29F',
          accent: '#F78F3F',
          text: '#EDE3DB',
        },
      },
      animation: {
        'theme-transition': 'theme-transition 0.3s ease-in-out',
      },
      keyframes: {
        'theme-transition': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
