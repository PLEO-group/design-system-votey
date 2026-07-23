# Figma Content to CMS

Orkiestrator łączący skille i narzędzia w jeden przepływ:
**Figma** (nazwy assetów i treści) → **Google Drive** (weryfikacja plików) → **CMS** (Sanity / Strapi / inny wykryty provider)

## Spis treści

- [Kiedy ten dokument jest aktywny](#kiedy-ten-dokument-jest-aktywny)
- [Krok 0 — Provider, target i topologia](#krok-0--ustal-provider-cms-i-target-contentu)
- [Krok 1 — Specyfikacja](#krok-1--znajdź-specyfikację)
- [Krok 2 — Figma](#krok-2--odczytaj-makietę-z-figmy)
- [Krok 3 — Schemat CMS](#krok-3--pobierz-schemat-content-type--schema-type)
- [Krok 4 — Google Drive](#krok-4--weryfikacja-plików-na-google-drive)
- [Krok 5 — Potwierdzenie i idempotencja](#krok-5--potwierdź-dane-wpisu-z-użytkownikiem)
- [Krok 6 — Mutacja CMS](#krok-6--wgraj-pliki-do-cms-i-utwórz-albo-zaktualizuj-wpis)
- [Preflight credentiali Sanity](#preflight-credentiali-sanity)
- [Krok 7 — Raport](#krok-7--zgłoś-wyniki)
- [Reguły ogólne](#reguły-ogólne)

---

## Kiedy ten dokument jest aktywny

Użyj gdy użytkownik chce:
- stworzyć wpis CMS na podstawie specyfikacji lub makiety Figmy
- uzupełnić istniejącą stronę, moduł albo dokument CMS treściami z makiety
- uzupełnić pola media plikami z Google Drive wykrytymi z Figmy
- zautomatyzować flow: spec → pliki → wpis

---

## Krok 0 — Ustal provider CMS i target contentu

Zanim edytujesz pliki albo mutujesz CMS, rozdziel trzy różne operacje:

- `schema` — dodajesz lub zmieniasz definicję pól, walidacje, fragmenty GROQ/query albo typy.
- `document mutation` — uzupełniasz istniejący dokument, stronę, moduł albo wpis realną treścią.
- `both` — najpierw schema, potem mutacja dokumentu, bo obecny model danych nie obsługuje wymaganej treści.

Jeśli użytkownik mówi: „dodaj w CMS”, „uzupełnij treści”, „dodaj na podstronie”, „pod tym modułem”, „w tym dokumencie” albo pokazuje Sanity Studio z istniejącym dokumentem, domyślnym targetem jest `document mutation`, nie `initialValue` w schemacie.

`initialValue` w schema traktuj wyłącznie jako domyślne wartości dla nowo tworzonych dokumentów lub modułów. Nie używaj go jako substytutu migracji/patcha istniejącego contentu, chyba że użytkownik jawnie prosi o defaulty dla przyszłych wpisów.

Wykryj providera CMS z repo i narzędzi:

- `Sanity`: `sanity.config.*`, `sanity.cli.*`, `@sanity/client`, `next-sanity`, env `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.
- `Strapi`: MCP Strapi, konfiguracja Strapi, skrypty entries/upload albo env Strapi.
- Inny provider: odczytaj konfigurację projektu i nie zakładaj Strapi.

Przed mutacją pokaż krótkie podsumowanie targetu:

```text
Provider: Sanity
Dataset/env: production
Target: page / slug=contact / locales=pl,en
Operation: insert module after _key=contact-ai-assistant
Idempotency: module _key=contact-ask-frac-ai-faq
Expected state: module exists once, starterQuestions count=6
```

Jeśli target, locale, dataset, anchor albo tryb `schema` vs `document mutation` są niejasne, zatrzymaj się i zapytaj.

### Kontrakt topologii contentu i mutation allowlist

Przed mutacją rozpisz minimalną topologię dokumentów objętych zadaniem. Dla każdego bytu podaj:

- typ dokumentu albo modułu,
- czy jest routowalny,
- właściciela treści i stabilną tożsamość,
- relacje oraz dokumenty, które na niego wskazują,
- oczekiwany stan po operacji.

Następnie przygotuj jawną allowlistę:

```text
Mutation allowlist:
- create: <typ + stabilna tożsamość albo none>
- update: <typ + selektor targetu albo none>
- delete: <dokładne ID albo deterministyczne kryteria + expected count albo none>
- forbidden/out of scope: <typy i obszary, których nie wolno mutować>
```

Nie twórz osobnego dokumentu tylko dlatego, że element ma anchor, pozycję w menu, blok treści albo reprezentację w
Figmie. Najpierw potwierdź w schemacie, query i istniejących danych, czy jest samodzielnym routowalnym bytem, czy
elementem zagnieżdżonym albo referencją należącą do istniejącego dokumentu.

Dokument nieobecny na allowliście nie może zostać utworzony, zaktualizowany ani usunięty. Jeśli podczas wykonania
odkryjesz potrzebę rozszerzenia allowlisty, zatrzymaj mutację, pokaż zmianę zakresu i uzyskaj akceptację użytkownika.

#### Macierz umieszczenia modułu na trasach

Jeśli operacja dodaje, przenosi albo usuwa moduł w dokumencie strony, przed mutacją powiąż topologię z trasami:

```text
Route placement:
- required: <route + locale + documentId/slug + expected count + pozycja/anchor>
- forbidden: <route + locale + documentId/slug + expected count=0>
- shared references: ...
```

Zapis „ostatni moduł” oznacza postcondition `index = modules.length - 1`. Zapis „tylko na” wymaga zarówno listy tras
`required`, jak i pełnej listy znanych tras `forbidden` w ustalonej topologii, które mogły odziedziczyć albo wcześniej
zawierać moduł.
Każdy dokument z macierzy, który ma zostać zmieniony, musi znaleźć się również na mutation allowlist.

Po commicie wykonaj read-after-write per dokument i potwierdź: expected count, stabilny `_key`, pozycję/anchor oraz brak
modułu w dokumentach zabronionych. Następnie sprawdź te same postconditions na routowalnych stronach w runtime; sam
poprawny stan jednego dokumentu CMS nie potwierdza całej topologii.

#### Bezpieczne usuwanie

Przed `delete` wykonaj dry-run i pokaż:

- dokładne ID kandydatów oraz expected count,
- dowód, że spełniają kryterium usunięcia,
- krytyczne pola potwierdzające brak poprawnej treści,
- draft/published status,
- graf referencji przychodzących i plan ich naprawy,
- typy podobnych poprawnych dokumentów, które pozostają poza zakresem.

Usuń dokumenty dopiero po naprawie albo świadomym rozstrzygnięciu wszystkich referencji. Po operacji potwierdź osobnym
odczytem: brak usuniętych ID i draftów, brak osieroconych referencji, zachowanie poprawnych dokumentów oraz expected
state właściciela treści.

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

## Krok 3 — Pobierz schemat content type / schema type

Dobierz metodę do providera:

- Strapi: użyj `mcp__strapi__get-content-type-by-name`, aby pobrać schemat docelowego content type.
- Sanity: odczytaj lokalne schema type / fragmenty / generated schema dla modułu albo dokumentu, który ma zostać uzupełniony.
- Inny provider: użyj natywnego schematu lub konfiguracji repo.

Wyfiltruj pola typu `media` / image / file — to są kandydaci do uzupełnienia plikami z Google Drive.

Przy `document mutation` odczytaj także aktualny target po stabilnej tożsamości:

- dokument: `documentId`, `_id`, UID, slug + locale, route albo inny unikalny klucz,
- moduł w tablicy: stabilny `_key`, UID albo inny deterministyczny identyfikator,
- anchor pozycji: np. `_key` modułu, po którym trzeba wstawić nowy blok.

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

### Kontrakt idempotencji przed mutacją

Przed wysłaniem mutacji:

1. Odczytaj aktualny target po stabilnej tożsamości, np. `documentId`, UID + locale, route albo innym unikalnym kluczu.
2. Zapisz revision/version, bieżący stan pól oraz warunek oznaczający, że oczekiwana zmiana już istnieje.
3. Użyj deterministycznego klucza/idempotency key, jeśli CMS albo model danych go wspiera.
4. Zdefiniuj expected state do późniejszego read-after-write: identyfikator, locale, status publikacji i krytyczne pola.
5. Jeśli target już spełnia expected state, nie mutuj go ponownie; przejdź do raportu jako operacja idempotentna.

### Unicode-safe mutation

Przy mutacji CMS z treściami lokalizowanymi albo znakami spoza ASCII stosuj bezpieczny transport Unicode.

Na Windows nie wysyłaj nie-ASCII przez inline PowerShell here-string / `cmd` / ad hoc shell quoting, dopóki nie zweryfikujesz kodowania end-to-end. Preferuj:

- payload JSON zapisany jako UTF-8,
- natywny client CMS w runtime, który czyta payload bezpośrednio jako UTF-8,
- `\uXXXX` escapes dla krótkich inline one-off skryptów,
- oficjalny import/migration runner providera, jeśli istnieje w repo.

Po zapisie wykonaj read-after-write i audyt tekstu:

- porównaj krytyczne pola z oczekiwanym payloadem,
- sprawdź typowe ślady mojibake: replacement char, `Ã`, `Â`, `â€`, `â€¦`,
- sprawdź podejrzane `?` tylko przez porównanie z expected text, bo normalne pytania mogą kończyć się `?`.

Jeśli wykryjesz uszkodzone znaki, nie rób ręcznych punktowych poprawek. Podmień cały uszkodzony moduł/wpis payloadem z bezpiecznego transportu i ponów audyt.

---

## Krok 6 — Wgraj pliki do CMS i utwórz albo zaktualizuj wpis

### Strapi

1. Dla każdego zweryfikowanego pliku media — wgraj do biblioteki mediów Strapi i zapamiętaj ID.
2. Utwórz wpis używając skryptu `entries-create`.
3. Jeśli użytkownik chce wiele locale — użyj `create-multilingual.js`.
4. Oddziel wynik commitu od lokalnego formatowania/logowania odpowiedzi. Błąd raportowania nie oznacza, że commit się nie wykonał.

### Sanity

#### Preflight credentiali Sanity

Przed jakąkolwiek mutacją:

1. Wylistuj wyłącznie nazwy dostępnych zmiennych środowiskowych pasujących do tokenów Sanity; nigdy nie wypisuj ich wartości.
2. Jeśli repo rozdziela credentiale, utwórz osobny uwierzytelniony read client z `perspective: "raw"` oraz write client
   z jawnym tokenem zapisu. Read token może służyć do preflightu; commit musi użyć write tokenu.
3. Potwierdź obecność nazwy zmiennej z write tokenem przed zbudowaniem transakcji. Brak tokenu zapisu jest blockerem,
   nie powodem do próby commitu read tokenem.
4. Mutation allowlist, revision i preconditions wyznaczaj z uwierzytelnionego odczytu raw. Nie buduj ich z anonimowego
   klienta ani CDN, jeśli dostępny jest authenticated raw read.
5. Nie loguj klienta, headers, request options ani obiektu env, jeśli mogłyby ujawnić secret.

Następnie:

1. Użyj `@sanity/client`, Sanity CLI albo istniejącego migration/seed runnera z repo.
2. Ustal dataset/workspace jawnie. Nie zakładaj, że `.env.local` wskazuje właściwy target bez sprawdzenia.
3. Odczytaj target uwierzytelnionym klientem w `perspective: "raw"`, żeby wykryć drafty i published documents, jeśli to istotne dla Studio.
4. Dla tablic modułów używaj deterministycznego `_key`. Przed insertem sprawdź, czy moduł o tym `_key` albo oczekiwanym `_type` już istnieje.
5. Przy insercie pozycyjnym używaj stabilnego anchor `_key`, np. `modules[_key == "..."]`. Nie opieraj pozycji na indeksie, jeśli można użyć `_key`.
6. Dla wielu locale mutuj każdy dokument osobno i raportuj wynik per locale.
7. Po commicie wykonaj read-after-write expected state: obecność modułu, kolejność, liczba elementów, locale, krytyczne pola i audyt Unicode.
8. Jeśli Sanity Studio pokazuje draft, a published document został zmieniony, sprawdź również `drafts.*` i zgłoś różnicę zamiast zakładać, że Studio pokazuje published.

### Granica commit i obowiązkowy read-after-write

Po wysłaniu mutacji jej wynik może być `confirmed`, `not committed` albo `unknown`.

- `confirmed`: CMS potwierdził commit; mimo to wykonaj osobny odczyt expected state.
- `not committed`: narzędzie jednoznacznie potwierdziło brak zapisu; retry jest dozwolony po ponownej kontroli precondition.
- `unknown`: wystąpił timeout, zerwane połączenie, błąd parsowania odpowiedzi albo błąd lokalnego kodu po wysłaniu requestu. Nie ponawiaj mutacji w ciemno.

Błąd permissions/authorization po próbie commitu traktuj jako `unknown`, dopóki osobny authenticated raw
read-after-write nie potwierdzi braku expected state. Dopiero wtedy oznacz operację jako `not committed`. Nie ponawiaj
tej samej transakcji z tym samym credentialem; retry jest dozwolony dopiero po poprawieniu write tokenu, ponownym
odczycie revision/preconditions i potwierdzeniu, że expected state nadal nie istnieje.

Dla stanu `unknown` najpierw wykonaj read-after-write po stabilnej tożsamości targetu:

1. Jeśli expected state istnieje, uznaj operację za wykonaną i nie retry'uj.
2. Jeśli odczyt jednoznacznie potwierdza brak zmiany, ponów dopiero po ponownej kontroli revision/precondition.
3. Jeśli odczyt jest niejednoznaczny albo niedostępny, zatrzymaj się i zgłoś stan `unknown`; nie ryzykuj duplikatu.
4. Dla batcha lub wielu locale zweryfikuj każdy target osobno i raportuj częściowy commit zamiast wspólnego sukcesu.

---

## Krok 7 — Zgłoś wyniki

Potwierdź:
- `documentId` nowego wpisu
- locale i status (draft / published)
- które pola media zostały uzupełnione, które pominięte
- provider CMS, dataset/env i stabilne identyfikatory targetów
- przy aktualizacji dokumentu: pozycję modułu/wpisu, `_key` i expected state
- wynik read-after-write dla każdego targetu
- wynik Unicode audit dla treści spoza ASCII
- czy operacja była nowym commitem, czy idempotentnym potwierdzeniem istniejącego expected state

---

## Reguły ogólne

- **Nigdy nie twórz wpisu** zanim wszystkie wątpliwości dotyczące plików nie zostaną rozwiązane przez użytkownika
- **Nigdy nie zgaduj** przypisania asset → pole CMS — zawsze pytaj jeśli nie jest oczywiste
- **Nigdy nie pomijaj** pola media bez jawnej decyzji użytkownika
- **Nigdy nie pomijaj kroku Google Drive** dla pól media
- **Nigdy nie mutuj CMS bez pokazania podsumowania danych do akceptu**
- **Nigdy nie mutuj dokumentu spoza jawnej mutation allowlist**
- **Nigdy nie utożsamiaj elementu nawigacji, anchora albo bloku treści z osobnym dokumentem routowalnym bez weryfikacji topologii**
- **Nigdy nie usuwaj dokumentów bez dry-runu, audytu referencji i postconditions chroniących poprawne dane**
- **Nigdy nie retry'uj mutacji o statusie `unknown` bez read-after-write**
- **Nigdy nie buduj Sanity mutation allowlist z anonimowego/CDN odczytu, jeśli dostępny jest authenticated raw read**
- **Nigdy nie wypisuj wartości tokenów Sanity; w preflighcie pokazuj wyłącznie nazwy zmiennych**
- **Nigdy nie używaj `initialValue` jako zamiennika patcha istniejącego contentu**
- **Nigdy nie mutuj treści z polskimi znakami albo innym non-ASCII bez Unicode-safe transportu i read-after-write audit**
- Przestrzegaj reguł bezpieczeństwa skilla `google-drive` — operuj wyłącznie w `Dyski współdzielone/`
