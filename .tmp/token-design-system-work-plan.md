# Plan wykonawczy — tokeny Design System Votey

Status dokumentu: aktywna checklista projektu  
Zakres: tokeny, Style Dictionary, Figma, Storybook i integracja konsumentów  
Główny konsument nowych tokenów: `wyborek-crm` (Angular)  
Konsument wymagający ochrony przed regresją: `votey-user-app` (React)

## Jak prowadzimy ten dokument

- Zadanie niezaczęte: `- [ ]`.
- Zadanie zakończone i zweryfikowane: `- [x]`.
- Nie oznaczamy zadania jako wykonane tylko dlatego, że kod został napisany — musi przejść walidację wskazaną w danym etapie.
- Po każdym etapie uzupełniamy sekcję **Notatki po etapie**: datę, wynik, decyzje, dowody i dalsze zadania.
- Jeżeli w trakcie pracy zmieni się zakres, aktualizujemy najpierw ten dokument, a dopiero potem implementację.
- Następny etap zaczynamy po spełnieniu bramki zakończenia poprzedniego etapu albo po zapisaniu jawnej decyzji o wyjątku.

## Ustalony zakres

- Obecne tokeny kolorów nadal obsługują React i zostaną ujednolicone z CRM.
- Nowe tokeny spacingu i typografii będą na razie używane wyłącznie w CRM.
- Scaling zainspirowany `angular-design-system` wdrażamy najpierw dla CRM.
- React zachowuje obecne spacing, typografię i scaling `rv-*`. Nie migrujemy ich w tym projekcie.
- CRM docelowo nie przechowuje własnych plików będących źródłem tokenów.
- CRM importuje do buildu jeden wygenerowany plik CSS z paczki Design Systemu, przed `src/styles.scss`.
- `src/styles/colors.scss` w CRM ma zostać usunięty po zakończeniu migracji.
- Lokalne definicje tokenów spacingu i typografii w CRM także mają zostać usunięte. Nietokenowe style aplikacyjne mogą pozostać.
- Ikony, ilustracje, pozostałe SVG i komponenty UI są poza zakresem.

## Checklista główna

- [ ] Etap 0 — zamrożenie stanu wyjściowego i decyzje
- [ ] Etap 1 — kontrakt tokenów i pipeline Style Dictionary
- [ ] Etap 2 — audyt i mapowanie Figmy
- [ ] Etap 3 — ujednolicenie tokenów kolorów
- [ ] Etap 4 — pojedynczy CSS Design Systemu w buildzie CRM
- [ ] Etap 5 — tokeny spacingu dla CRM
- [ ] Etap 6 — tokeny typografii dla CRM
- [ ] Etap 7 — scaling system dla CRM
- [ ] Etap 8 — usunięcie lokalnych tokenów i aliasów z CRM
- [ ] Etap 9 — Storybook, testy konsumentów i publikacja

---

## Etap 0 — zamrożenie stanu wyjściowego i decyzje

Cel: zapisać obecny kontrakt, aby późniejsze zmiany były mierzalne i bezpieczne.

### Checklista

- [ ] Zapisać aktualną wersję `@pleodigital/design-system-votey` używaną przez React i CRM.
- [ ] Zapisać aktualny stan zmian Git we wszystkich trzech repozytoriach, aby nie nadpisać cudzej pracy.
- [ ] Wygenerować manifest obecnych zmiennych CSS, nazw Tailwind i plików publikowanych w paczce.
- [ ] Porównać źródłowe JSON-y tokenów z aktualnym `dist`.
- [ ] Zapisać różnice light/dark i brakujące tokeny.
- [ ] Zapisać użycia tokenów w React jako kontrakt chroniony przed regresją.
- [ ] Zinwentaryzować w CRM:
  - [ ] definicje `--color-*`;
  - [ ] definicje i użycia `--app-color-*`;
  - [ ] wartości spacingu;
  - [ ] style i wartości typograficzne;
  - [ ] breakpointy i istniejące mechanizmy skalowania.
- [ ] Przygotować tabelę: lokalny token CRM → obecny token Design Systemu → brakujący token.
- [ ] Zatwierdzić, że pliki tokenów w repo Design Systemu są źródłem publikowanego kontraktu, a Figma jest synchronizowanym źródłem intencji projektowej.
- [ ] Zdecydować o docelowym foncie CRM. Do czasu tej decyzji podłączenie tokenów nie zmienia Open Sans.
- [ ] Zdecydować, gdzie będą żyły przejściowe aliasy `--app-color-*`.
- [ ] Zdecydować o nazwie i publicznej ścieżce pojedynczego CSS-a dla CRM. Robocza nazwa: `dist/css/tokens.angular.css`.
- [ ] Ustalić politykę SemVer, deprecacji i minimalny czas utrzymywania aliasów.

### Bramka zakończenia

- [ ] Mamy zapisany baseline Reacta, CRM i paczki.
- [ ] Wszystkie decyzje blokujące format artefaktów są podjęte albo oznaczone jako jawny blocker.
- [ ] Nie rozpoczęliśmy jeszcze migracji konsumentów.

### Notatki po etapie

- Data:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 1 — kontrakt tokenów i pipeline Style Dictionary

Cel: zbudować deterministyczne źródło tokenów i generator obsługujący wszystkie potrzebne kategorie.

### Checklista

- [ ] Zdefiniować warstwy tokenów:
  - [ ] primitives/core;
  - [ ] semantic tokens;
  - [ ] light/dark/brand;
  - [ ] artefakty konsumenckie.
- [ ] Zatwierdzić konwencję nazw niezależną od Angulara, Reacta i konkretnych wartości.
- [ ] Zatwierdzić typy oraz jednostki dla color, dimension, font family, font weight, font size, line height i letter spacing.
- [ ] Zdefiniować zasady referencji i zakaz cykli.
- [ ] Uogólnić filtry Style Dictionary, które obecnie rozpoznają głównie `color.*`.
- [ ] Rozdzielić generowanie źródeł od adapterów konsumenckich.
- [ ] Zapewnić deterministyczny build source → dist.
- [ ] Dodać walidację schema tokenów.
- [ ] Dodać test brakujących i cyklicznych referencji.
- [ ] Dodać test identycznego zestawu ścieżek semantycznych light/dark.
- [ ] Dodać test manifestu publicznego API paczki.
- [ ] Sprawdzić i poprawić publikowanie wszystkich wymaganych plików w `package.json`.
- [ ] Udokumentować lokalne komendy build/test dla tokenów.

### Bramka zakończenia

- [ ] Dwa kolejne buildy z tego samego źródła dają identyczne artefakty.
- [ ] `dist` jest zgodny ze źródłami.
- [ ] Usunięcie publicznego tokenu powoduje kontrolowany błąd testu.
- [ ] Pipeline jest gotowy na color, spacing, typography i scaling.

### Notatki po etapie

- Data:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 2 — audyt i mapowanie Figmy

Cel: ustalić, które wartości i role pochodzą z Figmy oraz gdzie występują rozbieżności z kodem.

### Checklista

- [x] Potwierdzić działanie połączenia Figma MCP i uwierzytelnienie konta.
- [ ] Potwierdzić dostęp do właściwego pliku/biblioteki Figma po otrzymaniu jego URL-a.
- [x] Przed bieżącym pre-checkiem użyć repozytoryjnego skilla `figma` i wykonać jego MCP Guard.
- [ ] Powtórzyć MCP Guard przed kolejną sesją operacji Figma, jeśli zmieni się sesja lub środowisko MCP.
- [ ] Zinwentaryzować collections, modes, variables i style typograficzne.
- [ ] Odczytać wartości spacingu, typografii, kolorów i breakpointów bez zgadywania ich ze screenshotów.
- [ ] Przygotować tabelę: Figma variable/style → token repo → CSS custom property.
- [ ] Oznaczyć każde mapowanie jako:
  - [ ] exact;
  - [ ] alias;
  - [ ] missing;
  - [ ] product-specific;
  - [ ] wymagające decyzji projektowej.
- [ ] Dla kolorów walidować pary light/dark, nie pojedyncze wartości.
- [ ] Dla typografii zapisać pełny komplet: family, size, weight, line height i letter spacing.
- [ ] Dla spacingu oddzielić wartości fixed od semantycznych/responsywnych.
- [ ] Zatwierdzić listę tokenów, które trzeba dodać do Design Systemu.

### Bramka zakończenia

- [ ] Wszystkie tokeny planowane dla CRM mają potwierdzone źródło albo zapisaną decyzję o wyjątku.
- [ ] Brakujące wartości nie są inferowane „na oko”.
- [ ] Tabela mapowania jest gotowa do aktualizowania przy kolejnych zmianach.

### Notatki po etapie

- Data: 2026-07-21 — częściowy pre-check etapu.
- Wynik: Figma MCP działa; `whoami` zwróciło uwierzytelnione konto z pełnym dostępem do planów PLEO. Nie sprawdzano jeszcze dostępu do konkretnego pliku ani biblioteki.
- Podjęte decyzje:
- Dowody / raporty / linki: poprawne wywołanie read-only `whoami` w bieżącej sesji.
- Otwarte problemy:
- Zadania przeniesione dalej: po otrzymaniu URL-a sprawdzić dostęp do dokładnie wskazanego pliku/node'a i rozpocząć inwentaryzację variables/styles.

---

## Etap 3 — ujednolicenie tokenów kolorów

Cel: zachować działający kontrakt Reacta i doprowadzić CRM do tych samych semantycznych nazw.

### Checklista

- [ ] Wyrównać zestaw ścieżek tokenów light/dark.
- [ ] Potwierdzić znaczenie wszystkich używanych tokenów semantycznych Reacta.
- [ ] Nie zmieniać istniejących nazw ani wartości Reacta bez osobnej, zaakceptowanej migracji.
- [ ] Zweryfikować kolejność i zakres nadpisań `tokens.samsung.css`.
- [ ] Przejść przez tabelę `--app-color-*` z CRM.
- [ ] Dla każdego `--app-color-*` wskazać:
  - [ ] istniejący odpowiednik semantyczny DS;
  - [ ] nowy potrzebny token semantyczny DS;
  - [ ] wyjątek wyłącznie produktowy;
  - [ ] token nieużywany, przeznaczony do usunięcia.
- [ ] Dodać zaakceptowane brakujące tokeny do źródeł Design Systemu.
- [ ] Wygenerować aktualne artefakty base/light/dark/Tailwind.
- [ ] Jeżeli migracja CRM nie będzie atomowa, wygenerować jawnie deprecated aliasy `--app-color-*` po stronie paczki.
- [ ] Dodać testy pokrycia mapowania CRM.
- [ ] Dodać/uzupełnić dokumentację kolorów w Storybooku.
- [ ] Uruchomić regresję kolorów w React.

### Bramka zakończenia

- [ ] Każdy używany token kolorystyczny CRM ma odpowiednik albo udokumentowany wyjątek.
- [ ] Light i dark mają zgodny kontrakt.
- [ ] React nie ma niezamierzonych zmian wizualnych.
- [ ] CRM nie potrzebuje już ręcznie rozwijanej lokalnej palety.

### Notatki po etapie

- Data:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 4 — pojedynczy CSS Design Systemu w buildzie CRM

Cel: podłączyć Design System jako jedyne zewnętrzne źródło zmiennych tokenowych CRM.

### Checklista

- [ ] Wygenerować jeden CSS entry point dla CRM/Angulara.
- [ ] Umieścić w nim w wymaganej kolejności:
  - [ ] primitives;
  - [ ] domyślny motyw;
  - [ ] selektory dodatkowych motywów, jeżeli CRM ich potrzebuje;
  - [ ] przejściowe aliasy CRM, jeżeli zostały zatwierdzone.
- [ ] Opublikować plik w paczce i zabezpieczyć jego ścieżkę testem eksportów.
- [ ] Dodać CSS w `wyborek-crm/angular.json` w sekcji `styles` przed `src/styles.scss`.
- [ ] Usunąć import lokalnego `styles/colors` dopiero po potwierdzeniu, że wszystkie potrzebne zmienne dostarcza paczka lub warstwa przejściowa.
- [ ] Zbudować CRM w konfiguracji development.
- [ ] Zbudować CRM w konfiguracji production.
- [ ] Sprawdzić kolejność CSS i computed values w runtime.
- [ ] Przejść smoke test głównych ekranów CRM.

### Bramka zakończenia

- [ ] CRM pobiera tokeny z jednego pliku CSS paczki.
- [ ] Build development i production przechodzą.
- [ ] Nie ma błędów brakujących custom properties.
- [ ] `src/styles.scss` zawiera style aplikacji i ewentualne jawne override'y, a nie kopię tokenów.

### Notatki po etapie

- Data:
- Wynik:
- Nazwa i ścieżka CSS:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 5 — tokeny spacingu dla CRM

Cel: dodać skalę spacingu i rozpocząć migrację wartości CRM bez zmian w React.

### Checklista

- [ ] Na podstawie Figmy i audytu CRM zatwierdzić skalę primitives `spacing.*`.
- [ ] Porównać skalę z `angular-design-system`; zapisać świadome różnice.
- [ ] Zdefiniować fixed spacing do konstrukcji komponentów.
- [ ] Zdefiniować semantic/responsive spacing wyłącznie tam, gdzie istnieje potwierdzona rola.
- [ ] Ustalić nazwy CSS custom properties.
- [ ] Dodać tokeny do źródeł Design Systemu.
- [ ] Wygenerować je do tego samego CSS entry pointu używanego przez CRM.
- [ ] Nie generować ani nie wdrażać teraz Tailwind/`rv-*` dla nowego spacingu.
- [ ] Dodać testy wartości fixed i responsive.
- [ ] Dodać dokumentację spacingu w Storybooku.
- [ ] Wybrać pierwszy, mały obszar CRM do migracji pilotażowej.
- [ ] Zmigrować pilotaż bez zmiany wyglądu.
- [ ] Zweryfikować pilotaż w obsługiwanych szerokościach.
- [ ] Rozpisać pozostałą migrację CRM obszarami.

### Bramka zakończenia

- [ ] Spacing jest publikowany w CSS Design Systemu i używany w pilotażu CRM.
- [ ] Nie powstał lokalny plik tokenów spacingu w CRM.
- [ ] React nie został zmieniony.
- [ ] Testy breakpointów i regresja pilotażu przechodzą.

### Notatki po etapie

- Data:
- Wynik:
- Wybrany obszar pilotażowy:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 6 — tokeny typografii dla CRM

Cel: przenieść wartości typograficzne CRM do pełnych, semantycznych ról Design Systemu.

### Checklista

- [ ] Na podstawie Figmy i audytu CRM zatwierdzić primitives typografii.
- [ ] Potwierdzić font family CRM; podłączenie tokenów samo w sobie nie zmienia fontu.
- [ ] Zdefiniować role, np. display, heading, body, label i caption.
- [ ] Dla każdej roli zdefiniować komplet:
  - [ ] font family;
  - [ ] font size;
  - [ ] font weight;
  - [ ] line height;
  - [ ] letter spacing.
- [ ] Zdefiniować warianty responsywne tylko dla ról potwierdzonych przez Figmę/produkt.
- [ ] Dodać tokeny do źródeł Design Systemu.
- [ ] Wygenerować CSS custom properties do tego samego entry pointu CRM.
- [ ] Nie dodawać teraz mapowania typografii do Reacta ani Tailwinda.
- [ ] Dodać testy kompletu właściwości każdej roli.
- [ ] Dodać specimen i macierz responsywną w Storybooku.
- [ ] Wybrać pierwszy obszar CRM do migracji pilotażowej.
- [ ] Zmigrować tokenowe wartości z odpowiedniej części `texts.scss` i komponentów.
- [ ] Oddzielić nietokenowe utility od definicji wartości.
- [ ] Zweryfikować brak zmian wymiarów i łamania tekstu na ekranach pilotażowych.
- [ ] Rozpisać pozostałą migrację CRM obszarami.

### Bramka zakończenia

- [ ] Pełne role typograficzne są publikowane w CSS i używane w pilotażu CRM.
- [ ] CRM nie ma nowego lokalnego źródła tokenów typografii.
- [ ] Font i layout pilotażu nie zmieniły się bez zaakceptowanej decyzji.
- [ ] React nie został zmieniony.

### Notatki po etapie

- Data:
- Wynik:
- Wybrany obszar pilotażowy:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 7 — scaling system dla CRM

Cel: przenieść mechanizm skalowania z `angular-design-system` w formie dopasowanej do CRM i wspólnego pipeline'u tokenów.

### Checklista

- [ ] Spisać specyfikację scalingu z `angular-design-system`:
  - [ ] breakpointy;
  - [ ] wzór interpolacji/clamp;
  - [ ] rozdzielenie breakpoint/device;
  - [ ] responsive spacing;
  - [ ] responsive typography.
- [ ] Spisać obecne breakpointy i zachowanie CRM.
- [ ] Udokumentować różnice i wpływ na ekrany CRM.
- [ ] Zaprojektować parametry scalingu jako tokeny/primitives Design Systemu.
- [ ] Wygenerować wynikowe custom properties/reguły do tego samego CSS-a CRM.
- [ ] Nie uzależniać podstawowej semantyki layoutu wyłącznie od user agenta.
- [ ] Nie zmieniać mechanizmu `rv-*` w React.
- [ ] Zbudować kalkulator/podgląd scalingu w Storybooku.
- [ ] Dodać testy computed style dla reprezentatywnych spacingów i ról typograficznych.
- [ ] Wybrać ekran CRM do proof of concept.
- [ ] Porównać ekran przed/po na wszystkich obsługiwanych szerokościach.
- [ ] Uzyskać akceptację różnic wizualnych albo doprowadzić do zgodności.
- [ ] Rozpisać migrację scalingu CRM obszarami.

### Bramka zakończenia

- [ ] Scaling działa w proof of concept CRM i pochodzi z CSS Design Systemu.
- [ ] W CRM nie skopiowano ręcznie wzorów ani wartości scalingu.
- [ ] Testy computed style i zaakceptowana regresja wizualna przechodzą.
- [ ] React nadal korzysta z niezmienionego `rv-*`.

### Notatki po etapie

- Data:
- Wynik:
- Wybrany ekran proof of concept:
- Zaakceptowane różnice:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 8 — usunięcie lokalnych tokenów i aliasów z CRM

Cel: osiągnąć stan docelowy, w którym CRM nie ma własnego systemu tokenów.

### Checklista

- [ ] Migrować użycia kolorów obszarami na semantyczne nazwy Design Systemu.
- [ ] Migrować użycia spacingu obszarami na tokeny Design Systemu.
- [ ] Migrować użycia typografii obszarami na role Design Systemu.
- [ ] Migrować zaakceptowane obszary na scaling Design Systemu.
- [ ] Po każdym obszarze uruchomić wyszukiwanie pozostałych użyć legacy.
- [ ] Po każdym obszarze wykonać build i odpowiednią regresję wizualną.
- [ ] Usunąć nieużywane `--app-color-*`.
- [ ] Usunąć nieużywane surowe `--color-*`.
- [ ] Usunąć `@use "styles/colors"` z `src/styles.scss`.
- [ ] Usunąć `src/styles/colors.scss`, gdy liczba używanych definicji wyniesie zero.
- [ ] Usunąć lokalne definicje tokenów spacingu.
- [ ] Usunąć lokalne definicje tokenów typografii; zachować tylko jawnie nietokenowe utility.
- [ ] Usunąć przejściowe aliasy CRM z paczki/adaptera po migracji ostatniego użycia.
- [ ] Przeszukać repo CRM pod kątem osieroconych lub zduplikowanych wartości.
- [ ] Udokumentować świadome wyjątki produktowe.

### Bramka zakończenia

- [ ] CRM importuje jeden CSS z paczki Design Systemu.
- [ ] CRM nie zawiera lokalnych plików będących źródłem tokenów.
- [ ] `colors.scss` nie istnieje.
- [ ] Nie ma użyć przejściowych aliasów `--app-color-*`.
- [ ] Pozostałe wyjątki są nazwane, udokumentowane i nie dublują wspólnego systemu.

### Notatki po etapie

- Data:
- Wynik:
- Usunięte pliki/aliasy:
- Pozostawione wyjątki i uzasadnienie:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania przeniesione dalej:

---

## Etap 9 — Storybook, testy konsumentów i publikacja

Cel: zamknąć pierwsze wdrożenie udokumentowanym i bezpiecznie opublikowanym kontraktem.

### Checklista

- [ ] Uzupełnić Storybook o:
  - [ ] primitive i semantic colors;
  - [ ] light/dark/brand;
  - [ ] fixed i responsive spacing;
  - [ ] specimen typografii;
  - [ ] breakpointy i kalkulator scalingu;
  - [ ] przykłady użycia CSS w Angularze;
  - [ ] status deprecated aliases;
  - [ ] raport pokrycia Figma ↔ tokeny.
- [ ] Potwierdzić, że Storybook czyta wygenerowane artefakty i nie jest drugim źródłem wartości.
- [ ] Uruchomić walidację schema, referencji, light/dark i publicznego API.
- [ ] Uruchomić pełny build paczki.
- [ ] Uruchomić build/testy CRM w wymaganych konfiguracjach.
- [ ] Uruchomić końcową regresję wizualną CRM.
- [ ] Uruchomić smoke build Reacta.
- [ ] Zweryfikować w React light/dark, Samsung override i brak zmian `rv-*`.
- [ ] Przygotować changelog i manifest różnic tokenów.
- [ ] Przygotować instrukcję integracji/migracji dla zespołu Angular.
- [ ] Opisać wyraźnie, że spacing i typografia nie są jeszcze wdrażane w React.
- [ ] Wybrać wersję zgodnie z SemVer.
- [ ] Opublikować paczkę.
- [ ] Zaktualizować przypiętą wersję w CRM.
- [ ] Wykonać smoke test CRM na opublikowanej paczce, a nie tylko na lokalnym buildzie.
- [ ] Zaktualizować tę checklistę i zamknąć lub przepisać wszystkie otwarte zadania.

### Bramka zakończenia

- [ ] Opublikowana paczka działa w CRM.
- [ ] React nie ma regresji po wydaniu paczki.
- [ ] Dokumentacja odpowiada rzeczywistym artefaktom.
- [ ] Nie ma nieopisanych blockerów ani tymczasowych aliasów bez terminu usunięcia.

### Notatki po etapie

- Data:
- Wersja paczki:
- Wynik:
- Podjęte decyzje:
- Dowody / raporty / linki:
- Otwarte problemy:
- Zadania do kolejnej iteracji:

---

## Rejestr decyzji przekrojowych

| Data | Decyzja | Uzasadnienie | Wpływ | Osoba/zespół |
|---|---|---|---|---|
| — | — | — | — | — |

## Rejestr ryzyk i blockerów

| Status | Ryzyko / blocker | Właściciel | Plan działania | Etap |
|---|---|---|---|---|
| Otwarte | `dist` jest obecnie niespójny ze źródłami tokenów | Design System | Naprawić i zabezpieczyć testem w etapie 1 | 1 |
| Otwarte | React intensywnie używa obecnego kontraktu kolorów i `rv-*` | React + Design System | Zamrozić API i wykonywać regresję; nie migrować spacingu/typografii/scalingu | 0, 3, 9 |
| Otwarte | CRM ma dużą liczbę lokalnych użyć `--app-color-*` | Angular + Design System | Tabela mapowania, przejściowe aliasy i migracja obszarami | 0, 3, 8 |
| Otwarte | Nieustalony docelowy font CRM | Design + Angular | Zachować Open Sans do jawnej decyzji | 0, 6 |

## Kryteria zakończenia całej pierwszej iteracji

- [ ] Design System jest jedynym źródłem tokenów używanych przez CRM.
- [ ] CRM importuje jeden CSS z paczki w konfiguracji buildu.
- [ ] `src/styles/colors.scss` został usunięty z CRM.
- [ ] Spacing, typografia i scaling CRM pochodzą z Design Systemu.
- [ ] React zachował dotychczasowe spacing, typografię i scaling `rv-*`.
- [ ] Istniejące kolory Reacta nie mają niezaakceptowanych regresji.
- [ ] Figma, pliki tokenów, wygenerowany CSS i Storybook mają udokumentowane mapowanie.
- [ ] Pipeline automatycznie wykrywa niespójności źródło → dist, light → dark i usunięcia publicznego API.
- [ ] Wszystkie tymczasowe aliasy zostały usunięte albo mają właściciela i termin usunięcia.
