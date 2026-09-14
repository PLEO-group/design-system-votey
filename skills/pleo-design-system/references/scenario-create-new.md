# Tworzenie nowego design systemu

Utwórz `.tmp/design-system-implementation.md`. Zapisuj w nim architekturę docelową, decyzje, pliki, etapy i akceptacje; nie formatuj go jak raport stanu zastanego.

1. Utwórz niezależne repo/paczkę npm. Default nazwy: `@pleodigital/design-system-<product>`. Default registry: publiczne npmjs.
2. Utwórz manifest DS przed kodem i wypełnij go podczas discovery.
3. Pozyskaj Figma Variables przez właściwy skill `figma`. Brak Figmy jest jawnym wyjątkiem wymagającym alternatywnego źródła tokenów.
4. Zbuduj Style Dictionary, firmowy kontrakt nazw, warstwy core/semantic oraz light/dark jako tryby semantycznych tokenów zależnych od motywu; dodaj typografię i spacing.
5. Wystaw osobne kontrakty `/angular` i `/react` tylko dla wybranych frameworków. Nie publikuj osobnego `/tokens`.
6. Dodaj ikony i ilustracje przez source-driven pipeline z `svg-asset-pipeline.md`; nazwy plików mają generować typy, Angular Registry, React exports i preview bez ręcznych list.
7. Dodaj responsywność, opcjonalny grid i Angular theming zgodnie z manifestem. Użyj właściwego adaptera/providera gridu oraz jawnego ThemeService z `angular-grid-and-theming.md`; nie łącz gridu device z gridem media-query.
8. Dodaj Storybook albo preview, testy i build.
9. Dodaj SemVer, conventional commits, release notes i CI dla wybranego providera.
10. Utwórz skill konkretnego DS przy użyciu `skill-creator` oraz kontraktu domenowego, w tym obowiązkowe `references/tokens.md`, `references/svg-assets.md`, `references/responsiveness.md` i dla Angulara `references/theming.md`.
11. Dodaj paczkę do centralnego rejestru. Publikuj globalny skill dopiero po osobnym potwierdzeniu.
12. Dla każdego konsumenta utwórz manifest i osobną instrukcję integracji.

Komponenty są drugą warstwą i nie są wymagane, jeśli manifest ich nie deklaruje.

