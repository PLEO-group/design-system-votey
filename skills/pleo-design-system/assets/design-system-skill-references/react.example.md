# React

- Entry point: `<package/react>`
- Token/SCSS/Tailwind outputs: `<public paths>`
- SVG exports: `<entry points/aliases>`
- Theme integration: `<imports/runtime>`
- Responsive/grid ownership: `<package/consumer>`
- Component source/public API: `<paths or local primitives>`
- Next/bundler integration: `<configuration>`

## Isolation and validation

Kod React/Next, Tailwind, komponenty i zależności frameworka nie mogą przeciekać
do Angular entry pointu. Podaj dokładne komendy build/test/pack i smoke test.
