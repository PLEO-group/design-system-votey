# Workflow i discovery

## Spis treści

1. Zasady wspólne
2. Discovery read-only
3. Pytania startowe
4. Routing trybów
5. Akceptacje
6. Domknięcie procesu

## Zasady wspólne

Rozpocznij każdy proces od odczytu instrukcji repozytorium i minimalnego preflightu potrzebnego do wyboru trybu, targetu, owner root, scope root i commitu startowego. Następnie utwórz artefakt i dopiero wtedy wykonaj pełne discovery, aby zachować jego wynik. Nie pytaj o informacje, które można wiarygodnie wykryć w plikach. Nie modyfikuj kodu w trybie audytu ani przed zaakceptowaniem właściwego etapu planu wykonawczego.

Wybierz tryb i artefakt zgodnie z `work-artifacts.md`, a następnie użyj `scripts/initialize-work-artifact.mjs`. Dla introduction przed inicjalizacją potwierdź poprawny manifest DS; jego brak blokuje rozpoczęcie trybu. Pokaż użytkownikowi klikalną ścieżkę. O akceptację proś dla każdego etapu planu implementacji, wprowadzenia albo migracji, nie dla samego raportu audytu.

## Discovery read-only

Sprawdź co najmniej:

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` i lokalne skille;
- `package.json`, lockfile, workspaces, frameworki i wersje Node;
- istniejące paczki DS, biblioteki UI oraz publiczne importy;
- tokeny, CSS variables, theme, Style Dictionary i Figma/Tokens Studio;
- assety SVG, registry, generatory i copy rules;
- Storybook albo aplikację preview;
- build, testy, lint, publikację i CI;
- lokalne katalogi `tokens`, `theme`, `shared/ui`, registry ikon i prymitywy UI;
- istniejące manifesty DS/konsumenta, ich zgodność z kanoniczną lokalizacją i skill konkretnego DS;
- topologię repo: osobny package root, workspace packages oraz źródła mini-DS osadzone w aplikacji; dla planowanego `embedded-mini-ds` zbierz informacje potrzebne do uzasadnienia małej skali i braku reuse/release/ownershipu w manifeście.

Uruchom `scripts/discover-project.mjs --project <root>` po utworzeniu artefaktu i dołącz wynik do niego. Potwierdź ręcznie fakty krytyczne przed mutacją. Brak dostępu do elementu objętego zakresem zatrzymuje audyt: ustaw `awaiting-input`, poproś o dostęp i kontynuuj ten sam `runId`; nie zamieniaj braku dostępu w finding ani „obszar niezweryfikowany”.

## Pytania startowe

Zadaj tylko pytania niewynikające z repo:

1. Topologia: osobne repozytorium czy niezależna paczka workspace współlokowana z aplikacją?
2. Tryb: audyt całego DS, implementacja/utworzenie/remediacja DS, audyt konsumenta czy wprowadzenie istniejącego DS do aplikacji?
3. Frameworki DS: Angular, React czy oba?
4. Ilu konsumentów istnieje i gdzie znajdują się ich repozytoria albo katalogi workspace?
5. Podaj link do całego projektu lub pliku Figma design systemu, obejmującego również ewentualne komponenty. Jeśli Figma nie jest źródłem całego projektu, podaj alternatywę i powód odstępstwa.
6. Czy Figma Variables są źródłem prawdy o tokenach? Jeśli tak, poproś o link do ich źródła — może być taki sam jak link do całego projektu. Jeśli nie, poproś o alternatywne źródło i powód odstępstwa.
7. Który wyłączny model ma stosować DS: rekomendowany `device-contract` z runtime mixinem `device()` czy prosty `css-media` z mixinem `breakpoint()`? Nie wolno wybrać obu. Dla `device-contract` ustal nazwy rodzajów urządzeń i top-level mapowanie każdego z nich na breakpoint referencyjny niezależnie od tego, czy grid jest włączony.
8. Jakie uporządkowane nazwy breakpointów wspiera DS i gdzie znajdują się ich core tokens? Dozwolone są zarówno rozbudowane zestawy, np. `mobile-small/mobile/tablet-small/tablet/laptop/desktop`, jak i prostsze `mobile/tablet/desktop`. Dla `device-contract` ustal fallbacki dla breakpointów bez jawnej wartości responsive tokenu oraz mnożnik każdego device type; dla `css-media` pozostaw device types, mapowanie, mnożniki i fallbacki puste.
9. Czy DS ma grid?
10. Czy DS publikuje komponenty, czy tylko fundamenty/tokeny/assety?
11. Storybook czy dedykowana aplikacja preview?
12. Publiczne npmjs czy customowe registry? Default: publiczne npmjs; dla współlokowanej paczki publikację można odroczyć, ale `npm pack` pozostaje obowiązkowy.
13. Uzupełnij politykę tokenów per framework: `generate`, `autocomplete`, `allowedUsage`.

Jeśli grid jest włączony dla Angulara, dopytaj o warianty, wariant domyślny, wartości `columns/gutter/margin/margin-extra` dla potrzebnych breakpointów oraz debug overlay. Grid w `device-contract` wykorzystuje wspólne `responsive.deviceBreakpointMap`; nie utrzymuj drugiej mapy wewnątrz grida. Wymiary gridu są liczbami w referencyjnych pikselach Figmy; nie zapisuj ich jako gotowych `px`, bo kontrakt przelicza je na `vw`. Dla Angular light/dark nie pytaj o host, storage ani preferencję systemową: zastosuj firmowy kontrakt z `themes.angular` w manifeście. Nie zadawaj pytań o Reactowe implementacje grid/theme, dopóki firmowe assety React nie zostaną dodane; zapisz ten zakres jako odłożony albo projektowy.

Po wyborze `colocated-workspace-package` albo rozważeniu `embedded-mini-ds` przeczytaj `repository-topology-and-boundaries.md` przed zaprojektowaniem ścieżek. W trybie wykonawczym ustaw w czystym projekcie zakaz lokalnego mini-DS, a w projekcie zastanym zaplanuj baseline i zamrożenie przyrostu. `embedded-mini-ds` zatwierdź wyłącznie przez wymagane uzasadnienie w manifeście. W audycie jedynie opisz obecny stan i potrzebę baseline'u albo brak wymaganego uzasadnienia.

Zapisuj każdą odpowiedź od razu we właściwym artefakcie. Projektowany manifest opisuj w planie wykonawczym; w audycie zapisuj stan istniejącego manifestu albo jego brak.

## Routing trybów

### Integracja istniejącego DS

Przeczytaj `scenario-connect-existing.md`. Poprawny manifest DS jest warunkiem rozpoczęcia. Nie zmieniaj repo paczki w tym trybie. Zweryfikuj publiczne API zainstalowanej wersji, nie z pamięci ani nazwy pliku.

### Audyt częściowego wdrożenia

Przeczytaj `scenario-audit-and-complete.md`. Najpierw utwórz raport `.tmp/design-system-audit.md`. Nie twórz baseline ani nie wykonuj napraw w trybie audytu. Jeśli zamknięty raport zawiera `BLOCK`, automatycznie utwórz osobny draft `design-system-implementation`, zaplanuj baseline i podziel naprawy na osobno akceptowane etapy.

### Audyt konsumenta

Przeczytaj `scenario-consumer-audit.md`. Utwórz `.tmp/design-system-consumer-audit.md` i nie rozszerzaj zakresu na źródła całego DS bez jawnej zmiany trybu.

### Nowy DS

Przeczytaj `scenario-create-new.md`. Zbuduj niezależną paczkę npm, nawet jeśli obecnie istnieje jeden konsument.

### Migracja konsumentów po remediacji DS

To nie jest scenariusz startowy. Przeczytaj `consumer-migration-after-remediation.md` dopiero w zaakceptowanym `design-system-implementation` utworzonym po audycie. Po stabilizacji kontraktu i zbudowaniu candidate wykonaj analizę wpływu, uzyskaj osobną zgodę na wygenerowanie plików i utwórz plan w repo każdego istniejącego konsumenta przed publikacją finalnej paczki.

## Akceptacje

- Wymagaj osobnej akceptacji każdego etapu przed jego mutacją.
- Raport audytu nie jest zgodą na remediację.
- Automatycznie utworzony draft planu po audycie nie jest zgodą na remediację.
- Wymagaj osobnej akceptacji przed publikacją paczki, skilla DS albo globalnego rejestru.
- Przy materialnym rozszerzeniu zakresu zaktualizuj plan i ponownie zaakceptuj zmienioną część.

## Domknięcie procesu

Audyt możesz zamknąć jako `completed`, gdy zakres, audytowany release, wszystkie wymagane dowody, zgodności, findingi i konkluzja są zapisane. Brak manifestu, guardraila albo integracji pozostaje findingiem i nie blokuje zakończenia raportu, ale brak dostępu do dowodu objętego zakresem blokuje zamknięcie i wymaga `awaiting-input`.

`design-system-implementation` nie zamykaj, dopóki:

- manifest DS i manifesty konsumentów objęte zaakceptowanym zakresem są poprawne;
- guardraile odpowiednie dla etapu przechodzą;
- build/test/preview przechodzą albo pominięcie jest jawnie opisane;
- skill konkretnego DS istnieje, jest aktualny i zgodny z manifestem;
- skill konkretnego DS zawiera projektowe referencje SVG i responsywności;
- źródłowe SVG odtwarzają aktualne typy, registry, framework exports i preview, a `checkAssets` przechodzi;
- instrukcja integracji istnieje dla każdego konsumenta;
- właściwy artefakt zawiera wyniki, wyjątki i odłożone kroki; raport pozostaje raportem, a plan pozostaje planem wykonawczym.

`design-system-introduction` nie zamykaj, dopóki:

- read-only prerequisite manifestu i skilla DS nadal jest poprawny;
- manifest bieżącego konsumenta jest poprawny;
- zaakceptowane etapy integracji aplikacji są ukończone i mają dowody;
- build/test/runtime smoke konsumenta przechodzą albo jawne pominięcie jest zapisane;
- nie zmodyfikowano repo paczki, manifestu DS, skilla DS ani centralnego rejestru;
- blokery należące do paczki są powiązane z osobnym `design-system-implementation`, jeśli występują.

`design-system-consumer-migration` nie zamykaj, dopóki:

- plan jest powiązany z właściwym `design-system-implementation`, release candidate i ukończonym etapem stabilizacji;
- macierz wpływu obejmuje API/importy, tokeny/theme, SVG, responsive/grid i komponenty;
- candidate został zweryfikowany w aplikacji albo jawne pominięcie ma decyzję i ryzyko;
- każdy wymagany etap migracji ma osobną akceptację i dowody albo prawidłowy status `skipped` dla wpływu `none`;
- rollback i rollout po publikacji są zapisane.

