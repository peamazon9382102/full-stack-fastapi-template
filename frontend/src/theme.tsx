import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      fontSize: "16px",
    },
    body: {
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    },
    ".main-link": {
      color: "ui.main",
      fontWeight: "bold",
    },
    "html.green": {
      // Direct overrides for body under html.green
      // These are applied to the html tag if components use "inherit"
      // but let's also target body specifically.
      "&": { // This refers to html.green itself
        "--chakra-colors-body-bg": "#f0fff4",
        "--chakra-colors-body-text": "#22543d",
        "--chakra-colors-heading-color": "#22543d",
        "--chakra-colors-link-color": "#38a169",

        // Palette scale overrides
        "--chakra-colors-gray-50": "#f0fff4",
        "--chakra-colors-gray-100": "#c6f6d5",
        "--chakra-colors-gray-200": "#9ae6b4",
        "--chakra-colors-brand-50": "#e6fffa",
        "--chakra-colors-brand-100": "#c6f6d5",
        "--chakra-colors-brand-200": "#9ae6b4",
        "--chakra-colors-brand-300": "#68d391",
        "--chakra-colors-brand-400": "#48bb78",
        "--chakra-colors-brand-500": "#38a169",
        "--chakra-colors-brand-600": "#2f855a",
        "--chakra-colors-brand-700": "#276749",
        "--chakra-colors-brand-800": "#22543d",
        "--chakra-colors-brand-900": "#1c4532",
        "--chakra-colors-chakra-border-color": "#9ae6b4",
        "--chakra-colors-chakra-placeholder-color": "#2f855a",
        "--chakra-shadows-outline": "0 0 0 3px rgba(56, 161, 105, 0.6)",
      },
      // Specific override for body's actual background and color
      "body": {
        "background-color": "#f0fff4 !important", // Light green background
        "color": "#22543d !important",            // Dark green text
      }
    },
  },
  theme: {
    tokens: {
      colors: {
        ui: {
          main: { value: "#009688" },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
})
