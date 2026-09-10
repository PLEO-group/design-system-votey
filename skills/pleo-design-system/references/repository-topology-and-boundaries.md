# Topologia repozytorium i granice paczki

## Pierwsza decyzja

Przed wyborem scenariusza ustal, gdzie ma żyć design system:

- `standalone-repository` — niezależna paczka w osobnym repozytorium;
- `colocated-workspace-package` — niezależna paczka we wspólnym repozytorium z co najmniej jednym konsumentem.
- `embedded-mini-ds` — wyjątek dla jednej szczególnie małej aplikacji, gdy nie istnieje realny scenariusz współdzielenia, niezależnego release'u ani osobnego ownershipu DS.

Domyślnie wybierz niezależną paczkę. `embedded-mini-ds` wolno wybrać tylko po jawnej decyzji człowieka, gdy koszt utrzymania granicy paczki jest nieproporcjonalny do skali jednej małej aplikacji. Zapisz konkretne uzasadnienie w `repository.boundaryPolicy.localMiniDs.justification`. Sam brak drugiego konsumenta nie wystarcza. Bez uzasadnienia topologia jest `BLOCK`.

## Zatwierdzony embedded mini-DS

- Ustaw `repository.topology: embedded-mini-ds`, `repository.packageRoot: "."`, pustą listę `consumerRoots`, `distribution.mode: workspace-internal` i `publishable: false`.
- Ustaw `localMiniDs.mode: forbid`, `baselineFile: null` i `heuristicFindings: block`; zadeklarowany root jest jedynym mini-DS i nie wolno tworzyć drugiej konkurencyjnej warstwy.
- W `localMiniDs.justification` opisz małą skalę, brak przewidywanego reuse/release/ownershipu oraz dlaczego osobna paczka byłaby nieproporcjonalna. Nie wymagaj wskazania osób odpowiedzialnych ani akceptujących.
- Ponownie oceń decyzję, gdy pojawi się drugi konsument, niezależny cykl release, osobny właściciel albo istotny wzrost zakresu. Wtedy zaplanuj migrację do paczki współlokowanej lub osobnego repo.

## Współlokowana paczka

Umieść DS w osobnym katalogu projektu/paczki, np. `projects/kindflow-design-system` albo `packages/design-system-kindflow`. Nie umieszczaj go w `src/app/components`, `src/shared/ui`, globalnych stylach aplikacji ani innym katalogu konsumenta.

Wymagaj:

- własnego `package.json`, nazwy i SemVer;
- `design-system.manifest.json` obok tego `package.json`;
- jawnych entry pointów `/angular` i/lub `/react`;
- niezależnych komend tokenów, builda, testów, preview i `npm pack`;
- braku importów z aplikacji do paczki;
- konsumpcji wyłącznie przez nazwę paczki i publiczne entry pointy;
- osobnego `design-system-consumer.manifest.json` w root każdej aplikacji konsumującej, także w tym samym repo;
- Storybooka albo preview skierowanego na publiczne API paczki;
- możliwości późniejszej publikacji bez przebudowy struktury źródeł.

Ustaw `distribution.mode: workspace-internal`, `publishable: false`, obowiązkową komendę `pack` i `publish: null`, jeśli publikacja jest odłożona. Po pojawieniu się zewnętrznego konsumenta przełącz manifest na `registry`, dodaj komendę publikacji i przeprowadź osobno akceptowany release.

Ścieżki workspace lub TypeScript mogą wskazywać na źródła paczki podczas developmentu, ale import w kodzie konsumenta nadal musi używać nazwy paczki. CI ma dodatkowo wykonać `npm pack` i smoke test spakowanego artefaktu.

## Czysty projekt

Ustaw `localMiniDs.mode: forbid`. Od pierwszego commita blokuj źródła tokenów, theme, registry, prymitywy UI i responsive contract poza `packageRoot`. Komponent domenowy może pozostać w aplikacji, ale znalezienie komponentu przypominającego prymityw DS wymaga klasyfikacji albo jawnego wyjątku.

## Projekt z istniejącym mini-DS

Ustaw `localMiniDs.mode: migration-baseline` i utwórz baseline istniejących kandydatów. Od tego momentu:

- nowe pliki mini-DS poza paczką są `BLOCK`;
- usunięcie pliku z baseline jest postępem migracji;
- zmiana istniejącego pliku jest dozwolona tylko w zaakceptowanym etapie naprawczym;
- każdy etap przenosi odpowiedzialność do paczki i aktualizuje baseline;
- po opróżnieniu baseline przełącz politykę na `forbid`.

Nie przenoś automatycznie wszystkich elementów. Token, komponent lub asset może być domenowy i pozostać u konsumenta po `REVIEW_REQUIRED` oraz zapisaniu decyzji.

## Kiedy osobne repo staje się potrzebne

Nie wymagaj osobnego repo tylko dlatego, że pojawia się drugi konsument. Paczkę można publikować z repo pierwszej aplikacji. Zaplanuj wydzielenie repo, gdy DS ma osobnego właściciela, niezależny cykl release, różne uprawnienia albo rozwój dla innych produktów jest blokowany przez lifecycle aplikacji-gospodarza.
