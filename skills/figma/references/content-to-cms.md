# Figma Content to CMS

Orkiestrator łączący trzy skille w jeden przepływ:
**Figma** (nazwy assetów i treści) → **Google Drive** (weryfikacja plików) → **Strapi** (tworzenie wpisu)

---

## Kiedy ten dokument jest aktywny

Użyj gdy użytkownik chce:
- stworzyć wpis CMS na podstawie specyfikacji lub makiety Figmy
- uzupełnić pola media plikami z Google Drive wykrytymi z Figmy
- zautomatyzować flow: spec → pliki → wpis

---

## Krok 1 — Znajdź specyfikację

Sprawdź czy specyfikacja modułu jest dostępna:

1. Jeśli użytkownik podał ścieżkę do pliku `spec.md` — użyj jej.
2. Jeśli nie — przeszukaj `docs/sdd/` w repo po nazwie modułu z promptu.
3. Jeśli nie znajdziesz — zapytaj.

Z `spec.md` wyciągnij:
- linki do Figmy (Desktop / Tablet / Mobile)
- nazwę modułu i UID content type (`feature slug`)

---

## Krok 2 — Odczytaj makietę z Figmy

Użyj linku do Figmy z spec (preferuj Desktop). Wywołaj `get_design_context` z Figma MCP.

Z odpowiedzi wyciągnij:
- **nazwy assetów / warstw** oznaczonych jako obrazy, ikony, media (szukaj warstw typu `image`, `vector`, nazw zawierających `logo`, `icon`, `ilu`, `mockup`, `img`, `photo`)
- **teksty** przypisane do pól content type (nagłówki, opisy, labele)

### Mapowanie pól tekstowych: tekst płaski vs tekst formatowany

Przy tworzeniu albo aktualizacji wpisu CMS na podstawie Figmy przed mutacją sklasyfikuj każde pole tekstowe:

- `tekst płaski` — pojedynczy tekst bez formatowania inline; zwykle pasuje do pól typu `string`, `text`, `shortText` albo podobnych prostych pól tekstowych.
- `tekst formatowany / strukturalny` — tekst zawiera albo może wymagać formatowania inline z Figmy: różne kolory, style, linki, pogrubienia, kilka spanów w jednym węźle albo widoczne wyróżnienie fragmentu tekstu. W konkretnym CMS może to być nazwane np. `rich text`, `blocks`, `portable text`, `structured text`, `formatted text` albo inaczej.

Jeśli `get_design_context` pokazuje kilka `<span>` w jednym tekście albo różne kolory wewnątrz jednej frazy, traktuj pole jako wymagające tekstu formatowanego/strukturalnego i sprawdź, czy schemat CMS to obsługuje. Jeśli schemat ma tylko płaskie pole tekstowe, zatrzymaj się przed mutacją danych i zgłoś konieczność zmiany kontraktu albo świadomego spłaszczenia treści.

Przed wywołaniem skryptów CMS wypisz krótko mapowanie:

```text
Pole CMS | Kategoria tekstu | Dowód z Figmy | Decyzja
heading  | formatowany      | dwa spany / kolor inline | wymaga pola obsługującego formatowanie
tag      | płaski           | jeden tekst bez formatowania | proste pole tekstowe
```

### Jak odczytać nazwę pliku assetu z kodu Figmy

Kanoniczna nazwa pliku assetu to wartość atrybutu `data-name` na elemencie `<div>` lub `<img>` otaczającym obraz w kodzie zwróconym przez `get_design_context`. Jest to dokładna nazwa bazowa pliku do szukania na Google Drive (bez rozszerzenia).

Przykład:
```jsx
<div data-node-id="4893:18178" data-name="votey_banner_feature_agenda 1">
```
→ nazwa pliku: `votey_banner_feature_agenda` (ignoruj trailing ` 1` lub podobne sufiksy numeryczne)

Nie szukaj nazwy pliku w URL assetów Figma API (`figma.com/api/mcp/asset/...`) — te URLe są tymczasowe i nie zawierają nazwy pliku.

Zapisz wyciągniętą listę assetów w formacie:
```
Asset: [nazwa_warstwy] → nazwa pliku Google Drive: [data-name bez sufiksu] → potencjalne pole CMS: [nazwa_pola]
```

Jeśli nie możesz jednoznacznie przypisać assetu do pola CMS — **zapytaj użytkownika**, nie zgaduj.

---

## Krok 3 — Pobierz schemat content type

Użyj `mcp__strapi__get-content-type-by-name` aby pobrać schemat docelowego content type.

Wyfiltruj pola typu `media` — to są kandydaci do uzupełnienia plikami z Google Drive.

---

## Krok 4 — Weryfikacja plików na Google Drive

Dla każdego assetu z Figmy który ma trafić do pola media:

1. OBOWIĄZKOWO uruchom skill `google-drive` przed jakąkolwiek mutacją CMS.
2. Zastosuj logikę skilla `google-drive` (dynamiczne wykrycie punktu montowania, weryfikacja pliku).
3. Jeśli plik **nie istnieje** — zastosuj fuzzy matching (min. 70% zgodności) i zapytaj usera.
4. Jeśli plik **istnieje** — zweryfikuj typ i rozmiar.
5. Poczekaj na rozwiązanie **wszystkich** wątpliwości przed przejściem do Kroku 5.

---

## Krok 5 — Potwierdź dane wpisu z użytkownikiem

Przed utworzeniem wpisu pokaż podsumowanie:

```
Typ treści: [UID]
Locale: [locale]

Pola tekstowe:
  title: "[wartość z Figmy]"
  description: "[wartość z Figmy]"
  ...

Pola media:
  notion_logo: [nazwa_pliku] ([ścieżka lokalna])
  tablet_mockup: [nazwa_pliku] ([ścieżka lokalna])
  ...  (lub "pominięte" jeśli brak pliku)

Publikować od razu? [tak/nie]
```

Poczekaj na potwierdzenie użytkownika przed kontynuowaniem.

Brama jakości (obowiązkowa):
- Nie wykonuj Kroku 6 dopóki użytkownik nie potwierdzi jawnie danych.
- Jeśli którekolwiek pole z Figmy jest niepewne / puste / niejednoznaczne, pokaż je explicite w podsumowaniu i zapytaj o decyzję.

---

## Krok 6 — Wgraj pliki do Strapi i utwórz wpis

1. Dla każdego zweryfikowanego pliku media — wgraj do biblioteki mediów Strapi i zapamiętaj ID.
2. Utwórz wpis używając skryptu `entries-create`.
3. Jeśli użytkownik chce wiele locale — użyj `create-multilingual.js`.

---

## Krok 7 — Zgłoś wyniki

Potwierdź:
- `documentId` nowego wpisu
- locale i status (draft / published)
- które pola media zostały uzupełnione, które pominięte

---

## Reguły ogólne

- **Nigdy nie twórz wpisu** zanim wszystkie wątpliwości dotyczące plików nie zostaną rozwiązane przez użytkownika
- **Nigdy nie zgaduj** przypisania asset → pole CMS — zawsze pytaj jeśli nie jest oczywiste
- **Nigdy nie pomijaj** pola media bez jawnej decyzji użytkownika
- **Nigdy nie pomijaj kroku Google Drive** dla pól media
- **Nigdy nie mutuj CMS bez pokazania podsumowania danych do akceptu**
- Przestrzegaj reguł bezpieczeństwa skilla `google-drive` — operuj wyłącznie w `Dyski współdzielone/`
