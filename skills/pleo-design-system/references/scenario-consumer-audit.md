# Audyt konsumenta design systemu

1. Ustal dokładny application root, framework, paczkę, zainstalowaną wersję i odpowiadający skill projektowy.
2. Utwórz `.tmp/design-system-consumer-audit.md`; nie używaj planu implementacji.
3. Odczytaj manifest konsumenta, a przy jego braku zapisz finding. Nie twórz manifestu w trybie audytu.
4. Zweryfikuj wyłącznie publiczne API zainstalowanej wersji paczki.
5. Sprawdź instalację, importy, style/tokeny, theme bootstrap, asset copy/registry, responsive/grid, lokalne UI/mini-DS oraz build/test/runtime smoke.
6. Sklasyfikuj dostępne dowody jako elementy zgodne, `BLOCK`, `REVIEW_REQUIRED` albo `WARN`. Jeśli brakuje dostępu do części zakresu, ustaw `awaiting-input`, przerwij i poproś o dostęp.
7. Zakończ konkluzją o stanie integracji i rekomendowanymi kierunkami, nie checklistą zmian.
8. Jeżeli raport zawiera dowolny `BLOCK`, obowiązkowo utwórz draft planu naprawczego bez wykonywania zmian: `design-system-introduction` w repo aplikacji dla blokerów konsumenta, `design-system-implementation` w repo DS dla blokerów paczki albo oba plany ze wspólnym `runId`, gdy występują oba rodzaje.

Nie rozszerzaj audytu konsumenta na pełny audyt repozytorium DS bez jawnej zmiany trybu.
