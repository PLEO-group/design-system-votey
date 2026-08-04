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
version: 1.1.1
author: n.koktysz@pleodigital.com
scope: SHARED
category: Frontend
tags: [FE]
---

# Votey SVG Assets

# CHANGELOG

# 1.1.1 — Dodano context ilustracji `info`, prefiks `illu_info_`, kontrakt powiększonych kafelków infografik w Storybooku, bezwyjątkową zgodność folderu z prefiksem assetu, warunkowe raportowanie walidacji audytu read-only oraz rozróżnienie zewnętrznych URL-i od lokalnych referencji SVG.

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
2. Dla dodawania użyj plików załączonych w rozmowie albo ścieżek wskazanych
   przez użytkownika. Jeżeli nie ma dostępnych SVG, poproś o ich załączenie
   i zatrzymaj zapis. Dla audytu, przeniesienia, rename albo usunięcia rozwiąż
   dokładne istniejące ścieżki źródłowe i nie wymagaj nowego pliku wejściowego.
3. Wczytaj `references/icon-naming-system.md` zawsze dla ikon, logotypów,
   rename, audytu nazw albo niejednoznacznego contextu.
4. Sprawdź stan worktree. Zachowaj wszystkie niezwiązane zmiany użytkownika.

## Walidacja wejścia

Dla każdego pliku przed skopiowaniem:

- potwierdź rozszerzenie `.svg` i pojedynczy korzeń `<svg>`,
- odrzuć aktywną zawartość: `<script>`, `<foreignObject>`, inline event handlers
  `on*` i odwołania ze schematem `javascript:`,
- odrzuć wyłącznie zewnętrzne URL-e `http://`, `https://` albo `//` użyte w
  `href`, `xlink:href` lub `url(...)`,
- dopuść lokalne referencje fragmentowe, np. `href="#gradient"`,
  `url(#gradient)` i `url(#clip)`; dla każdej potwierdź, że docelowy `id`
  istnieje, jest unikalny w pliku i nie powoduje kolizji między wieloma
  instancjami po transformacji SVGR,
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

Folder, prefiks pliku i publiczny namespace muszą zawsze odpowiadać temu samemu
setowi. Nie utrzymuj wyjątków od tej reguły. Sprzeczność między prefiksem a
folderem jest błędem: ustal właściwy context, a następnie przenieś asset albo
zmień jego nazwę zgodnie z decyzją użytkownika. Nowy context wymaga aktualizacji
generatora, Storybooka oraz referencji nazewnictwa.

### Ilustracje

| Wzorzec | Folder |
|---|---|
| `illu_bg_*.svg` | `assets/illustrations/background/` |
| `illu_info_*.svg` | `assets/illustrations/info/` |
| `logo_*.svg` | `assets/illustrations/logotypes/` |
| `illu_simple_*.svg` | `assets/illustrations/simple/` |
| `illu_spot_*.svg` | `assets/illustrations/spot/` |

Nie toleruj literówek prefixu ani nazw legacy, takich jak `panel_avatar.svg`,
i nie dodawaj nowych plików do usuniętego contextu `spotSimple`. Dla nazwy
niepasującej jednoznacznie do tabeli zatrzymaj się i zapytaj o klasyfikację.

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

## Workflow audytu

Audyt jest domyślnie read-only. Nie poprawiaj wykrytych problemów bez jawnej
prośby użytkownika.

1. Ustal i wypisz zakres kontroli: foldery, contexty, wskazane nazwy publiczne
   oraz dostarczone instrukcje migracyjne. Nie rozszerzaj audytu na inne repo.
2. Zbuduj inwentarz `plik źródłowy -> folder -> Angular Registry -> React export
   -> karta/grupa Storybooka`. Porównaj liczbę źródeł z publicznymi listami
   `VoteyIconNames` i `VoteyIllustrationNames`.
3. Sprawdź kolejno:
   - zgodność nazwy, prefixu i folderu z `references/icon-naming-system.md`,
   - unikalność nazw Angular i React,
   - duplikaty treści i znaczenia,
   - bezpieczeństwo SVG, `viewBox`, kolory i kolizje używanych identyfikatorów,
   - zgodność źródeł z wygenerowanym `dist` i konfiguracją grup Storybooka,
   - pozostałości starych nazw w dokumentacji i potwierdzonych konsumentach.
4. Uruchom wyłącznie read-only `npm run check:asset-types` oraz
   `npm run test:tokens`. Nie uruchamiaj pełnego builda ani Storybooka tylko po
   to, żeby wypełnić raport końcowy.
5. Jeżeli użytkownik jawnie oczekuje potwierdzenia aktualnego wygenerowanego
   outputu albo audyt łączy się z autoryzowaną naprawą, uruchom pełny zestaw:
   `npm run build`, `npm run check:asset-types`, `npm run test:tokens`,
   `npm run build-storybook`.
6. Zgłoś osobno błędy, ryzyka i decyzje wymagające potwierdzenia. Dla każdego
   problemu podaj dokładny plik, obecną i oczekiwaną nazwę oraz wpływ na Angular,
   React i Storybook.
7. Sprawdź `git diff`; audyt read-only nie może pozostawić zmian źródłowych.

## Workflow przeniesienia lub zmiany nazwy

Traktuj przeniesienie między contextami i każdy rename publicznego assetu jako
breaking change.

1. Rozwiąż dokładne źródła i przygotuj tabelę:
   `stary plik/folder/nazwa Angular/eksport React -> nowy odpowiednik`.
2. Zweryfikuj docelowy context i nazwę z
   `references/icon-naming-system.md`. Sprawdź kolizje pliku, nazw publicznych,
   treści oraz znaczenia. Bez zatwierdzonego targetu zastosuj `STOP & ASK`.
3. Wyszukaj starą nazwę i ścieżkę w generatorze, Storybooku, testach,
   dokumentacji migracyjnej oraz potwierdzonych lokalnych konsumentach. Nie
   modyfikuj zewnętrznego repo bez zakresu użytkownika.
4. Przenieś lub zmień nazwę wyłącznie źródłowego SVG. Zachowaj treść, geometrię,
   kolory i `viewBox`; nie edytuj ręcznie wygenerowanych odpowiedników.
5. Zaktualizuj jawne grupy Storybooka, testy kontraktu i instrukcje migracyjne,
   jeśli używają starej nazwy. Zapisz pełne mapowanie Angular i React.
6. Uruchom obowiązkowo, w tej kolejności:
   `npm run build`, `npm run check:asset-types`, `npm run test:tokens`,
   `npm run build-storybook`.
7. Potwierdź, że nowy plik, nazwa Angular, eksport React i karta Storybooka
   istnieją, a stare odpowiedniki nie istnieją w źródłach ani wygenerowanym API.
8. Sprawdź kolory, `viewBox`, aktywne referencje `id` i kilka instancji React
   dla assetów wielokolorowych lub używających `clipPath`, mask i gradientów.
9. Sprawdź `git diff` pod kątem niezamierzonych zmian i wypisz breaking change
   dla CRM/PWA.

## Workflow usunięcia

Nie usuwaj assetu na podstawie samego audytu ani domysłu o braku użyć.

1. Rozwiąż dokładny plik źródłowy i jego nazwy Angular/React. Wymagaj jawnego
   polecenia usunięcia; brak potwierdzenia oznacza `STOP & ASK`.
2. Wyszukaj użycia pliku, nazwy registry i eksportu React w generatorze,
   Storybooku, testach, dokumentacji oraz potwierdzonych lokalnych konsumentach.
   Wyniki podziel na aktywne użycia, dokumentację migracyjną i artefakty
   wygenerowane.
3. Jeżeli istnieje aktywne użycie, zatrzymaj usunięcie i przedstaw wpływ albo
   wymagany zamiennik. Nie wybieraj zamiennika bez decyzji użytkownika.
4. Usuń wyłącznie zatwierdzony źródłowy SVG. Usuń również jawne odwołania do
   niego z grup Storybooka i testów kontraktu; zachowaj historyczne mapowanie
   w instrukcji migracyjnej, jeżeli jest potrzebne konsumentom.
5. Uruchom obowiązkowo, w tej kolejności:
   `npm run build`, `npm run check:asset-types`, `npm run test:tokens`,
   `npm run build-storybook`.
6. Potwierdź brak usuniętego pliku, nazwy Angular, eksportu React i karty
   Storybooka oraz zgodność liczby pozostałych źródeł z publicznymi listami.
7. Sprawdź, czy żadna grupa Storybooka nie stała się niekompletna i czy build
   nie pozostawił osieroconych plików w `dist` lub `storybook-static`.
8. Sprawdź `git diff`, wypisz breaking change i wskaż, że plik można odzyskać
   z historii Git, o ile zmiana nie została jeszcze trwale usunięta z historii.

## Storybook

Istniejące contexty pojawiają się automatycznie:

- ikony: `storybook/utils/assetLoader.js` używa `assets/icons/**/*.svg`,
- ilustracje: loader używa `dist/assets/react/illustrations/**/*.tsx`,
- `storybook/stories/Assets.stories.jsx` grupuje je według folderu.

Modyfikuj kod Storybooka tylko dla nowego contextu, nowego sposobu prezentacji
albo gdy automatyczny loader nie pokrywa poprawnego assetu. Nie twórz ręcznej
listy pojedynczych ikon.

Context `info` służy większym, szczegółowym infografikom z prefiksem
`illu_info_`. Prezentuj go w osobnej grupie `Info`; kafelek i obszar podglądu
powinny mieć około dwukrotny rozmiar względem zwykłej ilustracji, z zachowaniem
responsywnego przejścia do jednej kolumny na małym ekranie.

## Wynik dla użytkownika

Raportuj wyłącznie czynności faktycznie wykonane. Nie uruchamiaj dodatkowych
komend generujących artefakty tylko po to, żeby spełnić format raportu.

Dla dodania, przeniesienia, zmiany nazwy, usunięcia albo autoryzowanej naprawy
podaj:

- listę dodanych/przeniesionych/usuniętych źródeł,
- wynikowe nazwy Angular Registry i eksporty React,
- rezultat pełnego builda, testów i Storybooka,
- ostrzeżenia migracyjne dla CRM/PWA,
- każdą decyzję, której nie wolno było zgadnąć.

Dla audytu read-only podaj:

- zakres audytu oraz wykryte błędy, ryzyka i wymagane decyzje,
- rezultat tylko uruchomionych kontroli read-only,
- informację, że pełny build i Storybook nie zostały uruchomione, jeśli nie było
  autoryzowanej naprawy ani jawnej prośby o potwierdzenie wygenerowanego outputu,
- potwierdzenie, że audyt nie pozostawił zmian źródłowych.
