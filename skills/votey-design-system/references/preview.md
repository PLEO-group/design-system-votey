# Preview i dokumentacja Votey

Preview to Storybook oparty o React Vite, skonfigurowany w `.storybook/main.js` i
`.storybook/preview.jsx`; komenda builda to `npm run build-storybook`. Stories są
w `storybook/**`, a Angularowe komponenty są montowane w rzeczywistym hoście
`vt-*`, aby scoped style działały tak samo jak u konsumenta.

Dokumentuj publiczny komponent w `ANGULAR COMPONENTS/<Name>` przez interaktywny
`Playground`; kontrolki obejmują sensowne inputy, outputy są actions, a osobna
historia powstaje tylko dla zachowania niewyrażalnego kontrolkami. Nie utrzymuj
ręcznej listy assetów, jeśli generator tworzy katalog lub typy.

Preview udostępnia theme, viewporty CRM `360`, `375`, `768`, `1024`, `1280`, `1920`
i toolbar device. Przed zamknięciem zmiany wykonaj build, a dla zmian UI smoke test:
render, console, keyboard/focus, eventy, default/required states, theme, viewport,
overflow i brak wycieku Angularowych styli do historii Reactowych.
