# Figma MCP Guard

## Cel

Zanim wykonasz jakąkolwiek operację na Figmie, zweryfikuj że połączenie z MCP Figma działa. Narzędzia Figma zawodzą po cichu albo zwracają błędy trudne do zinterpretowania — ten guard daje użytkownikowi jasny komunikat zamiast niejasnego błędu w połowie pracy.

## Kroki

### 1. Wykryj klienta i wybierz poprawny check

Wykonaj tylko jeden wariant:

- **Claude Code / Claude MCP tools**
  - **NAJPIERW** sprawdź, czy `mcp__claude_ai_Figma__whoami` jest w liście dostępnych toolów. Jeśli nie jest — przejrzyj listę deferred tools w ostatnich `<system-reminder>` blokach. Jeśli tam występuje (lub którykolwiek tool z prefiksem `mcp__claude_ai_Figma__`), załaduj jego schemat przez `ToolSearch` z zapytaniem `select:mcp__claude_ai_Figma__whoami` zanim uznasz MCP za niedostępne.
  - Dopiero po potwierdzeniu, że toolu nie ma ani w loaded, ani w deferred, uznaj MCP Figma za niedostępne.
  - Jeśli tool jest dostępny, wywołaj `mcp__claude_ai_Figma__whoami`.
  - **Uwaga dla subagentów**: Agent spawnowany przez `Task`/`Agent` tool NIE widzi listy deferred tools rodzica — ma własny zestaw. Nie deleguj checku MCP Figma do subagenta, który nie ma załadowanego `mcp__claude_ai_Figma__whoami` — dostaniesz fałszywy negatyw. Wykonaj check w głównej sesji.
- **Codex (CLI / IDE)**
  - Najpierw sprawdź, czy w bieżącej sesji są natywne callable tools Figmy albo deferred tools Figmy dostępne przez `tool_search`.
  - Jeśli natywne narzędzie Figma jest dostępne, użyj najlżejszego checku z tej sesji (preferuj `whoami`) i nie wymagaj obecności `codex` CLI w `PATH`.
  - Jeśli natywne narzędzie Figma nie jest dostępne, dopiero wtedy sprawdź czy `codex` CLI jest dostępny (`codex --version`).
  - Jeśli komenda `codex` nie istnieje (np. `command not found`) i nie ma natywnych narzędzi Figmy, przerwij i zgłoś użytkownikowi:
    - że Codex CLI nie jest zainstalowany lub nie jest dostępny w `PATH`
    - że w tej sesji nie ma też natywnych narzędzi Figmy, więc nie da się wykonać checku MCP Figma w tym workflow
  - Wykonaj check w tej kolejności:

    ```bash
    echo $CODEX_HOME
    codex mcp list
    ```

  - Agent może samodzielnie wykonywać wyłącznie komendy diagnostyczne, które nie zmieniają lokalnej konfiguracji, np. `codex --version`, `echo $CODEX_HOME` i `codex mcp list`.
  - Nie wykonuj samodzielnie komend mutujących konfigurację MCP ani uruchamiających OAuth, takich jak `codex mcp add figma --url https://mcp.figma.com/mcp` albo `codex mcp login figma`, chyba że użytkownik wcześniej jawnie poprosił o konfigurację MCP lub potwierdził zgodę na tę zmianę.
  - Nie traktuj `list_mcp_resources` albo braku globalnie wystawionych callable tooli Figmy w głównej sesji jako dowodu, że Figma MCP nie działa. W Codexie to może oznaczać tylko tyle, że narzędzia nie są wystawione bezpośrednio w tej rozmowie.
  - Najpierw sprawdź konfigurację MCP: `codex mcp list`.
  - Serwer `figma` musi być widoczny i `enabled`.
  - Jeśli `figma` nie jest widoczna, sprawdź czy sesja nie działa na innym `CODEX_HOME` niż globalne `~/.codex`:
    - sprawdź `echo $CODEX_HOME` i plik `$CODEX_HOME/config.toml`
    - jeśli w tej sesji brak wpisu `[mcp_servers.figma]`, zatrzymaj flow i poinformuj użytkownika, że aktywne `CODEX_HOME` wymaga konfiguracji MCP Figma; podaj komendy, które wymagają jego zgody:
      - `codex mcp add figma --url https://mcp.figma.com/mcp`
      - `codex mcp login figma`
      - `codex mcp list`
    - jeśli `figma` jest skonfigurowana tylko globalnie (`~/.codex`), ale nie w aktywnym `CODEX_HOME`, zatrzymaj flow i poproś o zgodę na ponowną konfigurację w aktywnej sesji; nie kontynuuj checku dopóki użytkownik nie potwierdzi zgody i `Status` nie będzie `enabled`
  - Jeśli po konfiguracji zaakceptowanej przez użytkownika nadal brak `enabled`, zatrzymaj się i zgłoś blokadę użytkownikowi.
  - Następnie wykonaj najlżejsze dostępne narzędzie Figma z tej sesji (preferuj `whoami`, jeśli jest udostępnione przez klienta).
  - Jeśli `figma` jest `enabled`, ale główna sesja nie ma natywnych callable tooli Figmy, użyj **read-only bridge** przez `codex exec` i każ mu:
    - wykonać `whoami`,
    - odczytać dokładnie wskazany `fileKey` i `nodeId`,
    - zwrócić wynik w ustrukturyzowanym JSON,
    - nie modyfikować plików.
  - Prompt dla bridge ma być krótki i zamknięty do samego odczytu Figmy. Nie każ bridge'owi czytać lokalnych `SKILL.md`, robić kolejnego version guada ani ponownie wykonywać telemetryki, jeśli główna sesja już to zrobiła.
  - Preferuj pojedyncze wywołanie `codex exec` per node albo per zwarty batch node'ów. Nie uruchamiaj kolejnych bridge'y tylko po to, żeby przepisać albo sformatować wynik, jeśli poprzedni bridge zwrócił już komplet danych.
  - W bridge wyraźnie wymagaj formatu `return only JSON` i listy dozwolonych kluczy wyniku. Ogranicza to odpowiedzi opisowe, które spowalniają odczyt i utrudniają dalsze parsowanie.
  - Uruchom standardowy bridge tylko raz. Jeśli tool calle zakończyły się, ale proces nie zwrócił finalnego JSON albo zwrócił wyłącznie statusy narzędzi, nie powtarzaj tej samej próby opisowej.
  - W takiej sytuacji wykonaj dokładnie jeden deterministyczny fallback przez `codex exec --json` i odczytaj JSONL:
    - preferuj końcowy `item.completed` typu `agent_message`, jeśli zawiera komplet dozwolonych kluczy,
    - w przeciwnym razie wyciągnij `result` z `item.completed` typu `mcp_tool_call` dla oczekiwanych narzędzi,
    - zachowaj wyłącznie bloki tekstowe potrzebne do zadania oraz pola `status`/`error`,
    - pomiń bloki `image`, base64, binaria i tymczasowe asset payloady, chyba że screenshot jest jawnie wymaganym wynikiem,
    - sprawdź kompletność per `fileKey`/`nodeId`; brak wyniku dla jednego targetu raportuj jako partial/blocked zamiast uruchamiać kolejne bridge'e.
  - Jeśli fallback JSONL nadal nie daje kompletnego wyniku, zatrzymaj bridge flow i zgłoś konkretny brak. Nie wykonuj trzeciej próby tym samym mechanizmem.
  - Dla bridge przez `codex exec` preferuj sekwencję:

    ```bash
    whoami -> get_metadata -> get_design_context
    ```

    `use_figma` traktuj jako opcjonalny fallback, nie jako jedyną drogę odczytu.
  - Jeśli bridge `codex exec` może odczytać node i zwraca poprawne dane, uznaj MCP guard za zaliczony.

### 2. Oceń wynik

**Połączenie działa**:
- Claude: `mcp__claude_ai_Figma__whoami` zwraca dane użytkownika.
- Codex: `figma` jest `enabled` i wywołanie lekkiego narzędzia Figma albo read-only bridge przez `codex exec` kończy się sukcesem.

Komunikat:
```
✅ Figma MCP połączone. Kontynuuję.
```
Przejdź do właściwej pracy z Figmą.

**Połączenie nie działa**:
- błąd, timeout, pusta odpowiedź z narzędzia Figma, albo
- w Codex brak serwera `figma` / status inny niż `enabled` / brak autoryzacji OAuth.

Komunikat:
```
🔴 Figma MCP niedostępne — nie mogę kontynuować pracy z Figmą.

Co możesz zrobić:
- Sprawdź czy serwer Figma MCP jest dodany i aktywny (`codex mcp list`).
- Sprawdź czy konfigurujesz właściwe środowisko Codexa (`$CODEX_HOME`), a nie tylko `~/.codex`.
- Wykonaj ponowne logowanie OAuth (`codex mcp login figma`) i uruchom nową sesję.
- Jeśli problem się powtarza, podaj zawartość makiety tekstowo lub jako screenshot.
```
Zatrzymaj się. Nie wywołuj żadnych innych narzędzi Figma. Czekaj na odpowiedź użytkownika.

## Zasady

- Nie pomijaj tego guarda nawet gdy URL Figmy jest oczywisty i wydaje się że wszystko zadziała.
- Nie zakładaj, że nazwa narzędzia jest taka sama we wszystkich klientach MCP (Claude i Codex mogą mieć inne nazwy tooli).
- Jeśli `codex mcp list` pokazuje `figma enabled`, ale nie masz globalnie wystawionych tooli Figmy w tej rozmowie, najpierw spróbuj bridge przez `codex exec`, zamiast od razu uznawać MCP za niedostępne.
- Jeśli bridge przez `codex exec` został już skutecznie użyty w tej sesji i środowisko MCP się nie zmieniło, nie powtarzaj całego flow inicjalizacyjnego dla każdego kolejnego node'a; przejdź od razu do odczytu kolejnych wskazanych node'ów.
- Dla fallbacku `--json` nie przekazuj dalej całego JSONL ani obrazów base64; zredukuj wynik do oczekiwanych pól tekstowych i błędów.
- Jeśli check dla klienta kończy się błędem, nie próbuj „na siłę" kontynuować pracy z Figmą.
- Komunikat błędu wypisuj w języku polskim (język projektu).
