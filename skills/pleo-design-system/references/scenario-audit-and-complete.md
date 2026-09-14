# Audyt DS i przejście do remediacji

## Baseline

Uruchom discovery, walidatory manifestów i guardraile w trybie raportowym. Sklasyfikuj każdy wynik jako `BLOCK`, `REVIEW_REQUIRED` albo `WARN`.

Sprawdź co najmniej:

- strukturę paczki i możliwość skalowania do wielu repozytoriów;
- Figma Variables i pipeline Style Dictionary;
- warstwy core/semantic, light/dark jako tryby semantyczne, typografię i spacing;
- osobne polityki Angular/React;
- assety jako file-name-driven pipeline, generowane typy/registry/framework exports, publiczne API, preview, build i testy;
- SemVer, release i artifact policy;
- manifest DS, manifesty konsumentów oraz skill DS z `references/tokens.md`, `references/svg-assets.md`, `references/responsiveness.md` i dla Angulara `references/theming.md`;
- lokalne mini-DS-y u konsumentów.

## Raport audytu

Zapisz stan zastany, elementy zgodne, dowody i rozbieżności w `.tmp/design-system-audit.md`. Raport może zawierać priorytety i kierunki remediacji, ale nie szczegółową checklistę implementacji ani pola akceptacji etapów.

Nie twórz brakujących manifestów, generatorów ani guardraili w trybie audytu. Ich brak jest findingiem.

## Przejście do remediacji

Jeżeli raport zawiera co najmniej jeden `BLOCK`, obowiązkowo utwórz draft `design-system-implementation` i podlinkuj raport źródłowy. Samo utworzenie planu nie pozwala na mutację. Dopiero tam podziel naprawy na małe etapy o mierzalnym wyniku. Dla każdego zapisz zakres, pliki, ryzyka, rollback, walidację i zależności. Wymagaj osobnej akceptacji każdego etapu. Bez `BLOCK` plan remediacji powstaje tylko na jawne żądanie użytkownika.

Jeżeli DS ma istniejących konsumentów, plan remediacji musi zawierać etapy `contract-stabilization` i `consumer-migration-plan-generation`. Po stabilizacji i zbudowaniu candidate wygeneruj — dopiero po osobnej zgodzie użytkownika — po jednym planie `<application-root>/.tmp/design-system-consumer-migration.md` dla każdego konsumenta. Zrób to przed publikacją finalnego release’u, zgodnie z `consumer-migration-after-remediation.md`.

Nie włączaj wszystkich nowych blokerów jednocześnie. Najpierw usuń istniejące naruszenia danego guardraila, następnie aktywuj go w CI.

Finding `REVIEW_REQUIRED` sklasyfikuj po decyzji dewelopera skonsultowanej z szefem:

- potwierdzone naruszenie: zapisz decyzję w raporcie, a remediation dopiero w osobnym planie; jeżeli reguła jest jednoznaczna i powtarzalna, zaplanuj deterministyczny guardrail zamiast wpisu historycznego do manifestu;
- aktywne, czasowo zaakceptowane odstępstwo od standardu: zapisz decyzję w raporcie; aktualizację `exceptions` właściwego manifestu wykonaj dopiero w zaakceptowanym trybie implementacji;
- element domenowy lub false positive: zapisz decyzję w raporcie; trwałą, wąską konfigurację/baseline dodaj dopiero w implementacji i tylko wtedy, gdy skaner bez niej ponownie zgłaszałby to samo.

Nie używaj manifestu jako historii wszystkich findingów audytu. Sam finding nie staje się blokerem przez zapis w manifeście; o klasyfikacji decyduje potwierdzona reguła, a manifest przechowuje wyłącznie aktywny kontrakt i wyjątki potrzebne maszynom.

