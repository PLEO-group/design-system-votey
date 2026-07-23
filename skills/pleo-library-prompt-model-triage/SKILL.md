---
name: pleo-library-prompt-model-triage
description: Pierwszy router promptu po target-only version preflight. Szybko klasyfikuj bieżący prompt pod najlepszy poziom modelu, reasoning, koszt i dobór skilli wykonawczych. Nie raportuj tego skilla w telemetryce, bo jego nazwa zaczyna się od `pleo-library-`.
version: 2.7.3
author: d.kawula@pleodigital.com
scope: SHARED
category: Library
tags: []
---

# Prompt Model Triage — CORE

Ten plik zawiera reguły ładowane przy każdym użyciu tego skilla. Szczegółowa dokumentacja
Full Mode (cztery osie, Prompt Quality Check, pełny Cost Estimate, tabela pewności,
przykłady Full Mode) jest w `extended/full-mode.md` — ładuj go tylko gdy routing
wymaga Full Mode.

## Cel

Po obowiązkowym target-only version preflight dla `pleo-library-prompt-model-triage` wykonaj szybki, tani triage prompta. Oceń tylko tyle, ile trzeba do dobrania właściwego modelu, poziomu reasoning i skilli wykonawczych; nie rób jeszcze pełnej analizy rozwiązania.

## Antykanibalizacja skilli

Ten skill jest właścicielem pierwszej decyzji routingowej, ale nie jest pierwszym realnym skillem w orkiestracji.
Przed nim ma zadziałać tylko:

1. target-only version preflight dla `pleo-library-prompt-model-triage`, jeśli nie był jeszcze sprawdzony w rozmowie.

Wykonaj preflight z katalogu repo dokładnie tą komendą:

```bash
python skills/pleo-library-skill-version-guard/scripts/run.py check --skill pleo-library-prompt-model-triage
```

Jeśli guard zwróci `conversationCache.hit=true`, uznaj preflight za wykonany i nie powtarzaj go w tej rozmowie. Nie przechodź do triage, dopóki komenda nie zakończy się powodzeniem albo guard nie wskaże jawnego obejścia. Ten sam kontrakt do wpięcia w instrukcje repo jest w `references/instruction-snippets.md`.

Version preflight nie jest raportowany w telemetryce i nie oznacza pełnego użycia `pleo-library-skill-version-guard`.
`pleo-library-prompt-model-triage` też nie jest raportowany w telemetryce, bo wszystkie skille `pleo-library-*` są infrastrukturą biblioteki.

Po triage rozdziel wynik na:

- skille merytoryczne, które realnie pomagają wykonać zadanie,
- skille operacyjne Pleo Library, które są potrzebne dopiero po wyborze skilla merytorycznego albo przy publikacji/synchronizacji,
- skille pominięte, które tylko pasują słowem kluczowym, ale nie są potrzebne do zadania.

Jeśli prompt dotyczy brakujących shared skilli, pobierania shared skilli albo odświeżenia instrukcji po ich pobraniu, wskaż `pleo-library-shared-skill-sync` jako kolejny skill po triage.
Jeśli prompt dotyczy publikacji, pull, sync, bootstrapu, telemetryki, wersjonowania albo instrukcji `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`, nadal wykonaj krótki routing i wskaż właściwy operacyjny skill jako kolejny krok.

## Reguła Nadrzędna

Wybierz najtańszy wariant, który nadal ma wysoką szansę dowieźć poprawny wynik bez reworku. Nie eskaluj do mocniejszego modelu tylko dlatego, że temat "brzmi technicznie".
Jeśli prompt wygląda jak wyprawa przez Morię, nie idź najciemniejszym tunelem tylko dlatego, że jest efektowny.

---

## Uniwersalność — Warstwa Abstrakcyjna + Adaptery Runtime

Ten skill jest niezależny od konkretnego IDE czy interfejsu. Działa wszędzie tam, gdzie użytkownik ma możliwość wyboru modelu AI lub poziomu reasoning.

### Hierarchia Źródeł

1. **Aktualny runtime użytkownika** — picker modelu, konfiguracja CLI, parametry API.
2. **Jawna lista modeli lub screenshot** dostarczone przez użytkownika.
3. **Referencje provider-specific** z `references/`.
4. **Oficjalna dokumentacja vendora** — backup.

### Adaptery Runtime

| Runtime                  | Jak rozpoznać                      | Referencja                                   |
| ------------------------ | ---------------------------------- | -------------------------------------------- |
| JetBrains AI Chat        | IntelliJ, WebStorm, picker modelu  | `references/jetbrains-ai-chat.md`            |
| Claude                   | Claude Desktop/Code/API, Anthropic | `references/claude.md`                       |
| OpenAI / Codex / ChatGPT | GPT, OpenAI, Codex                 | `references/codex-openai.md`                 |
| Gemini / Google AI       | Gemini, Google AI Studio, Vertex   | `references/gemini.md`                       |
| VS Code Copilot          | Copilot, VS Code                   | Modele dostępne w Copilot Chat picker        |
| Inny / nieznany          | Brak kontekstu                     | Zapytaj; podaj rekomendację na poziomie tier |

### Twarde Reguły Runtime

- Nie rekomenduj modelu, którego użytkownik nie może wybrać.
- Nie rekomenduj poziomu reasoning, którego środowisko nie obsługuje.
- Zachowuj dokładny alias i casing z UI/CLI/API.
- Traktuj etykiety runtime takie jak `ultra`, `pro` albo `adaptive` jako osobne tryby środowiska, dopóki oficjalna dokumentacja nie potwierdzi, że są poziomami reasoning providera.
- Jeśli nie znasz dostępnych modeli, podaj rekomendację tier i pozwól użytkownikowi zmapować.
- Oddziel dostępność modelu od sposobu rozliczania: model widoczny w subskrypcji lub IDE nie oznacza, że użytkownik płaci stawkę API za token.

---

## Ładowanie Kontekstu

Załaduj referencję runtime (jeśli znany), a potem referencję providera:

- JetBrains AI Chat: `references/jetbrains-ai-chat.md`
- OpenAI / Codex: `references/codex-openai.md`
- Claude: `references/claude.md`
- Gemini: `references/gemini.md`

Nie ładuj wszystkich plików naraz.

---

## Freshness Policy

Domyślnie ufaj lokalnej mapie modeli z `references/`.

- `stale_after_days`: `14`

**Uruchom browse gdy:**

- użytkownik pyta o `latest`, `current`, `most recent` albo pisze `sprawdź najnowsze modele i zaktualizuj skilla`
- zadanie dotyczy wyboru modeli, pricingu, porównania vendorów
- runtime pokazuje nieznany alias
- referencja starsza niż 14 dni
- decyzja wysokiej stawki oparta o katalog modeli

**Nie uruchamiaj browse gdy:**

- zwykłe zadanie developerskie
- referencja świeża, runtime nie pokazuje nic nowego

**Fallback dla nieznanego modelu:**
Traktuj jako odpowiednik najbliższego poznanego modelu w tym samym tier. Zakomunikuj niższą pewność.

**Prompt aktualizacyjny** (gdy referencja > 10 dni):

```
💡 Jeśli masz do wyboru inne modele/reasoningi niż zaproponowane, wpisz `sprawdź najnowsze modele i zaktualizuj skilla` — zaktualizuję referencje.
```

### Bramka Jakości Aktualizacji Katalogu Modeli

Gdy browse prowadzi do zmiany katalogu modeli, reasoning albo cen, potraktuj aktualizację jako nieukończoną, dopóki wszystkie punkty nie przejdą:

1. Potwierdź w oficjalnych źródłach providera dokładne aliasy/ID, status `GA|preview|restricted|deprecated`, dostępne poziomy reasoning/effort/thinking oraz publiczne stawki i ich progi czasowe lub kontekstowe.
2. Dla istniejącego providera zaktualizuj plik wskazany w polu `provider.reference` odpowiadającego `agents/*.yaml`, jego `doc_date`, statusy modeli i sekcję `Źródła`. Nie otwieraj literalnej ścieżki z placeholderem i nie uzupełniaj brakujących danych przez analogię; oznacz je jako nieznane.
3. Zsynchronizuj odpowiadający `agents/*.yaml`: `catalog_verified_on`, `reference`, `default_model`, `reasoning_levels`, `tier_map`, `model_status` i `pricing_estimates`.
4. Zsynchronizuj modele, ceny, progi i daty promocji użyte w `extended/full-mode.md`.
5. Uruchom `node <skill-dir>/scripts/validate-model-catalog.mjs`. Publikacja lub handoff są zablokowane, jeśli validator zgłosi błąd.

Źródło runtime może potwierdzić dostępność w pickerze, ale nie zastępuje oficjalnego źródła providera dla aliasów API, reasoning i pricingu.

Dla nowego providera najpierw ustal jego jednoznaczny slug, utwórz pod tą nazwą konkretny plik referencyjny i YAML agenta, np. `references/mistral.md` oraz `agents/mistral.yaml`, wpisz rzeczywistą ścieżkę w `provider.reference`, dodaj oficjalne domeny providera do `officialDomains` w validatorze, a dopiero potem wykonaj bramkę. Jeśli nie da się jednoznacznie ustalić sluga albo oficjalnych źródeł, przerwij aktualizację zamiast tworzyć niepełny katalog.

---

## Normalizacja Poziomów

- `cheap`: krótka odpowiedź, rewrite, klasyfikacja, prosty edit
- `balanced`: większość codziennej pracy inżynierskiej
- `deep`: niejednoznaczny debugging, root cause, złożony refaktor
- `max`: tylko gdy koszt pomyłki lub złożoność uzasadnia najwyższy koszt

Mapowanie na modele i reasoningi → pliki provider-specific z `references/`.

Nie normalizuj w ciemno providerowych trybów wykonania do reasoning level:

- OpenAI `reasoning.mode: pro` to tryb wykonania niezależny od `reasoning.effort`.
- Claude `adaptive thinking` to tryb myślenia, a `effort` steruje intensywnością pracy.
- Gemini `thinkingLevel` i starszy `thinkingBudget` to różne kontrakty zależne od generacji modelu.
- Codex `ultra` może obejmować orkiestrację wielu agentów; nie przedstawiaj go jako publicznego poziomu API bez potwierdzenia runtime.

## Billing Surface

Przed podaniem kosztu określ `billing_surface`:

- `api-metered` — użytkownik płaci za tokeny według publicznego cennika API,
- `subscription` — ChatGPT, Codex, Claude, Gemini albo IDE w abonamencie,
- `credits` — runtime rozlicza własne kredyty/limity,
- `unknown` — brak danych o sposobie rozliczania.

Tylko dla `api-metered` podawaj estymację jako bezpośredni koszt użytkownika. Dla pozostałych powierzchni użyj poziomu `niski|średni|wysoki`; opcjonalne centy nazwij `API-equivalent`, nigdy kosztem sesji.

---

## Routing Cost-Benefit — Lightweight vs Full Mode

### Pre-check (bez tool use)

1. **Czy prompt jest jednoznacznie trywialny?** — jedno zdanie, jedno polecenie, zero zależności, oczywisty tier `cheap`.
2. **Czy jest tylko jeden sensowny wariant modelu?**

### Lightweight Mode (oba warunki spełnione)

```
Routing (lightweight): <model> | reasoning <level> | tier cheap | koszt <niski albo ~N¢ dla api-metered>
Powód: <jedno zdanie>
Następny krok: <skill docelowy albo "kontynuuj bez dodatkowego skilla">
```

### Full Mode (choćby jeden warunek niespełniony)

**Załaduj `extended/full-mode.md`** i wykonaj pełną analizę: cztery osie, Prompt Quality Check (jeśli niejednoznaczność ≥ medium), pełny Cost Estimate, tabela pewności.

---

## Kontynuacja Po Routingu

Triage ma być krótkim routerem. Sam routing zawsze może zostać pokazany, ale wykonanie zadania podlega osobnej bramce.

### Bramka Wykonania Dla Brakujących Decyzji

Przed oceną niejednoznaczności zainicjuj `execution_gate: continue`. Pozostaw tę wartość dla niejednoznaczności `low`; oznacza ona kompletny prompt bez brakujących decyzji i bez dodatkowych założeń. Jeśli Prompt Quality Check uruchomi się dla `medium` albo `high`, nadpisz bramkę jedną z wartości:

- `continue_with_assumptions` — brakuje wyłącznie preferencji z bezpiecznym, odwracalnym defaultem; wypisz przyjęte założenia.
- `read_only_discovery` — brak można rozstrzygnąć ograniczonym odczytem zasobów już wskazanych przez użytkownika; nie wykonuj zapisu ani akcji zewnętrznych przed rozstrzygnięciem.
- `blocked` — brak może zmienić target/scope, środowisko, oczekiwany rezultat lub typ operacji, uprawnienia, bezpieczeństwo, koszt albo nieodwracalny skutek.

Brak scope/modułu, środowiska, oczekiwanego outputu lub zgody na zapis/akcję zewnętrzną jest blokujący zawsze, gdy istnieje więcej niż jedna istotnie różna interpretacja. Wtedy pokaż routing, zadaj jedno zwięzłe pytanie obejmujące minimalny zestaw decyzji i zatrzymaj się przed skillem docelowym, tool callami wykonawczymi oraz edycjami.

Ta bramka ma pierwszeństwo przed progiem reasoning. Reasoning `medium` albo niżej nie pozwala kontynuować przy `execution_gate: blocked`.

- Po routingu wskaż model/reasoning, koszt i kolejny skill albo decyzję, że zadanie można kontynuować bez dodatkowego skilla.
- Po `read_only_discovery` przelicz bramkę; nie przechodź do wykonania, dopóki jej wartość nie zmieni się na `continue`, `continue_with_assumptions` albo `blocked`.
- Jeśli `execution_gate` to `continue` albo `continue_with_assumptions`, a rekomendowany reasoning to `medium` albo niżej (`minimal`, `low`, `medium`), kontynuuj pracę bez pytania użytkownika o potwierdzenie.
- Jeśli `execution_gate` to `continue` albo `continue_with_assumptions`, a rekomendowany reasoning jest wyższy niż `medium` (`high`, `xhigh`, `max` albo providerowy odpowiednik), zatrzymaj się po routingu i poproś użytkownika o potwierdzenie. Wystarczy dowolne jasne potwierdzenie, np. `ok`, `tak`, `go`, `start`, `zatwierdzam`.
- Dla reasoning powyżej `medium` nie wykonuj dalszych tool calli, odczytu repo ani edycji, dopóki użytkownik nie potwierdzi kontynuacji.
- Jeśli aktywny runtime wymaga ręcznej zmiany modelu/reasoningu, a rekomendacja różni się od aktualnego ustawienia, poproś o zmianę razem z tym samym potwierdzeniem.
- Jeśli użytkownik wpisze `bez routingu` albo `skip routing`, pomiń routing dla tej tury.

---

## Twarde Reguły Eskalacji

- Użytkownik prosi o maksymalną dokładność → tier ≥ `deep`.
- Wysokie ryzyko / wysoka stawka → nie schodź do `cheap` bez przyczyny.
- Potrzebne aktualne info z internetu → nota o browse.
- Ukryta złożoność w trakcie pracy → zakomunikuj eskalację.

---

## Disclaimer — Szacunki Cenowe

**Ceny podane w tym skillu i w plikach referencyjnych są szacunkowe na stan wiedzy z daty `doc_date` danego pliku i dotyczą publicznych stawek API.** Nie są cennikiem sesji w abonamencie, IDE ani runtime rozliczanym kredytami. Rzeczywiste stawki providerów mogą się różnić, szczególnie dla:

- nowych modeli, których pricing nie został jeszcze oficjalnie opublikowany
- reasoning tokens, które nie każdy provider wycenia osobno (oznaczone `est.`)
- modeli preview / beta, których ceny mogą się zmienić przed GA

Reasoning/thinking zwykle jest rozliczany stawką output. Jeśli provider raportuje reasoning jako część `output_tokens`, nie dodawaj ponownie pełnego `output_tokens` do osobno oszacowanego reasoning — części kosztorysu muszą być rozłączne.

**Margines błędu arytmetyki agenta:** Szacunki centowe wymagają mnożenia tokenów × stawki. Modele LLM mogą popełniać błędy w arytmetyce. Traktuj wyliczenia centowe jako przybliżenie z marginesem **±50%**, nie jako dokładną kalkulację. Przy dużych kwotach (> $1) weryfikuj ręcznie.

**Aktualizacja stawek:** Gdy użytkownik wpisze `sprawdź najnowsze modele i zaktualizuj skilla`, zaktualizuj nie tylko listę modeli, ale też stawki cenowe w plikach referencyjnych i YAML-ach agentów.

---

## Repo Wiring Contract

Ten skill ma być pierwszym routerem po obowiązkowym target-only version preflight i nie jest raportowany w telemetryce. Kontrakt w `references/instruction-snippets.md`.

---

## Antywzorce

- Nie defaultuj do najmocniejszego modelu.
- Nie wybieraj najtańszego przy wysokiej niejednoznaczności.
- Nie otwieraj repo/internetu tylko do klasyfikacji.
- Nie ukrywaj kosztu.
- Nie zgaduj nazw modeli.
- Nie utożsamiaj niskiego reasoningu z pozwoleniem na wykonanie przy brakujących decyzjach blokujących.
- Nie pozostawiaj `execution_gate` bez wartości; dla niskiej niejednoznaczności ustaw `continue`.
- Nie przechodź do skilla docelowego ani zapisu przy `execution_gate: blocked`.
- Nie kontynuuj bez potwierdzenia przy reasoning powyżej `medium`.
- Nie rekomenduj modelu niedostępnego w runtime.
- Nie pomijaj Cost Estimate w Full Mode.
- Nie uruchamiaj Full Mode dla trywialnych promptów.
- Nie traktuj szacunków centowych jako dokładnych kalkulacji.
- Nie publikuj aktualizacji katalogu modeli bez przejścia `scripts/validate-model-catalog.mjs`.

---

## Przykład — Lightweight Mode

**Runtime:** OpenAI API

**Prompt:** `"Przetłumacz ten opis błędu na angielski"`

```
Routing (lightweight): gpt-5.6-luna | reasoning low | tier cheap | koszt niski
Powód: Jednoetapowe tłumaczenie, zero zależności.
Następny krok: kontynuuj bez dodatkowego skilla.
```

Więcej przykładów (w tym Full Mode) → `extended/full-mode.md`.
