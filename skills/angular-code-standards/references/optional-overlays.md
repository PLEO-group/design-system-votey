# Opcjonalne nakładki zależne od geometrii DOM

Przypadek do sekcji [Zakres obserwacji i pomiary DOM](initialization-and-effects.md#zakres-obserwacji-i-pomiary-dom).

- Delegowane listenery potrzebne wyłącznie opcjonalnej nakładce rejestruj po jej włączeniu. Powiąż odłączenie z `onCleanup` efektu, aby wyłączenie opcji lub zmiana obserwowanego kontenera usuwały poprzednie listenery.
- Jeśli zmiana rozmiaru jednego elementu może przesunąć sąsiadów, traktuj powiadomienie obserwatora jako sygnał do ponownego pomiaru całego zależnego rzędu. Porównaj pozycje z poprzednim pomiarem i zapisuj nową tablicę do sygnału tylko po zmianie pozycji.
