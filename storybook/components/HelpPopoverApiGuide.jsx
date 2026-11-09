import React from "react";
import "./TableApiGuide.scss";

const inputs = [
  [
    "content",
    "VoteyHelpPopoverContent",
    "wymagane",
    "Tytuł, sekcje, opcjonalna ilustracja i link. Jedna definicja w TS zasila cały panel.",
  ],
  [
    "placement",
    "VoteyPopoverPlacement",
    "bottom-end",
    "Preferowane położenie. MatMenu dopasowuje panel do dostępnego miejsca.",
  ],
  [
    "disabled",
    "boolean",
    "false",
    "Blokuje przycisk i otwarcie panelu. Zamyka panel, jeśli jest już otwarty.",
  ],
];

const contentFields = [
  [
    "title",
    "string",
    "wymagane",
    "Tytuł panelu i dostępna nazwa przycisku pomocy.",
  ],
  [
    "illustration",
    "VoteyIllustration",
    "brak",
    "Nazwa publicznej ilustracji DS. Wewnątrz renderowana przez vt-icon; bez ścieżek do obrazków.",
  ],
  [
    "sections",
    "readonly VoteyHelpPopoverSection[]",
    "wymagane",
    "Kolejne wpisy pomocy. Pusta tablica pozwala użyć własnego szablonu.",
  ],
  [
    "sections[].heading",
    "string",
    "brak",
    "Opcjonalny nagłówek wpisu. Wielkość liter wynika z treści.",
  ],
  [
    "sections[].paragraphs",
    "readonly string[]",
    "wymagane",
    "Akapity wpisu. Zwykły tekst, bez interpretacji HTML.",
  ],
  [
    "action",
    "{ label: string; href: string }",
    "brak",
    "Opcjonalny link na końcu treści. Routing może przejąć konsument przez actionPressed.",
  ],
];

const usage = `import { VoteyHelpPopoverComponent,
  type VoteyHelpPopoverContent,
} from '@pleodigital/design-system-votey/angular';

protected readonly eventHelp: VoteyHelpPopoverContent = {
  title: 'LABEL.VOTINGS_AND_EVENTS',
  illustration: 'bg-create-first-vote',
  sections: [
    {
      heading: 'MESSAGE.EVENTS_LIST_EVENT_LABEL',
      paragraphs: ['MESSAGE.EVENTS_LIST_EVENT_DESC'],
    },
  ],
};`;

const template = `<vt-help-popover [content]="eventHelp" />`;

const customContent = `<vt-help-popover [content]="eventHelp">
  <ng-template vtPopoverContent let-close="close">
    <vt-button text="BUTTON.CONTINUE" (pressed)="continue(); close()" />
  </ng-template>
</vt-help-popover>`;

const routing = `<vt-help-popover
  [content]="eventHelp"
  (actionPressed)="openGuide($event)"
/>

protected openGuide(event: MouseEvent): void {
  event.preventDefault();
  void this.router.navigateByUrl('/client/guide');
}`;

function Code({ title, children }) {
  return (
    <figure className="code-example">
      <figcaption>{title}</figcaption>
      <pre>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

function ApiTable({ rows }) {
  return (
    <div className="api-scroll">
      <table className="api-table">
        <thead>
          <tr>
            <th>Parametr</th>
            <th>Typ</th>
            <th>Domyślnie</th>
            <th>Znaczenie</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, value, description]) => (
            <tr key={name}>
              <th scope="row">
                <code>{name}</code>
              </th>
              <td>
                <code>{type}</code>
              </td>
              <td>
                <code>{value}</code>
              </td>
              <td>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="guide-section">
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function HelpPopoverApiGuide() {
  function scrollToSection(event, id) {
    event.preventDefault();
    const section = event.currentTarget
      .closest(".table-api-guide")
      ?.querySelector(`#${id}`);
    const reducedMotion =
      event.currentTarget.ownerDocument.defaultView?.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    section?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <main className="table-api-guide help-popover-api-guide">
      <header className="guide-hero">
        <span className="eyebrow">Votey Design System · Angular</span>
        <h1>
          Help Popover <span>API & Usage</span>
        </h1>
        <p>
          Gotowa pomoc kontekstowa: przycisk, ilustracja i treść z jednej
          definicji w TypeScript.
        </p>
        <div className="hero-tags">
          <span>MatMenu</span>
          <span>Signals API</span>
          <span>vt-icon</span>
          <span>Grid DS</span>
        </div>
      </header>
      <nav className="guide-nav" aria-label="Sekcje dokumentacji Help Popover">
        {[
          ["help-start", "Szybki start"],
          ["help-inputs", "API"],
          ["help-content", "Treść"],
          ["help-layout", "Responsywność"],
          ["help-events", "Interakcje"],
          ["help-custom", "Szablony i routing"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => scrollToSection(event, id)}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="intro-grid">
        <article>
          <span className="eyebrow">Design System</span>
          <h2>Wygląd i zachowanie</h2>
          <p>
            Przycisk ?, MatMenu, typografia, vt-icon, pozycjonowanie i obsługa
            klawiatury.
          </p>
        </article>
        <article>
          <span className="eyebrow">Aplikacja</span>
          <h2>Treść i nawigacja</h2>
          <p>
            Definicje pomocy, klucze tłumaczeń i decyzja, dokąd prowadzi link.
          </p>
        </article>
      </div>
      <Section
        id="help-start"
        number="01"
        title="Jedna definicja, jedna linijka HTML"
      >
        <p>
          Dodaj VoteyHelpPopoverComponent do imports komponentu. Treść
          przechowuj przy feature, a wspólne definicje współdziel między
          widokami.
        </p>
        <Code title="TypeScript · definicja pomocy">{usage}</Code>
        <Code title="HTML · użycie">{template}</Code>
      </Section>
      <Section id="help-inputs" number="02" title="Publiczne API">
        <ApiTable rows={inputs} />
        <div className="note">
          <strong>Preferencja położenia</strong>
          <p>
            bottom-end, bottom-start, top-end i top-start określają punkt
            wyjściowy. MatMenu obsługuje fallback przy krawędzi viewportu.
          </p>
        </div>
      </Section>
      <Section
        id="help-content"
        number="03"
        title="Treść, ilustracje i tłumaczenia"
      >
        <ApiTable rows={contentFields} />
        <div className="mode-grid">
          <article>
            <h3>Ilustracja z DS</h3>
            <p>
              Wybierz publiczną nazwę typu VoteyIllustration. Aplikacja
              dostarcza provideVoteySvgRegistry() i dostęp do assetów.
            </p>
          </article>
          <article>
            <h3>Zmiana języka</h3>
            <p>
              Teksty są przekazywane do VOTEY_TRANSLATOR. W Storybooku można
              używać literalów, w aplikacji kluczy tłumaczeń.
            </p>
          </article>
        </div>
      </Section>
      <Section id="help-layout" number="04" title="Panel oparty na gridzie">
        <div className="mode-grid">
          <article>
            <h3>Szerokość</h3>
            <p>
              6 kolumn DS i 5 odstępów między nimi. Panel reaguje na szerokość
              kolumn, column gap i stan menu bocznego aplikacji.
            </p>
          </article>
          <article>
            <h3>Wysokość</h3>
            <p>
              Wynika z zawartości i jest ograniczona dostępną wysokością
              viewportu. Ilustracja skaluje się proporcjonalnie do swojej
              kolumny.
            </p>
          </article>
          <article>
            <h3>Mobile</h3>
            <p>
              Ilustracja jest nad treścią i przewija się cały panel. Kontekst
              urządzenia pochodzi z DS; w Playground ustaw toolbar Device.
            </p>
          </article>
        </div>
        <Code title="Szerokość zgodna z gridem DS">
          {"calc(6 * var(--grid-column-width) + 5 * var(--grid-column-gap))"}
        </Code>
      </Section>
      <Section id="help-events" number="05" title="Zdarzenia i klawiatura">
        <div className="method-card">
          <strong>openedChange: boolean</strong>
          <p>Informuje o otwarciu i zamknięciu panelu.</p>
        </div>
        <div className="method-card">
          <strong>actionPressed: MouseEvent</strong>
          <p>
            Pozwala przejąć zwykłe kliknięcie linku przez router. Kliknięcia z
            Ctrl, Cmd lub Shift zachowują natywne zachowanie przeglądarki.
          </p>
        </div>
        <ul>
          <li>Enter lub Space otwiera pomoc z przycisku.</li>
          <li>Escape i kliknięcie poza panelem zamykają pomoc.</li>
          <li>Tab przechodzi między kontrolkami wewnątrz panelu.</li>
          <li>Po zamknięciu fokus wraca do przycisku pomocy.</li>
        </ul>
      </Section>
      <Section id="help-custom" number="06" title="Własna treść i routing">
        <p>
          Dla nietypowej zawartości zaimportuj dodatkowo
          VoteyPopoverContentDirective. Własny szablon pojawia się za
          standardowymi wpisami i otrzymuje close().
        </p>
        <Code title="HTML · dodatkowy szablon">{customContent}</Code>
        <Code title="Przejęcie nawigacji przez aplikację">{routing}</Code>
        <footer className="guide-footer">
          <strong>Gdy potrzebujesz panelu filtrów</strong>
          <p>
            Użyj vt-popover i własnego formularza w ng-template
            vtPopoverContent. Help Popover jest gotową kompozycją dla treści
            pomocy.
          </p>
          <span>
            Publiczny kontrakt: VoteyHelpPopoverComponent ·
            VoteyHelpPopoverContent · VoteyPopoverContentDirective
          </span>
        </footer>
      </Section>
    </main>
  );
}
