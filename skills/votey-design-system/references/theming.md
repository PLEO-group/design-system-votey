# Theming Votey

## Kontrakt paczki

Votey generuje semantic modes `light` i `dark` ze źródeł
`tokens/color/semantic-CRM/Light.json` oraz `Dark.json`. Importy i aktywacja
theme należą do konsumenta; paczka nie utrzymuje własnego runtime `ThemeService`.
Aktualny manifest opisuje Angular jako `consumer-owned`, `data-theme` na `html`,
domyślnie `light`, bez persistence i bez view transitions. To nie jest brak
dokumentacji, lecz jawne `not-applicable` dla runtime'u paczki.

## Angular

- Dołącz `@pleodigital/design-system-votey/dist/css/tokens.angular.css` przez
  konfigurację builda konsumenta.
- Ustal theme w bootstrapie lub globalnym ownerze aplikacji, nie w komponencie
  feature. Potwierdź host i inicjalizację w aktualnym manifeście konsumenta.
- Używaj semantic CRM; nie przenoś light/dark arkuszy, klas PWA ani lokalnego
  stanu theme do paczki Angular.
- Po zmianie semantic tokenów sprawdź oba mode, render komponentu, computed
  colors, kontrast i brak flashu przy inicjalizacji runtime konsumenta.

## React / Next

- Zachowaj kolejność globalnych importów PWA: Tailwind, `tokens.css`,
  `tokens.light.css`, `tokens.dark.css`, `tokens.tailwind.css`, potem lokalne
  overlaye.
- `data-theme` na `html` prowadzi owner aplikacji; komponent nie tworzy
  równoległego state'u. Brak pary light/dark to `gap`, nie zgoda na użycie
  koloru CRM albo raw wartości.
- Przetestuj light i dark, hydration, computed values i route docelowego widoku.

Przy zmianie modelu hosta, persistence lub dystrybucji arkuszy eskaluj do
`pleo-design-system`, bo zmienia się kontrakt paczki albo konsumentów.
