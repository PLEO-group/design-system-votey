# Mapowanie kolorów CRM → Design System

Data: 2026-07-22  
CRM commit bazowy: `dfc969e217bb5b2ff9c75205c20c6117e966cc3b`  
Design System commit bazowy: `dd614ce7371765222e13879e6798e0fae38e04d1`

## START HERE — panel decyzji

Ten panel jest jedyną listą miejsc wymagających decyzji. Szczegółowe tabele niżej są materiałem dowodowym i nie należy czytać ich od góry do dołu jako checklisty.

### Statusy

- `✅ APPROVED` — decyzja podjęta; nie wymaga ponownego przeglądu.
- `⚙️ AUTO / EXACT` — wartości są identyczne; jest to mechaniczna migracja, nie decyzja wizualna.
- `🟡 DECISION REQUIRED` — potrzebna jest Twoja decyzja.
- `⏸ DEFERRED` — nie decydujemy po samym hexie; wracamy po analizie roli, użyć i Figmy.
- `🧹 IMPLEMENTATION` — zadanie techniczne, nie decyzja projektowa.

### Decyzje rozstrzygnięte — primitives

| ID | Kolor CRM | Wynik | Główne użycie | Status |
|---|---|---|---|---|
| `D-COLOR-01` | `--color-f4f9ff` (`#f4f9ff`) | `--color-blue-25` (`#eefbfe`), ΔE `0,0093` | `--app-color-bg-page`, 42 użycia | ✅ APPROVED — odrzucono mint-green-50 |
| `D-COLOR-02` | `--color-e0eefc` (`#e0eefc`) | `--color-blue-70` (`#e1efff`), ΔE `0,0045` | `--app-color-bg-surface-soft`, 11 użyć | ✅ APPROVED |

Pierwsza runda przeglądu primitives jest zamknięta. Nie ma decyzji kolorystycznych wymaganych teraz do zakończenia punktów 7–8 etapu 0.

### Decyzje odłożone do etapu semantic/Figma

Nie wymagają odpowiedzi teraz, ale muszą zostać rozstrzygnięte przed zakończeniem etapu 3:

| ID | Temat | Co trzeba zdecydować | Dlaczego nie teraz |
|---|---|---|---|
| `D-SEM-01` | 15 używanych aliasów z exact-value semantic candidates | zatwierdzić rolę, nie tylko wartość | identyczny hex nie gwarantuje poprawnej semantyki |
| `D-BRAND-01` | `brand-primary` i `brand-accent` | zatwierdzić rozdzielenie na text/surface/border/icon/button | obecne aliasy są wieloról |
| `D-CORE-01` | 35 używanych primitives bez bezpiecznego kandydata | zdecydować: semantic ze zmianą wizualną albo nowy core | decyzja zależy od rzeczywistych użyć i Figmy; 4 dodatkowe nieużywane primitives idą do cleanupu |
| `D-SEM-MISSING-01` | 73 używane aliasy bez semantic candidate | przypisać istniejący semantic ze zmianą wartości albo zaprojektować brakującą rolę | primitive i semantic rozwiązujemy osobno; wymaga kontekstu komponentu |
| `D-SHADOW-01` | shadows | zdecydować, czy tokenizujemy tylko semantic shadow color, czy całą elewację: color + offset + blur + spread | wymaga wspólnego modelu dla Angulara i Reacta |
| `D-OVERLAY-01` | accent overlay gradient | potwierdzić opaque core i dwa semantic gradient stops | alpha hex nie powinien trafić do core |
| `D-BUG-01` | dwa niezdefiniowane aliasy | wskazać docelową rolę dla `text-primary-white` i `text-body` | obecny kod zawiera błąd/ fallback, a nie jawny kontrakt |

### Pozycje niewymagające decyzji

- 46 mapowań primitives ma status `✅ APPROVED`, w tym trzy użycia dwóch nowych yellow core values.
- 15 primitives ma identyczne wartości w istniejącym core — migracja `⚙️ AUTO / EXACT`.
- Nowe zaakceptowane core values: `yellow-25: #fffcf1` oraz `yellow-50: #fff5e1`.
- 14 nieużywanych aliasów i 8 nieużywanych primitives to `🧹 IMPLEMENTATION`: usuwamy je dopiero po sprawdzeniu braku użyć dynamicznych.

## Jak czytać tabelę

- Dopasowanie `exact` oznacza zgodność wartości w light theme, nie automatyczną zgodność semantyczną.
- Oznaczenie `zbliżony kolor` wymaga łącznie: odległości `ΔE OKLab ≤ 0,03`, identycznego kanału alpha oraz zachowania chromy/rodziny hue dla kolorów widocznie chromatycznych. Samo ΔE nie jest wystarczające, szczególnie dla bardzo jasnych tintów. Przy proponowanym core tokenie podano także jego hex. Wiersze `✅ APPROVED` są już zamknięte; tylko `🟡 DECISION REQUIRED` czekają na potwierdzenie.
- Kandydat semantic oznaczony `🟡 DECISION REQUIRED` wymaga potwierdzenia roli przez użycia i Figmę; zgodność wartości nie wystarcza.
- Brak dopasowania nie oznacza, że wszystkie 85 kolory trzeba dodać do core. Najpierw należy przepiąć użycia na semantykę i dopiero potem ocenić potrzebne wartości.
- Docelowo komponenty CRM powinny używać semantic tokens; tabela primitives służy do likwidacji warstwy nazwanej hexami.

## Podsumowanie pokrycia

| Warstwa CRM | Liczba | Exact match w aktualnym DS | Brak exact match / expression |
|---|---:|---:|---:|
| Hex primitives `--color-*` | 100 | 15 base | 85 |
| Semantic aliases `--app-color-*` | 110 | 26 ma co najmniej jeden semantic value match | 82 bez exact value + 2 expressions |

Dla 42 z 85 primitives bez exact match pozostaje propozycja zbliżonego, już istniejącego core tokenu po kontroli ΔE, alpha, chromy i hue. Dodatkowo zapisano dwie nowe wartości core w rodzinie yellow używane przez trzy primitives oraz jedną świadomą decyzję przypisania do rodziny navy-blue poza automatycznym progiem. Pozostałych 39 wartości nie ma propozycji automatycznej w tej tabeli.

### Zaakceptowane do dodania w rodzinie yellow

| Proponowany core token | Hex | Powód |
|---|---|---|
| `--color-yellow-25` | `#fffcf1` | nowy najjaśniejszy yellow; źródło dla warning banner i zbliżonego `#fffcf5` |
| `--color-yellow-50` | `#fff5e1` | nowy jasny yellow pomiędzy `yellow-25` i istniejącym `yellow-100` (`#ffeda3`) |

Te wpisy są zaakceptowaną decyzją mapowania, ale pozostają zadaniem implementacyjnym. Nie zostały jeszcze dodane do `tokens/base/colors.json` ani wygenerowanego `dist`.

## Załącznik A — primitives CRM

| CRM primitive | Wartość | DS base replacement                                                                  | Liczba bezpośrednich aliasów app | Decyzja migracyjna |
|---|---|--------------------------------------------------------------------------------------|---:|---|
| `--color-ffffff` | `#ffffff` | `--color-white` — ⚙️ AUTO / EXACT | 2 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-2af5ba` | `#2af5ba` | `--color-mint-green-400` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-07064e` | `#07064e` | `--color-navy-blue-800` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-010027` | `#010027` | `--color-navy-blue-900` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-0ad69c` | `#0ad69c` | `--color-mint-green-500` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-1517524d` | `#1517524d` | — — ⏸ DEFERRED `D-SHADOW-01` | 1 | ⏸ **DEFERRED** — patrz `D-SHADOW-01` w panelu decyzji |
| `--color-3b3a76` | `#3b3a76` | `--color-navy-blue-400` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-5250df` | `#5250df` | `--color-navy-blue-200` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-939393` | `#939393` | `--color-gray-700` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-c6c6c6` | `#c6c6c6` | `--color-gray-500` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-e1fff6` | `#e1fff6` | `--color-mint-green-70` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-dfedfb` | `#dfedfb` | `--color-blue-70` (`#e1efff`) *(zbliżony kolor; ΔE OKLab 0.0072)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-f19a58` | `#f19a58` | `--color-orange-300` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-f6f6f6` | `#f6f6f6` | `--color-gray-100` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-5f6368` | `#5f6368` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-ebf4fd` | `#ebf4fd` | `--color-blue-70` (`#e1efff`) *(zbliżony kolor; ΔE OKLab 0.0198)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-f4f9ff` | `#f4f9ff` | `--color-blue-25` (`#eefbfe`) *(zbliżony kolor; ΔE OKLab 0.0093)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta; odrzucono mint-green-50 |
| `--color-08db9e` | `#08db9e` | `--color-mint-green-500` (`#0ad69c`) *(zbliżony kolor; ΔE OKLab 0.0139)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-ffb87e` | `#ffb87e` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-d6d6d6` | `#d6d6d6` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-d5d9e5` | `#d5d9e5` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-fd8080` | `#fd8080` | — — ⏸ DEFERRED `D-CORE-01` | 2 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-181c63` | `#181c63` | `--color-navy-blue-700` (`#13125d`) *(zbliżony kolor; ΔE OKLab 0.0276)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-46467b` | `#46467b` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-23db9e` | `#23db9e` | `--color-mint-green-500` (`#0ad69c`) *(zbliżony kolor; ΔE OKLab 0.0155)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-e0eefc` | `#e0eefc` | `--color-blue-70` (`#e1efff`) *(zbliżony kolor; ΔE OKLab 0.0045)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-444d5f` | `#444d5f` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-191c63` | `#191c63` | `--color-navy-blue-700` (`#13125d`) *(zbliżony kolor; ΔE OKLab 0.0284)*   ✅ APPROVED | 0 | 🧹 **IMPLEMENTATION** — primitive nieużywany; usunąć zamiast migrować (approved mapping zostaje referencją) |
| `--color-28eec7` | `#28eec7` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-fcd5b5` | `#fcd5b5` | `--color-orange-100` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-c2faef` | `#c2faef` | `--color-mint-green-100` (`#cafdee`) *(zbliżony kolor; ΔE OKLab 0.0130)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-404040` | `#404040` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-4f4e81` | `#4f4e81` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-cccccc` | `#cccccc` | `--color-gray-500` (`#c6c6c6`) *(zbliżony kolor; ΔE OKLab 0.0187)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-515182` | `#515182` | — — 🧹 IMPLEMENTATION: usunąć po kontroli użyć dynamicznych | 0 | 🧹 **IMPLEMENTATION** — usunąć po kontroli braku użyć dynamicznych |
| `--color-7878af` | `#7878af` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-000000` | `#000000` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-24dba6` | `#24dba6` | `--color-mint-green-500` (`#0ad69c`) *(zbliżony kolor; ΔE OKLab 0.0187)* ✅ APPROVED | 0 | 🧹 **IMPLEMENTATION** — primitive nieużywany; usunąć zamiast migrować (approved mapping zostaje referencją) |
| `--color-9da5b4` | `#9da5b4` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-e6e6e6` | `#e6e6e6` | `--color-gray-400` (`#ececec`) *(zbliżony kolor; ΔE OKLab 0.0181)*   ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-29fa7f4e` | `#29fa7f4e` | — — ⏸ DEFERRED `D-OVERLAY-01` | 1 | ⏸ **DEFERRED** — patrz `D-OVERLAY-01` w panelu decyzji |
| `--color-157d4000` | `#157d4000` | — — ⏸ DEFERRED `D-OVERLAY-01` | 1 | ⏸ **DEFERRED** — patrz `D-OVERLAY-01` w panelu decyzji |
| `--color-dbf7f5` | `#dbf7f5` | `--color-blue-100` (`#cdf4fd`) *(zbliżony kolor; ΔE OKLab 0.0226)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-2bf5ba` | `#2bf5ba` | `--color-mint-green-400` (`#2af5ba`) *(zbliżony kolor; ΔE OKLab 0.0002)*    ✅ APPROVED | 0 | 🧹 **IMPLEMENTATION** — primitive nieużywany; usunąć zamiast migrować (approved mapping zostaje referencją) |
| `--color-66bb6a` | `#66bb6a` | `--color-active-green-500` (`#5fbe54`) *(zbliżony kolor; ΔE OKLab 0.0297)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-dcdcdc` | `#dcdcdc` | — — 🧹 IMPLEMENTATION: usunąć po kontroli użyć dynamicznych | 0 | 🧹 **IMPLEMENTATION** — usunąć po kontroli braku użyć dynamicznych |
| `--color-f1f1f1` | `#f1f1f1` | `--color-gray-100` (`#f6f6f6`) *(zbliżony kolor; ΔE OKLab 0.0150)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-1d1b64` | `#1d1b64` | — — 🧹 IMPLEMENTATION: usunąć po kontroli użyć dynamicznych | 0 | 🧹 **IMPLEMENTATION** — usunąć po kontroli braku użyć dynamicznych |
| `--color-fff8f1` | `#fff8f1` | `--color-orange-50` (`#fff3e8`) *(zbliżony kolor; ΔE OKLab 0.0143)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-00000014` | `#00000014` | — — ⏸ DEFERRED `D-SHADOW-01` | 1 | ⏸ **DEFERRED** — patrz `D-SHADOW-01` w panelu decyzji |
| `--color-9aaec3` | `#9aaec3` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-ffac00` | `#ffac00` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-ffd52f` | `#ffd52f` | `--color-yellow-400` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-c0c0c0` | `#c0c0c0` | `--color-gray-500` (`#c6c6c6`) *(zbliżony kolor; ΔE OKLab 0.0188)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-f2f2f2` | `#f2f2f2` | `--color-gray-100` (`#f6f6f6`) *(zbliżony kolor; ΔE OKLab 0.0120)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-d8f8ef` | `#d8f8ef` | `--color-mint-green-100` (`#cafdee`) *(zbliżony kolor; ΔE OKLab 0.0203)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-27cc9c` | `#27cc9c` | `--color-mint-green-500` (`#0ad69c`) *(zbliżony kolor; ΔE OKLab 0.0286)*  ✅ APPROVED | 0 | 🧹 **IMPLEMENTATION** — primitive nieużywany; usunąć zamiast migrować (approved mapping zostaje referencją) |
| `--color-525864` | `#525864` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-cbcbcb` | `#cbcbcb` | `--color-gray-500` (`#c6c6c6`) *(zbliżony kolor; ΔE OKLab 0.0156)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-c9fac2` | `#c9fac2` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-fafafa` | `#fafafa` | `--color-gray-100` (`#f6f6f6`) *(zbliżony kolor; ΔE OKLab 0.0120)*     ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-efefef` | `#efefef` | `--color-gray-400` (`#ececec`) *(zbliżony kolor; ΔE OKLab 0.0090)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-b0afe8` | `#b0afe8` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-f5f5f5` | `#f5f5f5` | `--color-gray-100` (`#f6f6f6`) *(zbliżony kolor; ΔE OKLab 0.0030)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-e8e8e8` | `#e8e8e8` | `--color-gray-400` (`#ececec`) *(zbliżony kolor; ΔE OKLab 0.0121)*   ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-fffdf8` | `#fffdf8` | `--color-white` (`#ffffff`) *(zbliżony kolor; ΔE OKLab 0.0090)*     ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-ecc3a5` | `#ecc3a5` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-e7f2fc` | `#e7f2fc` | `--color-blue-70` (`#e1efff`) *(zbliżony kolor; ΔE OKLab 0.0128)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-f2f2f7` | `#f2f2f7` | `--color-gray-100` (`#f6f6f6`) *(zbliżony kolor; ΔE OKLab 0.0125)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-dbeafc` | `#dbeafc` | `--color-blue-70` (`#e1efff`) *(zbliżony kolor; ΔE OKLab 0.0155)*   ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-e8e8ef` | `#e8e8ef` | `--color-gray-400` (`#ececec`) *(zbliżony kolor; ΔE OKLab 0.0138)*   ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-fffcf1` | `#fffcf1` | nowy `--color-yellow-25` (`#fffcf1`) *(exact po dodaniu)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-ececec` | `#ececec` | `--color-gray-400` — ⚙️ AUTO / EXACT | 1 | ⚙️ **AUTO / EXACT** — mechaniczna zamiana bez zmiany wartości |
| `--color-dfe2eb` | `#dfe2eb` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-a9b3cf` | `#a9b3cf` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-606489` | `#606489` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-fff5e1` | `#fff5e1` | nowy `--color-yellow-50` (`#fff5e1`) *(exact po dodaniu)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-eafff9` | `#eafff9` | `--color-mint-green-50` (`#edfffa`) *(zbliżony kolor; ΔE OKLab 0.0041)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-25e0a9` | `#25e0a9` | — — 🧹 IMPLEMENTATION: usunąć po kontroli użyć dynamicznych | 0 | 🧹 **IMPLEMENTATION** — usunąć po kontroli braku użyć dynamicznych |
| `--color-c5ccda` | `#c5ccda` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-9beed8` | `#9beed8` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-b2f5e4` | `#b2f5e4` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-e9e9e9` | `#e9e9e9` | `--color-gray-400` (`#ececec`) *(zbliżony kolor; ΔE OKLab 0.0091)*   ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-f08080` | `#f08080` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-ff6e6e` | `#ff6e6e` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-e03f3f` | `#e03f3f` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-ff5656` | `#ff5656` | `--color-red-400` (`#f56161`) *(zbliżony kolor; ΔE OKLab 0.0232)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-29f8bb` | `#29f8bb` | `--color-mint-green-400` (`#2af5ba`) *(zbliżony kolor; ΔE OKLab 0.0081)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-08c9db` | `#08c9db` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-fffcf5` | `#fffcf5` | nowy `--color-yellow-25` (`#fffcf1`) *(zbliżony kolor; ΔE OKLab 0.0053)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-6c6c6c` | `#6c6c6c` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-929292` | `#929292` | `--color-gray-700` (`#939393`) *(zbliżony kolor; ΔE OKLab 0.0033)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-c5c5c5` | `#c5c5c5` | `--color-gray-500` (`#c6c6c6`) *(zbliżony kolor; ΔE OKLab 0.0031)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-f0f0f0` | `#f0f0f0` | `--color-gray-400` (`#ececec`) *(zbliżony kolor; ΔE OKLab 0.0121)*  ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-fafcff` | `#fafcff` | `--color-navy-blue-25` (`#e9eaff`) *(decyzja projektowa; ΔE OKLab 0.0537)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-e2edf8` | `#e2edf8` | `--color-blue-70` (`#e1efff`) *(zbliżony kolor; ΔE OKLab 0.0092)*   ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-d1dbe6` | `#d1dbe6` | — — ⏸ DEFERRED `D-CORE-01` | 1 | ⏸ **DEFERRED** — patrz `D-CORE-01` w panelu decyzji |
| `--color-fefefe` | `#fefefe` | `--color-white` (`#ffffff`) *(zbliżony kolor; ΔE OKLab 0.0030)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-e6ecf3` | `#e6ecf3` | `--color-navy-blue-25` (`#e9eaff`) *(zbliżony kolor; ΔE OKLab 0.0196)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |
| `--color-c1c1c1` | `#c1c1c1` | `--color-gray-500` (`#c6c6c6`) *(zbliżony kolor; ΔE OKLab 0.0156)* ✅ APPROVED | 1 | ✅ **APPROVED** — decyzja zamknięta |

## Załącznik B — semantic aliases CRM

| Token CRM | Definicja CRM | Wartość rozwiązana | Użycia poza `colors.scss` | Exact DS semantic/value | Decyzja migracyjna |
|---|---|---|---:|---|---|
| `--app-color-brand-primary` | `var(--color-07064e)` | `#07064e` | 214 | `--color-border-emphasis`<br>`--color-icon-dark`<br>`--color-controls-handUp-icon-default`<br>+13 innych | 🟡 **DECISION REQUIRED `D-BRAND-01`** — rozdzielić użycia na text/surface/border/icon/button |
| `--app-color-brand-primary-dark` | `var(--color-181c63)` | `#181c63` | 38 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-brand-accent` | `var(--color-2af5ba)` | `#2af5ba` | 234 | `--color-border-active`<br>`--color-surface-brand`<br>`--color-button-text-active`<br>+8 innych | 🟡 **DECISION REQUIRED `D-BRAND-01`** — rozdzielić użycia na text/surface/border/icon/button |
| `--app-color-brand-accent-hover` | `var(--color-08db9e)` | `#08db9e` | 50 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-brand-accent-active` | `var(--color-23db9e)` | `#23db9e` | 13 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-brand-accent-alt` | `var(--color-28eec7)` | `#28eec7` | 12 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-primary` | `var(--app-color-brand-primary)` | `#07064e` | 4 | `--color-text-dark` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-text-secondary` | `var(--color-46467b)` | `#46467b` | 15 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-muted` | `var(--color-444d5f)` | `#444d5f` | 13 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-tertiary` | `var(--color-4f4e81)` | `#4f4e81` | 13 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-disabled` | `var(--color-9da5b4)` | `#9da5b4` | 11 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-disabled-alt` | `var(--color-9aaec3)` | `#9aaec3` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-neutral` | `var(--color-404040)` | `#404040` | 9 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-neutral-strong` | `var(--color-525864)` | `#525864` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-soft` | `var(--color-7878af)` | `#7878af` | 34 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-black` | `var(--color-000000)` | `#000000` | 6 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-inverse` | `var(--color-ffffff)` | `#ffffff` | 2 | `--color-text-on-neutral-contrast` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-bg-shell` | `var(--app-color-brand-primary)` | `#07064e` | 0 | `--color-surface-base-strong`<br>`--color-surface-plain-navy` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-bg-shell-dark` | `var(--app-color-brand-primary-dark)` | `#181c63` | 0 | — | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-bg-page` | `var(--color-f4f9ff)` | `#f4f9ff` | 42 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-surface` | `var(--color-ffffff)` | `#ffffff` | 276 | `--color-surface-bright` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-bg-surface-muted` | `var(--color-ebf4fd)` | `#ebf4fd` | 52 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-surface-soft` | `var(--color-e0eefc)` | `#e0eefc` | 11 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-accent-soft` | `var(--color-c2faef)` | `#c2faef` | 15 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-accent-soft-alt` | `var(--color-dbf7f5)` | `#dbf7f5` | 5 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-accent-soft-strong` | `var(--color-d8f8ef)` | `#d8f8ef` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-warning-soft` | `var(--color-fff8f1)` | `#fff8f1` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-neutral-100` | `var(--color-f1f1f1)` | `#f1f1f1` | 3 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-neutral-200` | `var(--color-f2f2f2)` | `#f2f2f2` | 14 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-surface-alt` | `var(--color-fafafa)` | `#fafafa` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-default` | `var(--color-d5d9e5)` | `#d5d9e5` | 41 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-muted` | `var(--color-d6d6d6)` | `#d6d6d6` | 32 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-subtle` | `var(--color-cccccc)` | `#cccccc` | 9 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-light` | `var(--color-e6e6e6)` | `#e6e6e6` | 3 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-light-alt` | `var(--color-c0c0c0)` | `#c0c0c0` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-light-strong` | `var(--color-cbcbcb)` | `#cbcbcb` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-very-subtle` | `var(--color-efefef)` | `#efefef` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-accent` | `var(--app-color-brand-accent)` | `#2af5ba` | 0 | `--color-border-active` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-border-danger` | `var(--color-fd8080)` | `#fd8080` | 0 | — | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-status-warning` | `var(--color-ffb87e)` | `#ffb87e` | 35 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-status-warning-strong` | `var(--color-ffac00)` | `#ffac00` | 6 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-status-warning-alert` | `var(--color-ffd52f)` | `#ffd52f` | 2 | `--color-border-warning`<br>`--color-surface-warning-emphasis` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-status-warning-soft` | `var(--color-fcd5b5)` | `#fcd5b5` | 7 | `--color-alert-weak`<br>`--color-button-background-edit`<br>`--color-surface-warning-muted` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-status-danger` | `var(--color-fd8080)` | `#fd8080` | 54 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-status-success` | `var(--color-66bb6a)` | `#66bb6a` | 4 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-status-success-soft` | `var(--color-c9fac2)` | `#c9fac2` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-overlay-accent-start` | `var(--color-29fa7f4e)` | `#29fa7f4e` | 2 | proponowany `--color-overlay-accent-start` | 🟡 **DECISION REQUIRED `D-OVERLAY-01`** — potwierdzić bazowy opaque core i gradient |
| `--app-color-overlay-accent-end` | `var(--color-157d4000)` | `#157d4000` | 2 | proponowany `--color-overlay-accent-end` | 🟡 **DECISION REQUIRED `D-OVERLAY-01`** — potwierdzić końcowy stop gradientu |
| `--app-color-shadow-soft` | `var(--color-00000014)` | `#00000014` | 12 | proponowany `--color-shadow-soft` | 🟡 **DECISION REQUIRED `D-SHADOW-01`** — rozstrzygnąć color-only vs pełny elevation token |
| `--app-color-loader-overlay` | `color-mix(in srgb, var(--app-color-bg-surface) 78%, transparent)` | `color-mix(in srgb, var(--app-color-bg-surface) 78%, transparent)` | 1 | proponowany `--color-overlay-loader` | 🧹 **IMPLEMENTATION** — dodać semantic overlay po zatwierdzeniu modelu kompozycji |
| `--app-color-loader-overlay-soft` | `color-mix(in srgb, var(--app-color-bg-surface) 68%, transparent)` | `color-mix(in srgb, var(--app-color-bg-surface) 68%, transparent)` | 2 | proponowany `--color-overlay-loader-soft` | 🧹 **IMPLEMENTATION** — dodać semantic overlay po zatwierdzeniu modelu kompozycji |
| `--app-color-button-primary-bg` | `var(--app-color-brand-accent)` | `#2af5ba` | 0 | `--color-button-background-active` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-button-primary-bg-hover` | `var(--app-color-brand-accent-hover)` | `#08db9e` | 0 | — | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-button-primary-text` | `var(--app-color-brand-primary)` | `#07064e` | 0 | `--color-button-text-dark` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-button-secondary-bg` | `var(--app-color-bg-surface)` | `#ffffff` | 0 | `--color-button-background-bright` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-button-secondary-text` | `var(--app-color-text-primary)` | `#07064e` | 0 | `--color-button-text-dark` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-button-warning-bg` | `var(--color-fff5e1)` | `#fff5e1` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-button-secondary-hover-bg` | `var(--color-eafff9)` | `#eafff9` | 16 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-placeholder` | `var(--color-c5ccda)` | `#c5ccda` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-placeholder-soft` | `var(--color-a9b3cf)` | `#a9b3cf` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-hint` | `var(--color-606489)` | `#606489` | 12 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-input-strong` | `var(--color-dfe2eb)` | `#dfe2eb` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-form-indicator-active-soft` | `var(--color-9beed8)` | `#9beed8` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-focus-soft` | `var(--color-b2f5e4)` | `#b2f5e4` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-badge` | `var(--color-b0afe8)` | `#b0afe8` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-card-soft` | `var(--color-f5f5f5)` | `#f5f5f5` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-card-muted` | `var(--color-e8e8e8)` | `#e8e8e8` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-card-summary` | `var(--color-e8e8ef)` | `#e8e8ef` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-panel-divider` | `var(--color-f2f2f7)` | `#f2f2f7` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-chart-divider` | `var(--color-dbeafc)` | `#dbeafc` | 25 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-panel-info` | `var(--color-e7f2fc)` | `#e7f2fc` | 4 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-modal-muted` | `var(--color-ececec)` | `#ececec` | 1 | `--color-surface-mild` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-bg-event-test` | `var(--color-fffdf8)` | `#fffdf8` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-event-test-inactive` | `var(--color-ecc3a5)` | `#ecc3a5` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-warning-banner` | `var(--color-fffcf1)` | `#fffcf1` | 3 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-bg-test-sticker` | `var(--color-fffcf5)` | `#fffcf5` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-border-row-divider` | `var(--color-e9e9e9)` | `#e9e9e9` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-table-row-hover-primary` | `var(--color-fafcff)` | `#fafcff` | 5 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-table-row-hover-secondary` | `var(--color-e2edf8)` | `#e2edf8` | 5 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-pagination-current-bg` | `var(--color-d1dbe6)` | `#d1dbe6` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-pagination-current-text` | `var(--color-fefefe)` | `#fefefe` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-pagination-hover-bg` | `var(--color-e6ecf3)` | `#e6ecf3` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-timepicker-clock-time-inactive` | `var(--color-6c6c6c)` | `#6c6c6c` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-timepicker-clock-time-inner-inactive` | `var(--color-929292)` | `#929292` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-timepicker-clock-time-disabled` | `var(--color-c5c5c5)` | `#c5c5c5` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-timepicker-clock-face-bg` | `var(--color-f0f0f0)` | `#f0f0f0` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-gradient-danger-1` | `var(--color-f08080)` | `#f08080` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-gradient-danger-2` | `var(--color-ff6e6e)` | `#ff6e6e` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-gradient-danger-3` | `var(--color-e03f3f)` | `#e03f3f` | 10 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-gradient-danger-4` | `var(--color-ff5656)` | `#ff5656` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-gradient-success-2` | `var(--color-29f8bb)` | `#29f8bb` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-gradient-success-3` | `var(--color-08c9db)` | `#08c9db` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-event-filter-text` | `var(--color-010027)` | `#010027` | 2 | `--color-text-emphasis` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-filter-selected` | `var(--color-3b3a76)` | `#3b3a76` | 3 | `--color-surface-neutral-emphasis` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-filter-control-border` | `var(--color-c6c6c6)` | `#c6c6c6` | 5 | `--color-border-subtle` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-filter-scheduled` | `var(--color-5250df)` | `#5250df` | 1 | `--color-surface-interactive-active` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-filter-warning` | `var(--color-f19a58)` | `#f19a58` | 1 | `--color-alert-decent` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-filter-shadow` | `var(--color-1517524d)` | `#1517524d` | 1 | proponowany `--color-shadow-event-filter` | 🟡 **DECISION REQUIRED `D-SHADOW-01`** — rozstrzygnąć color-only vs pełny elevation token |
| `--app-color-event-tab-count-bg` | `var(--color-f6f6f6)` | `#f6f6f6` | 1 | `--color-surface-neutral` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-tab-count-text` | `var(--color-939393)` | `#939393` | 1 | `--color-text-inactive-dark` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-tab-count-active-bg` | `var(--color-e1fff6)` | `#e1fff6` | 1 | `--color-surface-accent-muted` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-tab-count-active-text` | `var(--color-0ad69c)` | `#0ad69c` | 1 | `--color-text-action-subtle` | 🟡 **DECISION REQUIRED `D-SEM-01`** — potwierdzić rolę semantyczną w kontekście użycia/Figmy |
| `--app-color-event-filter-remove-bg` | `var(--color-dfedfb)` | `#dfedfb` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-event-filter-remove-icon` | `var(--color-5f6368)` | `#5f6368` | 1 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-text-label` | `var(--color-c1c1c1)` | `#c1c1c1` | 2 | — | ⏸ **DEFERRED `D-SEM-MISSING-01`** — wrócić po analizie roli i Figmy |
| `--app-color-primary` | `var(--app-color-brand-primary)` | `#07064e` | 0 | `--color-surface-base-strong<br>--color-surface-plain-navy<br>--color-text-dark<br>+13 innych` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-accent` | `var(--app-color-brand-accent)` | `#2af5ba` | 0 | `--color-surface-active-strong<br>--color-surface-brand<br>--color-surface-active-contrast<br>+8 innych` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-primary-dark` | `var(--app-color-brand-primary-dark)` | `#181c63` | 0 | — | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-surface` | `var(--app-color-bg-surface)` | `#ffffff` | 0 | `--color-surface-bright<br>--color-surface-light-navy<br>--color-surface-subtle-contrast<br>+19 innych` | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |
| `--app-color-background` | `var(--app-color-bg-page)` | `#f4f9ff` | 0 | — | 🧹 **IMPLEMENTATION** — usunąć alias po kontroli braku użyć dynamicznych |

## Załącznik C — architektura przezroczystości, shadow i overlay

Ustalamy następujący kierunek architektury tokenów:

1. Core color tokens przechowują wyłącznie kolory nieprzezroczyste; wartości z kanałem alpha nie trafiają do palety core.
2. Skala opacity jest osobną warstwą foundation, niezależną od palety kolorów.
3. Semantic color może składać się z referencji do opaque core oraz opacity. Nazwa opisuje rolę, np. `shadow`, `overlay`, `border` albo `surface`, a nie wartość procentową.
4. Wygenerowany CSS może używać `color-mix(..., transparent)` albo rozwiązanej wartości RGBA. Dla Figmy należy wygenerować równoważną wartość RGBA i zachować relację core + opacity w źródle/metadanych tokenu.
5. Nie każda przezroczystość jest shadow. Gradienty, overlays, borders i surfaces muszą mieć osobne role semantyczne.
6. Pozostaje do rozstrzygnięcia, czy oprócz semantic shadow colors wprowadzamy również tokeny całej elewacji: kolor + offset X/Y + blur + spread.

### Tokenizowane wartości alpha w `colors.scss`

| Primitive / formuła CRM | Rozkład | Obecna rola | Roboczy semantic |
|---|---|---|---|
| `#1517524d` | `#151752` + alpha `30,2%` | cień panelu filtrów | `--color-shadow-event-filter` |
| `#00000014` | `#000000` + alpha `7,8%` | wspólny delikatny cień | `--color-shadow-soft` |
| `#29fa7f4e` | `#29fa7f` + alpha `30,6%` | początek gradientu overlay | `--color-overlay-accent-start` |
| `#157d4000` | `#157d40` + alpha `0%` | koniec gradientu overlay | `--color-overlay-accent-end` |
| surface + alpha `78%` | `color-mix(..., transparent)` | loader overlay | `--color-overlay-loader` |
| surface + alpha `68%` | `color-mix(..., transparent)` | łagodniejszy loader overlay | `--color-overlay-loader-soft` |

### Przezroczystości zapisane poza `colors.scss`

Pomiar SCSS po usunięciu komentarzy wykazał dodatkowo:

- 65 wystąpień `rgba()` reprezentujących 22 unikalne wartości;
- 18 wystąpień `color-mix(... transparent)` reprezentujących 10 unikalnych formuł;
- role obejmujące shadows, overlays/backgrounds, borders, outlines i efekty loadera;
- powtarzające się czarne cienie z alpha m.in. `5%`, `8%`, `10%` i `15%`, które są kandydatami do deduplikacji.

Te wartości trzeba sklasyfikować przed usunięciem `colors.scss`. `color-mix(kolor, surface)` bez `transparent` jest mieszanką tonalną, a `opacity` na elemencie wpływa na całe drzewo renderowania — nie należy zaliczać ich automatycznie do semantic alpha colors.

## Załącznik D — błędy i wyjątki

1. 🟡 **DECISION REQUIRED `D-BUG-01`** — `--app-color-text-primary-white` jest używany bez fallbacku, ale nie jest zdefiniowany.
2. 🟡 **DECISION REQUIRED `D-BUG-01`** — `--app-color-text-body` nie jest zdefiniowany, lecz jego jedyne użycie ma fallback do `--app-color-brand-primary`.
3. 🧹 **IMPLEMENTATION** — 14 aliasów app nie ma użyć poza `colors.scss`; pięć z nich jest jawnie opisanych jako backward compatibility aliases.
4. 🧹 **IMPLEMENTATION** — 8 hex primitives nie zasila żadnego aliasu app i może zostać usunięte po potwierdzeniu braku użyć dynamicznych.
5. 🟡 **DECISION REQUIRED `D-BRAND-01`** — szerokie tokeny `brand-primary` i `brand-accent` są używane w wielu rolach; użycia trzeba rozdzielić na text/surface/border/icon/button.

## Sekwencja wykonania po decyzjach

1. ✅ Zamknięto `D-COLOR-01` i `D-COLOR-02` w etapie 0.
2. W etapie semantic/Figma rozstrzygnąć `D-SEM-01`, `D-SEM-MISSING-01`, `D-BRAND-01` i `D-CORE-01`.
3. Rozstrzygnąć `D-SHADOW-01` i `D-OVERLAY-01`, następnie sklasyfikować inline `rgba()`, alpha hex i `color-mix(... transparent)`.
4. Naprawić `D-BUG-01` i wykonać elementy oznaczone `IMPLEMENTATION`.
5. Wygenerować tokeny i przeprowadzić migrację obszarami.
6. Po migracji ostatniego użycia usunąć `colors.scss`.
