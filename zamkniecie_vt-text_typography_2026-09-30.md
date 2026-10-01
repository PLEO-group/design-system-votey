# Zamknięcie — vt-text i typografia (2026-09-30)

## Metryka
- Wariant: DELTA
- Czat rozpoczęty: 2026-09-30 · stan wiedzy na: 2026-09-30 · wygenerowano: 2026-09-30T16:32:01+02:00
- Repozytorium: `C:\ProjektyAngular\design-system-votey`
- Ostatni commit sesji: `8b15fa2c46bac55f1b6462fb7533fb2a6ba92e53` (`WYBOREK-3095`)
- Plik jednorazowy. Po przyjęciu przez pipeline można go usunąć.

## Delty do kanonu

### D1 · Publikacja npm 1.0.180 i numerowanie workflow
- **Cel:** `package.json`, `.github/workflows/npm-publish.yml`, dokumentacja procesu wydawniczego projektu.
- **Typ:** fakt projektowy / pozycja do kolejki.
- **Treść (dokładne brzmienie do wstawienia):**
  > Workflow `npm-publish.yml` po pushu do `main` wykonuje `npm version patch --no-git-tag-version`, następnie `npm publish --access public`, a dopiero potem commit i push nowej wersji. Log uruchomienia dla commita `0e73904151b29f7a9fadc462e43a9434deeb30ca` potwierdza `+@pleodigital/design-system-votey@1.0.180` oraz udany commit `chore(release): new version 1.0.180`. npm wypisał, że paczka jest przetwarzana i może być dostępna po kilku minutach. Bezpośrednio po tym uruchomieniu `npm view` nadal zwracał `latest: 1.0.179`, a wersja `1.0.180` zwracała 404. Nie uruchamiać kolejnego workflow wyłącznie w celu wymuszenia propagacji; po dłuższym opóźnieniu przekazać log publikacji do npm support. Nie traktować wersji `1.0.179` w lokalnym checkoutcie jako dowodu nieudanej publikacji.
- **Miejsce wstawienia:** dokumentacja procesu release, jeśli projekt ją posiada; nie zmieniać workflow bez osobnej decyzji.
- **Dowód z sesji:** log GitHub Actions ze screenshotu użytkownika, `npm view` wykonane po publikacji, zawartość `.github/workflows/npm-publish.yml`.
- **Pewność:** wysoka.

### D2 · Aktualne role typografii semantycznej
- **Cel:** `tokens/type/semantic/*.json`, `angular/src/lib/text/votey-text.component.ts`, `angular/src/lib/text/votey-text.component.scss`.
- **Typ:** reguła potwierdzona.
- **Treść (dokładne brzmienie do wstawienia):**
  > Aktualne role typografii to `action`, `action-s` i `column-header`. Historyczne role `button`, `button-small` i `table-header` zostały usunięte z aktualnych tokenów po synchronizacji z Figmą. Zgodność wartości została potwierdzona w historii tokenów: `button` → `action` (600/16/21), `button-small` → `action-s` (800/11/15), `table-header` → `column-header` (600/14/18). Nie implementować tego jako aliasów starych nazw.
- **Miejsce wstawienia:** kontrakt typografii komponentu `vt-text` i dokumentacja tokenów semantycznych.
- **Dowód z sesji:** historia commitów tokenów i porównanie plików `Desktop 1920.json` przed/po synchronizacji.
- **Pewność:** wysoka.

### D3 · Publiczne warianty `vt-text`
- **Cel:** `angular/src/lib/text/votey-text.component.ts`, `angular/src/lib/text/votey-text.component.scss`, `angular/src/lib/pagination/votey-pagination.component.html`, `tests/angular-package.test.js`, wygenerowany `dist/angular/**`.
- **Typ:** zmiana kontraktu publicznego.
- **Treść (dokładne brzmienie do wstawienia):**
  > `VoteyTextVariants` oraz lista wariantów SCSS zawierają `action`, `action-s`, `column-header` zamiast `button`, `button-small`, `table-header`. Style mapują wariant bezpośrednio na `--typo-<wariant>-*`; nie ma mapy aliasów. Użycie paginacji zmieniono z `variant="button-small"` na `variant="action-s"`. Zaktualizowano oczekiwania eksportu Angulara i wygenerowany artefakt `dist`.
- **Miejsce wstawienia:** kontrakt wariantów oraz migracja konsumentów.
- **Dowód z sesji:** commit `8b15fa2` i kontrolny skan SCSS/HTML.
- **Pewność:** wysoka.

### D4 · Walidacja `maxLines`
- **Cel:** `angular/src/lib/text/votey-text.component.ts` oraz testy/preview `vt-text`.
- **Typ:** reguła potwierdzona.
- **Treść (dokładne brzmienie do wstawienia):**
  > `maxLines` normalizuje się do dodatniej liczby całkowitej bezpiecznej (`Number.isSafeInteger(lines) && lines > 0`). Wartości `0`, ujemne, dodatnie ułamki, `Infinity` i wartości nieliczbowe normalizują się do `0`, więc nie aktywują clampu. `lineClampEnabled` pozostaje zależne od `!wrap()` i znormalizowanego limitu. Obecny kontrakt naturalnego zawijania przy `wrap=false` oraz renderowania `span` dla h1–h5 pozostaje bez zmian.
- **Miejsce wstawienia:** opis inputu `maxLines` i testy komponentu.
- **Dowód z sesji:** implementacja transformera i historie Storybooka dla wartości granicznych.
- **Pewność:** wysoka.

### D5 · Storybook `vt-text` jako źródło publicznych opcji
- **Cel:** `storybook/stories/angular/Text.stories.jsx`, `storybook/stories/ResponsiveTokens.stories.jsx`, `storybook/stories/angular/Button.stories.scss`.
- **Typ:** reguła potwierdzona.
- **Treść (dokładne brzmienie do wstawienia):**
  > Storybook `Text` pobiera opcje z eksportowanych `VoteyTextVariants` i `VoteyTextColors`, w tym kolor `error`; nie buduje list z prywatnych nazw tokenów. Storybook tokenów używa etykiet `action`, `action-s`, `column-header`. Plansza Button używa `--typo-action-font-size` i `--typo-action-line-height`, bez `--typo-button-*`.
- **Miejsce wstawienia:** historie `Text`, `ResponsiveTokens` i `Button`.
- **Dowód z sesji:** diff commit `8b15fa2` oraz skan SCSS/HTML.
- **Pewność:** wysoka.

### D6 · Pokrycie przeglądarkowe i pozostała weryfikacja
- **Cel:** `storybook/stories/angular/Text.stories.jsx`, `storybook/stories/angular/Text.stories.scss`, testy uruchamiane przez projektowy runner.
- **Typ:** fakt projektowy / pozycja do kolejki.
- **Treść (dokładne brzmienie do wstawienia):**
  > Historie `BrowserChecksMobile` i `BrowserChecksDesktop` sprawdzają tekst, liczbę, zero, null, undefined, literalny HTML, modyfikatory, naturalne zawijanie, długi ciąg bez spacji, clamp, relację wrap–maxLines, warianty aktualnych ról, kolor error oraz motywy light/dark. Przed publikacją uruchomić właściwy build paczki i build Storybooka oraz zweryfikować te historie w przeglądarce. W tej sesji nie uruchomiono builda ani testów przeglądarkowych; nie traktować ich jako zweryfikowanych. Rozważyć dodanie wykonywalnej macierzy testów DOM, jeśli runner projektu ją obsługuje.
- **Miejsce wstawienia:** checklista weryfikacji komponentu `vt-text`.
- **Dowód z sesji:** dodane historie Storybooka; ograniczenie wynika z instrukcji uruchamiania testów bez jawnej zgody.
- **Pewność:** średnia.

## Kolejka prac (pomysły odłożone)
- Uruchomić build paczki, testy Angulara i build Storybooka po zmianie publicznych wariantów.
- Wykonać smoke test `Text` w 360 px i 1920 px dla light/dark oraz potwierdzić brak błędów konsoli.
- Jeśli runner to umożliwia, dodać pełną wykonywalną macierz DOM dla treści tekst/liczba/zero/null/undefined, literalnego HTML, modyfikatorów i relacji wrap–maxLines.
- Po potwierdzeniu stanu npm sprawdzić dostępność `@pleodigital/design-system-votey@1.0.180`; kolejny zwykły release powinien wynikać z aktualnego `package.json` na `main`, nie z ręcznego wymuszania numeru.

## Zapisane trwale w tej sesji (kategoria A — informacyjnie)
- Zmiany komponentu, Storybooka, paginacji, testu eksportów i wygenerowanego `dist` są zapisane w commicie `8b15fa2c46bac55f1b6462fb7533fb2a6ba92e53`.
- Repozytorium było czyste po tym commicie; lokalny `package.json` ma wersję `1.0.179`.

## Pobrane z tego czatu (kategoria B — checklista użytkownika)
- Brak dodatkowych artefaktów do pobrania poza tym plikiem zamknięcia.
