# Tłumaczenia — proces i integracje

Jeżeli po handoffie użytkownik prosi o kompletne query, INSERT, UPSERT albo
migrację tłumaczeń dla GoCouriers, wczytaj
`skills/gocouriers-translation-query/SKILL.md`. Ten skill pozostaje właścicielem
generowania wielojęzycznego SQL i jego walidacji; nie rozszerzaj zasad Angulara o
schemat bazy ani samodzielnie nie stosuj angielskich fallbacków.


Jeżeli projekt ma potwierdzony proces dodawania tłumaczeń przez osobne UI, CMS albo panel administracyjny, pełny nowy klucz użyty w kodzie nie musi jeszcze istnieć w słownikach trzymanych w repo. Traktuj listę kluczy z polskimi tekstami przekazaną użytkownikowi jako prawidłowy handoff do tego procesu.

W takim projekcie nie klasyfikuj samego braku wpisu słownikowego jako blockera implementacji, błędu runtime ani findingu blokującego code review lub publikację skilla. Nie wymagaj też dopisania wpisu do repo w tym samym zadaniu. Zgłoś brak wyłącznie informacyjnie w formacie wymaganym niżej. Blocker występuje dopiero wtedy, gdy projekt nie ma potwierdzonego zewnętrznego procesu uzupełniania tłumaczeń albo użytkownik jawnie wymaga kompletnego słownika przed wdrożeniem.


Dla błędów numerycznych z backendu używaj klasycznego wzorca `ERRORS.<numer>` i również wypisz brakujące tłumaczenia zamiast dopisywać je samodzielnie do plików i18n.
