# Konsumenci Votey

## Instalacja prywatnej paczki

`@pleodigital/design-system-votey` jest publikowany w `https://registry.npmjs.org/`
z ograniczonym dostępem. Instalacja i `npm ci` wymagają tokenu npm z prawem
odczytu paczki. W CI ustaw sekret `NPM_TOKEN`; w Bitbucket dodaj go jako
zabezpieczoną zmienną repozytorium `NPM_TOKEN`. Wartość pozostaje sekretem
CI i nie może trafić do pliku ani logów.

Projektowy `.npmrc` może zawierać odwołanie do zmiennej środowiskowej:

```ini
@pleodigital:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

W Bitbucket można też utworzyć `~/.npmrc` przed `npm ci` z tokenu
`NPM_TOKEN`. Sprawdź dostęp poleceniem
`npm view @pleodigital/design-system-votey version --registry=https://registry.npmjs.org/`.
Odpowiedź `404` może oznaczać brak uprawnień do prywatnej paczki albo niedostępną
wersję; potwierdź dostęp tokenu i opublikowaną wersję.

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

### Weryfikacja konsumenta po zmianie runtime'u paczki

Gdy zadanie obejmuje sprawdzenie lub integrację poprawki runtime'u w konsumencie,
nie uznawaj go za aktualny tylko dlatego, że korzysta ze zgodnego API. Sprawdź
deklarację zależności w `package.json`, lockfile i wersję faktycznie zainstalowaną
w `node_modules`. Jeśli konsument używa lokalnego archiwum `file:`, zbuduj i spakuj
bieżącą paczkę DS zgodnie z jej workflow, zaktualizuj zależność konsumenta oraz
lockfile do tego archiwum, zainstaluj je i uruchom build wskazany w tabeli powyżej.
Rozdziel wynik oceny kompatybilności API od potwierdzenia, że konsument uruchamia
artefakt zawierający poprawkę. Zmiany w repozytorium konsumenta wprowadzaj tylko,
gdy jego aktualizacja mieści się w zakresie zadania.

Przy aktywnej migracji release candidate utwórz w root aplikacji
`.tmp/design-system-consumer-migration.md`, powiąż inventory i waliduj plany przed
publikacją. Nie publikuj pakietu tylko dlatego, że plan migracji został utworzony.
