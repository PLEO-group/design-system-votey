---
name: votey-design-system
description: >
  Implementuj i reviewuj UI korzystające z `@pleodigital/design-system-votey`
  w `design-system-votey`, `wyborek-crm`, `votey-user-app` oraz innych potwierdzonych
  konsumentach paczki. Używaj przy przekładaniu handoffu z Figmy na kod, doborze tokenów,
  responsywności, assetów SVG, nazewnictwa ikon, publicznego API paczki i lokalnych
  prymitywów Votey.
  Triggeruj dla zmian Angular/SCSS w CRM, React/Next/Tailwind w PWA, tokenów Votey,
  importów `@pleodigital/design-system-votey`, `@votey/*`, `tokens.angular.css`,
  `tokens.light.css`, `tokens.dark.css`, `tokens.tailwind.css`, klas `rv-*`,
  `provideVoteyDeviceDetection()`, audytów i zmian nazw `icon_*` oraz implementacji
  z makiet Figmy w ekosystemie Votey.
  Pomiń dla projektów BoxEs, aplikacji bez tej paczki oraz samego odczytu Figmy bez
  implementacji w kodzie.
version: 1.0.2
author: n.koktysz@pleodigital.com
scope: SHARED
category: Frontend
tags: [FE]
---

# Votey Design System

# CHANGELOG

# 1.0.2 — Poprawiono autora skilla oraz dodano system nazewnictwa ikon Votey z mapowaniem nazw plików na Angular Registry i eksporty React.

# 1.0.1 — Dodano wybór między mixinami SCSS a `VoteyDeviceService` dla różnic urządzeniowych w Angularze.

# 1.0.0 — Utworzono kontrakt implementacji Votey z osobnymi referencjami dla Angular CRM i React/Next PWA.

## Granice odpowiedzialności

Ten skill tłumaczy potwierdzony projekt lub handoff Figmy na kontrakt Votey.
Nie zastępuje:

- `figma` — odpowiada za MCP, odczyt node’ów, klasyfikację `verified / partial / blocked`
  i neutralny handoff;
- lokalnych standardów Angulara albo Reacta — odpowiadają za kod frameworka;
- lokalnych skilli prymitywów, formularzy, testów i debugowania runtime.

Jeżeli zadanie zawiera link do Figmy, najpierw uruchom `figma`. Ten skill zaczyna pracę
dopiero od gotowego handoffu i nie odczytuje makiety ponownie bez konkretnej luki.

## Routing frameworka

Rozpoznaj repo, framework i faktycznie zainstalowaną paczkę przed wczytaniem referencji:

| Kontekst | Referencja |
|---|---|
| Dodawanie, przenoszenie, zmiana nazwy albo audyt ikon | `references/icon-naming-system.md`, a następnie właściwa referencja frameworkowa, jeżeli zmiana dotyka konsumenta |
| `design-system-votey`, `wyborek-crm`, Angular + `@pleodigital/design-system-votey` | `references/angular.md` |
| `votey-user-app`, React/Next + `@pleodigital/design-system-votey` | `references/react.md` |
| Inny konsument paczki | wybierz referencję frameworka, ale użyj tylko publicznego kontraktu potwierdzonego w tym repo |
| Brak paczki albo projekt BoxEs | zatrzymaj routing; ten skill nie ma zastosowania |

Nie ładuj obu referencji frameworkowych, jeżeli zmiana dotyczy tylko jednego
frameworka. Referencję nazewnictwa ikon ładuj niezależnie od frameworka zawsze,
gdy zadanie zmienia albo ocenia nazwę ikony.

## Workflow

1. Odczytaj `AGENTS.md`, `package.json`, konfigurację builda i najbliższy istniejący
   przykład w repo.
2. Jeżeli źródłem jest Figma, odbierz handoff z targetem, layout-driving scope,
   stanami, breakpointami oraz listą wartości potwierdzonych i brakujących.
3. Dla dodawania, zmiany nazwy, przenoszenia albo audytu ikon wczytaj
   `references/icon-naming-system.md`.
4. Wczytaj jedną właściwą referencję frameworkową, jeżeli zadanie dotyka konsumenta.
5. Potwierdź publiczne API zainstalowanej wersji paczki. Nie zakładaj eksportu na
   podstawie samej nazwy pliku w repo Design Systemu.
6. Rozdziel odpowiedzialność:
   - paczka Votey: tokeny, eksportowane assety i Angular responsive runtime,
   - aplikacja: lokalne komponenty, grid, integracja frameworka i zachowanie domenowe.
7. Zmapuj role z handoffu na istniejące tokeny i prymitywy. Brakujący kontrakt
   zgłoś jako gap; nie kopiuj podobnej roli z innego frameworka ani produktu.
8. Zaimplementuj zgodnie z lokalnymi skillami frameworka.
9. Uruchom najwęższą właściwą walidację statyczną i runtime wskazaną w referencji.

## Wspólne reguły Votey

- Nie edytuj ręcznie `dist`, plików w `node_modules` ani wygenerowanych assetów.
- Nie importuj tokenów, komponentów, breakpointów ani runtime’u z BoxEs.
- Nie przenoś `tokens.angular.css`, `provideVoteyDeviceDetection()` ani Angularowych
  `--space-*` / `--typo-*` do Reacta.
- Nie przenoś lokalnych klas `rv-*`, providerów PWA ani arkuszy light/dark do CRM.
- Nie zakładaj, że paczka publikuje gotowe komponenty Button, Input, Modal, Table
  albo Text. Zawsze sprawdź publiczne API i lokalne prymitywy aplikacji.
- Nie wpisuj surowych kolorów, jeśli istnieje odpowiednia rola semantyczna.
- Nie zgaduj nazwy tokenu, klasy Tailwind, assetu ani breakpointu z nazwy warstwy Figmy.
- Zmianę brakującego tokenu lub assetu wykonuj w `design-system-votey` jako osobny,
  jawny zakres, a następnie przebuduj paczkę i zweryfikuj konsumenta.

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
