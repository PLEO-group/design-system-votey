/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: design-system.schema.json
 * Regenerate with scripts/generate-manifest-types.mjs.
 */

/**
 * Pin wersji jednego kontraktu z centralnego company-standard-contracts.json.
 */
export interface CompanyStandardContractPin {
  /**
   * Stabilny identyfikator kontraktu firmowego.
   */
  id: string;
  /**
   * Dokładna wersja kontraktu zgodna z SemVer.
   */
  version: string;
}

/**
 * Konfiguracja dostępności frameworka i jego publicznego entry pointu.
 */
export interface Framework {
  /**
   * Określa, czy paczka oficjalnie obsługuje dany framework.
   */
  enabled: boolean;
  /**
   * Publiczny subpath paczki dla frameworka albo null, jeśli wsparcie jest wyłączone.
   */
  entryPoint: string | null;
}

/**
 * Warstwa tokenów: surowa core albo przeznaczona do użycia produktowego semantic.
 */
export type TokenLayer = "core" | "semantic";

/**
 * Polityka cyklu życia warstw tokenów w wybranej kategorii.
 */
export interface TokenPolicy {
  /**
   * Warstwy tokenów fizycznie generowane do artefaktów.
   */
  generate: Array<TokenLayer>;
  /**
   * Warstwy tokenów prezentowane deweloperowi w podpowiedziach IDE.
   */
  autocomplete: Array<TokenLayer>;
  /**
   * Warstwy tokenów dozwolone do bezpośredniego użycia w kodzie konsumenta.
   */
  allowedUsage: Array<TokenLayer>;
}

/**
 * Nadpisania polityk wybranych kategorii tokenów dla danego frameworka.
 */
export type DesignSystemManifestFrameworkTokenPolicyCategories = Record<string, TokenPolicy>;

/**
 * Frameworkowe nadpisania kategorii tokenów i lista generowanych formatów integracji.
 */
export interface FrameworkTokenPolicy {
  /**
   * Nadpisania polityk wybranych kategorii tokenów dla danego frameworka.
   */
  categories: DesignSystemManifestFrameworkTokenPolicyCategories;
  /**
   * Formaty artefaktów tokenowych generowane dla danego frameworka.
   */
  outputs: Array<"scss" | "css-variables" | "tailwind">;
}

/**
 * Odstępstwo od reguły zaakceptowane przez dewelopera po konsultacji z przełożonym, wraz ze statusem cyklu życia.
 */
export interface Exception {
  /**
   * Stabilny identyfikator reguły, od której przyznano wyjątek.
   */
  rule: string;
  /**
   * Konkretne biznesowe lub techniczne uzasadnienie odstępstwa.
   */
  reason: string;
  /**
   * Deweloper odpowiedzialny za zgłoszenie i utrzymanie wyjątku.
   */
  developer: string;
  /**
   * Przełożony, z którym deweloper skonsultował odstępstwo.
   */
  consultedApprover: string;
  /**
   * Opcjonalne odwołanie do zadania, decyzji lub dokumentacji wyjątku.
   */
  reference?: string;
  /**
   * Aktualny stan wyjątku używany przez guardraile i audyt.
   */
  status: "active" | "expired" | "resolved";
}

/**
 * Konfiguracja rejestru, do którego paczka jest lub może być publikowana.
 */
export interface DesignSystemManifestIdentityRegistry {
  /**
   * Rodzaj rejestru paczek; domyślnym wariantem firmowym jest npmjs.
   */
  type: "npmjs" | "private" | "custom";
  /**
   * Poziom dostępu do opublikowanej paczki.
   */
  access: "public" | "restricted";
  /**
   * Adres rejestru paczek używany przez narzędzia publikujące i instalujące.
   */
  url: string;
}

/**
 * Identyfikacja produktu, paczki, jej wersji i docelowego rejestru.
 */
export interface DesignSystemManifestIdentity {
  /**
   * Czytelna nazwa produktu lub obszaru obsługiwanego przez design system.
   */
  product: string;
  /**
   * Pełna nazwa paczki NPM stanowiąca jej publiczną tożsamość.
   */
  packageName: string;
  /**
   * Aktualna wersja paczki zgodna z Semantic Versioning.
   */
  version: string;
  /**
   * Konfiguracja rejestru, do którego paczka jest lub może być publikowana.
   */
  registry: DesignSystemManifestIdentityRegistry;
}

/**
 * Kanoniczne źródło projektu wizualnego obejmujące cały design system, w tym fundamenty i ewentualne komponenty; jest niezależne od tokenowego sourceOfTruth.
 */
export interface DesignSystemManifestDesignSource {
  /**
   * Narzędzie będące źródłem całego projektu wizualnego; firmowym defaultem jest Figma.
   */
  type: "figma" | "other";
  /**
   * Link do całego projektu lub pliku design systemu, a nie tylko do widoku albo źródła tokenów.
   */
  projectUrl: string | null;
  /**
   * Uzasadnienie braku projektu Figma; dla źródła typu figma wartość musi być null.
   */
  exceptionReason: string | null;
}

/**
 * Polityka wykrywania i kontrolowanej migracji lokalnych mini design systemów.
 */
export interface DesignSystemManifestRepositoryBoundaryPolicyLocalMiniDs {
  /**
   * Tryb całkowitego zakazu albo czasowej migracji zamrożonego stanu zastanego.
   */
  mode: "forbid" | "migration-baseline";
  /**
   * Ścieżka do baseline'u istniejącego mini-DS; null, gdy mini-DS jest całkowicie zabroniony.
   */
  baselineFile: string | null;
  /**
   * Poziom reakcji na heurystycznie wykryte potencjalne elementy lokalnego mini-DS.
   */
  heuristicFindings: "block" | "review-required";
  /**
   * Konkretne uzasadnienie wyboru embedded-mini-ds dla szczególnie małego projektu; dla pozostałych topologii null.
   */
  justification: string | null;
}

/**
 * Deterministyczne zasady chroniące granicę publicznego API paczki.
 */
export interface DesignSystemManifestRepositoryBoundaryPolicy {
  /**
   * Wymusza korzystanie przez konsumentów wyłącznie z publicznych entry pointów paczki.
   */
  publicImportsOnly: true;
  /**
   * Zabrania paczce design systemu importowania kodu z aplikacji konsumującej.
   */
  packageImportsConsumer: false;
  /**
   * Wymaga sprawdzenia faktycznej zawartości artefaktu tworzonego przez npm pack.
   */
  packCheck: true;
  /**
   * Prefiksy niedozwolonych importów względnych lub głębokich omijających publiczne API.
   */
  forbiddenPackageImportPrefixes: Array<string>;
  /**
   * Polityka wykrywania i kontrolowanej migracji lokalnych mini design systemów.
   */
  localMiniDs: DesignSystemManifestRepositoryBoundaryPolicyLocalMiniDs;
}

/**
 * Topologia repozytorium oraz granice pomiędzy design systemem i jego konsumentami.
 */
export interface DesignSystemManifestRepository {
  /**
   * Położenie DS: osobne repozytorium, wydzielona paczka we wspólnym workspace albo zatwierdzony mini-DS osadzony w szczególnie małym projekcie.
   */
  topology: "standalone-repository" | "colocated-workspace-package" | "embedded-mini-ds";
  /**
   * Ścieżka do katalogu głównego design systemu względem repozytorium; dla embedded-mini-ds musi wynosić kropkę.
   */
  packageRoot: string;
  /**
   * Ścieżki do aplikacji konsumujących DS w tym samym workspace.
   */
  consumerRoots: Array<string>;
  /**
   * Deterministyczne zasady chroniące granicę publicznego API paczki.
   */
  boundaryPolicy: DesignSystemManifestRepositoryBoundaryPolicy;
}

/**
 * Sposób udostępniania paczki konsumentom i gotowość do publikacji.
 */
export interface DesignSystemManifestDistribution {
  /**
   * Dystrybucja tylko wewnątrz workspace albo poprzez rejestr paczek.
   */
  mode: "workspace-internal" | "registry";
  /**
   * Informuje, czy paczka ma skonfigurowany i dozwolony proces publikacji.
   */
  publishable: boolean;
}

/**
 * Frameworki obsługiwane przez paczkę i ich niezależne publiczne entry pointy.
 */
export interface DesignSystemManifestFrameworks {
  /**
   * Konfiguracja wsparcia i entry pointu dla Angulara.
   */
  angular: Framework;
  /**
   * Konfiguracja wsparcia i entry pointu dla Reacta.
   */
  react: Framework;
}

/**
 * Kanoniczne źródło danych tokenowych, preferencyjnie Figma Variables.
 */
export interface DesignSystemManifestTokensSourceOfTruth {
  /**
   * Rodzaj źródła prawdy tokenów.
   */
  type: "figma-variables" | "json" | "other";
  /**
   * Adres źródła, na przykład pliku Figma zawierającego Variables.
   */
  url?: string;
  /**
   * Lokalna ścieżka do pliku źródłowego, jeśli tokeny nie pochodzą bezpośrednio z Figmy.
   */
  path?: string;
  /**
   * Uzasadnienie odstępstwa od firmowego źródła prawdy opartego na Figma Variables.
   */
  exceptionReason?: string;
}

/**
 * Bazowe polityki generowania, autocomplete i użycia dla każdej kategorii tokenów.
 */
export type DesignSystemManifestTokensCategories = Record<string, TokenPolicy>;

/**
 * Nadpisania polityk tokenowych i formaty outputu definiowane osobno dla frameworków.
 */
export interface DesignSystemManifestTokensFrameworkPolicies {
  /**
   * Polityki tokenów i outputy przeznaczone dla Angulara.
   */
  angular: FrameworkTokenPolicy;
  /**
   * Polityki tokenów i outputy przeznaczone dla Reacta.
   */
  react: FrameworkTokenPolicy;
}

/**
 * Źródło prawdy, generowanie i polityki wykorzystania tokenów design systemu.
 */
export interface DesignSystemManifestTokens {
  /**
   * Kanoniczne źródło danych tokenowych, preferencyjnie Figma Variables.
   */
  sourceOfTruth: DesignSystemManifestTokensSourceOfTruth;
  /**
   * Obowiązkowy silnik przetwarzający źródłowe tokeny na artefakty frameworkowe.
   */
  generator: "style-dictionary";
  /**
   * Wersja kontraktu znaczenia warstw tokenów i rekomendowanych, niewymaganych wzorców nazewnictwa.
   */
  namingContract: "pleo-design-system-tokens-v1";
  /**
   * Bazowe polityki generowania, autocomplete i użycia dla każdej kategorii tokenów.
   */
  categories: DesignSystemManifestTokensCategories;
  /**
   * Nadpisania polityk tokenowych i formaty outputu definiowane osobno dla frameworków.
   */
  frameworkPolicies: DesignSystemManifestTokensFrameworkPolicies;
}

/**
 * Źródłowe pliki semantic tokenów zależnych od motywu, przetwarzane przez Style Dictionary.
 */
export interface DesignSystemManifestThemesSemanticTokenFiles {
  /**
   * Ścieżka względem packageRoot do semantic tokenów light.
   */
  light: string;
  /**
   * Ścieżka względem packageRoot do semantic tokenów dark.
   */
  dark: string;
}

/**
 * Kontrakt Angular runtime oparty na body[data-theme], sessionStorage i jawnej inicjalizacji loadTheme().
 */
export interface DesignSystemManifestThemesAngular {
  /**
   * Włącza firmowy Angular theme runtime, gdy paczka obsługuje Angulara.
   */
  enabled: boolean;
  /**
   * Element utrzymujący data-theme; standard Angular używa body.
   */
  host: "body" | null;
  /**
   * Atrybut runtime przełączający semantic token modes; standard używa data-theme.
   */
  attribute: "data-theme" | null;
  /**
   * Magazyn preferencji użytkownika; standard Angular używa sessionStorage.
   */
  storage: "session" | null;
  /**
   * Klucz zapisanej preferencji; standard Angular używa theme.
   */
  storageKey: "theme" | null;
  /**
   * Motyw początkowy przed odczytem zapisanej preferencji.
   */
  defaultTheme: "light" | null;
  /**
   * Wartość data-theme umieszczana na body w index.html przed uruchomieniem Angulara.
   */
  initialThemeInHtml: "light" | null;
  /**
   * Sposób inicjalizacji; explicit-load wymaga jawnego wywołania ThemeService.loadTheme() przez konsumenta.
   */
  initialization: "explicit-load" | null;
  /**
   * Włącza document.startViewTransition przy świadomym przełączeniu motywu, z fallbackiem do natychmiastowej zmiany.
   */
  useViewTransitions: boolean;
  /**
   * Ścieżka względem packageRoot do publicznego Angular ThemeService.
   */
  servicePath: string | null;
  /**
   * Ścieżka względem packageRoot do SCSS spinającego wygenerowane semantic modes z body[data-theme].
   */
  contractScssPath: string | null;
}

/**
 * Kontrakt semantic modes light/dark oraz frameworkowego runtime themingu.
 */
export interface DesignSystemManifestThemes {
  /**
   * Motywy obsługiwane przez publiczne semantic tokens; kontrakt v1 wymaga dokładnie light i dark.
   */
  modes: Array<"light" | "dark">;
  /**
   * Źródłowe pliki semantic tokenów zależnych od motywu, przetwarzane przez Style Dictionary.
   */
  semanticTokenFiles: DesignSystemManifestThemesSemanticTokenFiles;
  /**
   * Kontrakt Angular runtime oparty na body[data-theme], sessionStorage i jawnej inicjalizacji loadTheme().
   */
  angular: DesignSystemManifestThemesAngular;
}

/**
 * Polityka przechowywania i deterministycznego generowania artefaktów builda.
 */
export interface DesignSystemManifestArtifacts {
  /**
   * Określa, które wygenerowane artefakty są śledzone w repozytorium.
   */
  policy: "build-only" | "tracked-intermediate" | "tracked-dist";
  /**
   * Ścieżki do kanonicznych plików źródłowych podlegających generowaniu.
   */
  sources: Array<string>;
  /**
   * Ścieżki do artefaktów tworzonych automatycznie ze źródeł.
   */
  generated: Array<string>;
  /**
   * Określa, czy generator musi usunąć poprzedni output przed rozpoczęciem builda.
   */
  cleanBeforeBuild: boolean;
  /**
   * Określa, czy CI ma potwierdzać identyczny wynik generowania dla tych samych źródeł.
   */
  verifyDeterminism: boolean;
}

/**
 * Publiczne lokalizacje ikon, ilustracji i integracji assetów frameworkowych.
 */
export interface DesignSystemManifestAssets {
  /**
   * Wersja obowiązującego firmowego kontraktu nazewnictwa plików i publicznych nazw SVG.
   */
  namingContract: "pleo-design-system-assets-v1";
  /**
   * Ścieżka publiczna lub paczkowa do kolekcji ikon SVG.
   */
  iconsPath: string;
  /**
   * Ścieżka publiczna lub paczkowa do kolekcji ilustracji SVG.
   */
  illustrationsPath: string;
  /**
   * Określa, czy wariant Angular udostępnia system rejestracji SVG.
   */
  angularSvgRegistry: boolean;
  /**
   * Ścieżka względem packageRoot do generatora typów, registry i frameworkowych mapowań ze źródłowych nazw SVG.
   */
  generatorPath: string;
  /**
   * Ścieżka względem packageRoot do projektowej konfiguracji contextów, prefixów, namespace'ów i słownictwa SVG.
   */
  configPath: string;
  /**
   * Ścieżka względem packageRoot do generowanego pliku TypeScript z nazwami i wpisami registry.
   */
  generatedTypesPath: string;
  /**
   * Ścieżka względem packageRoot do generowanego publicznego barrel React albo null, gdy React nie jest obsługiwany.
   */
  reactBarrelPath: string | null;
}

/**
 * Dla device-contract mapuje każdy device type na breakpoint referencyjny używany przez skalowanie tokenów i opcjonalny grid; dla css-media pozostaje pustym obiektem. Pole nie zależy od włączenia gridu.
 */
export type DesignSystemManifestResponsiveDeviceBreakpointMap = Record<string, string>;

/**
 * Kanoniczna lista wspieranych breakpointów i lokalizacja ich core tokens; kolejność od najmniejszej do największej steruje interpolacją.
 */
export interface DesignSystemManifestResponsiveBreakpoints {
  /**
   * Uporządkowane nazwy wspieranych breakpointów, na przykład mobile-small, mobile, tablet-small, tablet, laptop i desktop albo prostszy zestaw mobile, tablet i desktop.
   */
  names: Array<string>;
  /**
   * Ścieżka względem packageRoot do źródłowego JSON z wartościami breakpointów przetwarzanego przez Style Dictionary.
   */
  tokenFile: string;
  /**
   * Kropkowana ścieżka w tokenFile do mapy breakpointów, na przykład breakpoint.core.
   */
  tokenPath: string;
}

/**
 * Jedyne ręcznie edytowane źródło mnożników skali przypisanych do device types; klucze muszą odpowiadać responsive.deviceTypes. Style Dictionary przenosi wartości do generatedConfigScssPath.
 */
export type DesignSystemManifestResponsiveScalingDeviceMultipliers = Record<string, number>;

/**
 * Mapowanie breakpointu bez jawnej wartości tokenu na wspierany breakpoint z wartością, na przykład mobile-small na mobile.
 */
export type DesignSystemManifestResponsiveScalingImplicitBreakpointFallbacks = Record<string, string>;

/**
 * Reguły płynnego skalowania responsive tokens pomiędzy breakpointami dla aktualnie wykrytego rodzaju urządzenia.
 */
export interface DesignSystemManifestResponsiveScaling {
  /**
   * Określa, czy DS generuje płynne wartości tokenów pomiędzy kolejnymi breakpointami.
   */
  enabled: boolean;
  /**
   * Jedyne ręcznie edytowane źródło mnożników skali przypisanych do device types; klucze muszą odpowiadać responsive.deviceTypes. Style Dictionary przenosi wartości do generatedConfigScssPath.
   */
  deviceMultipliers: DesignSystemManifestResponsiveScalingDeviceMultipliers;
  /**
   * Mapowanie breakpointu bez jawnej wartości tokenu na wspierany breakpoint z wartością, na przykład mobile-small na mobile.
   */
  implicitBreakpointFallbacks: DesignSystemManifestResponsiveScalingImplicitBreakpointFallbacks;
}

/**
 * Konfiguracja opcjonalnego systemu gridu; wartości columns, gutter, margin i margin-extra pozostają core tokens generowanymi przez Style Dictionary.
 */
export interface DesignSystemManifestResponsiveGrid {
  /**
   * Określa, czy design system dostarcza własny system gridu.
   */
  enabled: boolean;
  /**
   * Nazwy wariantów gridu dostępnych w paczce.
   */
  variants: Array<string>;
  /**
   * Domyślny wariant gridu albo null, gdy grid jest wyłączony.
   */
  defaultVariant: string | null;
  /**
   * Ścieżka względem packageRoot do źródłowego JSON gridu przetwarzanego przez Style Dictionary albo null, gdy grid jest wyłączony.
   */
  tokenFile: string | null;
  /**
   * Kropkowana ścieżka w tokenFile do mapy wariantów gridu, na przykład grid.core, albo null, gdy grid jest wyłączony.
   */
  tokenPath: string | null;
}

/**
 * Kontrakt nazw breakpointów, detekcji urządzeń, płynnego skalowania tokenów i opcjonalnego gridu.
 */
export interface DesignSystemManifestResponsive {
  /**
   * Wyłączny model responsywności: runtime device() oparty na data-device albo breakpoint() oparty na media queries; jeden DS nie może używać obu.
   */
  mode: "device-contract" | "css-media";
  /**
   * Ścieżka względem packageRoot do mapy SCSS generowanej wspólnie z manifestu, breakpoint tokens i opcjonalnych grid tokens. Plik jest wyłącznie outputem commands.buildTokens i nie wolno edytować go ręcznie.
   */
  generatedConfigScssPath: string;
  /**
   * Nazwy rodzajów urządzeń ustawianych przez runtime detector dla device-contract; dla css-media lista jest pusta. Nie są synonimami breakpointów viewportu.
   */
  deviceTypes: Array<string>;
  /**
   * Dla device-contract mapuje każdy device type na breakpoint referencyjny używany przez skalowanie tokenów i opcjonalny grid; dla css-media pozostaje pustym obiektem. Pole nie zależy od włączenia gridu.
   */
  deviceBreakpointMap: DesignSystemManifestResponsiveDeviceBreakpointMap;
  /**
   * Kanoniczna lista wspieranych breakpointów i lokalizacja ich core tokens; kolejność od najmniejszej do największej steruje interpolacją.
   */
  breakpoints: DesignSystemManifestResponsiveBreakpoints;
  /**
   * Reguły płynnego skalowania responsive tokens pomiędzy breakpointami dla aktualnie wykrytego rodzaju urządzenia.
   */
  scaling: DesignSystemManifestResponsiveScaling;
  /**
   * Konfiguracja opcjonalnego systemu gridu; wartości columns, gutter, margin i margin-extra pozostają core tokens generowanymi przez Style Dictionary.
   */
  grid: DesignSystemManifestResponsiveGrid;
}

/**
 * Środowisko podglądu i dokumentowania elementów design systemu.
 */
export interface DesignSystemManifestPreview {
  /**
   * Rodzaj środowiska preview: Storybook albo dedykowana aplikacja.
   */
  type: "storybook" | "application";
  /**
   * Komenda uruchamiająca lub budująca środowisko preview.
   */
  command: string;
}

/**
 * Kanoniczne komendy używane lokalnie, przez agenta i w CI.
 */
export interface DesignSystemManifestCommands {
  /**
   * Komenda generująca wszystkie tokenowe artefakty przez Style Dictionary.
   */
  buildTokens: string;
  /**
   * Komenda transformująca źródłowe SVG i generująca typy, registry oraz frameworkowe eksporty z nazw plików.
   */
  buildAssets: string;
  /**
   * Komenda read-only walidująca nazwy i bezpieczeństwo SVG oraz aktualność wszystkich generowanych kontraktów.
   */
  checkAssets: string;
  /**
   * Komenda budująca dystrybuowalną paczkę design systemu.
   */
  build: string;
  /**
   * Komenda uruchamiająca obowiązkowe testy design systemu.
   */
  test: string;
  /**
   * Komenda weryfikująca zawartość instalowalnego artefaktu paczki.
   */
  pack: string;
  /**
   * Komenda publikująca paczkę albo null dla paczki dostępnej wyłącznie w workspace.
   */
  publish: string | null;
}

/**
 * Konfiguracja dostawców CI wykonujących firmowe guardraile.
 */
export interface DesignSystemManifestCi {
  /**
   * Lista platform CI, dla których repozytorium posiada aktywną konfigurację.
   */
  providers: Array<"github-actions" | "gitlab-ci" | "bitbucket-pipelines">;
}

/**
 * Powiązanie paczki z obowiązkowym skillem opisującym konkretny design system.
 */
export interface DesignSystemManifestDesignSystemSkill {
  /**
   * Nazwa skilla konkretnego design systemu zgodna z zasadami nazewnictwa Codex.
   */
  name: string;
  /**
   * Względna ścieżka POSIX do źródłowego katalogu skilla w repozytorium, poza .tmp, używana przez CI niezależnie od publikacji SHARED.
   */
  sourcePath: string;
  /**
   * Wersja paczki, względem której zweryfikowano wiedzę i instrukcje skilla.
   */
  verifiedPackageVersion: string;
  /**
   * Dokładne wersje centralnych kontraktów firmowych zastosowanych i przetłumaczonych na referencje skilla projektowego.
   */
  companyStandardContracts: Array<CompanyStandardContractPin>;
}

/**
 * Maszynowy kontrakt paczki design systemu, jej architektury, dystrybucji i integracji.
 */
export interface DesignSystemManifest {
  /**
   * Ścieżka lub URI schemy używanej przez IDE i narzędzia walidujące manifest.
   */
  $schema?: string;
  /**
   * Wersja struktury manifestu, niezależna od wersji paczki design systemu.
   */
  schemaVersion: 1;
  /**
   * Stały identyfikator odróżniający manifest design systemu od innych manifestów.
   */
  kind: "pleo-design-system";
  /**
   * Identyfikacja produktu, paczki, jej wersji i docelowego rejestru.
   */
  identity: DesignSystemManifestIdentity;
  /**
   * Kanoniczne źródło projektu wizualnego obejmujące cały design system, w tym fundamenty i ewentualne komponenty; jest niezależne od tokenowego sourceOfTruth.
   */
  designSource: DesignSystemManifestDesignSource;
  /**
   * Topologia repozytorium oraz granice pomiędzy design systemem i jego konsumentami.
   */
  repository: DesignSystemManifestRepository;
  /**
   * Sposób udostępniania paczki konsumentom i gotowość do publikacji.
   */
  distribution: DesignSystemManifestDistribution;
  /**
   * Frameworki obsługiwane przez paczkę i ich niezależne publiczne entry pointy.
   */
  frameworks: DesignSystemManifestFrameworks;
  /**
   * Źródło prawdy, generowanie i polityki wykorzystania tokenów design systemu.
   */
  tokens: DesignSystemManifestTokens;
  /**
   * Kontrakt semantic modes light/dark oraz frameworkowego runtime themingu.
   */
  themes: DesignSystemManifestThemes;
  /**
   * Polityka przechowywania i deterministycznego generowania artefaktów builda.
   */
  artifacts: DesignSystemManifestArtifacts;
  /**
   * Publiczne lokalizacje ikon, ilustracji i integracji assetów frameworkowych.
   */
  assets: DesignSystemManifestAssets;
  /**
   * Kontrakt nazw breakpointów, detekcji urządzeń, płynnego skalowania tokenów i opcjonalnego gridu.
   */
  responsive: DesignSystemManifestResponsive;
  /**
   * Środowisko podglądu i dokumentowania elementów design systemu.
   */
  preview: DesignSystemManifestPreview;
  /**
   * Kanoniczne komendy używane lokalnie, przez agenta i w CI.
   */
  commands: DesignSystemManifestCommands;
  /**
   * Konfiguracja dostawców CI wykonujących firmowe guardraile.
   */
  ci: DesignSystemManifestCi;
  /**
   * Powiązanie paczki z obowiązkowym skillem opisującym konkretny design system.
   */
  designSystemSkill: DesignSystemManifestDesignSystemSkill;
  /**
   * Jawnie zatwierdzone odstępstwa od reguł; tylko status active wpływa na walidatory. Nie jest to historia findingów audytu.
   */
  exceptions: Array<Exception>;
}
