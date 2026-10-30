import React from "react";
import "./TableApiGuide.scss";

const inputGroups = [
  ["Dane i kolumny", [
    ["rows", "readonly T[]", "wymagane", "Rekordy do wyświetlenia. W trybie remote przekazuj bieżącą stronę; w local pełny zbiór."],
    ["columns", "readonly VoteyTableColumn<T>[]", "[]", "Jawne kolumny; przy autoColumns nadpisania po id oraz dodatkowe kolumny, np. actions."],
    ["fillContainer", "boolean", "false", "Wypełnia kontener o ustalonej wysokości. Przewija tylko wiersze; toolbar i paginacja pozostają widoczne. Rodzic flex wymaga min-height: 0."],
    ["autoColumns", "boolean", "false", "Generuje kolumny z kluczy pierwszego rekordu. Szczegóły i ograniczenia poniżej."],
    ["excludedColumns", "readonly string[]", "[]", "Pomija kolumny po id, również jawnie zdefiniowane."],
    ["headersPrefix", "string", "''", "Prefiks kluczy nagłówków generowanych automatycznie; zamienianych w całości na uppercase."],
    ["rowKey", "(row: T) => string | number", "wymagane", "Stabilny, unikalny klucz rekordu. Nie używaj indeksu ani referencji obiektu."],
    ["label", "string", "wymagane", "Klucz tłumaczenia dostępnej nazwy tabeli."],
    ["headerVariant", "'standard' | 'heavy'", "'standard'", "Standard: tło surface (białe w light) i tekst primary. Heavy: bg-inverse, tekst inverse i zaokrąglone końce."],
  ]],
  ["Zaznaczanie", [
    ["selectable", "boolean", "false", "Włącza checkboxy rekordów i checkbox wszystkich widocznych."],
    ["selectedKeys", "readonly VoteyTableKey[]", "[]", "Model z bindingiem dwukierunkowym. Przechowuje identyfikatory również z innych stron."],
    ["selectionActions", "TemplateRef<VoteyTableSelectionContext> | null", "null", "Treść paska akcji nad tabelą. $implicit to wszystkie wybrane klucze."],
  ]],
  ["Paginacja i zapytanie", [
    ["paginated", "boolean", "false", "Pokazuje istniejący komponent vt-pagination."],
    ["page", "number", "0", "Indeks strony od zera. Konsument aktualizuje go po queryChange."],
    ["size", "number", "20", "Liczba rekordów na stronie i liczba wierszy skeletonu w trybie paginowanym."],
    ["totalElements", "number", "0", "Łączna liczba wyników z serwera. W local tabela oblicza ją po wyszukiwaniu."],
    ["pageSizeOptions", "readonly number[]", "[10, 20, 50, 100]", "Dostępne rozmiary stron w paginatorze."],
    ["searchMode", "'none' | 'local' | 'remote'", "'none'", "Wybiera sposób wyszukiwania; szczegóły w sekcji Tryby danych."],
    ["search", "string", "''", "Zastosowana fraza, a nie szkic aktualnie wpisywany w pole."],
    ["filters", "Readonly<Record<string, unknown>>", "{}", "Zatwierdzone filtry. Nowe wartości najpierw przekazuj do requestFilters()."],
  ]],
  ["Stany i komunikaty", [
    ["loading", "boolean", "false", "Zastępuje dane skeletonem i blokuje wbudowane kontrolki. Bez paginacji: 5 wierszy."],
    ["error", "boolean", "false", "Pokazuje komunikat błędu i przycisk emitujący retry. Loading ma pierwszeństwo."],
    ["disabled", "boolean", "false", "Blokuje wbudowane kontrolki i aktywację wiersza. Własne akcje blokuj również w ich szablonach."],
    ["emptyText", "string", "'MESSAGE.TABLE_EMPTY'", "Klucz komunikatu dla pustego zbioru bez zastosowanego zapytania."],
    ["noResultsText", "string", "'MESSAGE.TABLE_NO_RESULTS'", "Klucz komunikatu dla pustego wyniku, gdy search jest niepuste lub filters ma klucze."],
    ["errorText", "string", "'MESSAGE.TABLE_ERROR'", "Klucz komunikatu błędu pobierania."],
  ]],
];

const columnsApi = [
  ["headerTooltip", "string", "brak", "Opcjonalna podpowiedź nagłówka, np. pełna treść pytania. Obsługuje klucz tłumaczenia lub tekst."],
  ["id", "string", "wymagane", "Unikalny identyfikator. Łączy kolumnę z vtTableCell."],
  ["header", "string", "wymagane", "Klucz tłumaczenia nagłówka. Typografia caption-extrabold."],
  ["field", "Extract<keyof T, string>", "field albo value", "Typowany klucz bezpośredniego pola rekordu. Bez ścieżek z kropkami. Obiekty i tablice wymagają funkcji value lub szablonu."],
  ["value", "(row: T) => VoteyTableValue", "value albo field", "Funkcja dla pól wyliczanych. Nie podawaj jej razem z field. Wartość zasila też wyszukiwanie FE."],
  ["width", "number", "180", "Szerokość w px. Tabela wypełnia minimum szerokość kontenera; nadmiar przewija się poziomo."],
  ["align", "'left' | 'center' | 'right'", "'left'", "Wyrównanie nagłówka i domyślnej zawartości komórki."],
  ["searchable", "boolean", "false", "Tylko kolumny z true uczestniczą w wyszukiwaniu local."],
  ["role", "'data' | 'actions'", "zwykła kolumna", "Jedną kolumnę actions umieść na końcu; pozostaje sticky po prawej."],
];

const events = [
  ["queryChange", "VoteyTableQuery", "Zatwierdzona zmiana strony, rozmiaru, wyszukiwania lub filtrów. Zaktualizuj stan kontrolowany; w remote pobierz dane."],
  ["selectedKeysChange", "readonly VoteyTableKey[]", "Zdarzenie modelu selectedKeys. Wygodna integracja: [(selectedKeys)]."],
  ["filtersCancelled", "VoteyTableFilters", "Odrzucony kandydat filtrów. Możesz przywrócić szkic formularza do zastosowanych wartości."],
  ["retry", "void", "Prośba o ponowienie pobrania. Tabela sama nie wykonuje HTTP."],
  ["rowClick", "T", "Kliknięcie nieinteraktywnej części rekordu. Linki, przyciski i checkboxy nie wywołują tego zdarzenia."],
];

const translations = [
  ["LABEL.TABLE_CLEAR_SEARCH", "Wyczyść wyszukiwanie"],
  ["LABEL.TABLE_SELECT_VISIBLE", "Zaznacz wszystkie widoczne rekordy"],
  ["LABEL.TABLE_SELECT_ROW", "Zaznacz rekord"],
  ["MESSAGE.TABLE_EMPTY", "Brak danych"],
  ["MESSAGE.TABLE_NO_RESULTS", "Brak wyników wyszukiwania lub filtrowania"],
  ["MESSAGE.TABLE_ERROR", "Nie udało się pobrać danych"],
  ["MESSAGE.TABLE_CONFIRM_TITLE", "Wyczyścić zaznaczenie?"],
  ["MESSAGE.TABLE_CONFIRM_RESET", "Zastosowanie wyszukiwania lub filtrów wyczyści zaznaczone rekordy na wszystkich stronach."],
  ["BUTTON.TABLE_KEEP_SELECTION", "Zachowaj zaznaczenie"],
  ["BUTTON.TABLE_APPLY_AND_CLEAR", "Zastosuj i wyczyść"],
  ["BUTTON.TABLE_RETRY", "Spróbuj ponownie"],
];

const setup = `import { ChangeDetectionStrategy, Component, signal,
  type WritableSignal } from '@angular/core';
import {
  VoteyTableComponent,
  type VoteyTableColumn,
} from '@pleodigital/design-system-votey/angular';

interface Member {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-members-example',
  imports: [VoteyTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <vt-table
      label="LABEL.MEMBERS"
      [rows]="rows()"
      [columns]="columns"
      [rowKey]="rowKey"
    />
  \`,
})
export class MembersExampleComponent {
  public readonly rows: WritableSignal<readonly Member[]> = signal([
    { id: 'member-1', name: 'Anna Kowalska', email: 'anna@example.com' },
  ]);

  public readonly rowKey: (row: Member) => string = (row: Member): string => row.id;

  public readonly columns: readonly VoteyTableColumn<Member>[] = [
    { id: 'name', header: 'LABEL.NAME', width: 240,
      searchable: true, value: (row: Member): string => row.name },
    { id: 'email', header: 'LABEL.EMAIL', width: 320,
      searchable: true, value: (row: Member): string => row.email },
  ];
}`;

const customCell = `<vt-table #table label="LABEL.MEMBERS"
  [rows]="rows()" [columns]="columns" [rowKey]="rowKey">
  <ng-template vtTableCell [vtTableCellOf]="table"
    let-row let-column="column" let-value="value">
    @switch (column.id) {
      @case ('actions') {
        <vt-button variant="ghost" ico="ui-edit"
          [ariaLabel]="editLabel" (pressed)="edit(row)" />
      }
      @default {
        <vt-text variant="body" [content]="'' + (value ?? '')" />
      }
    }
  </ng-template>
</vt-table>

// Dodaj VoteyTableCellDirective i VoteyButtonComponent do imports.
// Do columns dodaj ostatnią kolumnę:
{ id: 'actions', header: 'LABEL.ACTIONS', role: 'actions',
  width: 120, value: (): string => '' }`;

const remote = `<vt-table label="LABEL.MEMBERS"
  [rows]="rows()" [columns]="columns" [rowKey]="rowKey"
  [paginated]="true" searchMode="remote"
  [page]="query().page" [size]="query().size"
  [search]="query().search" [filters]="query().filters"
  [totalElements]="totalElements()"
  [loading]="loading()" [error]="error()"
  (queryChange)="handleQuery($event)" (retry)="load(query())" />

// Importuj VoteyTableQuery z publicznego entry pointu.
public readonly query = signal<VoteyTableQuery>({
  page: 0, size: 20, search: '', filters: {},
});

public handleQuery(next: VoteyTableQuery): void {
  this.query.set(next);
  this.load(next);
}

// load() to metoda aplikacji: pobiera bieżącą stronę, ustawia rows,
// totalElements, loading i error. Tabela nie narzuca serwisu ani endpointu.`;

const selection = `<vt-table #table label="LABEL.MEMBERS"
  [rows]="rows()" [columns]="columns" [rowKey]="rowKey"
  [selectable]="true" [(selectedKeys)]="selectedKeys"
  [selectionActions]="bulkActions">
  <vt-button vtTableToolbar text="BUTTON.APPLY_FILTERS"
    (pressed)="table.requestFilters(draftFilters())" />
</vt-table>

<ng-template #bulkActions let-keys>
  <vt-button text="BUTTON.DELETE_SELECTED"
    (pressed)="deleteSelected(keys)" />
</ng-template>

// Importuj VoteyTableKey z publicznego entry pointu.
public readonly selectedKeys = signal<readonly VoteyTableKey[]>([]);

// W trybie requestowym obsłuż także queryChange jak w przykładzie wyżej.
// Zastosowane filtry aktualizuj dopiero w tej obsłudze.`;

function Code({ title, children }) {
  return <figure className="code-example"><figcaption>{title}</figcaption><pre><code>{children}</code></pre></figure>;
}

function ApiTable({ rows, event = false }) {
  return <div className="api-scroll"><table className="api-table">
    <thead><tr><th>{event ? "Zdarzenie" : "Parametr"}</th><th>Typ</th>{!event && <th>Domyślnie</th>}<th>Znaczenie</th></tr></thead>
    <tbody>{rows.map(([name, type, value, description]) => <tr key={name}>
      <th scope="row"><code>{name}</code></th><td><code>{type}</code></td>
      {!event && <td><code>{value}</code></td>}<td>{event ? value : description}</td>
    </tr>)}</tbody>
  </table></div>;
}

function Section({ id, number, title, children }) {
  return <section id={id} className="guide-section"><div className="section-heading">
    <span className="section-number">{number}</span><h2>{title}</h2>
  </div>{children}</section>;
}

export function TableApiGuide() {
  function scrollToSection(event, id) {
    event.preventDefault();
    const guide = event.currentTarget.closest(".table-api-guide");
    const section = guide?.querySelector(`#${id}`);
    const reducedMotion = event.currentTarget.ownerDocument.defaultView
      ?.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  }

  return <main className="table-api-guide">
    <header className="guide-hero">
      <span className="eyebrow">Votey Design System · Angular</span>
      <h1>Table<span>API & Usage</span></h1>
      <p>Od pierwszej kolumny do paginacji, własnych komórek i bezpiecznego zaznaczania. Praktyczny przewodnik po <code>vt-table</code>.</p>
      <div className="hero-tags"><span>Signals API</span><span>Typowane szablony</span><span>Kompozycja Votey</span></div>
    </header>

    <nav className="guide-nav" aria-label="Sekcje dokumentacji Table">
      {[["start", "Szybki start"], ["inputs", "Inputs"], ["columns", "Kolumny"], ["events", "Zdarzenia"], ["cells", "Szablony"], ["data", "Dane i requesty"], ["selection", "Zaznaczanie"], ["states", "Stany i wygląd"], ["integration", "Integracja"]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => scrollToSection(event, id)}>{label}</a>)}
    </nav>

    <div className="intro-grid">
      <article><span className="eyebrow">Tabela</span><h2>Prezentacja i interakcje</h2><p>Kolumny, szablony, checkboxy, sticky header, skeleton i intencje użytkownika.</p></article>
      <article><span className="eyebrow">Aplikacja</span><h2>Dane i decyzje domenowe</h2><p>Requesty, uprawnienia, routing, edytory, tłumaczenia oraz wykonanie akcji.</p></article>
    </div>

    <Section id="start" number="01" title="Szybki start">
      <p>Importuj komponent i typy wyłącznie z publicznego entry pointu. Wymagane wejścia to <code>rows</code>, <code>rowKey</code> i <code>label</code>. Podaj również <code>columns</code> lub włącz <code>autoColumns</code>.</p>
      <Code title="Minimalny przykład · Angular">{setup}</Code>
      <aside className="note"><strong>Przygotowanie aplikacji</strong><p>Załaduj publiczny arkusz <code>tokens.angular.css</code> i skonfiguruj adapter <code>VOTEY_TRANSLATOR</code>. Przy używaniu ikon dodaj <code>provideVoteySvgRegistry()</code> i udostępnij assety zgodnie z konfiguracją paczki.</p></aside>
    </Section>

    <Section id="inputs" number="02" title="Inputs i model">
      <p>Wejścia są signalowe. Parametry strony i zastosowane zapytanie kontroluje konsument; samo odebranie zdarzenia nie aktualizuje jego stanu.</p>
      {inputGroups.map(([name, rows]) => <div className="api-group" key={name}><h3>{name}</h3><ApiTable rows={rows} /></div>)}
    </Section>

    <Section id="columns" number="03" title="Definicja kolumny">
      <p><code>VoteyTableColumn&lt;T&gt;</code> opisuje zawartość oraz układ. Podaj <code>field</code> dla zwykłego pola albo <code>value(row)</code> dla wartości wyliczanej. Domyślna komórka zachowuje 0 i false; null i undefined dają pusty tekst.</p>
      <ApiTable rows={columnsApi} />
      <aside className="note"><strong>Szablon nie zastępuje wartości</strong><p>Własna komórka zmienia prezentację, ale wyszukiwanie local nadal używa wartości z field lub value. Włącz searchable tylko dla pól przeznaczonych do wyszukiwania.</p></aside>
      <h3>Prostsze definicje przez field</h3>
      <p>Najlepszy wybór dla zwykłych ekranów: zachowujesz kontrolę nad kolejnością i nagłówkami, pomijając powtarzalne funkcje. TypeScript sprawdza nazwę pola. Obiekty i tablice nie są automatycznie zamieniane na tekst — zwróć tekst przez value albo obsłuż je we własnej komórce.</p>
      <Code title="Jawna konfiguracja · rekomendowana">{`const columns: readonly VoteyTableColumn<Member>[] = [
  { id: 'name', header: 'LABEL.NAME', field: 'name', searchable: true },
  { id: 'groups', header: 'LABEL.GROUPS',
    value: row => row.groups.map(group => group.name).join(', ') },
];`}</Code>
      <h3>Opcjonalne generowanie przez autoColumns</h3>
      <p>Tabela odczytuje Object.keys z pierwszego rekordu przed lokalnym filtrowaniem i stronicowaniem. Każdy klucz staje się id oraz field; nagłówek to headersPrefix + klucz, zamienianych w całości na uppercase. Bez prefiksu klucz pola jest zamieniany na uppercase i trafia do tłumacza. Kolejność pochodzi z Object.keys.</p>
      <Code title="Generowanie i nadpisania">{`<vt-table #table label="LABEL.MEMBERS"
  [rows]="rows()" [rowKey]="rowKey"
  [autoColumns]="true" headersPrefix="LABEL.MEMBER."
  [excludedColumns]="['id', 'internalNotes']" [columns]="overrides" />

// Definicja o tym samym id zastępuje całą wygenerowaną definicję.
const overrides: readonly VoteyTableColumn<Member>[] = [
  { id: 'name', header: 'LABEL.NAME', field: 'name', searchable: true },
  { id: 'actions', header: 'LABEL.ACTIONS', role: 'actions', value: () => '' },
];
// np. pole email -> klucz tłumaczenia LABEL.MEMBER.EMAIL
// actions obsłuż we wspólnym szablonie @switch (column.id).`}</Code>
      <p>Nadpisania działają po id; dodatkowe definicje są dopisywane na końcu. excludedColumns usuwa kolumny w obu trybach. Wspólny szablon vtTableCell otrzymuje standardowy kontekst column, value i rekord — możesz użyć @switch oraz @default tak samo jak przy jawnych kolumnach.</p>
      <aside className="note"><strong>Kiedy stosować automat</strong><p>Używaj dla prostych, płaskich danych o kontrolowanym schemacie. Nowe pole API pojawi się jako nowa kolumna, jeśli go nie wykluczysz. Przy pustym zbiorze pozostają tylko jawne definicje; pola występujące dopiero w kolejnych rekordach nie są wykrywane. W remote kolumny mogą zmienić się wraz ze stroną. Dla stałych nagłówków podczas ładowania, ustalonej kolejności i pól wewnętrznych wybierz jawne columns. Wykluczanie kolumn nie zastępuje kontroli dostępu do danych.</p></aside>
    </Section>

    <Section id="events" number="04" title="Zdarzenia i publiczna metoda">
      <ApiTable rows={events} event />
      <Code title="Payload queryChange">{`interface VoteyTableQuery {
  page: number;  // od zera
  size: number;
  search: string;
  filters: Readonly<Record<string, unknown>>;
}`}</Code>
      <div className="method-card"><h3><code>requestFilters(candidate): Promise&lt;boolean&gt;</code></h3><p>Wywołaj przed zmianą zastosowanych filtrów i przed requestem. Przy zaznaczeniu tabela wyświetla monit. Akceptacja czyści wybór i emituje queryChange; odmowa zwraca false oraz emituje filtersCancelled. Gdy tabela jest zablokowana, metoda zwraca false bez zmiany stanu.</p></div>
    </Section>

    <Section id="cells" number="05" title="Własne komórki i projekcja">
      <Code title="Komórka akcji · template">{customCell}</Code>
      <ApiTable rows={[
        ["$implicit", "T", "let-row", "Bieżący rekord."],
        ["column", "VoteyTableColumn<T>", 'let-column="column"', "Definicja renderowanej kolumny."],
        ["value", "VoteyTableValue", 'let-value="value"', "Wynik funkcji value(row)."],
        ["index", "number", 'let-index="index"', "Indeks rekordu na widocznej stronie."],
      ]} />
      <p><code>[vtTableCellOf]="table"</code> pozwala Angularowi wywnioskować typ rekordu w strict templates. Sam atrybut <code>vtTableCell</code> definiuje wspólny szablon z @switch i @default. Opcjonalne <code>vtTableCell="actions"</code> nadpisuje go dla konkretnego id kolumny. Bez szablonu tabela renderuje tekst body.</p>
      <div className="intro-grid">
        <article><h3>Toolbar</h3><p>Elementy z <code>vtTableToolbar</code> trafiają nad tabelę. Tu umieszczaj własne kontrolki filtrów i akcje dla całej tabeli.</p></article>
        <article><h3>Akcje zaznaczenia</h3><p><code>selectionActions</code> przyjmuje TemplateRef. Jego <code>$implicit</code> to wszystkie zaznaczone klucze, także z innych stron.</p></article>
      </div>
      <p>Używaj istniejących komponentów Votey również we własnych komórkach. Standardowe przyciski, linki i checkboxy nie aktywują rowClick; inne interaktywne obszary oznacz <code>data-table-interactive</code>.</p>
    </Section>

    <Section id="data" number="06" title="Tryby danych i obsługa requestów">
      <div className="mode-grid">
        <article><code>none</code><h3>Bez wyszukiwarki</h3><p>Przekazuj gotowe dane. Jeśli paginacja jest włączona, aplikacja dostarcza bieżącą stronę.</p></article>
        <article><code>local</code><h3>Pełny zbiór w pamięci</h3><p>Tabela przeszukuje kolumny searchable i opcjonalnie dzieli wyniki na strony. Zaktualizuj page i size po queryChange, bez requestu wyszukiwania.</p></article>
        <article><code>remote</code><h3>Wyszukiwanie serwerowe</h3><p>queryChange uruchamia pobranie po stronie aplikacji. Przekaż stronę odpowiedzi i liczbę wszystkich wyników.</p></article>
      </div>
      <Code title="Kontrolowane zapytanie · schemat integracji remote">{remote}</Code>
      <aside className="note"><strong>Jedno źródło danych</strong><p>Nie przekazuj pojedynczej strony serwerowej do trybu local, jeśli wyszukiwarka ma obejmować całą bazę. Przy nakładających się requestach aplikacja powinna anulować poprzedni lub ignorować nieaktualną odpowiedź.</p></aside>
      <h3>Zasady wyszukiwania</h3>
      <ul><li>Bez zaznaczenia: automatycznie po 300 ms, od minimum 3 znaków po trim.</li><li>Przy zaznaczeniu: Enter lub lupa, następnie monit przed utratą wyboru.</li><li>1–2 znaki pozostawiają poprzednie wyniki. Sama pusta fraza również nie uruchamia nowego zapytania.</li><li>X resetuje zastosowane wyszukiwanie, zachowując pozostałe filtry. Jeśli reset powoduje utratę zaznaczenia, wymaga monitu.</li></ul>
    </Section>

    <Section id="selection" number="07" title="Zaznaczanie i zmiana filtrów">
      <Code title="Pasek akcji zbiorczych i filtry">{selection}</Code>
      <ol><li>Checkbox nagłówka obejmuje tylko widoczną stronę. Częściowy wybór pokazuje indeterminate.</li><li>Shift zaznacza lub odznacza zakres widocznych rekordów. Zmiana strony zachowuje klucze; nowe obiekty o tych samych kluczach zachowują wybór.</li><li>Przechowuj szkic filtrów oddzielnie od zastosowanych wartości. Przekaż kandydata do requestFilters().</li><li>Po odmowie zachowaj dotychczasowe dane i parametry. Nie wysyłaj odrzuconego requestu. Escape i zamknięcie przez tło także oznaczają odmowę.</li><li>Ręczne odznaczanie checkboxów nie wymaga monitu.</li></ol>
      <aside className="note"><strong>Nie omijaj potwierdzenia</strong><p>Bezpośrednia zmiana inputów search i filters oznacza przekazanie już zatwierdzonego stanu. Nie używaj ich do podawania niezatwierdzonych filtrów z formularza. Podczas otwartego monitu zmiana danych, strony, rozmiaru lub kontrolowanego zapytania anuluje oczekującą operację.</p></aside>
    </Section>

    <Section id="states" number="08" title="Stany i wygląd">
      <ApiTable rows={[
        ["Loading", "loading = true", "priorytet 1", "Skeleton przy każdym requestcie danych tabeli. Liczba wierszy: size z paginacją, 5 bez paginacji. Zaznaczenie pozostaje w modelu."],
        ["Error", "error = true", "priorytet 2", "Komunikat błędu i akcja retry. Aplikacja ponawia pobranie."],
        ["Empty", "brak rekordów", "bez zapytania", "Komunikat emptyText."],
        ["No results", "brak rekordów", "search / filters", "Komunikat noResultsText. Filtr z wartością false nadal ma klucz i jest traktowany jako obecny filtr."],
      ]} />
      <div className="intro-grid">
        <article><h3>Standard</h3><p>Tło surface (białe w light, dopasowane do dark) i tekst primary. Nagłówki: caption-extrabold. Komórki domyślne: body.</p></article>
        <article><h3>Heavy</h3><p>Tło bg-inverse, tekst inverse i zaokrąglenia pierwszej oraz ostatniej komórki zgodne z wierszami danych.</p></article>
      </div>
      <p>Kontener ma maksymalną wysokość 66vh. Nagłówki pozostają sticky u góry, checkboxy po lewej, a ostatnia kolumna actions po prawej. Szeroka tabela przewija się poziomo; nie przełącza się w karty.</p>
    </Section>

    <Section id="integration" number="09" title="Tłumaczenia i checklista integracji">
      <p>Podłącz <code>VOTEY_TRANSLATOR</code>. Tabela używa także istniejących kluczy <code>LABEL.SEARCH</code>, <code>MESSAGE.SELECTED_RECORDS</code> i etykiet paginatora. Nagłówki, label oraz nadpisania komunikatów traktowane są jako klucze tłumaczeń.</p>
      <div className="api-scroll"><table className="api-table"><thead><tr><th>Klucz</th><th>Przykładowy tekst PL</th></tr></thead><tbody>{translations.map(([key, text]) => <tr key={key}><th scope="row"><code>{key}</code></th><td>{text}</td></tr>)}</tbody></table></div>
      <ul><li>Publiczne importy, arkusz tokenów, translator i konfiguracja SVG są gotowe.</li><li>rowKey jest stabilny, kolumny mają unikalne id, a kolumna actions jest ostatnia.</li><li>Właściwy tryb danych i obsługa queryChange odpowiadają paginacji aplikacji.</li><li>Akcje własnych komórek i toolbara respektują loading, disabled i uprawnienia konsumenta.</li><li>Przetestowano zaznaczenie między stronami oraz akceptację i odmowę zmiany filtrów.</li></ul>
      <footer className="guide-footer"><strong>Poza pierwszą wersją</strong><p>Sortowanie nagłówkami, drag-and-drop wierszy, hierarchiczne rekordy, mobilne karty i preferencje kolumn. Ich brak nie wymaga lokalnego odtwarzania tabeli.</p><span>Publiczny kontrakt: VoteyTableComponent · VoteyTableCellDirective · VoteyTableColumn · VoteyTableQuery</span></footer>
    </Section>
  </main>;
}
