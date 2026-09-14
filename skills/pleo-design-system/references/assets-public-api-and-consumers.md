# Assety, publiczne API i konsumenci

## SVG

Rozdziel źródła na `icons` i `illustrations`. Utrzymuj stabilne nazwy publiczne, waliduj duplikaty, niedozwolone znaki, rozmiar, `viewBox`, kolizje `id` oraz właściwe użycie `currentColor`.

Źródłowe nazwy plików są jedyną ręcznie utrzymywaną listą. Przeczytaj `svg-asset-pipeline.md` i generuj z nich typy TypeScript, Angular Registry, publiczne mapowania React oraz galerię preview. Zabroń ręcznego dopisywania pojedynczego assetu do wygenerowanych list.

Stosuj neutralny kontrakt `pleo-design-system-assets-v1` z `naming-contracts.md`. Skill konkretnego DS musi zdefiniować własną listę dozwolonych contextów, odpowiadających im folderów/publicznych namespace'ów oraz dozwolonych modifierów.

Nie kopiuj publicznego SVG do kodu konsumenta. Angular powinien korzystać z registry i raw assets kopiowanych w buildzie. React powinien korzystać z publicznych komponentów/entry pointu lub uzgodnionego publicznego URL.

## Publiczne API

- Eksportuj wyłącznie wspierane kontrakty.
- Blokuj deep imports.
- Rozdziel `/angular` i `/react`.
- Testuj deklarowane entry pointy i typy.
- Klasyfikuj usunięcie/zmianę publicznego API jako breaking change SemVer.

## Konsumenci

Utwórz manifest i instrukcję integracji dla każdej aplikacji. Instrukcja ma być dopasowana do frameworka i wersji paczki, nie kopiowana generycznie.

Mini-DS to lokalna warstwa odtwarzająca odpowiedzialności paczki: własna paleta/tokeny, theme, biblioteka prymitywów, registry ikon, breakpointy lub utility system używany przez niezależne feature'y. Nie klasyfikuj jako mini-DS domenowego komponentu lub layoutu jednego flow.

Podejrzenie mini-DS oznacz `REVIEW_REQUIRED`. Po decyzji przenieś element do paczki, pozostaw domenowo albo zapisz zatwierdzony wyjątek.

