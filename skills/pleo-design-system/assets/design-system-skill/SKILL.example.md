---
name: <design-system-skill-name>
description: >
  Używaj przy implementacji, utrzymaniu i review UI korzystającego z <package-name>
  w <confirmed-consumers>. Obejmuje <angular/react>, publiczne entry pointy
  <entry-points>, tokeny, theming, SVG, responsywność, komponenty, preview i integrację.
  Pomijaj dla innych design systemów i aplikacji bez tej paczki.
---

# <Design system name>

## Granice

Ten skill jest codziennym właścicielem pracy z `<package-name>`. Nie uruchamiaj
`pleo-design-system` dla rutynowej zmiany tokenu, SVG, stylu, komponentu, story
ani eksportu.

## Rozpoznanie kontekstu

Przed zmianą ustal: repo, package/consumer root, zainstalowaną wersję paczki,
framework oraz klasyfikację `angular-only`, `react-only` albo `shared`.
Potwierdź publiczne API zainstalowanej wersji; nie zgaduj go z nazw źródeł.

## Routing

| Potrzeba | Referencja |
| --- | --- |
| Tożsamość, ownership, piny standardów, wyjątki | `references/design-system-contract.md` |
| Tokeny, zgodność 1:1 z Figmą i zmiany source-driven | `references/tokens.md` |
| Light/dark i runtime theme | `references/theming.md` |
| Ikony i ilustracje | `references/svg-assets.md` |
| Responsive, grid i layout z Figmy | `references/responsiveness.md` |
| Wybór lub authoring komponentu | `references/components.md` |
| Storybook/aplikacja preview | `references/preview.md` |
| Instalacja i walidacja konkretnej aplikacji | `references/consumers.md` |
| Angular | `references/angular.md` |
| React | `references/react.md` |

Wczytuj tylko referencje potrzebne dla bieżącego zadania i włączonych frameworków.

## Figma → kod

1. Użyj właściwego skilla Figmy i odbierz neutralny handoff.
2. Wczytaj konsumenta, framework i potrzebne capability references.
3. Mapuj role na istniejące komponenty/prymitywy i potwierdź publiczne API.
4. Mapuj wartości na dozwolone tokeny; brak roli zgłoś jako gap.
5. Zastosuj wybrany responsive/grid contract i publiczne assety.
6. Nie twórz lokalnego mini-DS ani kopii komponentu paczki.
7. Uruchom walidację wskazaną dla konsumenta, theme i viewportu.

Na prośbę o zgodność tokenów z Figmą wczytaj `references/tokens.md` i wykonaj
opisane tam porównanie aktualnych Figma Variables ze źródłami kodu 1:1.

## Izolacja frameworków

Zmiana jednego frameworka nie może zmieniać zależności, bundla ani publicznego API
drugiego. Zmiana `shared` wymaga obu zestawów walidacji.

## Eskalacja

Pełny onboarding, audyt, topologia, manifest albo nowy standard →
`pleo-design-system` w trybie `orchestrator`.

Dokładna luka standardu →

```text
pleo-design-system contract-reference
package: <package-name>
contract: <contract-id>@<version>
question: <gap>
return-to: references/<file>.md
```

## Weryfikacja

Uruchom najwęższy adekwatny build/test/preview konsumenta lub paczki. Dla zmiany
shared wykonaj oba frameworki. Nie deklaruj pixel-perfect bez runtime screenshotu
i potwierdzonych wartości krytycznych.
