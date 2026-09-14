# Firmowy standard design systemu

## Obowiązkowa baza

- domyślnie niezależna granica paczki npm gotowa na wielu konsumentów; paczka może mieć osobne repo albo być współlokowana w workspace aplikacji; zatwierdzony `embedded-mini-ds` jest wyjątkiem wyłącznie dla szczególnie małego projektu;
- default `@pleodigital/design-system-<product>` i publiczne npmjs, z obsługą jawnych wariantów;
- cały projekt/pliki DS w Figmie jako domyślne źródło projektu wizualnego oraz Figma Variables jako domyślne źródło prawdy o tokenach;
- Style Dictionary jako obowiązkowy generator;
- wersjonowany kontrakt znaczenia warstw tokenów wraz z rekomendowanymi wzorcami nazw oraz osobny kontrakt nazw SVG z `naming-contracts.md`;
- warstwy core i semantic; light i dark jako obowiązkowe tryby semantycznych tokenów zależnych od motywu; typografia i spacing;
- SCSS zawsze;
- osobne polityki/outputy Angular i React;
- ikony i ilustracje jako osobne kategorie;
- źródłowe nazwy SVG jako jedyna ręczna lista; automatycznie generowane typy, Angular Registry, React exports i preview z blokującą walidacją nazw/słownictwa;
- publiczne API bez importów z wnętrza paczki;
- Storybook albo preview;
- testy, deterministyczny build i SemVer;
- manifest DS obok `package.json` paczki, manifest każdego konsumenta w root jego aplikacji i jeden aktualny skill DS ze źródłem wskazanym przez manifest;
- wersjonowane kontrakty firmowe przypięte w manifeście, z kontrolą stalenia i bez cichego przejmowania nowych reguł przez istniejące projekty;
- instrukcja integracji per aplikacja.
- po remediacji wynikającej z audytu: zaakceptowany przez użytkownika plan migracji per istniejący konsument, wygenerowany z release candidate przed publikacją finalnej paczki.

## Topologia repozytorium

- Dozwól `standalone-repository` i `colocated-workspace-package` jako default.
- Dozwól `embedded-mini-ds` tylko dla jednej szczególnie małej aplikacji bez realnego reuse, niezależnego release'u ani osobnego ownershipu DS. Wymagaj konkretnego uzasadnienia w `repository.boundaryPolicy.localMiniDs.justification`; nie wymagaj danych osób odpowiedzialnych ani akceptujących.
- Dla współlokowanej paczki wymagaj osobnego package root, publicznych entry pointów, niezależnego build/test/preview/pack i zakazu importów z konsumenta.
- W czystej aplikacji blokuj powstawanie lokalnego mini-DS poza package root.
- W zastanej aplikacji zamroź baseline mini-DS i blokuj nowe elementy aż do zakończenia migracji.

## Elementy warunkowe

- grid;
- jeden wyłączny model responsywności: rekomendowany `device-contract` z runtime `device()` albo prosty `css-media` z `breakpoint()`;
- responsywność: manifestowa kolejność nazw breakpointów, core tokeny ich szerokości, device types, fallbacki i mnożniki skalowania;
- grid: dla Angulara core tokens `columns/gutter/margin/margin-extra`, płynne obliczenia względem breakpointu referencyjnego, provider `data-grid-type` i jeden adapter zgodny z modelem responsywności;
- Angular theme runtime: `body[data-theme="light|dark"]`, początkowy light w `index.html`, `sessionStorage["theme"]`, jawne `loadTheme()` i View Transitions podczas przełączenia;
- komponenty;
- Angular SVG registry;
- Tailwind dla Reacta;
- customowe registry i artifact policy.

## Firmowe defaulty

- artifact policy: `build-only`;
- nowy DS: wszystkie guardraile aktywne od początku;
- istniejący DS: baseline i etapowa aktywacja;
- kolory konsumenta: semantic-only, chyba że manifest jawnie zatwierdza wariant;
- wyjątek: deweloper po konsultacji z szefem, z zapisem w planie i manifeście;
- accessibility: poza zakresem v1; zachowuj lokalne wymagania i nie pogarszaj istniejących zabezpieczeń.

## Skill konkretnego DS

- Jeden główny skill obsługuje codzienną pracę z tokenami, themingiem, SVG, responsywnością, komponentami, preview i konsumentami.
- `SKILL.md` jest routerem; konkretne procedury znajdują się w nazwanych referencjach wymaganych przez `design-system-skill-contract.md`.
- Rutynowe zadanie nie uruchamia `pleo-design-system`. Globalny skill działa jako orkiestrator pełnego procesu albo jako referencja jednego dokładnego `contract-id@version`.
- Projektowe ścieżki, komponenty, komendy, katalogi, wzorce i wyjątki nie trafiają do centralnego standardu.
- Starsze wyspecjalizowane skille można utrzymać czasowo jako aliasy; nie wolno ich wycofać przed migracją całej wiedzy i forward-testem.

## Antywzorce

- aplikacyjny katalog tokenów konkurujący z paczką DS;
- umieszczenie źródeł współlokowanego DS bezpośrednio w katalogu aplikacji;
- lokalna biblioteka button/input/modal powtarzająca publiczne API DS;
- ręczne poprawianie `dist` lub wygenerowanego CSS;
- importy z prywatnych ścieżek paczki;
- mieszanie zależności Angular i React;
- bezpośrednie core colors przy semantic-only;
- kopiowanie SVG lub komponentów z paczki do konsumenta;
- dokumentowanie reguły wyłącznie w skillu bez guardraila, gdy można ją sprawdzić deterministycznie.
- ręczne dopisywanie SVG do typów, registry, barrel exports albo listy preview.
- mieszanie `device()` i `breakpoint()` w jednym design systemie albo zmienianie znaczenia `device()` na media query.
- pipeline tokenów, który nie potrafi deterministycznie ustalić warstwy core/semantic albo kategorii niezależnie od nazw; dla SVG także nazwy bez zgodności z zadeklarowanym kontraktem assetów.

