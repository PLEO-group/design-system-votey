---
name: flow-skill-improver
description: >
  Analizuj dłuższy przebieg pracy w bieżącym flow czatu i wskazuj, czy warto
  stworzyć nowy skill albo usprawnić użyte skille. Używaj, gdy użytkownik po
  kilku lub kilkunastu wiadomościach pracy z AI prosi o retrospekcję typu
  "użyj skilla flow-skill-improver", "użyj skilla flow-improver",
  "przeanalizuj ten flow pod skille",
  "co możemy poprawić w skillach po tej rozmowie".
version: 1.3.1
author: d.kawula@pleodigital.com
scope: SHARED
category: Workflow
tags: [skills, retrospective]
---

# Flow Skill Improver

Analizuj tylko bieżący flow rozmowy. Nie rób ogólnego audytu całego repo ani wszystkich skilli, jeśli nie wynika to z tego, co faktycznie wydarzyło się w rozmowie.

Ten skill jest analityczny. Nie edytuj plików i nie twórz nowych skilli automatycznie, dopóki użytkownik wyraźnie nie poprosi o wdrożenie rekomendacji.
Jeśli użytkownik w jednym promptcie prosi o analizę i wdrożenie usprawnień, najpierw pokaż wykryte problemy do akceptacji i zatrzymaj się przed edycją plików.

Głównym wynikiem pracy nie są case-specific poprawki, tylko uogólnione wzorce problemów wykryte w rozmowie. Każdą rekomendację prowadź ścieżką:

`dowód z rozmowy -> wzorzec problemu -> uogólniona reguła -> przykładowa zmiana`.

## 1. Bramka Kontekstu

Najpierw oceń, czy jest wystarczający kontekst do sensownej retrospekcji.

Kontekst jest wystarczający, jeśli wystąpił przynajmniej jeden silny sygnał:

- kilka realnych wymian użytkownik-agent dotyczących jednego zadania lub obszaru,
- użycie co najmniej jednego skilla,
- zmiany w plikach, uruchamianie narzędzi, publikacja, testy albo walidacja,
- powtarzający się błąd, poprawka, cofnięcie, retriable flow albo niejasność proceduralna,
- użytkownik prosi o wnioski po zakończonym etapie pracy.

Jeśli użytkownik używa skilla na początku rozmowy albo bez materiału do analizy, odpowiedz dokładnie:

> Przed wyruszeniem w drogę należy zebrać drużynę.

Następnie krótko wyjaśnij, że ten skill ma sens po dłuższej wymianie pracy z AI, gdy są już decyzje, błędy, narzędzia albo użyte skille do oceny.

## 2. Zakres Analizy

Analizuj tylko fakty z bieżącej rozmowy:

- jakie zadania wykonywano,
- które skille zostały użyte albo powinny były zostać użyte,
- gdzie agent popełnił błąd, działał za wolno, zrobił za dużo lub za mało,
- gdzie brakowało automatyzacji, walidacji albo jasnego workflow,
- które problemy wyglądają na powtarzalne, a nie jednorazowe.

Nie opieraj rekomendacji na domysłach spoza rozmowy.
Nie proponuj nowego skilla dla jednorazowego problemu, jeśli wystarczy poprawić istniejący skill albo instrukcję projektu.

Czytaj tylko skille użyte w rozmowie albo bezpośrednio wskazane przez użytkownika.
Nie skanuj całego `/skills`, jeśli nie ma wyraźnego powodu.

### 2.1 Źródło Problemu I Istniejąca Reguła

Dla każdego kandydata na rekomendację wskaż jedno główne `źródło problemu`:

- `prompt użytkownika` — brakujący, sprzeczny albo niejednoznaczny input,
- `skill` — brak, niejasność albo niewystarczająca reguła w skillu,
- `instrukcja projektu` — luka albo konflikt w `AGENTS.md` lub równoważnej instrukcji,
- `narzędzie` — ograniczenie, błąd albo brak walidacji po stronie narzędzia,
- `brak wiedzy lub kontekstu` — decyzja wymagała informacji, których nie było w rozmowie ani dostępnych materiałach.

Przed zaproponowaniem zmiany skilla albo instrukcji sprawdź tylko materiały ujawnione przez rozmowę, aby ustalić status `istniejącej reguły`:

- `brak` — nie ma reguły pokrywającej problem,
- `jest, ale niejednoznaczna` — istnieje, lecz nie daje wystarczającej wskazówki,
- `jest, ale nie została zastosowana` — instrukcja była wystarczająca, a problem leży w wykonaniu,
- `niezweryfikowano` — materiał nie był dostępny w bieżącym flow.

Nie proponuj dopisania zasady, jeśli jest wystarczająca i problem polegał tylko na jej niezastosowaniu. Zamiast tego wskaż działanie naprawcze dla wykonania albo oznacz obserwację jako jednorazową. Nie skanuj dodatkowych skilli wyłącznie po to, aby znaleźć podobne reguły.

## 3. Uogólnianie Wniosków

Dowód z rozmowy służy tylko jako evidence. Nie przenoś do proponowanej reguły nazw własnych, konkretnych błędnych inputów, ścieżek plików, ticketów ani jednorazowych komend, chyba że sama rekomendacja dotyczy narzędzia albo CLI.

Każdy kandydat na rekomendację musi przejść test trzech przyszłych rozmów: czy ta sama zmiana pomogłaby w co najmniej trzech podobnych przyszłych flow, a nie tylko w tej jednej rozmowie.

Rekomendacja musi spełniać minimum 2 z 3 kryteriów:

- `Powtarzalność`: podobny problem może wystąpić w innych projektach, skillach albo flow.
- `Zmiana zachowania agenta`: rekomendacja poprawia decyzję, procedurę albo format pracy agenta, a nie tylko dopisuje konkretny case.
- `Testowalność`: da się sprawdzić, czy agent zastosował zasadę, np. po formacie odpowiedzi, warunku brzegowym, komendzie, polu JSON albo checkliście.

W odpowiedzi przy rekomendacji wypisz tylko nazwy spełnionych kryteriów, bez ich szczegółowych opisów.

Jeśli kandydat spełnia 0-1 kryteriów albo nie przechodzi testu trzech przyszłych rozmów, przenieś go do `Obserwacje Jednorazowe` i nie rekomenduj edycji skilla.

## 4. Wzorce Do Poprawy

Podstawową jednostką rekomendacji jest wzorzec usprawnienia, nie konkretny skill.

Dla każdego wzorca podaj:

- `wzorzec`: krótka nazwa uogólnionego problemu,
- `dowód`: konkretne zachowanie, błąd, retriable flow albo decyzja z bieżącego czatu,
- `źródło problemu`: jedna klasyfikacja z sekcji 2.1,
- `istniejąca reguła`: jeden status z sekcji 2.1 oraz krótki dowód weryfikacji,
- `uogólniona reguła`: zasada, która poprawi przyszłe działanie agenta,
- `przykładowa zmiana`: 1-3 zdania, bez pełnego patcha,
- `kryteria`: nazwy spełnionych kryteriów,
- `typ`: `poprawka istniejącego skilla`, `instrukcja projektu`, `nowy skill` albo `brak akcji`,
- `priorytet`: `wysoki wpływ / niski koszt`, `wysoki wpływ / średni koszt`, `średni wpływ / niski koszt` albo `niski priorytet`,
- `pewność`: `wysoka`, `średnia` albo `niska`,
- `walidacja`: krótka propozycja walidacji albo `brak`.

`nowy skill` jest tylko typem zmiany przy wzorcu. Nie twórz osobnej sekcji kandydatów na nowe skille i nie proponuj nowego skilla, jeśli wystarczy poprawić istniejący skill albo instrukcję projektu.

Maksymalnie proponuj 5 wzorców. Jeśli widzisz więcej, wybierz te o najwyższym wpływie.

## 5. Do Poprawy

W sekcji `Do poprawy` mapuj każdy wzorzec na konkretne skille albo instrukcje, które należy poprawić w ramach zastosowania tego wzorca.

Domyślnie wypisuj tylko skille i instrukcje użyte w rozmowie albo bezpośrednio ujawnione przez rozmowę. Nie skanuj innych skilli, żeby znaleźć dodatkowe miejsca zastosowania wzorca, dopóki użytkownik o to nie poprosi.

Dla każdej pozycji podaj:

- `wzorzec`,
- `do poprawy`: lista konkretnych skilli albo instrukcji z kontekstu rozmowy,
- `typ zmiany`.

## 6. Obserwacje Jednorazowe

Zachowuj obserwacje, które są przydatnym feedbackiem, ale nie powinny prowadzić do edycji skilla.

Do tej sekcji trafiają obserwacje, które:

- nie przechodzą testu trzech przyszłych rozmów,
- spełniają mniej niż 2 kryteria,
- opisują jednorazowy błąd, decyzję albo koszt pracy,
- wymagają doprecyzowania od użytkownika przed uznaniem za wzorzec.

Dla każdej obserwacji podaj krótko:

- `obserwacja`,
- `dowód`,
- `dlaczego brak rekomendacji edycji`.

## 7. Czego Nie Robić

Wskaż krótko, jeśli coś nie powinno być robione:

- nie tworzyć nowego skilla, bo wystarczy poprawić istniejący,
- nie rozbijać skilla na mniejsze, bo zwiększy to koszt i ryzyko błędnego triggera,
- nie automatyzować jednorazowego problemu,
- nie publikować ani nie modyfikować skilli bez osobnej zgody użytkownika.

## 8. Format Odpowiedzi

Stosuj nagłówki Markdown (`##`, `###`), a nie same pogrubione etykiety. Najpierw pokaż zwięzły werdykt, a następnie tylko rekomendacje wymagające decyzji. Nie powtarzaj wszystkich pól jako jednolitej listy — grupuj je według znaczenia.

Każdy wzorzec nadal musi zawierać wszystkie pola wymagane w sekcji 4, ale prezentuj je w czterech czytelnych blokach:

1. `Dowód i diagnoza` — `dowód`, `źródło problemu`, `istniejąca reguła`.
2. `Rekomendacja` — `uogólniona reguła`, `przykładowa zmiana`.
3. `Meta` — pojedynczy cytat Markdown z `typ`, `priorytet`, `pewność` i `kryteria` rozdzielonymi znakiem `·`.
4. `Walidacja` — pojedyncze zdanie.

Użyj stałej, krótkiej struktury:

```md
## Czy kontekst jest wystarczający?

Tak/Nie — <jedno zdanie uzasadnienia>.

## Werdykt

<jedno zdanie: liczba rekomendacji i najważniejsza korzyść>.

## Wzorce do akceptacji

### 1. <krótka nazwa wzorca>

**Dowód i diagnoza**

<dowód>. Źródło problemu: <źródło>. Istniejąca reguła: <status i krótki dowód>.

**Rekomendacja**

<uogólniona reguła>. <Przykładowa zmiana>.

> Typ: <typ> · Priorytet: <priorytet> · Pewność: <pewność>
>
> Kryteria: <kryteria>

**Walidacja:** <walidacja>

## Do poprawy

- **<wzorzec>** — <skill lub instrukcja>; <typ zmiany>.

## Obserwacje jednorazowe

- **<obserwacja>** — <dowód>. Brak rekomendacji: <powód>.

## Optymalizacja kosztu i szybkości

<maksymalnie dwa zdania>.

## Czego nie warto robić

- <krótki punkt>.

## Rekomendowany następny krok

<jeden konkretny krok>.
```

W sekcji `Wzorce do akceptacji` nie umieszczaj pozycji z typem `brak akcji`; przenieś je do `Obserwacje jednorazowe` lub pomiń, jeśli nie wnoszą nowej decyzji. Jeśli nie ma rekomendacji w danej sekcji, napisz `Brak sensownych rekomendacji na podstawie tego flow.`

W `Rekomendowany Następny Krok` wskaż jeden najlepszy krok. Pełny plan rozpisuj tylko wtedy, gdy użytkownik o niego poprosi.

Jeśli nie ma rekomendacji w danej sekcji, napisz `Brak sensownych rekomendacji na podstawie tego flow.`

Na końcu zawsze dodaj pytanie:

> Czy chcesz bym sprawdzil, czy ten sam wzorzec problemu istnieje w innych skilach?
