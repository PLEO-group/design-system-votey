import tokens from "./dist/react/tokens/tailwind.tokens.json" with { type: "json" };

export default {
  theme: {
    extend: {
      colors: tokens.color.semantic,
      spacing: {
        ...tokens.spacing.core,
        ...tokens.spacing.semantic,
      },
      borderRadius: {
        ...tokens.radius.core,
        ...tokens.radius.semantic,
      },
    },
  },
};
