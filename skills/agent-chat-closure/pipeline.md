# Zamknięcie czatu — transport PLEO-733

Domyślnym odbiorcą pliku jest pipeline PleoAI. Zamykany czat zbiera delty; nie modyfikuje kanonu, nie akceptuje propozycji i nie publikuje materiałów. Przyjęcie pliku oznacza jedynie zapis źródła. Analiza, decyzje recenzentów i publikacja mają osobne statusy.

## Przygotowanie

Zachowaj cały dotychczasowy bilans, format delt D1…Dn, źródła, nierozstrzygnięte pytania, checklistę pobrania i opcjonalną sekcję pracy w toku opisaną w `legacy.md`. Nie usuwaj informacji merytorycznych. Dopuszczalne jest jawne „zero delt”. Plik ma być Markdown UTF-8. Pipeline przyjmuje maksymalnie 1 MiB (1 048 576 bajtów UTF-8) i 100 delt, przy czym oba warunki muszą być spełnione. Są to limity transportu, a nie zakresu zbieranych informacji; nie obcinaj przekroczeń.

Przed pierwszą wysyłką utwórz UUID `clientClosureId` w osobnym pliku metryki. Nie zmieniaj UUID, bajtów pliku ani metryki przy retry. Nie wymyślaj daty, godziny, autora ani projektu. Autor wynika z uwierzytelnienia. Spróbuj ustalić projekt z metadanych repozytorium lub mapy projektów; przy niejednoznaczności zapytaj użytkownika o nazwę, nie o numeryczne ID. `projectId` oznacza ID projektu repozytoryjnego (`platform` nie jest `null`), nie ID przestrzeni (`platform: null`) ani `spaceId` projektu. Projekt wyszukaj przez `library_projects` w MCP, wybierając wpis z ustawioną `platform`, albo skryptem `python skills/agent-chat-closure/scripts/chat-closure-ingest.py --list-projects "fraza"`. Skrypt pobiera aktywne projekty przez `GET /api/chat-closure-options?kind=PROJECT` z tym samym `TELEMETRY_USER_ID` co upload i wypisuje JSON z `content` (`id`, `displayName`), `page` i `totalPages`; kolejne strony pobierz przez `--project-page N`. Jeśli projektu nadal nie da się ustalić, wyślij `projectId: null` zamiast zgadywać lub blokować transport. Pokaż `missingFields` i status z receipt; uniwersalne delty mogą być analizowane, a projektowe czekają na przypisanie. To rozdziela pytanie o metrykę od decyzji o kontynuacji w `legacy.md`.

Jeżeli receipt już zwrócił `missingFields: ["projectId"]`, nie poprawiaj lokalnej metryki i nie ponawiaj tego samego `clientClosureId` z inną metryką. Po wyborze projektu przypisz istniejące zamknięcie przez PleoAI (`reassign`) w uwierzytelnionej sesji. Zachowaj oryginalne pliki do audytu.

Przykład metryki (UUID należy wygenerować dla konkretnego zamknięcia):

```json
{
  "formatVersion": "1.0.0",
  "clientClosureId": "00000000-0000-4000-8000-000000000001",
  "projectId": null,
  "closedAt": null,
  "closedDate": null,
  "datePrecision": "UNKNOWN",
  "sourceEnv": "JETBRAINS",
  "sourceEnvLabel": null
}
```

Jeżeli znana jest wyłącznie data, użyj `closedDate: YYYY-MM-DD`, `datePrecision: DAY`, `closedAt: null`. Dokładny czas używa `closedAt` z offsetem, `datePrecision: INSTANT`, `closedDate: null`. Środowiska: `CLAUDE_AI`, `CLAUDE_CODE`, `JETBRAINS`, `OTHER`; przy `OTHER` dodaj opis. Nie zgaduj wartości.

## Przekroczenie limitów

Przed wysyłką sprawdź liczbę delt i rozmiar gotowego pliku w bajtach UTF-8, nie liczbę znaków. Dokładnie 100 delt i dokładnie 1 048 576 bajtów mieszczą się w limitach. Zalecana komenda transportu wykonuje obie kontrole automatycznie przed jakimkolwiek HTTP. Samą kontrolę bez sieci i poświadczeń uruchom przez `python skills/agent-chat-closure/scripts/chat-closure-ingest.py closure.md --check-only`. Dla odczytanego pliku `.md` w poprawnym UTF-8 stdout zawiera dokładnie jeden obiekt JSON z `deltaCount` (liczba delt), `bytes` (rozmiar UTF-8) i `withinLimits` (boolean). Spełnienie obu limitów zwraca `withinLimits: true` i kod 0; przekroczenie jednego lub obu zwraca ten sam format JSON z rzeczywistymi wartościami, `withinLimits: false` i kod 2. Żaden z tych wyników nie wysyła HTTP ani nie zmienia pliku lub metryki. Przykład przekroczenia: `{"deltaCount":101,"bytes":80000,"withinLimits":false}`. Błędy odczytu, rozszerzenia lub kodowania nie są wynikiem kontroli limitów: mogą zakończyć się bez JSON-a, z błędem na stderr i niezerowym kodem. Brak poprawnego JSON-a zawsze oznacza wstrzymanie transportu, nigdy zgodność z limitami. Kontrola limitów nie zastępuje walidacji treści przez backend.

Deterministyczny licznik `count_deltas` odwzorowuje `ChatClosureParser`: normalizuje CRLF/CR tylko w kopii używanej do liczenia; zlicza nagłówki delt wyłącznie w sekcjach `## Delty` lub `## Delty do kanonu` (bez rozróżniania wielkości liter), kończonych kolejnym nagłówkiem H1/H2. Pomija zawartość bloków kodu ograniczonych backtickami lub tyldami zgodnie z regułami parsera. Liczy każde wystąpienie nagłówka `### D…` oraz pozostałe nagłówki zaczynające się od `### ` w tych sekcjach, także z błędnym lub powtórzonym ID; nie liczy unikalnych ID ani największego numeru D. Sumuje wszystkie sekcje delt. Dokładny algorytm jest w skrypcie; nie zastępuj go prostym wyszukaniem `D1` w całym pliku. W środowisku bez Pythona zastosuj te same reguły; jeżeli nie możesz wiarygodnie sprawdzić liczby lub rozmiaru, zachowaj plik do kontroli i wstrzymaj automatyczny transport.

Jeżeli przekroczono choć jeden limit, również gdy przekroczono oba naraz:

1. Zachowaj jeden kompletny oryginał Markdown ze wszystkimi deltami, źródłami i pytaniami oraz osobny plik metryki. Udostępnij oba użytkownikowi do pobrania. Nie usuwaj oryginału jako rzekomo przetworzonego.
2. Wstrzymaj wysyłkę. Nie skracaj, nie streszczaj, nie scalaj delt ani nie dziel pliku automatycznie, aby zmieścić go w limitach. Nie usuwaj nagłówków delt w celu obejścia licznika i nie twórz nowych UUID w celu obejścia odrzucenia.
3. Podaj rzeczywistą liczbę delt i rozmiar, jeśli są znane, przekroczone limity oraz komunikat: „Zamknięcie zachowane w całości; nieprzyjęte do pipeline’u z powodu limitów”. Bez receipt nie podawaj `closureId` ani statusu przyjęcia, analizy czy publikacji.
4. Wskaż dalszy krok: zgłoszenie do opiekuna PleoAI potrzeby obsługi większego zamknięcia i zachowanie plików do czasu udostępnienia takiej możliwości. Nie wysyłaj zgłoszenia samodzielnie bez upoważnienia. Alternatywą jest świadomy wybór przez użytkownika ręcznej APLIKACJI pełnego oryginału według `legacy.md`; samo przekroczenie limitu nie upoważnia do jej uruchomienia.
5. Ręczny upload, MCP i skrypt korzystają z tych samych limitów backendu. Zmiana transportu ani ponawianie niezmienionego pliku nie rozwiązuje przekroczenia. Ponów tę samą parę plików i ten sam `clientClosureId` dopiero po potwierdzeniu, że backend obsłuży taki materiał. Nie uruchamiaj równolegle ręcznej aplikacji i pipeline’u dla tych samych delt.

Przykłady: 101 delt przy 80 KiB, 20 delt przy 1 048 577 bajtach oraz 101 delt przy 1 048 577 bajtach prowadzą do zachowania pełnego oryginału i wstrzymania wysyłki. Żaden z tych przypadków nie uzasadnia utraty informacji.

## Transport

1. W claude.ai lub desktop preferuj dostępne narzędzie MCP `chat_closures_ingest(content, metadata)`. Przekaż pełną treść bez zmiany końców linii i tę samą metrykę. Jeśli środowisko nie zapewnia odczytu oryginalnych bajtów, przekaż użytkownikowi plik do uploadu; nie deklaruj zachowania bajtów bez dowodu.
2. W repozytorium użyj `python skills/agent-chat-closure/scripts/chat-closure-ingest.py closure.md --metadata closure.json` (ścieżka `scripts/chat-closure-ingest.py` jest względna do katalogu z tym `SKILL.md`, jeśli skill zainstalowano w innym miejscu). Skrypt używa stałego adresu HTTPS PleoAI oraz indywidualnego `TELEMETRY_USER_ID` z bieżącego środowiska, przekazywanego w nagłówku `X-Telemetry-User-Id`. Nie wpisuj klucza do argumentów komendy, treści zamknięcia, metryki ani logów. Backend z obsługą tego nagłówka przypisuje źródło do aktywnego użytkownika z odpowiadającym `library_user_id`; nieaktywne, wyłączone i nieznane klucze są odrzucane. Identyfikator nie nadaje dostępu do odczytu źródeł ani do decyzji — te operacje wymagają sesji PleoAI. Przed wdrożeniem tej wersji backendu skrypt otrzyma HTTP 401; nie zmieniaj wtedy `clientClosureId` ani pliku przy ponowieniu.
3. Gdy connector, logowanie lub funkcja są niedostępne, zachowaj oba pliki i wskaż ręczny upload w PleoAI. Nie zgłaszaj przyjęcia bez receipt. Nie przechodź samoczynnie do ręcznej edycji kanonu.

Po sukcesie podaj `closureId`, status i jawne braki metryki. `duplicate: true` oznacza to samo przyjęcie, a nie nową analizę. Przy timeout wynik jest nieznany: ponów identyczną parę plików; dedup zwróci wcześniejszy receipt. HTTP 409 nie uprawnia do zmiany UUID ani nadpisania źródła. HTTP 401 wymaga ponownego logowania. HTTP 413, w tym `FILE_TOO_LARGE` i `TOO_MANY_DELTAS`, kieruje do procedury „Przekroczenie limitów”; nie oznacza polecenia skrócenia pliku. HTTP 415 wymaga sprawdzenia formatu Markdown i kodowania UTF-8 oraz zachowania oryginału przed poprawą. Po zmianie zawartości powstaje nowe świadome zamknięcie z nowym ID.

Nie uruchamiaj masowego importu starych zamknięć bez jawnej prośby. Historyczny tryb APLIKACJA z `legacy.md` pozostaje dostępny wyłącznie po wyraźnym wyborze ręcznego procesu przez użytkownika. Nie wykonuj go równolegle z propozycjami pipeline’u dla tych samych delt.
