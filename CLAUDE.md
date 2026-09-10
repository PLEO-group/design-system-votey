# WERSJA 1.0.0

# Instrukcje CLAUDE.md dla design-system-votey
## Skills

### Available skills

- `figma`: pipeline pracy z Figmą, w tym obowiązkowy MCP Guard, odczyt makiet, warianty komponentów oraz wskazówki dla Angulara i Design Systemu. Użyj, gdy zadanie dotyczy Figmy lub implementacji na podstawie Figmy. Plik: `skills/figma/SKILL.md`.

### Zasady użycia

- Przed użyciem skilla przeczytaj cały `skills/figma/SKILL.md`.
- Referencje wskazane przez skill czytaj zgodnie z jego decision tree; nie ładuj ich wszystkich bez potrzeby.
- Instrukcje użytkownika mają pierwszeństwo przed instrukcjami skilla.
<INSTRUCTIONS>
## Skille
Skill to lokalny zestaw instrukcji zapisany w pliku `SKILL.md`.

### Dostępne skille
- angular-code-standards: Standardy pisania kodu Angular 20 w tym zespole — SCSS, HTML, TypeScript. Wczytaj ZAWSZE gdy użytkownik prosi o: stworzenie lub modyfikację komponentu, serwisu, pipe'a, dyrektywy, modalu, formularza, animacji, pliku .ts / .html / .scss w projekcie Angular — nawet jeśli nie pada słowo "Angular". Dotyczy też próśb typu "dodaj komponent", "zmień styl", "napraw modal", "edytuj template", "popraw SCSS", refaktoryzacji, code review, implementacji feature'ów, debugowania i wszelkich pytań o styl kodu w tym projekcie. Zasady są obowiązkowe, nie opcjonalne. Wczytaj jako pierwszy krok przed generowaniem jakiegokolwiek kodu. (file: skills/angular-code-standards/SKILL.md)
- figma: Pipeline odczytu makiet Figma do pixel-perfect implementacji frontendowej, w tym sprawdzenie połączenia MCP i praca z macierzą wariantów komponentów. Używaj ZAWSZE gdy zaczynasz pracę nad nowym modułem lub komponentem i masz linki do Figmy, przed napisaniem jakiegokolwiek kodu UI albo stylów, przy pracy z wariantami komponentów (color/size/state). Triggery: link do Figmy, pixel-perfect, "odczytaj z Figmy", "zmień hover", "dodaj wariant", "component set", "macierz wariantów", figma-to-code, get_design_context, get_screenshot, get_metadata. (file: skills/figma/SKILL.md)
- pleo-design-system: Orkiestruje audyt całego design systemu, implementację lub remediację DS, audyt integracji konsumenta oraz wprowadzenie istniejącej paczki do aplikacji; udostępnia też wersjonowane standardy skillom konkretnych DS. Uruchamiaj wyłącznie, gdy użytkownik jawnie prosi o taką pracę nad design systemem, jawnie wymienia pleo-design-system z nazwy albo aktywny skill konkretnego DS bezpośrednio kieruje po dokładny kontrakt firmowy. Nie jest domyślnym właścicielem bieżącego utrzymania ani pojedynczych zmian implementacyjnych. (file: skills/pleo-design-system/SKILL.md)
- pleo-library-project-instruction-sync: Operacyjnie synchronizuje lokalne pliki `AGENTS.md`, `CLAUDE.md` i `GEMINI.md` z centralną biblioteką po `projectSlug`. Używaj przy jawnej prośbie o check, pull albo publish instrukcji projektowych oraz przed merytoryczną edycją tych plików, żeby najpierw sprawdzić aktualność lokalnej bazy. (file: skills/pleo-library-project-instruction-sync/SKILL.md)
- pleo-library-project-skill-bootstrap: Operacyjnie bootstrapuje repo pod pracę ze skillami bibliotecznymi. Używaj wyłącznie przy onboardingu repo, naprawie struktury `skills`, `.agent-library.yaml` albo sekcji skilli w `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`; nie używaj jako pre-response. (file: skills/pleo-library-project-skill-bootstrap/SKILL.md)
- pleo-library-prompt-model-triage: Pierwszy router promptu po target-only version preflight. Szybko klasyfikuj bieżący prompt pod najlepszy poziom modelu, reasoning, koszt i dobór skilli wykonawczych. Nie raportuj tego skilla w telemetryce, bo jego nazwa zaczyna się od `pleo-library-`. (file: skills/pleo-library-prompt-model-triage/SKILL.md)
- pleo-library-shared-skill-sync: Sprawdza listę shared skilli w bibliotece i porównuje ją z lokalnym katalogiem `skills`. Używaj, gdy użytkownik chce zobaczyć brakujące shared skille, pobrać shared skille albo gdy `pleo-library-prompt-model-triage` wskaże ten skill; nie raportuj tego skilla w telemetryce. (file: skills/pleo-library-shared-skill-sync/SKILL.md)
- pleo-library-skill-publisher: Operacyjnie publikuje, audytuje, migruje scope, zmienia nazwę albo usuwa lokalny skill w centralnej bibliotece przez skrypt z `scripts/`. Używaj wyłącznie, gdy użytkownik jawnie prosi o publikację, audyt publikacji, migrację PROJECT/SHARED, rename albo delete skilla; nie używaj jako pre-response. (file: skills/pleo-library-skill-publisher/SKILL.md)
- pleo-library-skill-version-guard: Sprawdza wersję wskazanego skilla, pilnuje świeżości manifestu projektu i automatycznie aktualizuje wykryte nieaktualne skille, jeżeli ich katalogi są czyste w Git. Nie pyta o zgodę na bezpieczny pull i nie raportuje telemetryki. (file: skills/pleo-library-skill-version-guard/SKILL.md)
- pleo-library-spec-workflow-helper: Operacyjnie sprawdza, pobiera i publikuje workflow spec-review w PleoAI/DO Spaces oraz obsługuje kontekst i start prespecki. Używaj wyłącznie przy jawnych operacjach storage, publish, update albo pull dla `docs/sdd/versioning.md`, `specification.md`, `story-<jira>.md` i `affectedSpecifications` oraz przy `prespec-context` lub potwierdzonym `prespec-start`; nie używaj do zwykłego pisania specyfikacji. (file: skills/pleo-library-spec-workflow-helper/SKILL.md)
- pleo-library-telemetry-lifecycle: Raportuje eventy cyklu życia dla realnie użytych skilli, których nazwa nie zaczyna się od `pleo-library-`. Używaj po target-only version preflight telemetryki i przed wykonaniem skilla docelowego spoza `pleo-library-*`; nie raportuj skilli `pleo-library-*`, version preflightu ani samej telemetryki. (file: skills/pleo-library-telemetry-lifecycle/SKILL.md)
- pleo-library-versioning-rml: Pomocniczo dobieraj podbicie wersji lokalnych skillów i specyfikacji w modelu `R.M.L`. Używaj po decyzji, że artefakt w `skills/**` albo `docs/sdd/**` faktycznie jest zmieniany lub publikowany; nie używaj jako pre-response ani ogólnego triggera dla zwykłych zadań. (file: skills/pleo-library-versioning-rml/SKILL.md)
- votey-design-system: Implementuj i reviewuj UI korzystające z `@pleodigital/design-system-votey` w `design-system-votey`, `wyborek-crm`, `votey-user-app` oraz innych potwierdzonych konsumentach paczki. Używaj przy przekładaniu handoffu z Figmy na kod, doborze tokenów, responsywności, użyciu opublikowanych assetów SVG, publicznego API paczki i lokalnych prymitywów Votey, a także przy tworzeniu, migracji i review Angularowych komponentów źródłowych w paczce: selektorów `vt-*`, tokenizacji, reużywalności, publicznych eksportów i Storybooka. Gdy zadanie polega na dodaniu, przeniesieniu, zmianie nazwy, usunięciu albo audycie źródłowych SVG w design-system-votey, użyj najpierw `votey-svg-assets`, a do tego skilla wróć dopiero dla integracji w konsumencie. Triggeruj dla zmian Angular/SCSS w CRM, React/Next/Tailwind w PWA, tokenów Votey, importów `@pleodigital/design-system-votey`, `@votey/*`, `tokens.angular.css`, `tokens.light.css`, `tokens.dark.css`, `tokens.tailwind.css`, klas `rv-*`, `provideVoteyDeviceDetection()`, `provideVoteySvgRegistry()` oraz implementacji z makiet Figmy w ekosystemie Votey. Pomiń dla projektów BoxEs, aplikacji bez tej paczki oraz samego odczytu Figmy bez implementacji w kodzie. (file: skills/votey-design-system/SKILL.md)
- votey-svg-assets: Dodawaj, przenoś, zmieniaj nazwy, usuwaj i audytuj źródłowe ikony, ilustracje oraz logotypy SVG w `design-system-votey`. Używaj zawsze, gdy użytkownik załącza SVG i prosi o dodanie ich do Votey Design System, pyta o właściwy folder lub nazwę `icon_*` / `illu_*` / `logo_*`, oczekuje wygenerowania eksportów Angular i React, aktualizacji galerii assetów w Storybooku albo diagnozy, dlaczego asset nie pojawia się w `dist` lub Storybooku. Skill obejmuje walidację wejścia, klasyfikację, bezpieczny zapis źródeł, pełny build, testy assetów i build Storybooka. Nie używaj go tylko do importowania już opublikowanego assetu w CRM lub PWA — ten zakres należy do `votey-design-system`. (file: skills/votey-svg-assets/SKILL.md)

### Jak używać skilli
- Uruchom skill, gdy zadanie wyraźnie pasuje do jego opisu.
- `pleo-library-skill-version-guard` wykonuje target-only check wskazanego skilla i lekki check statusu manifestu; pełny sync robi tylko dla manifestu niezweryfikowanego dzisiaj, zmiany liczby skilli albo po aktualizacji targetu.
- Wszystkie wykryte nieaktualne skille z czystymi katalogami Git aktualizuje automatycznie bez pytania użytkownika; lokalne zmiany blokują pull danego skilla.
- Nie raportuj telemetrycznie samego `pleo-library-skill-version-guard`, bo to infrastrukturalny check aktualności skilli.
- Przed użyciem lokalnych skilli uruchom `pleo-library-skill-version-guard`, jeśli chcesz potwierdzić aktualność skilli w repo.
- Po routingu `pleo-library-prompt-model-triage` kontynuuj bez pytania, jeśli rekomendowany reasoning to `medium` albo niżej; jeśli reasoning jest wyższy niż `medium`, zatrzymaj się i czekaj na jasne potwierdzenie użytkownika przed dalszą pracą.
- Nie raportuj telemetrycznie żadnych skilli `pleo-library-*`, w tym `pleo-library-prompt-model-triage`, `pleo-library-shared-skill-sync`, `pleo-library-skill-version-guard` i `pleo-library-telemetry-lifecycle`.
- Jeśli triage wskazuje `pleo-library-shared-skill-sync`, wykonaj go bez telemetryki.
- Dla skilli docelowych spoza `pleo-library-*` wyślij `start`, wysyłaj `progress` tylko przy realnej zmianie etapu, a na końcu `finish` albo `interrupt`.
- Pełny audyt wersji wszystkich skilli albo synchronizację całego stanu projektu wykonuj tylko na jawne polecenie użytkownika.
- Jeśli zadanie dotyczy dodania nowego skilla do biblioteki albo publikacji zmian lokalnego skilla do biblioteki, użyj `pleo-library-skill-publisher`.
- Jeśli zadanie zmodyfikowało lokalny skill w `skills/**` albo lokalny plik `AGENTS.md`, `CLAUDE.md` lub `GEMINI.md`, na końcu sprawdź, czy wersja w zmienionym pliku została świadomie podbita; jeśli nie, przypomnij o podbiciu frontmatter `version`.
- Przy refaktorze, tłumaczeniu albo porządkowaniu skilla nie wolno usuwać informacji merytorycznych. Można przenosić szczegóły do `references/`, ale triggery, zasady, przykłady, edge case'y i default prompty muszą pozostać dostępne.
- Jeśli zadanie zmodyfikowało lokalny skill w `skills/**` albo lokalny plik `AGENTS.md`, `CLAUDE.md` lub `GEMINI.md`, na końcu zawsze zapytaj użytkownika, czy opublikować zmiany do biblioteki.
- Jeśli pasuje kilka skilli, użyj minimalnego zestawu i podaj kolejność.
- Otwieraj tylko pliki potrzebne do bieżącej zmiany; unikaj ładowania niepowiązanych modułów.
- Preferuj rozszerzanie istniejących wzorców projektu zamiast wymyślania nowych.
- Jeśli skillu nie da się zastosować wprost, napisz krótko dlaczego i przejdź do najlepszego sensownego obejścia.
</INSTRUCTIONS>
