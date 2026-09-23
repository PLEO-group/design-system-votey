---
name: votey-design-system
description: >
  Implementuj, utrzymuj i reviewuj publiczny kontrakt `@pleodigital/design-system-votey`
  w źródłach paczki, konsumentach Angular i konsumentach React/Next. Używaj dla
  tokenów, SVG, responsywności, komponentów, Storybooka i integracji wyłącznie
  przez publiczne entry pointy `./angular`, `./ds-device-mixins` oraz
  `./dist/assets/react`.
version: 1.11.0
author: n.koktysz@pleodigital.com
scope: SHARED
category: Frontend
tags: [FE]
---

# Votey Design System

Ten skill jest codziennym właścicielem pracy z Votey. Obejmuje źródła paczki
`@pleodigital/design-system-votey`, Angularowy CRM oraz potwierdzonych konsumentów
React/Next, w tym `votey-user-app`. Nie dotyczy BoxEs, aplikacji bez tej paczki ani
innego Design Systemu.

Nie zastępuje `figma`, lokalnych standardów frameworka ani `votey-svg-assets`.
Przy dodaniu, audycie, przeniesieniu, zmianie nazwy lub usunięciu źródłowego SVG
uruchom najpierw `votey-svg-assets`; po jego walidacji wróć tutaj, aby sprawdzić
integrację konsumenta. Nie twórz lokalnej kopii publicznego assetu ani równoległego
mini-DS.

## Kontekst i routing

Najpierw rozpoznaj zmianę jako `angular-only`, `react-only` albo `shared` oraz
potwierdź zainstalowaną wersję paczki i publiczne API. Katalog źródłowy nie jest
dowodem eksportu. Dla `shared` nazwij wpływ na oba frameworki i zweryfikuj oba.

| Kontekst | Wczytaj |
| --- | --- |
| Zawsze przed pracą nad kontraktem paczki | [design-system-contract.md](references/design-system-contract.md) i [design-system-manifest.json](references/design-system-manifest.json) |
| Token, Figma Variables, Style Dictionary, deprecacja tokenu lub pełna synchronizacja z eksportem Variables | [tokens.md](references/tokens.md) oraz [figma-token-sync.md](references/figma-token-sync.md) |
| Light/dark, import arkuszy lub bootstrap theme | [theming.md](references/theming.md) oraz referencję frameworka |
| Źródłowy SVG albo integracja opublikowanego assetu | [svg-assets.md](references/svg-assets.md), [assets.md](references/assets.md) oraz referencję frameworka |
| Device, grid, breakpoint albo layout z Figmy | [responsiveness.md](references/responsiveness.md) |
| Publiczny komponent, wariant, wrapper lub authoring | [components.md](references/components.md); dla źródła Angular także [angular-components.md](references/angular-components.md) |
| Migracja istniejącego widoku Angular/CRM z legacy UI do Votey albo upgrade lokalnego konsumenta | [angular-consumer-migration.md](references/angular-consumer-migration.md), [angular.md](references/angular.md) |
| Storybook, dokumentacja lub visual smoke test | [preview.md](references/preview.md) |
| Instalacja, upgrade lub smoke test aplikacji | [consumers.md](references/consumers.md) oraz referencję frameworka |
| `design-system-votey` albo konsument Angular | [angular.md](references/angular.md) |
| Konsument React/Next | [react.md](references/react.md) |

### Granica frameworków i publicznego API

- `angular-only`: kod, DI, Material, komponenty `vt-*`, registry i tokeny Angular
  pozostają w `angular/` oraz subpath `@pleodigital/design-system-votey/angular`.
  Dla responsywności tego samego DOM użyj dodatkowego, publicznego Sass entry pointu
  `@pleodigital/design-system-votey/ds-device-mixins`; runtime Angulara stosuj tylko,
  gdy zmienia się DOM lub behavior. Nie zmieniaj bundle'a ani importów Reacta.
- `react-only`: React SVG, Tailwind i lokalne prymitywy PWA pozostają poza
  Angularowym entry pointem. PWA nie importuje `tokens.angular.css` ani runtime'u
  Angulara.
- `shared`: zmieniaj źródła tokenów, assetów lub kontrakt publiczny wyłącznie wtedy,
  gdy jest to istotą zadania. Zweryfikuj outputy Angular i React oraz wpływ na
  konsumentów przed deklarowaniem gotowości.
- Lokalny wrapper może łączyć publiczny komponent z logiką domenową, ale nie może
  kopiować komponentu, SVG ani omijać publicznego entry pointu. Brakującą rolę,
  wariant lub asset zgłoś jako `gap`.

### Kontrolki formularzowe Angulara

- Dla każdej kontrolki formularzowej Angulara preferuj
  `VoteyFormControlApplyDirective`. Stosuj wspólny input `control` i odziedziczony
  stan formularza jako domyślny kontrakt.
- Wiąż natywną kontrolkę lub Angular Material z odziedziczonym `formControl`
  przez `[formControl]`. Nie dodawaj subskrypcji ani hooków synchronizujących do
  dyrektywy bazowej.
- Użyj innego modelu integracji tylko wtedy, gdy ograniczenie platformy lub
  kontrakt komponentu uniemożliwia to wiązanie. Wyjątkiem jest
  `VoteyFilePickerComponent`: przeglądarka blokuje programowe ustawienie wartości
  natywnego `input[type=file]`, więc komponent utrzymuje lokalną synchronizację.
- Każdy wyjątek udokumentuj w kodzie lub dokumentacji komponentu, ogranicz go do
  tego komponentu i przetestuj programową zmianę wartości oraz stan `disabled`.
- Każdy komponent formularzowy musi spełniać wspólny kontrakt opisany w
  `references/angular-components.md`: odziedziczony `control`, jawna semantyka
  `label`, stany formularza, dostępność i brak równoległego `ngModel`.
- Dla komponentów z panelem lub overlayem zweryfikuj pozycjonowanie, szerokość,
  zamykanie poza komponentem, klawiaturę i widoczność akcji w Storybooku.

## Codzienny workflow

1. Dla Figmy odbierz zweryfikowany handoff ze skilla `figma`: target, struktura,
   stany, layout-driving scope, breakpointy oraz wartości potwierdzone i brakujące.
   Nie wyprowadzaj API ani tokenów z nazw warstw.
   Dla pełnej synchronizacji tokenów z Figma Variables najpierw przeczytaj
   [figma-token-sync.md](references/figma-token-sync.md): URL źródła odczytaj z
   manifestu, a po pozytywnej walidacji dwóch eksportów JSON przejdź bezpośrednio
   do wdrożenia w uzgodnionym zakresie, bez domyślnego raportu ani planu. Dla
   integracji opublikowanego assetu wczytaj `assets.md` przed wyborem `vt-icon`
   albo `url()` i przed konfiguracją kopiowania assetów konsumenta.
2. Odczytaj manifest, package exports, właściwą referencję frameworka i tylko
   referencje potrzebne w zadaniu. Dla widoku z Figmy wczytaj też `consumers.md`.
3. Zmapuj role UI kolejno na publiczny komponent lub lokalny prymityw, token,
   responsywność i asset. Przed nowym wrapperem sprawdź jeden najbliższy przykład.
4. Przy migracji istniejącego konsumenta wczytaj `angular-consumer-migration.md`,
   porównaj baseline historyczny, zapisz kontrakt przed zmianą i oddziel logikę
   domenową od mapowania publicznego API Votey.
5. Zastosuj lokalny standard frameworka. Zachowaj zachowanie, payloady, dostępność,
   stany i granicę Server/Client albo Angular Forms.
6. Dobierz najwęższą weryfikację wskazaną w referencji. Nie deklaruj uruchomienia
   testu, builda, Storybooka ani smoke testu bez dowodu z tej sesji.

### Testy przy zmianie kodu

Gdy zmiana dotyczy kodu runtime, publicznego API albo zachowania komponentu,
sprawdź najbliższe istniejące testy. Jeśli test opisuje zmieniany kontrakt,
zaktualizuj go; jeśli nowe zachowanie nie ma pokrycia, dodaj lub rozszerz
minimalny test adekwatny do zmiany. Aktualizacja testów jest częścią implementacji
zmiany, gdy jest konieczna — nie oznacza automatycznego uruchamiania całej suity.

Nie uruchamiaj testów przy każdym prompcie. Uruchom tylko najwęższy właściwy test
lub zestaw testów, gdy użytkownik o to poprosi, projektowy workflow tego wymaga
albo weryfikacja jest potrzebna do potwierdzenia wykonanej zmiany.

Rutynowa zmiana tokenu, assetu, komponentu, story lub eksportu pozostaje w tym
skill-u. Eskaluj do `pleo-design-system` tylko przy audycie całego DS, zmianie
topologii lub dystrybucji, nowym frameworku, nowym konsumencie wymagającym pełnego
planu, manifeście albo nowym firmowym guardrailu. Gdy potrzebna jest wyłącznie reguła
centralna, użyj dokładnego routingu:

```text
pleo-design-system contract-reference
package: @pleodigital/design-system-votey
contract: <contract-id>@<semver>
question: <konkretna luka>
return-to: references/<plik>.md
```

## Minimalna weryfikacja

- Potwierdź entry point, asset, token oraz wariant z faktycznie zainstalowanej
  wersji paczki.
- Zachowaj izolację Angular ↔ React; zmiana `shared` wymaga sprawdzenia obu outputów.
- Dla komponentu sprawdź dostępność, wymagane stany, publiczne API i preview.
- Dla migracji konsumenta sprawdź mapowanie legacy → publiczne API, walidację
  formularza, brak globalnych wycieków SCSS oraz świeżość zbudowanego artefaktu.
- Dla zmian wizualnych sprawdź route/story, theme, viewport, console, overflow oraz
  krytyczne computed values. Pixel-perfect wymaga screenshotu runtime i wartości
  potwierdzonych w handoffie.

## Historia zmian

Pełna historia wersji znajduje się w [references/changelog.md](references/changelog.md).
