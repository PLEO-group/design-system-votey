---
name: votey-design-system
description: >
  Implementuj i reviewuj UI korzystające z `@pleodigital/design-system-votey`
  w `design-system-votey`, `wyborek-crm`, `votey-user-app` oraz innych potwierdzonych
  konsumentach paczki. Używaj przy przekładaniu handoffu z Figmy na kod, doborze tokenów,
  responsywności, użyciu opublikowanych assetów SVG, publicznego API paczki i lokalnych
  prymitywów Votey, a także przy tworzeniu, migracji i review Angularowych komponentów
  źródłowych w paczce: selektorów `vt-*`, tokenizacji, reużywalności, publicznych eksportów
  i Storybooka. Gdy zadanie polega na dodaniu, przeniesieniu, zmianie nazwy,
  usunięciu albo audycie źródłowych SVG w design-system-votey, użyj najpierw
  `votey-svg-assets`, a do tego skilla wróć dopiero dla integracji w konsumencie.
  Triggeruj dla zmian Angular/SCSS w CRM, React/Next/Tailwind w PWA, tokenów Votey,
  importów `@pleodigital/design-system-votey`, `@votey/*`, `tokens.angular.css`,
  `tokens.light.css`, `tokens.dark.css`, `tokens.tailwind.css`, klas `rv-*`,
  `provideVoteyDeviceDetection()`, `provideVoteySvgRegistry()` oraz implementacji
  z makiet Figmy w ekosystemie Votey.
  Pomiń dla projektów BoxEs, aplikacji bez tej paczki oraz samego odczytu Figmy bez
  implementacji w kodzie.
version: 1.2.0
author: n.koktysz@pleodigital.com
scope: SHARED
category: Frontend
tags: [FE]
---

# Votey Design System

# CHANGELOG

# 1.2.0 — Dodano wybór sposobu użycia publicznych assetów w Angularze i React oraz obowiązkową bramkę jakościową dla lokalnego osadzania SVG.

# 1.1.0 — Dodano publiczny Angular SVG registry, provider bootstrapu, kontrakt migracji konsumentów z lokalnych rejestrów oraz standard autorowania Angularowych komponentów źródłowych.

# 1.0.2 — Poprawiono autora skilla, dodano system nazewnictwa ikon Votey, a następnie wydzielono onboarding, zmiany i audyt źródłowych SVG do `votey-svg-assets`.

# 1.0.1 — Dodano wybór między mixinami SCSS a `VoteyDeviceService` dla różnic urządzeniowych w Angularze.

# 1.0.0 — Utworzono kontrakt implementacji Votey z osobnymi referencjami dla Angular CRM i React/Next PWA.

## Granice odpowiedzialności

Ten skill tłumaczy potwierdzony projekt lub handoff Figmy na kontrakt Votey.
Nie zastępuje:

- `figma` — odpowiada za MCP, odczyt node’ów, klasyfikację `verified / partial / blocked`
  i neutralny handoff;
- `votey-svg-assets` — odpowiada za przyjęcie źródłowych SVG, nazewnictwo,
  klasyfikację folderu, generatory Angular/React, pełny build i Storybook;
- lokalnych standardów Angulara albo Reacta — odpowiadają za kod frameworka;
- lokalnych skilli prymitywów, formularzy, testów i debugowania runtime.

Jeżeli zadanie zawiera link do Figmy, najpierw uruchom `figma`. Ten skill zaczyna pracę
dopiero od gotowego handoffu i nie odczytuje makiety ponownie bez konkretnej luki.

## Routing frameworka

Rozpoznaj repo, framework i faktycznie zainstalowaną paczkę przed wczytaniem referencji:

| Kontekst | Referencja |
|---|---|
| Dodawanie, przenoszenie, zmiana nazwy, usuwanie albo audyt źródłowych SVG | przerwij ten workflow i użyj `votey-svg-assets`; wróć tutaj tylko dla integracji w konsumencie |
| Tworzenie, migracja albo review Angularowego komponentu źródłowego w `design-system-votey` | `references/angular-components.md` |
| `wyborek-crm` albo inny konsument Angular + `@pleodigital/design-system-votey` | `references/angular.md` |
| `votey-user-app`, React/Next + `@pleodigital/design-system-votey` | `references/react.md` |
| Integracja opublikowanej ikony lub ilustracji w komponencie albo stylach | właściwa referencja frameworka oraz `references/assets.md` |
| Inny konsument paczki | wybierz referencję frameworka, ale użyj tylko publicznego kontraktu potwierdzonego w tym repo |
| Brak paczki albo projekt BoxEs | zatrzymaj routing; ten skill nie ma zastosowania |

Przy przenoszeniu komponentu z CRM do paczki wczytaj najpierw `references/angular-components.md`,
a `references/angular.md` tylko dla sprawdzenia integracji po stronie konsumenta. Nie ładuj
obu referencji frameworkowych, jeżeli zmiana dotyczy tylko jednego frameworka. Nie duplikuj
reguł nazewnictwa ani onboardingu SVG w tym skillu;
ich źródłem prawdy jest `votey-svg-assets/references/icon-naming-system.md`.

## Workflow

1. Odczytaj `AGENTS.md`, `package.json`, konfigurację builda i najbliższy istniejący
   przykład w repo.
2. Jeżeli źródłem jest Figma, odbierz handoff z targetem, layout-driving scope,
   stanami, breakpointami oraz listą wartości potwierdzonych i brakujących.
3. Jeżeli zadanie zmienia źródłowe SVG, przekaż ten zakres do `votey-svg-assets`
   i kontynuuj dopiero po jego buildzie oraz walidacji.
4. Wczytaj właściwą referencję dla komponentu źródłowego albo konsumenta zgodnie z routingiem.
5. Jeżeli implementacja używa ikony albo ilustracji, wczytaj `references/assets.md`,
   wybierz publiczny mechanizm frameworka i wykonaj opisaną tam bramkę dla każdego
   proponowanego lokalnego osadzenia.
6. Potwierdź publiczne API zainstalowanej wersji paczki. Nie zakładaj eksportu na
   podstawie samej nazwy pliku w repo Design Systemu.
7. Rozdziel odpowiedzialność:
   - paczka Votey: tokeny, eksportowane assety i Angular responsive runtime,
   - aplikacja: lokalne komponenty, grid, integracja frameworka i zachowanie domenowe.
8. Zmapuj role z handoffu na istniejące tokeny i prymitywy. Brakujący kontrakt
   zgłoś jako gap; nie kopiuj podobnej roli z innego frameworka ani produktu.
9. Zaimplementuj zgodnie z lokalnymi skillami frameworka.
10. Dla Angularowego komponentu źródłowego wykonaj i jawnie zamknij bramkę tokenizacji
   SCSS opisaną w `references/angular-components.md`.
11. Uruchom najwęższą właściwą walidację statyczną i runtime wskazaną w referencji.

## Wspólne reguły Votey

- Nie edytuj ręcznie `dist`, plików w `node_modules` ani wygenerowanych assetów.
- Nie importuj tokenów, komponentów, breakpointów ani runtime’u z BoxEs.
- Nie przenoś `tokens.angular.css`, `provideVoteyDeviceDetection()` ani Angularowych
  `--space-*` / `--typo-*` do Reacta.
- Nie przenoś lokalnych klas `rv-*`, providerów PWA ani arkuszy light/dark do CRM.
- Nie zakładaj istnienia konkretnego komponentu, wariantu ani inputu na podstawie nazwy
  pliku źródłowego. Zawsze sprawdź publiczne API paczki i lokalne prymitywy aplikacji.
- Nie kopiuj publicznego SVG do konsumenta, nie wklejaj go inline i nie zastępuj data URI.
  Lokalne osadzenie assetu jest wyjątkiem wymagającym jawnego zamknięcia bramki z
  `references/assets.md`.
- Nie wpisuj surowych kolorów, jeśli istnieje odpowiednia rola semantyczna.
- Nie zgaduj nazwy tokenu, klasy Tailwind, assetu ani breakpointu z nazwy warstwy Figmy.
- Zmianę brakującego tokenu w kategorii objętej tokenizacją wykonuj w
  `design-system-votey` jako osobny, jawny zakres. Nie wymagaj tokenu dla kategorii,
  której Design System nie tokenizuje. Dla brakującego assetu użyj `votey-svg-assets`;
  po jego walidacji zweryfikuj konsumenta na zbudowanej paczce.

## Handoff wymagany przed implementacją z Figmy

Nie zaczynaj mapowania Votey, dopóki handoff nie zawiera:

- dokładnego targetu i layout-driving scope,
- potwierdzonej hierarchii oraz resizing `fill / hug / fixed`,
- wartości krytycznych oznaczonych jako potwierdzone, inferowane albo brakujące,
- różnic dla wszystkich wskazanych breakpointów, stanów i theme’ów,
- kontraktu struktury oraz interakcji.

Wartość z Figmy nie jest automatycznie tokenem, breakpointem ani klasą. Referencja
frameworkowa odpowiada za właściwe mapowanie.

## Weryfikacja końcowa

- Potwierdź, że użyto właściwego entry pointu i warstwy tokenów dla frameworka.
- Potwierdź brak przecieków kontraktu Angular ↔ React oraz Votey ↔ BoxEs.
- Uruchom build/test wskazany w lokalnym repo.
- Dla zmiany wizualnej sprawdź target route, theme, viewport, console, overflow
  i computed values krytycznych tokenów.
- Nie deklaruj pixel-perfect bez screenshotu runtime i potwierdzonych wartości krytycznych.
