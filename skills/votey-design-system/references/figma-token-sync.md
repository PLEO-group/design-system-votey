# Synchronizacja tokenów z Figma Variables

## Kiedy uruchamiać

Stosuj tę procedurę przy poleceniach „zsynchronizuj”, „porównaj” lub „zaudytuj tokeny z Figma Variables”, przy pełnym eksporcie Variables oraz przy zmianie wielu tokenów. Dla jednej, pewnej zmiany roli stosuj zwykły flow z [tokens.md](tokens.md).

## Punkt wejścia: manifest, nie drugi link

1. Odczytaj [snapshot manifestu](design-system-manifest.json).
2. Użyj `tokens.sourceOfTruth.url`, jeśli jest poprawnym URL-em Figmy; w przeciwnym razie użyj `designSource.projectUrl`.
3. Nie proś użytkownika o link do Figmy, gdy manifest wskazuje poprawny URL. W odpowiedzi możesz podać znaleziony URL jako źródło eksportu.
4. Gdy potrzebny jest bezpośredni odczyt Figmy, użyj obowiązującego pipeline’u Figmy i jego Guardów. Brak dostępu do konektora nie blokuje synchronizacji, jeżeli przesłane eksporty przejdą walidację.

## Prośba o dwa eksporty JSON

Poproś o dołączenie **dwóch plików JSON**, a nie o kolejny link:

1. **Pełny eksport Variables** — kolekcje, mody, ścieżki tokenów, typy, wartości, scope’y oraz aliasy. Alias powinien pozostać rozpoznawalny jako odwołanie (np. `{semantic.text.primary}`), a nie tylko jako skopiowana wartość końcowa.
2. **Eksport tożsamości i aliasów** — mapowanie ścieżek semantycznych i aliasów na identyfikatory Figmy (`VariableID:<collection>:<variable>`); jeżeli narzędzie je udostępnia, także własne `VariableID` i `CollectionID`.

W gotowej prośbie użyj URL-a z manifestu oraz zaproponuj te dwa pluginy społeczności Figmy:

- [Variables to JSON](https://www.figma.com/community/plugin/1468186413196022101/variables-to-json)
- [Figma Variables to JSON](https://www.figma.com/community/plugin/1345399750040406570/figma-variables-to-json)

To są propozycje, nie wymagane narzędzia ani gwarancja jednego schematu JSON. Nie instaluj ani nie uruchamiaj pluginu za użytkownika. Użytkownik może użyć innego eksportera, o ile dwa artefakty zachowują wymagane informacje.

Użyj tej treści, dostosowując jedynie nazwę systemu i URL:

> Korzystam z Figma Variables wskazanych w manifeście: `<URL z tokens.sourceOfTruth.url albo designSource.projectUrl>`. Dołącz proszę dwa pliki JSON: (1) pełny eksport Variables z kolekcjami, modami, typami, wartościami, scope’ami i aliasami oraz (2) eksport mapowania ścieżek/aliasów na `VariableID`. Możesz użyć [Variables to JSON](https://www.figma.com/community/plugin/1468186413196022101/variables-to-json) i [Figma Variables to JSON](https://www.figma.com/community/plugin/1345399750040406570/figma-variables-to-json) lub równoważnych narzędzi. Jeśli eksporty przejdą walidację, potraktuję je jako zgodę na aktualizację źródeł tokenów i wykonam synchronizację bez osobnego raportu ani planu.

## Walidacja przed zmianą

Trzymaj znormalizowany diff, decyzje i ostrzeżenia w pamięci **bieżącego zadania**. Nie twórz domyślnie pliku raportu ani planu.

Eksport jest gotowy do wdrożenia, gdy można jednoznacznie potwierdzić:

- niepuste kolekcje i mody;
- ścieżkę, typ i wartość każdego tokenu w zakresie synchronizacji;
- aliasy oraz ich rekursywne rozwiązanie w ramach eksportu lub mapy tożsamości;
- zgodność nazewnictwa i ścieżek z lokalnym kontraktem tokenów;
- dla eksportu tożsamości: poprawną postać wpisów `VariableID` i kompletne cele aliasów.

Brak własnego `VariableID` lub `CollectionID`, którego dany eksporter nie udostępnia, nie blokuje synchronizacji wartości. Zgłoś zwięźle ograniczenie śledzalności, ale nie żądaj nowego raportu tylko z tego powodu.

Zatrzymaj wdrożenie i poproś o decyzję tylko wtedy, gdy eksport jest pusty, uszkodzony, sprzeczny, nie rozwiązuje aliasów albo jego mapowanie wymaga materialnej decyzji publicznego API (np. rename, usunięcie lub deprecacja tokenu). Brak lokalnego tokenu w eksporcie nie jest dowodem na usunięcie — zachowaj go domyślnie.

Utwórz raport lub plan wyłącznie na wyraźną prośbę użytkownika, gdy wymaga tego aktywny workflow `pleo-design-system`, albo gdy walidacja nie pozwala bezpiecznie przejść do wdrożenia. Pamięć audytu obowiązuje tylko w bieżącej rozmowie; nie zakładaj jej trwałości w kolejnym zadaniu.

## Zgoda i granice synchronizacji

Przesłanie przez użytkownika dwóch eksportów, które przejdą powyższą walidację, jest zgodą na aktualizację **źródłowych tokenów** w bieżącym zakresie synchronizacji. Nie proś ponownie o potwierdzenie wdrożenia.

Ta zgoda nie obejmuje:

- usuwania lub zmiany nazw istniejących tokenów;
- publikacji paczki, podbicia wersji albo instalacji u konsumentów;
- zmian aplikacji Angular, React, Next lub PWA;
- zmiany nieobjętych eksportem wartości układu, responsywności, cieni, overlayów lub innych kategorii wymagających osobnej klasyfikacji;
- ręcznej edycji artefaktów `dist/**`.

## Wdrożenie bez nadmiarowego planowania

Po pozytywnej walidacji wykonaj od razu:

1. Porównaj znormalizowane kolekcje, mody, typy, scope’y, aliasy i wartości z plikami źródłowymi tokenów.
2. Dodaj brakujące, jednoznacznie odwzorowane tokeny w dozwolonych kolekcjach i zaktualizuj różniące się wartości.
3. Zachowaj istniejące tokeny poza zakresem eksportu. Zmianę publicznych nazw, deprecację i usuwanie skieruj do osobnej decyzji.
4. Jeżeli rozszerza się publiczna rola współdzielona, zaktualizuj wymagane listy opcji Angulara i Storybook; wyjścia React/Tailwind generuj wyłącznie z właściwego źródła.
5. Uruchom walidację tokenów, testy i build wskazane przez manifest lub skrypty repozytorium. Zbuduj Storybook, gdy synchronizacja wpływa na jego preview albo publiczne role.

Podsumuj rezultat krótko: co dodano lub zmieniono, jakie drobne ograniczenia pozostały oraz jakie komendy weryfikacyjne przeszły. Nie odtwarzaj pełnego raportu, jeżeli użytkownik go nie zażądał.
