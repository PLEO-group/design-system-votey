---
name: zamkniecie-czatu
description: >
  Zamknięcie czatu w modelu DELTA + APLIKACJA. Czat zamykany ma nieufny kontekst (skille
  i pliki wczytane do rozmowy mogą być przeterminowane), więc NIGDY nie edytuje kanonu —
  zawsze generuje jeden plik MD „Zamknięcie" z kompletem delt do skilli i dokumentów
  projektu. Wdrożenie robi ŚWIEŻY czat, który widzi aktualny kanon. Dwa tryby:
  (1) ZAMKNIĘCIE — gdy użytkownik mówi „zamykam czat", „usuwam ten czat", „nowy czat",
  „przenosimy się", „przygotuj plik do nowego czatu", „czy wszystko mamy zapisane?",
  „audyt czatu"; (2) APLIKACJA — gdy użytkownik wkleja plik zaczynający się od
  „# Zamknięcie —" albo mówi „zastosuj zamknięcie", „scal delty". Jedyna decyzja przy
  zamykaniu: kontynuacja TAK/NIE (dokłada sekcję Praca w toku). Nie mylić ze
  skill-improverem: improver decyduje CO warto zapisać, ten skill pilnuje, ŻEBY wszystko
  zostało zapisane — na aktualnej bazie.
---

# Zamknięcie czatu — model DELTA + APLIKACJA

## Fundament: dlaczego zamykany czat nie dotyka kanonu

Empiria użytkownika: nawet po wyraźnej prośbie o odświeżenie skilli Claude w długim czacie potrafi działać na wersjach wczytanych do rozmowy tygodnie wcześniej. Tekst skilla siedzący w historii konwersacji jest zamrożony i „przykrywa" świeży plik z dysku. Dlatego:

- **Czat zamykany = tylko zbieranie.** Produkuje jeden plik MD z deltami. Zero edycji skilli, zero edycji dokumentów projektu, zero założenia „przecież wiem, co jest w aktualnej wersji". Nie wiesz.
- **Czat świeży = wdrażanie.** Nowy czat montuje aktualne skille (`/mnt/skills`) i aktualne pliki projektu, więc scalanie delt odbywa się na prawdziwej, bieżącej bazie.
- **Kanon = pliki .md** (skille + dokumenty wiedzy projektu). Przenoszą się między kontami i organizacjami. Memory to cache, nie magazyn. Systemy zewnętrzne (Notion, Figma) trzymają treść projektu; reguły pracy trzymają pliki.
- **Użytkownik instaluje sam.** Każdy plik wynikowy → `/mnt/user-data/outputs/` + `present_files` + informacja, gdzie podmienić. Bieżące środowisko to jedna z wielu instalacji.

---

## TRYB ZAMKNIĘCIE (w czacie do usunięcia)

### Krok 1 — Bilans sesji

Przejrzyj rozmowę od początku i posortuj każdą trwałą informację:

| Kategoria | Los po usunięciu czatu | Trafia do |
|---|---|---|
| **A. Zapisane trwale** — wpisy w Notion/Figmie, pliki już podmienione przez użytkownika | przeżyje | sekcja informacyjna pliku zamknięcia |
| **B. W outputs, niepobrane** — artefakty, karty decyzji, wygenerowane pliki | przepadnie bez pobrania | checklista pobrania + `present_files` |
| **C. Delta do kanonu** — pułapki narzędzi, potwierdzone reguły, fakty projektowe, pomysły do kolejki, wnioski do decyzji | przepadnie | **sekcja Delty pliku zamknięcia** |

Sygnały kategorii C: błąd API + działająca poprawka; obietnica „zapiszę do skilla" bez wykonania; decyzja rzucona mimochodem; nowe ID / zmiana architektury; odpowiedź zmieniająca plan; różnica między tym, co mówi skill, a tym, co realnie zadziałało.

### Krok 2 — Jedyne pytanie do użytkownika

**„Kontynuujemy tę pracę w nowym czacie?"** — jeśli odpowiedź nie wynika wprost z wypowiedzi użytkownika. To jedyna decyzja przy zamykaniu:

- **NIE** → plik zamknięcia = sam pakiet delt (wariant standardowy).
- **TAK** → plik zamknięcia = pakiet delt **+ sekcja Praca w toku** (wariant kontynuacyjny).

Żadnych innych pytań. Nie pytaj, czy generować plik — plik powstaje ZAWSZE, nawet gdy delt brak (wtedy protokół zerowy: krótki plik stwierdzający „zero delt, czat czysty do usunięcia" — rytuał ma być przewidywalny).

### Krok 3 — Plik zamknięcia (szablon)

**Nazwa pliku:** `zamkniecie_{temat-kebab}_{RRRR-MM-DD}.md`, małe litery ASCII, bez polskich znaków, bez pauzy i bez spacji. Wcześniejszy wzór `Zamknięcie — {temat}.md` psuł się przy pobieraniu i przy montowaniu katalogu (pauza i spacje zamieniane na podkreślenia), zgodnie z pułapką opisaną w skillu `nazewnictwo`. **Nagłówek H1 w środku pliku zostaje w formie `# Zamknięcie — {temat} ({data})`**, bo po nim rozpoznawany jest tryb APLIKACJA; to jeden z wyjątków od zasady zero pauzy (identyfikator techniczny, nie proza). Plik jednorazowy: po scaleniu w nowym czacie do usunięcia, nie jest dokumentem project knowledge.

```markdown
# Zamknięcie — {projekt / temat} ({data})

## Metryka
- Wariant: DELTA / DELTA + KONTYNUACJA
- Czat rozpoczęty: {data} · stan wiedzy na: {data} · wygenerowano: {data}
- ⚠️ Plik jednorazowy. Wklej do NOWEGO czatu i poleć: „zastosuj zamknięcie".
  Po scaleniu usuń. Im starszy plik, tym większe ryzyko konfliktu z kanonem.

## Instrukcja dla Claude'a (tryb APLIKACJA)
Zastosuj delty poniżej na AKTUALNYM kanonie: każdy plik docelowy wczytaj świeżo
z dysku, porównaj z deltą, scal, wynik do outputs. Procedura: skill
`zamkniecie-czatu`, sekcja TRYB APLIKACJA.

## Delty do kanonu
{jedna pozycja = jeden blok; każda SAMOWYSTARCZALNA — czat aplikujący nie ma
dostępu do zamkniętej rozmowy}

### D1 · {krótki tytuł delty}
- **Cel:** {dokładna nazwa pliku: skill `xxx` / dokument `yyy.md` / kolejka prac}
- **Typ:** reguła potwierdzona / fakt projektowy / pozycja do kolejki / DO DECYZJI
- **Treść (dokładne brzmienie do wstawienia):**
  > {gotowy tekst, nie parafraza — apply-czat ma wklejać, nie zgadywać}
- **Miejsce wstawienia:** {sekcja / krok / po jakim fragmencie}
- **Dowód z sesji:** {co się wydarzyło: błąd, komunikat, decyzja użytkownika, data}
- **Pewność:** wysoka / średnia / niska

## Kolejka prac (pomysły odłożone)
{pozycje do dopisania do trwałej kolejki projektu: zadanie — narzędzie/skill — skąd pomysł}

## Zapisane trwale w tej sesji (kategoria A — informacyjnie)
{co + gdzie + data; apply-czat NIE musi nic z tym robić}

## Pobrane z tego czatu (kategoria B — checklista użytkownika)
{lista plików z outputs, które użytkownik miał pobrać przed usunięciem czatu}

## Praca w toku (TYLKO wariant kontynuacyjny)
{co zaczęte, gdzie stoi, co blokuje, linki/ID — z pełnym kontekstem;
apply-czat najpierw scala delty, POTEM podejmuje tę pracę}
```

Zasady sekcji Delty:

- **Kompletność ponad selekcję.** Wszystko, co wg wiedzy z sesji NIE jest jeszcze w kanonie, wchodzi do delt. Wątpliwość „może to już jest w skillu?" nie jest powodem pominięcia — rozstrzygnie ją apply-czat, porównując z aktualnym plikiem.
- **Dokładne brzmienie, nie streszczenie.** Delta ma gotowy tekst do wklejenia. Apply-czat scala, nie rekonstruuje.
- **Delta celująca w skill GENERYCZNY** (instalowany między projektami) ma treść sformułowaną bez nazw projektu, jego baz i wpisów już na etapie zamknięcia — nazwy pól jako materiał dowodowy mogą zostać. Dowód z sesji może być projektowy (zostaje w pliku zamknięcia), sama treść do wklejenia nie.
- **Wnioski wymagające decyzji:** jeśli się da, wyrenderuj kartę decyzji (`karty-decyzji`) jeszcze w zamykanym czacie i wpisz do delty wynik. Jeśli użytkownik odkłada — delta z typem **DO DECYZJI**; apply-czat wyrenderuje kartę przed scaleniem.
- Decyzje formatu DEC → delta celująca w rejestr decyzji projektu.

### Krok 4 — Wyjście

1. `present_files`: plik zamknięcia + WSZYSTKIE niepobrane pliki kategorii B.
2. Checklista: co pobrać (zniknie) vs co już trwałe (można zignorować).
3. Instrukcja jednym zdaniem: „wklej plik Zamknięcie do nowego czatu i napisz: zastosuj zamknięcie".

---

## TRYB APLIKACJA (w świeżym czacie)

Trigger: użytkownik wkleja plik `# Zamknięcie — ...` albo mówi „zastosuj zamknięcie" / „scal delty". Można wkleić **kilka plików zamknięcia naraz** (z kilku usuniętych czatów) — wtedy scalaj chronologicznie po dacie generacji.

1. **Świeży odczyt celów.** Dla każdego pliku docelowego z delt: `view` na aktualny plik z dysku (`/mnt/skills/user/...`, `/mnt/project/...`). NIGDY nie scalaj na podstawie treści pliku zapamiętanej skądinąd.
2. **Porównanie per delta:**
   - delta już obecna w kanonie (wdrożona wcześniej / z innego pliku zamknięcia) → pomiń, odnotuj w raporcie;
   - delta konfliktuje z nowszą treścią kanonu (plik zmienił się po dacie generacji delty) → NIE nadpisuj po cichu; pokaż konflikt użytkownikowi (obie wersje) i zapytaj;
   - delta czysta → scal w wskazanym miejscu, dokładnym brzmieniem.
3. **Delty DO DECYZJI** → karta decyzji przed scaleniem; scalaj dopiero wynik.
4. **Kolejka prac** → dopisz pozycje do trwałej kolejki projektu (sekcja `## Kolejka prac` w dokumencie wiedzy albo magazyn wskazany w Instructions projektu, np. baza Notion). Usuń z kolejki pozycje zrobione, oznacz zdezaktualizowane.
5. **Historia zmian** każdego zmodyfikowanego skilla/dokumentu → dopisz wiersz z datą i źródłem („scalono z Zamknięcie — {temat} ({data})"). **Wyjątek — skille GENERYCZNE** (instalowane między projektami i kontami, np. `notion-mcp-best-practices`, `karty-decyzji`, `zamkniecie-czatu`, `skill-improver`, `nazewnictwo`; rozpoznasz je po regule zerowej w nagłówku albo po braku prefiksu projektu w nazwie): wiersz historii dostaje samą datę i treść zmiany, bez tytułu pliku zamknięcia, bez nazwy projektu i bez nazw jego baz czy wpisów, a treść delty przed scaleniem anonimizujesz wg reguły zerowej danego skilla (nazwy pól jako dowód mogą zostać, kontekst projektu wypada).
6. **Wynik:** wszystkie zaktualizowane pliki → outputs + `present_files` + instrukcja podmiany (per plik: który projekt / które konto). **Skille oddawaj jako pakiety `.skill`, nie jako luźne `.md`** — patrz sekcja „Format wyjściowy: skille jako pakiety instalowalne".
7. **Raport scalenia:** wdrożone / pominięte (już były) / konflikty (jak rozstrzygnięte) / czekające na decyzję. Na końcu: „plik(i) Zamknięcie można usunąć".
8. **Wariant kontynuacyjny:** dopiero po scaleniu podejmij pracę z sekcji Praca w toku.

---

## Format wyjściowy: skille jako pakiety instalowalne

Dokument wiedzy projektu użytkownik podmienia ręcznie w project knowledge, więc wystarczy zwykły `.md`. **Skill to inna sytuacja: da się go zainstalować jednym kliknięciem, ale tylko wtedy, gdy oddasz go we właściwym formacie.**

Karta pliku w rozmowie pokazuje przycisk **Save skill** wyłącznie dla pliku `.skill` albo pliku nazwanego dokładnie `SKILL.md`. Plik nazwany `SKILL_nazwa-skilla.md` albo `nazwa-skilla.md` jest wyłącznie do pobrania — użytkownik musi go potem instalować ręcznie. To najczęstsza przyczyna sytuacji „dostałem pliki, ale nie mogę ich kliknąć".

Ponieważ kilka skilli naraz nie może się nazywać `SKILL.md` w jednym katalogu wyjściowym, domyślną formą wyjścia jest **pakiet `.skill` per skill**:

```bash
# katalog roboczy musi być zapisywalny — skrypt zapisuje pakiet do cwd
mkdir -p /tmp/pack/<nazwa-skilla> && cp <zredagowany-plik> /tmp/pack/<nazwa-skilla>/SKILL.md
cd /tmp/pack && export PYTHONPATH=<ścieżka-do-skill-creatora>
python -m scripts.package_skill /tmp/pack/<nazwa-skilla>
cp /tmp/pack/*.skill /mnt/user-data/outputs/
```

Zasady:

- **Nazwa katalogu = nazwa skilla z frontmatteru.** Pakiet dziedziczy ją do nazwy pliku, a instalacja po niej rozpoznaje aktualizację istniejącego skilla zamiast tworzyć duplikat. Nie dopisuj sufiksów w rodzaju `-v2`.
- **Zabierz zasoby.** Jeśli skill ma `scripts/`, `references/` albo `assets/`, skopiuj cały katalog, nie sam `SKILL.md` — pakiet bez zasobów instaluje się jako skill kaleki.
- **Nie oddawaj obu form naraz.** Karta `.skill` pozwala i zainstalować, i pobrać, więc dokładanie bliźniaczego `.md` tylko mnoży pliki i rodzi pytanie, który jest właściwy.
- **Walidacja jest częścią pakowania i bywa ostrzejsza niż środowisko uruchomieniowe.** Typowa wywrotka to niepoprawny YAML we frontmatterze: `description` z dwukropkiem w treści, zapisany bez cudzysłowów i bez bloku. Skill z takim opisem działa w runtime, ale pakowanie odrzuca go komunikatem „mapping values are not allowed here". Napraw blokiem zwijanym (`description: >-` i treść wcięta w kolejnych liniach), a naprawę odnotuj w raporcie — to realna wada pliku, nie przeszkoda proceduralna.
- **Katalog roboczy musi być zapisywalny.** Skrypt pakujący zapisuje wynik do bieżącego katalogu; uruchomiony z katalogu skilla na zamontowanym read-only zwróci `Read-only file system`. Stąd `cd` do `/tmp` i `PYTHONPATH` zamiast pracy w miejscu.

Gdy narzędzie pakujące jest niedostępne, oddaj pojedynczy skill jako `SKILL.md` (bez sufiksów) i uprzedź użytkownika, że kolejne trzeba wysłać osobno.

## Higiena wersji (dotyczy każdego czatu, nie tylko zamykania)

1. **Wznowiony stary czat = kontekst nieufny.** Skille i pliki wczytane do rozmowy to zamrożone migawki; dysk jest świeży przy każdej wiadomości, kontekst nie. Przed operacją w czacie starszym niż ~1 dzień: `view` skilla ponownie z dysku.
2. **Załącznik w czacie przedawnia się** — dotyczy też plików Zamknięcie: scalaj je szybko po wygenerowaniu; im starszy, tym więcej konfliktów.
3. **Po scaleniu delt najlepiej zamknąć pozostałe stare czaty robocze** — kontynuowanie ich to praca na regułach sprzed scalenia.
4. **Wersjonuj kanon datami** (Historia zmian / stopka) — rozjazd między dyskiem a pamięcią rozmowy ma być wykrywalny; przy rozbieżności wygrywa dysk, a rozjazd zgłoś.
5. **Paczka przysłana jako „źródło" nie jest źródłem, dopóki jej nie zdiffujesz w obie strony.** Gdy użytkownik przysyła spakowany skill z poleceniem „nanieś zmiany na tym pliku", zestaw inwentarz plików i treść z wersją zamontowaną, osobno w każdą stronę. Rozjazd bywa dwukierunkowy: paczka może mieć nowszy jeden plik i jednocześnie nie mieć całego katalogu zasobów dołożonego w innej gałęzi. Podmiana katalogu kasuje wtedy pracę, o której nikt w rozmowie nie pamięta. Właściwa operacja to scalenie per plik, z jawnym raportem, która gałąź wygrała w którym pliku i dlaczego.

## Zasady (TL;DR)

1. **Zamykany czat nie edytuje kanonu.** Zbiera delty do jednego pliku MD — zawsze, nawet protokół zerowy.
2. **Świeży czat scala.** Aplikacja delt wyłącznie na plikach wczytanych z dysku w nowej sesji.
3. **Jedna decyzja przy zamykaniu:** kontynuacja TAK/NIE. Reszta bez pytań.
4. **Delty samowystarczalne, dosłowne, kompletne.** Gotowy tekst + cel + dowód + pewność; nadmiar delt jest tani, brak delty jest bezpowrotny.
5. **Konflikt = pytanie, nie nadpisanie.** Kanon mógł się zmienić po wygenerowaniu delty.
6. **Kanon = pliki .md; memory = cache; użytkownik instaluje sam** (wiele kont i organizacji) — dokumenty jako `.md`, **skille jako pakiety `.skill`**, żeby dały się zainstalować kliknięciem.
7. **Granica ze skill-improverem:** improver = retro „co warto zapisać"; zamknięcie-czatu = audyt „czy wszystko zapisane" + gwarancja, że zapis pójdzie na aktualnej bazie.

## Historia zmian

| Data | Zmiana |
|---|---|
| 2026-08-02 | **Skille generyczne bez śladów projektowych (DEC-22, Niepospolita).** Tryb APLIKACJA krok 5: wiersz historii skilla generycznego to sama data + treść zmiany, bez tytułu pliku zamknięcia i nazw projektu; delta anonimizowana wg reguły zerowej skilla docelowego. Tryb ZAMKNIĘCIE: delta celująca w skill generyczny pisana neutralnie już przy zamykaniu. Powód: dotychczasowa procedura cytowania tytułów plików zamknięcia zabrudziła `notion-mcp-best-practices` siedemnastoma stopkami z nazwami projektu, mimo że skill jest instalowany na kontach bez tego projektu. |
| 2026-06 | Utworzenie skilla (wersja jednotrybowa: plik kontynuacyjny). |
| 2026-07-26 | **Przebudowa v3 — model DELTA + APLIKACJA (DEC-02, Niepospolita).** Zamykany czat nigdy nie edytuje kanonu (empiria: Claude w długich czatach działa na przeterminowanych wersjach skilli z historii rozmowy, nawet po prośbie o odświeżenie). Zamknięcie ZAWSZE generuje plik MD z kompletem delt (dokładne brzmienie + cel + dowód + pewność); wdrożenie robi świeży czat w trybie APLIKACJA (świeży odczyt z dysku, wykrywanie duplikatów i konfliktów, karty decyzji dla delt DO DECYZJI, obsługa wielu plików naraz). Jedyna decyzja użytkownika przy zamykaniu: kontynuacja TAK/NIE. Kanon = pliki .md przenośne między kontami; memory = cache. Case założycielski: wniosek o polu `Name` bazy Tagi czekał miesiąc w pliku kontynuacyjnym mimo 30-sekundowej poprawki. |
| 2026-08-05 | +Format wyjściowy skilli: pakiet `.skill` per skill zamiast luźnego `.md`. Przycisk instalacji na karcie pliku pojawia się tylko dla `.skill` albo pliku o nazwie dokładnie `SKILL.md`, więc dotychczasowa konwencja `SKILL_nazwa.md` dawała pliki wyłącznie do pobrania. Dołożone zasady: nazwa katalogu z frontmatteru, pakowanie razem z zasobami, jedna forma wyjścia zamiast dwóch, zapisywalny katalog roboczy oraz naprawa niepoprawnego YAML we frontmatterze, którą wymusza walidator pakujący. |
| 2026-08-25 | +Punkt 5 sekcji „Higiena wersji": paczka przysłana jako źródło wymaga diffu w obie strony przed scaleniem, bo rozjazd bywa dwukierunkowy (paczka z nowszym jednym plikiem i jednocześnie bez całego katalogu zasobów z innej gałęzi); operacją jest scalenie per plik z jawnym raportem, nie podmiana katalogu. |
| 2026-08-18 | Nazwa pliku zamknięcia bez pauzy i bez spacji: `zamkniecie_{temat-kebab}_{RRRR-MM-DD}.md`, ASCII. Powód: wzór z pauzą psuł się przy montowaniu katalogu i przy pobieraniu pliku. Nagłówek H1 w środku pliku zachowuje formę z pauzą, bo po nim rozpoznawany jest tryb APLIKACJA. |
