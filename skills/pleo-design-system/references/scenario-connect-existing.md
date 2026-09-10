# Podłączenie istniejącego design systemu

Warunek wstępny: źródłowy DS ma poprawny `design-system.manifest.json` w kanonicznej lokalizacji. Zweryfikuj go read-only przed utworzeniem artefaktu introduction. Jeśli manifestu nie ma albo jest niepoprawny, zatrzymaj ten scenariusz i zaproponuj osobny audyt lub implementację/remediację DS.

Po przejściu warunku utwórz `.tmp/design-system-introduction.md`. Jest to plan integracji konkretnej paczki z aplikacją, a nie raport audytu całego DS ani ogólny plan jego przebudowy.

1. Wykryj paczkę, wersję, registry i framework konsumenta.
2. Rozwiąż skill DS przez `scripts/resolve-design-system-skill.mjs` i centralny rejestr.
3. Jeśli skill nie istnieje albo jest nieaktualny, zatrzymaj introduction i skieruj naprawę do osobnego `design-system-implementation`; introduction nie modyfikuje repo ani kontraktu paczki.
4. Odczytaj publiczne entry pointy i artefakty z zainstalowanej wersji paczki.
5. Utwórz projekt manifestu konsumenta. Nie wpisuj ścieżek ani providerów, których nie potwierdzono w paczce.
6. Zaplanuj instalację, style/tokeny, theme, assety, runtime, publiczne importy i instrukcję integracji.
7. Wdróż każdy etap dopiero po jego osobnej akceptacji.
8. Uruchom validator konsumenta, build/test oraz runtime smoke test.
9. Jeżeli nowy konsument wymaga aktualizacji skilla DS, przygotuj osobny `design-system-implementation` w repo paczki; nie zmieniaj skilla DS w introduction.

Nie kopiuj źródeł tokenów, komponentów ani SVG z paczki do aplikacji. Lokalny wrapper może składać API DS w domenowy element, ale nie może odtwarzać komponentu DS.

