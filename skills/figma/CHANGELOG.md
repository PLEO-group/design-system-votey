# Changelog

## 1.25.2 — 2026-09-02

- Zawężono ładowanie `references/angular-implementation.md` wyłącznie do projektów Angular.
- Doprecyzowano, że sam Design System w repo React/Next lub innym stacku nie uruchamia Angularowej referencji.
- Usunięto z tytułu i wejścia referencji Angularowej sugestię, że jest ogólnym przewodnikiem dla każdego Design Systemu.

## 1.25.1 — 2026-09-02

- Uogólniono bazowe instrukcje implementacyjne skilla, żeby nie narzucały SCSS, JSX ani Tailwinda zespołom pracującym w innych stackach.
- Zmieniono bramkę Design Systemu na neutralną względem frameworka: mapowanie dotyczy kodu UI, stylów, tokenów, gridu, komponentów i assetów.
- Przeniesiono szczegóły składniowe do właściwych referencji stackowych; bazowy skill opisuje semantykę layoutu i stanów.

## 1.25.0 — 2026-09-02

- Dodano `DS mapping gate` do kontraktu implementacji UI z Figmy dla projektów używających Design Systemu.
- Dodano obowiązkowe mapowanie ikon jako assetów/wariantów DS, w tym rozmiaru i publicznej nazwy assetu.
- Doprecyzowano, że wartości pixelowe z Figmy nie powinny trafiać bezpośrednio do implementacji stylów, jeśli istnieje token, grid primitive, komponent albo wariant assetu.

## 1.24.0 — 2026-08-26

- Dodano obowiązkowy `Figma UI Implementation Gate` przed kodowaniem UI z Figmy.
- Wzmocniono mapowanie wartości z Figmy na tokeny Design Systemu i projektowe utility właściwe dla danego projektu.
- Dodano kontrolę zgodności widocznych tekstów między Figmą, CMS/specem i kodem.
- Rozszerzono wymóg runtime validation przez `chrome-debug`/Playwright na implementacje React/Next oraz overlaye.
- Doprecyzowano MCP Guard: automatyczne są tylko diagnostyczne komendy read-only, a `codex mcp add` i `codex mcp login` wymagają jawnej zgody użytkownika.
- Doprecyzowano kolejność MCP Guard w Codexie: natywne narzędzia Figmy mają pierwszeństwo przed fallbackiem przez `codex` CLI.
- Doprecyzowano relację `verified`/`partial`/`blocked`: można kontynuować zakresy `verified`, a blokada dotyczy całego wymaganego zakresu lub krytycznych wartości implementowanego zakresu.
- Zawężono `Figma UI Implementation Gate` dla zmian czysto tekstowych, żeby nie wymagać mapowania tokenów i klas przy aktualizacji treści.

## 1.23.0 — 2026-08-20

- Zawężono opis i triggery skilla do odczytu Figmy oraz implementacji frontendowej.
- Doprecyzowano, że `content-to-cms.md` ładuje się wyłącznie dla zadań CMS.
- Dodano warunek aktywnej zakładki Figma Desktop dla mostu `use_figma` oraz preferencję `get_metadata` przy odczycie między plikami.

## Historia wcześniejszych wersji

- **1.22.1** — Dodano wyjątek dla korekt usuwających lokalne override'y bez wyboru nowych wartości wizualnych.
- **1.22.0** — Ujednolicono fallback dla błędów odczytu Figmy i dodano niezależną walidację techniczną po implementacji.
- **1.21.0** — Doprecyzowano zakres breakpointów, trigger bez Figmy, macierz wariantów i checklistę krytycznych wartości.
- **1.16.0** — Dodano kontrakt breakpoint × input modality i bramkę struktury responsywnej.
- **1.15.0** — Dodano obowiązkowy handoff do grid contractu dla sekcji implementowanych z Figmy.
- **1.14.0** — Dodano route placement, macierz kolekcji, szybki follow-up, bounded tuning i preflight credentiali Sanity.
- **1.13.0** — Dodano topologię i allowlistę mutacji CMS oraz ledger sekwencyjnej akceptacji breakpointów runtime.
- **1.12.0** — Dodano target scope verification i follow-up breakpoint diff dla iteracyjnych poprawek layoutu z Figmy.
- **1.11.0** — Dodano Sanity workflow dla content-to-CMS: target preflight, Unicode-safe mutation i read-after-write audit.
- **1.10.0** — Dodano commit-aware mutacje CMS, deterministyczny fallback JSONL dla bridge'a Codex oraz freshness contract runtime.
- **1.9.0** — Runtime pixel-perfect loop wymaga pełnego preflightu chrome-debug: dev server reuse, route status i sandbox-aware Playwright CLI.
- **1.8.0** — Dodano runtime pixel-perfect loop z chrome-debug, route contract i stabilnymi selektorami modułów.
- **1.7.0** — Dodano obowiązkowy kontrakt struktury layoutu przed kodowaniem.
- **1.6.0** — Dodano zbiorczy status odczytu Figmy i fallback dla częściowo niedostępnych danych.
- **1.5.1** — Doprecyzowano Angular/Design System reference i obowiązek walidacji runtime dla implementacji UI z Figmy.
- **1.5.0** — Dodano Angular/Design System reference i obowiązek walidacji runtime dla implementacji UI z Figmy.
