---
name: pleo-library-skill-version-guard
description: Sprawdza target-only, czy skill użyty w aktualnym procesie jest aktualny względem biblioteki, oraz dba o świeżość manifestu projektu w PleoAI. Nie raportuje telemetryki.
version: 1.6.6
author: p.karas@pleodigital.com
scope: SHARED
category: Library
tags: []
---
# Pleo Library Skill Version Guard

Używaj tego skilla, gdy trzeba sprawdzić, czy skill użyty w aktualnym procesie jest aktualny względem biblioteki, albo gdy trzeba pobrać nowszą wersję lokalnego skilla.
Każde uruchomienie wykonuje świeży target-only check wskazanego skilla.

## Zasady

- Każdy check wykonuje świeże porównanie lokalnej wersji wskazanego skilla z biblioteką.
- Przed pełną synchronizacją manifestu skrypt sprawdza `/skills/remote/project-skill-state/status`.
- Jeśli backendowy manifest projektu ma `verifiedOn` z dzisiaj i liczba zarejestrowanych skilli zgadza się z lokalną liczbą skilli, wystarczy target-only check.
- Jeśli manifest nie jest z dzisiaj albo liczba skilli się nie zgadza, skrypt synchronizuje manifest `skillName + installedVersion` projektu przez `/skills/remote/project-skill-state/sync`.
- Skille `pleo-library-*` mogą być automatycznie aktualizowane, gdy remote ma nowszą wersję.
- Dla skilli spoza `pleo-library-*` pobieraj aktualizację dopiero po zgodzie użytkownika.
- Ten check jest infrastrukturą, nie realnym użyciem skilla, więc nie wysyłaj dla niego telemetryki.
- Jeśli lokalny skill nie ma `SKILL.md` albo frontmatter `version`, przerwij z błędem.

## Jak uruchomić

```bash
python skills/pleo-library-skill-version-guard/scripts/run.py check --skill <skill-name>
python skills/pleo-library-skill-version-guard/scripts/run.py pull --skill <skill-name>
python skills/pleo-library-skill-version-guard/scripts/run.py check --skill <skill-name> --full-project-check
```

## Wynik JSON

- `guardMode`: tryb sprawdzenia aktualności skilli.
- `versionRelation`: `missing_remote`, `local_newer`, `remote_newer` albo `same`.
- `needsPull`: `true`, gdy biblioteka ma nowszą wersję niż lokalna.
- `needsPublish`: `true`, gdy lokalna wersja jest nowsza niż biblioteka albo remote nie istnieje.
- `projectSkillStateSync`: wynik sprawdzenia świeżości manifestu albo pełnej synchronizacji manifestu projektu.
- `autoPulledTargetSkill`: wynik automatycznego pull dla wskazanego `pleo-library-*`, jeśli wystąpi.

## Workflow agenta

1. Uruchom `check --skill <skill-name>` dla konkretnego skilla użytego w aktualnym procesie albo `check --skill <skill-name> --full-project-check`, gdy użytkownik chce pełniejszego audytu projektu.
2. Jeśli `needsPull=true` dla skilla `pleo-library-*`, skrypt wykona automatyczny pull i zwróci wynik po aktualizacji.
3. Jeśli `needsPull=true` dla innego skilla, zapytaj użytkownika przed `pull`.
4. Po `pull` uznaj wcześniej zaczytaną treść aktualizowanego skilla za nieaktualną i odczytaj pliki ponownie, jeśli dalsza praca od nich zależy.
5. Nie zapisuj w rozmowie listy sprawdzonych skilli; kolejne sprawdzenie ma być świeżym target-only checkiem.
