---
name: votey-svg-assets
description: >
  Dodawaj, przenoś, zmieniaj nazwy, usuwaj i audytuj źródłowe ikony, ilustracje
  oraz logotypy SVG w `design-system-votey`. Używaj zawsze, gdy użytkownik
  załącza SVG i prosi o dodanie ich do Votey Design System, pyta o właściwy
  folder lub nazwę `icon_*` / `illu_*` / `logo_*`, oczekuje wygenerowania
  eksportów Angular i React, aktualizacji galerii assetów w Storybooku albo
  diagnozy, dlaczego asset nie pojawia się w `dist` lub Storybooku. Skill
  obejmuje walidację wejścia, klasyfikację, bezpieczny zapis źródeł, pełny build,
  testy assetów i build Storybooka. Nie używaj go tylko do importowania już
  opublikowanego assetu w CRM lub PWA — ten zakres należy do
  `votey-design-system`.
version: 1.1.0
author: n.koktysz@pleodigital.com
scope: SHARED
category: Frontend
tags: [FE]
---

# Votey SVG Assets

## Kontrakt

Obsługuj źródła wyłącznie w:

- `assets/icons/**`,
- `assets/illustrations/**`.

Nie edytuj ręcznie `dist`, `angular/src/lib/votey-assets.ts`, wygenerowanych
komponentów React ani list Storybooka. Repo generuje je ze źródeł.

Przy zmianie nazwy lub usunięciu publicznego assetu traktuj operację jako
breaking change. Wczytaj instrukcję migracji konsumenta, jeżeli użytkownik ją
dostarczył, i nie kończ zadania bez jawnego mapowania starej nazwy na nową dla
Angular Registry oraz React.

## Punkt startowy

1. Odczytaj `AGENTS.md`, `package.json`, konfiguracje `.svgrrc-*.json`,
   `scripts/generate-asset-types.mjs` i najbliższe istniejące assety.
2. Użyj plików załączonych w rozmowie albo ścieżek wskazanych przez użytkownika.
   Jeżeli nie ma dostępnych SVG, poproś o ich załączenie i zatrzymaj zapis.
3. Wczytaj `references/icon-naming-system.md` zawsze dla ikon, logotypów,
   rename, audytu nazw albo niejednoznacznego contextu.
4. Sprawdź stan worktree. Zachowaj wszystkie niezwiązane zmiany użytkownika.

## Walidacja wejścia

Dla każdego pliku przed skopiowaniem:

- potwierdź rozszerzenie `.svg` i pojedynczy korzeń `<svg>`,
- odrzuć aktywną zawartość: `<script>`, `<foreignObject>`, inline event handlers
  `on*`, zewnętrzne `http(s)` w `href`, `xlink:href` albo `url(...)`,
- sprawdź `viewBox`, wymiary i znaczenie `fill` / `stroke`,
- sprawdź kolizje `id`, `clipPath`, mask i gradientów; wiele instancji React
  nie może współdzielić globalnych identyfikatorów,
- porównaj nazwę, znaczenie i grafikę z istniejącymi assetami; nie dodawaj
  semantycznego ani binarnego duplikatu,
- nie optymalizuj, nie recoloruj i nie poprawiaj geometrii bez jawnej prośby.

Ikony bazowe mogą korzystać z `currentColor`. Ikony `special`, flagi, logotypy
i ilustracje mogą wymagać wielu kolorów. Jeżeli konfiguracja SVGR zmienia ich
znaczenie lub wygląd, zatrzymaj integrację zamiast naprawiać wynik lokalnym CSS.

## Klasyfikacja folderu

### Ikony i logotypy

| Wzorzec | Folder |
|---|---|
| `logo_*.svg` | `assets/icons/logotypes/` |
| `icon_menu_*.svg` | `assets/icons/menu/` |
| `icon_sp_*.svg` | `assets/icons/special/` |
| `icon_ui_*.svg` | `assets/icons/ui/` |

Nowy context lub sprzeczność między prefiksem a folderem wymaga decyzji
użytkownika i aktualizacji generatora, Storybooka oraz referencji nazewnictwa.

### Ilustracje

| Wzorzec | Folder |
|---|---|
| `illu_bg_*.svg` | `assets/illustrations/background/` |
| `logo_*.svg` | `assets/illustrations/logotypes/` |
| `illu_simple_*.svg` | `assets/illustrations/simple/` |
| `illu_spot_*.svg` | `assets/illustrations/spot/` |

Nie rozszerzaj wyjątków legacy, takich jak literówki prefixu albo
`panel_avatar.svg`, ani nie dodawaj nowych plików do usuniętego contextu
`spotSimple`. Dla nazwy niepasującej jednoznacznie do tabeli zatrzymaj się
i zapytaj o klasyfikację.

## STOP & ASK

Zatrzymaj zapis, jeżeli:

- trzeba zmienić nazwę dostarczonego pliku, a użytkownik nie zatwierdził nazwy,
- context, descriptor, modifier albo typ `icon` / `illustration` / `logo` jest
  niejednoznaczny,
- nowa nazwa koliduje z istniejącym plikiem, nazwą Angular albo eksportem React,
- rename zmienia znaczenie lub usuwa kontrakt używany przez CRM/PWA,
- SVG ma aktywną lub zewnętrzną zawartość,
- wielokolorowy asset traci kolory po SVGR,
- potrzebny jest nowy folder/context lub zmiana generatora.

Nie zatrzymuj workflow tylko dlatego, że wariant `thick` nie ma wariantu
bazowego — Votey jawnie dopuszcza taki kontrakt.

## Workflow dodawania

1. Zidentyfikuj wszystkie wejściowe SVG i zapisz plan `plik -> context -> folder
   -> Angular Registry -> React export`.
2. Zweryfikuj nazwy i publiczne mapowanie zgodnie z
   `references/icon-naming-system.md`.
3. Sprawdź duplikaty po nazwie publicznej, treści i znaczeniu.
4. Skopiuj każdy zaakceptowany plik do istniejącego folderu docelowego,
   zachowując dokładną zatwierdzoną nazwę.
5. Uruchom pełny `npm run build`. Ten krok czyści `dist` i generuje:
   - tokeny CSS/SCSS,
   - Angular package i typowane nazwy assetów,
   - raw SVG Angular,
   - komponenty React ikon i ilustracji.
6. Uruchom `npm run check:asset-types` i `npm run test:tokens`.
7. Uruchom `npm run build-storybook`. Galeria ikon czyta źródłowe SVG, a galeria
   ilustracji wygenerowane komponenty React; nie dopisuj kart ręcznie.
8. Sprawdź wygenerowane nazwy oraz obecność assetu w `storybook-static`.
9. Dla ikon `special`, flag, logotypów i ilustracji porównaj raw SVG z wynikiem
   React. Sprawdź kolory, `currentColor`, `viewBox`, brak kolizji `id` i kilka
   instancji obok siebie.
10. Sprawdź `git diff` i potwierdź, że zmieniły się tylko źródła oraz oczekiwane
    artefakty generowane.

## Storybook

Istniejące contexty pojawiają się automatycznie:

- ikony: `storybook/utils/assetLoader.js` używa `assets/icons/**/*.svg`,
- ilustracje: loader używa `dist/assets/react/illustrations/**/*.tsx`,
- `storybook/stories/Assets.stories.jsx` grupuje je według folderu.

Modyfikuj kod Storybooka tylko dla nowego contextu, nowego sposobu prezentacji
albo gdy automatyczny loader nie pokrywa poprawnego assetu. Nie twórz ręcznej
listy pojedynczych ikon.

## Wynik dla użytkownika

Podaj:

- listę dodanych/przeniesionych/usuniętych źródeł,
- wynikowe nazwy Angular Registry i eksporty React,
- rezultat pełnego builda, testów i Storybooka,
- ostrzeżenia migracyjne dla CRM/PWA,
- każdą decyzję, której nie wolno było zgadnąć.
