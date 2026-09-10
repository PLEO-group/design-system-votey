# Konsumenci Votey

Kanoniczne manifesty konsumentów nie są jeszcze zarejestrowane w manifeście
pakietu (`consumerRoots` jest puste). Nie zgaduj wersji paczki, aliasów ani rootów:
przed zmianą odczytaj `package.json`, manifest konsumenta i faktycznie zainstalowany
publiczny import. Brak manifestu to finding do osobnego procesu, nie zgoda na
utworzenie lokalnego mini-DS.

| Konsument | Framework | Integracja publiczna | Build i smoke test |
| --- | --- | --- | --- |
| `wyborek-crm` | Angular | `@pleodigital/design-system-votey/angular`, `tokens.angular.css`, `provideVoteyDeviceDetection()`, `provideVoteySvgRegistry()` | Co najmniej `npm run build:dev`; przy zmianie kontraktu paczki także build production, target route i `baseHref` assetów |
| `votey-user-app` | React/Next | alias `@votey/*` do React outputu, CSS tokeny light/dark i Tailwind | Najwęższy lint/test, a dla globalnych styli, assetów lub Next boundary `npm run build`; target route, hydration i theme |

Paczka odpowiada za tokeny, assety i Angular runtime; CRM za domenę, bootstrap,
katalog SVG i lokalny layout; PWA za lokalne prymitywy, grid, `rv-*`, viewport,
theme i fonty. Używaj wyłącznie publicznych importów. Upgrade paczki wymaga
sprawdzenia release notes, peer dependencies, asset copy/mapping i smoke testu.

Przy aktywnej migracji release candidate utwórz w root aplikacji
`.tmp/design-system-consumer-migration.md`, powiąż inventory i waliduj plany przed
publikacją. Nie publikuj pakietu tylko dlatego, że plan migracji został utworzony.
