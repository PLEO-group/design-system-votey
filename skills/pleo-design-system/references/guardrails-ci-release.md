# Guardraile, CI i release

## Poziomy

### BLOCK

Blokuj deterministyczne naruszenia: nieważny manifest, brak opisu pola w schemie manifestu, nieaktualny wygenerowany typ TypeScript manifestu DS, nieprawidłowy rejestr kontraktów, brak źródłowego skilla DS lub jego obowiązkowej referencji, nieznany pin albo stary kontrakt z polityką `block-on-stale`, jednoczesne użycie `device()` i `breakpoint()` albo użycie mixina niezgodnego z `responsive.mode`, niespójne nazwy breakpointów/device types/fallbacki/mnożniki, brakujący lub osierocony breakpoint/wariant gridu między manifestem i token JSON, brak grid adaptera mimo `responsive.grid.enabled: true`, grid mimo `responsive.grid.enabled: false` lub jednoczesne adaptery device/media, niedeterministyczny/stary output, błąd Style Dictionary, brak outputu, brak jednoznacznej maszynowej klasyfikacji tokenów core/semantic lub kategorii, różne zestawy semantic tokenów light/dark, Angular theme poza `body[data-theme]` i `sessionStorage["theme"]`, brak początkowego light albo jawnego `loadTheme()` w konsumencie, zabroniony token, brak entry pointu, przeciek frameworka, błąd build/test/preview, ręczna lub nieaktualna lista SVG, niezgodna z projektowym kontraktem nazwa tokenu albo niezgodna nazwa/folder/słownictwo SVG, niebezpieczny SVG, kolizja nazwy Angular/React, niespójne registry, brak wymaganej integracji konsumenta albo niezgodny skill DS. Nie twórz findingu wyłącznie dlatego, że projektowy kontrakt nazw tokenów różni się od propozycji z `naming-contracts.md`.

Dla współlokowanej paczki blokuj także: package root pokrywający się z aplikacją, brak własnego `package.json`, względny/deep import DS z konsumenta, import aplikacji przez paczkę, brak `npm pack`, nowy mini-DS poza package root oraz wzrost zamrożonego baseline legacy mini-DS. Dla `embedded-mini-ds` blokuj puste `localMiniDs.justification`, niepustą listę `consumerRoots`, dystrybucję registry oraz drugi lokalny mini-DS poza zadeklarowanym rootem.

### REVIEW_REQUIRED

Wymagaj decyzji człowieka dla podejrzenia mini-DS, lokalnych tokenów/zmiennych, komponentu podobnego do DS, wrappera, ręcznego SVG albo utility layer z możliwym uzasadnieniem domenowym.

Stary pin kontraktu z polityką `review-on-stale` również oznacz jako `REVIEW_REQUIRED`: obecny projekt działa według przypiętej wersji, ale trzeba zdecydować o zakresie i terminie migracji. Nie aktualizuj pinu bez aktualizacji lokalnej referencji i forward-testu.

W czystym projekcie manifest może podnieść heurystyczne znaleziska mini-DS z `REVIEW_REQUIRED` do `BLOCK`. Jest to rekomendowany, restrykcyjny default.

### WARN

Raportuj bez blokowania: kompatybilnie przestarzałą paczkę, dokumentację poza etapem, rekomendowaną migrację i nieoptymalne, ale legalne użycie API.

## CI

Dostarcz warianty GitHub Actions, GitLab CI i Bitbucket Pipelines. Dla nowego DS aktywuj guardraile od początku. Dla istniejącego najpierw zapisz baseline i aktywuj kolejne blokery po osobnych akceptacjach.

Punkty startowe znajdują się w `assets/ci/`. Po skopiowaniu dopasuj ścieżkę walidatora, centralnego rejestru kontraktów, źródłowego skilla z `designSystemSkill.sourcePath`, generatora typu manifestu DS, generatora SVG i jego konfiguracji, obu schem, outputów TypeScript, komendy z manifestu oraz artifact policy. Typ manifestu DS sprawdzaj przez `generate-manifest-types.mjs --check`, a opisy schemy konsumenta przez `generate-manifest-types.mjs --validate-only`; nie twórz typu manifestu konsumenta. Pipeline SVG używa komendy `commands.checkAssets`, a skill `validate-company-standard-contracts.mjs` i `validate-design-system-skill.mjs`.

Responsive config weryfikuj przez `scripts/verify-responsive-config.mjs`. Guard uruchamia manifestowe `commands.buildTokens` dwa razy i blokuje niedeterministyczny wynik. Dla `tracked-intermediate`/`tracked-dist` porównuje także pierwszy wynik z wersją sprzed generowania i blokuje stary lub brakujący output. Dla `build-only` blokuje śledzenie outputu przez Git i dopuszcza brak pliku w czystym checkoutcie: pierwsze generowanie ma go utworzyć, drugie potwierdzić identyczność, a dopiero potem `validate-repository-boundary.mjs` sprawdza jego istnienie i położenie.

Po generatorach zawsze uruchom bezwarunkowe `git diff --exit-code`. Git porówna tylko śledzone pliki, więc nie wymusi commitowania `dist` ani innych outputów `build-only`, a wykryje przypadkowo śledzony, nieaktualny artefakt. Nie uzależniaj tego kroku od istnienia `dist/**`.

## Artifact policy

- `build-only` — default; źródła w Git, czysty build/test/pack/publish w CI.
- `tracked-intermediate` — wybrane outputy w Git; po buildzie wymagaj pustego diffu.
- `tracked-dist` — cały output w Git; po pełnym buildzie wymagaj pustego diffu.

Nie wymagaj lokalnego `dist` przy `build-only`. Zawsze zabraniaj ręcznej edycji outputu.

Minimalna kolejność CI dla konfiguracji responsive:

1. walidacja rejestru kontraktów, manifestu, źródłowego skilla DS, wygenerowanego typu manifestu DS oraz opisów schemy konsumenta;
2. `verify-responsive-config.mjs` (generowanie, kontrola aktualności zależnie od artifact policy i drugi przebieg deterministyczny);
3. walidacja granicy repozytorium;
4. pozostałe generatory, build, test, preview i pack;
5. bezwarunkowy `git diff --exit-code` dla śledzonych outputów.

## Release

Stosuj SemVer i conventional commits. Agent klasyfikuje MAJOR/MINOR/PATCH i generuje release notes; deweloper może skorygować decyzję. Publikacja paczki oraz publikacja zmienionego globalnego rejestru wymagają osobnej zgody użytkownika.

Dla remediacji wygenerowanej po audycie DS przed publikacją finalnego release’u wymagaj:

1. ukończonego i zweryfikowanego etapu stabilizacji kontraktu;
2. zbudowanego artefaktu release candidate (`npm pack` albo odpowiednik);
3. kompletnego inventory oraz analizy wpływu na każdego istniejącego konsumenta, ustalonych z manifestów, `consumers.md` i dostępnego rejestru użyć paczki;
4. osobnej zgody użytkownika na utworzenie planów migracji;
5. `<application-root>/.tmp/design-system-consumer-migration.md` dla każdego konsumenta, ze wspólnym `runId` i linkiem do źródłowego planu DS;
6. statusu `completed` etapu `consumer-migration-plan-generation`.

Brak dostępu do repo konsumenta zatrzymuje generację planów i publikację. Samo utworzenie planu migracji nie pozwala na zmianę aplikacji; jej etapy wymagają osobnych akceptacji. Przed publikacją uruchom `scripts/validate-consumer-migration-plans.mjs --inventory <inventory.json>`; wynik inny niż PASS jest `BLOCK`.
