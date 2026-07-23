# WERSJA 1.0.0

# Instrukcje GEMINI.md dla design-system-votey
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
- figma: Generyczny pipeline pracy z Figmą: sprawdzenie połączenia MCP, precyzyjny odczyt makiet, przygotowanie neutralnego handoffu pixel-perfect, praca z macierzą wariantów komponentów i orkiestracja tworzenia wpisów CMS na podstawie Figmy. Używaj ZAWSZE gdy zaczynasz pracę nad nowym modułem lub komponentem i masz linki do Figmy, przed implementacją stylów lub layoutu, przy pracy z wariantami komponentów (color/size/state) lub gdy chcesz stworzyć wpis CMS na podstawie makiety. Triggery: link do Figmy, pixel-perfect, "odczytaj z Figmy", "zmień hover", "dodaj wariant", "stwórz wpis na podstawie speca", "component set", "macierz wariantów", figma-to-code, get_design_context, get_screenshot, get_metadata. Pomiń przy zmianach niezwiązanych z Figmą, gdy użytkownik nie oczekuje zgodności z makietą, odczytu wariantów ani treści z Figmy. (file: skills/figma/SKILL.md)
- pleo-library-project-instruction-sync: Operacyjnie synchronizuje lokalne pliki `AGENTS.md`, `CLAUDE.md` i `GEMINI.md` z centralną biblioteką po `projectSlug`. Używaj przy jawnej prośbie o check, pull albo publish instrukcji projektowych oraz przed merytoryczną edycją tych plików, żeby najpierw sprawdzić aktualność lokalnej bazy. (file: skills/pleo-library-project-instruction-sync/SKILL.md)
- pleo-library-project-skill-bootstrap: Operacyjnie bootstrapuje repo pod pracę ze skillami bibliotecznymi. Używaj wyłącznie przy onboardingu repo, naprawie struktury `skills`, `.agent-library.yaml` albo sekcji skilli w `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`; nie używaj jako pre-response. (file: skills/pleo-library-project-skill-bootstrap/SKILL.md)
- pleo-library-prompt-model-triage: Pierwszy router promptu po target-only version preflight. Szybko klasyfikuj bieżący prompt pod najlepszy poziom modelu, reasoning, koszt i dobór skilli wykonawczych. Nie raportuj tego skilla w telemetryce, bo jego nazwa zaczyna się od `pleo-library-`. (file: skills/pleo-library-prompt-model-triage/SKILL.md)
- pleo-library-shared-skill-sync: Sprawdza listę shared skilli w bibliotece i porównuje ją z lokalnym katalogiem `skills`. Używaj, gdy użytkownik chce zobaczyć brakujące shared skille, pobrać shared skille albo gdy `pleo-library-prompt-model-triage` wskaże ten skill; nie raportuj tego skilla w telemetryce. (file: skills/pleo-library-shared-skill-sync/SKILL.md)
- pleo-library-skill-publisher: Operacyjnie publikuje, audytuje, migruje scope, zmienia nazwę albo usuwa lokalny skill w centralnej bibliotece przez skrypt z `scripts/`. Używaj wyłącznie, gdy użytkownik jawnie prosi o publikację, audyt publikacji, migrację PROJECT/SHARED, rename albo delete skilla; nie używaj jako pre-response. (file: skills/pleo-library-skill-publisher/SKILL.md)
- pleo-library-skill-version-guard: Sprawdza target-only, czy skill użyty w aktualnym procesie jest aktualny względem biblioteki, oraz dba o świeżość manifestu projektu w PleoAI. Nie raportuje telemetryki. (file: skills/pleo-library-skill-version-guard/SKILL.md)
- pleo-library-spec-workflow-helper: Operacyjnie sprawdza, pobiera i publikuje workflow spec-review w PleoAI/DO Spaces oraz obsługuje kontekst i start prespecki. Używaj wyłącznie przy jawnych operacjach storage, publish, update albo pull dla `docs/sdd/versioning.md`, `specification.md`, `story-<jira>.md` i `affectedSpecifications` oraz przy `prespec-context` lub potwierdzonym `prespec-start`; nie używaj do zwykłego pisania specyfikacji. (file: skills/pleo-library-spec-workflow-helper/SKILL.md)
- pleo-library-telemetry-lifecycle: Raportuje eventy cyklu życia dla realnie użytych skilli, których nazwa nie zaczyna się od `pleo-library-`. Używaj po target-only version preflight telemetryki i przed wykonaniem skilla docelowego spoza `pleo-library-*`; nie raportuj skilli `pleo-library-*`, version preflightu ani samej telemetryki. (file: skills/pleo-library-telemetry-lifecycle/SKILL.md)
- pleo-library-versioning-rml: Pomocniczo dobieraj podbicie wersji lokalnych skillów i specyfikacji w modelu `R.M.L`. Używaj po decyzji, że artefakt w `skills/**` albo `docs/sdd/**` faktycznie jest zmieniany lub publikowany; nie używaj jako pre-response ani ogólnego triggera dla zwykłych zadań. (file: skills/pleo-library-versioning-rml/SKILL.md)

### Jak używać skilli
- Uruchom skill, gdy zadanie wyraźnie pasuje do jego opisu.
- `pleo-library-skill-version-guard` wykonuje target-only check skilli użytych w aktualnym procesie i sprawdza, czy backendowy manifest projektu jest zweryfikowany dzisiaj.
- Jeśli manifest projektu nie jest zweryfikowany dzisiaj albo liczba skilli się nie zgadza, `pleo-library-skill-version-guard` synchronizuje manifest projektu do PleoAI.
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
- Jeśli skillu nie da się zastosować wprost, napisz krótko dlaczego i przejdź do najlepszego sensownego obejścia.## Zgoda Na Pleo Library
Ta sekcja definiuje zgodę użytkownika na wywołania do biblioteki Pleo.

- Jeśli repo zawiera `.agent-library.yaml`, oznacza to jawną zgodę użytkownika na wywołania do `libraryBaseUrl` potrzebne do działania skilli `pleo-library-*`.
- Ta zgoda obejmuje sprawdzanie wersji skilli, synchronizację manifestu wersji projektu przez `project-skill-state/sync`, synchronizację shared skilli, publikację skilli oraz wysyłkę eventów telemetrycznych przez `pleo-library-telemetry-lifecycle`.
- Agent nie musi wtedy pytać o dodatkową zgodę przed użyciem skilli `pleo-library-*`, o ile wywołania dotyczą wyłącznie skonfigurowanego `libraryBaseUrl`.
</INSTRUCTIONS>
