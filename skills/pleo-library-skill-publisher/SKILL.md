---
name: pleo-library-skill-publisher
description: Operacyjnie publikuje, audytuje, migruje scope, zmienia nazwę albo usuwa lokalny skill w centralnej bibliotece przez skrypt z `scripts/`. Używaj wyłącznie, gdy użytkownik jawnie prosi o publikację, audyt publikacji, migrację PROJECT/SHARED, rename albo delete skilla; nie używaj jako pre-response.
version: 1.2.6
author: p.karas@pleodigital.com
scope: SHARED
category: Library
tags: []
---
# Pleo Library Skill Publisher

Używaj tego skilla tylko wtedy, gdy lokalne repo jest źródłem prawdy dla skilla i użytkownik jawnie chce wysłać nową albo zmienioną wersję do biblioteki, zmienić nazwę skilla albo usunąć skilla z biblioteki.
Nie uruchamiaj go przed routingiem zwykłego zadania tylko dlatego, że repo zawiera lokalne skille.

## Wymagany config repo

Plik `.agent-library.yaml`:

```yaml
libraryBaseUrl: https://pleoai.example.com
projectSlug: org/repo-name
paths:
  agents: AGENTS.md
  claude: CLAUDE.md
  gemini: GEMINI.md
  skillsDir: skills
publish:
  defaultScope: PROJECT
```

`projectSlug` jest używany dla skilli `PROJECT`.
Dla skilli `pleo-library-*` publisher dołącza też repozytoryjny `projectSlug` przy `SHARED`, bo backend autoryzuje te publikacje po slugu repo.

## Jak uruchomić

Publikacja pojedynczego skilla:

```bash
python skills/pleo-library-skill-publisher/scripts/run.py publish --skill <skill-name> --scope SHARED --category "<category>"
```

albo:

```bash
python skills/pleo-library-skill-publisher/scripts/run.py publish --skill <skill-name> --scope PROJECT --project-slug org/repo-name
```

Publikacja wszystkich katalogów z `skills/`, z prefiksem SHARED:

```bash
python skills/pleo-library-skill-publisher/scripts/run.py publish-all --shared-skill-prefix pleo-library-
```

Pobranie listy dostępnych kategorii shared skilli:

```bash
python skills/pleo-library-skill-publisher/scripts/run.py categories
```

Audyt lokalnych skilli względem biblioteki bez zapisu:

```bash
python skills/pleo-library-skill-publisher/scripts/run.py audit
python skills/pleo-library-skill-publisher/scripts/run.py audit --exclude-skill pleo-library-prompt-model-triage
python skills/pleo-library-skill-publisher/scripts/run.py publish-audit
```

Migracja skilla projektowego do shared:

```bash
python skills/pleo-library-skill-publisher/scripts/run.py migrate-project-to-shared --skill <skill-name> --category "<category>"
```

Skrypt wypisuje wynik jako JSON.

## Workflow agenta

1. Dla nowego skilla `SHARED` najpierw uruchom `categories` i pokaż użytkownikowi dostępne kategorie.
2. Jeśli biblioteka nie zwraca żadnej kategorii, zapytaj użytkownika o nową kategorię i przekaż ją w `--category`.
3. Jeśli trzeba tylko sprawdzić stan, uruchom `audit` albo alias `publish-audit` i odczytaj listy `missing`, `localNewerThanRemote`, `remoteNewerThanLocal`, `sameVersion`, `publishBlocked` oraz `publishRequiresLibraryPermission`.
4. Jeśli skill ma przejść z `PROJECT` na `SHARED`, użyj `migrate-project-to-shared` zamiast ręcznie składać `delete` i `publish`.
5. Uruchom `publish` albo `publish-all`.
6. Skrypt zawsze wysyła pełny katalog skilla jako payload.
7. Jeśli `SKILL.md` używa starego formatu `# WERSJA` albo `# AUTOR`, skrypt przerwie pracę i każe przerobić skilla do nowego frontmatter.
8. Jeśli biblioteka PLEO ma nowszą wersję niż lokalna, skrypt przerwie pracę i każe najpierw pobrać update.
9. Jeśli payload lokalny różni się od remote, ale frontmatter `version` nie została podbita, skrypt przerwie pracę.
10. Przy `502`, `503` albo `504` z biblioteki skrypt wykonuje ograniczone retry; nie retryuje `400`, `403` ani `409`.
11. Po sukcesie odczytaj `action` i `version` z JSON (`CREATED`, `UPDATED`, `NO_CHANGE`).

## Ważne reguły

- Nie publikuj pojedynczego pliku; zawsze publikuj cały katalog skilla.
- Nie publikuj skilli w starym formacie `# WERSJA`/`# AUTOR`; najpierw przerób je do frontmatter `version`, `author`, `scope` i `tags`. Pole `category` stosuj tylko dla `SHARED`.
- Przy refaktorze, tłumaczeniu albo porządkowaniu skilla nie wolno usuwać informacji merytorycznych. Można je przenosić do `references/`, ale zakres wiedzy, triggery, przykłady i edge case'y muszą pozostać dostępne.
- Nie zgaduj `scope`; podaj go z kontekstu użytkownika albo z configu repo.
- Dla nowego skilla `SHARED` nie zgaduj kategorii; najpierw sprawdź `categories`, potem zapytaj użytkownika i przekaż `--category`.
- Dla skilla `PROJECT` używaj `projectSlug`, nie `projectId`.
- Dla skilli `pleo-library-*` nie nadpisuj obcym `projectSlug`; publisher ma wysyłać slug bieżącego repo z `.agent-library.yaml`.
- Przy `409 Conflict` podczas publikacji sprawdź, czy skill nie istnieje już pod innym scope. Dla migracji `PROJECT -> SHARED` użyj `migrate-project-to-shared`.
- Błędy infrastruktury `502`, `503` i `504` są retryowalne w ograniczonym zakresie; jeśli retry się wyczerpie, pokaż końcowy komunikat skryptu razem z informacją o poprzednim błędzie transient.
- Przy `400` albo `403` nie zgaduj przyczyny: pokaż pełny komunikat skryptu i rozróżnij błąd payloadu, scope/kategorii oraz brak uprawnień do prefiksu `pleo-library-*`.
- `publishRequiresLibraryPermission` w audycie nie oznacza blokady; to sygnał, że publikacja skilla z prefiksem `pleo-library-*` wymaga właściwego `projectSlug` i uprawnień bibliotecznych.
- Jeśli task zmodyfikował jakikolwiek plik należący do skilla, w tym `SKILL.md`, `scripts/**`, `agents/**`, `assets/**` albo `references/**`, przed końcem pracy podbij frontmatter `version` w `SKILL.md` tego skilla.
- Jeśli w jednej sesji wprowadzasz kolejne zmiany do tego samego skilla i jego poprzednio podbita wersja nie została jeszcze opublikowana, nie podbijaj wersji ponownie.
- Jeśli task zmodyfikował jakikolwiek plik należący do skilla, po podbiciu frontmatter `version` wyślij zaktualizowanego skilla do biblioteki albo jednoznacznie zapytaj użytkownika o publikację, jeśli nie kazał publikować automatycznie.
