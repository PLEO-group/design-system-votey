# Ręczna instancjacja Angulara w testach

## Kiedy stosować

Ta referencja dotyczy testów, które tworzą instancję przez `new Component()`
w `runInInjectionContext` z ręcznie skonfigurowanym injectorem, bez fixture
`TestBed`. Nie stosuj jej automatycznie do wszystkich komponentów z `effect()`,
wszystkich bibliotek ani całego repozytorium. Jeden projekt może mieć oba modele
harnessu; klasyfikuj konkretny test i jego helper.

## Wybór środowiska

- Jeśli test używa `TestBed` i fixture, zachowaj istniejący setup runnera oraz
  Angulara. Nie dodawaj własnego schedulera tylko dlatego, że komponent ma efekt.
- Jeśli test ręcznie tworzy komponent, ustal, czy sprawdza wyłącznie logikę klasy,
  czy także efekty, cykl życia, sygnałowe inputy i template. Goły `Injector.create()`
  zapewnia tylko zadeklarowane zależności; `runInInjectionContext` udostępnia kontekst
  DI, lecz nie tworzy pełnego środowiska komponentu.
- Przy brakującym providerze wymaganym przez poprawny komponent dostosuj helper
  testowy. Dla zachowania zależnego od Angulara preferuj istniejący helper fixture
  lub kompletny setup testowy zgodny z zainstalowaną wersją Angulara. Nie usuwaj
  poprawnego efektu z komponentu wyłącznie w celu dopasowania go do ubogiego injectora.

## Efekty i scheduler

`effect()` rejestrowany podczas konstrukcji może wymagać Angularowego
`ChangeDetectionScheduler` oraz innych usług środowiska. Nie zakładaj, że pojedynczy
provider lub samo `provideZonelessChangeDetection()` uzupełni dowolny ręczny injector.
Sprawdź istniejący setup i wymagania faktycznie zainstalowanej wersji Angulara.

Nie traktuj dodania pustego mocka `notify()` ani samego braku wyjątku konstruktora
jako dowodu działania efektu. Gdy test ma sprawdzać efekt, uruchom jego wykonanie
mechanizmem właściwym dla harnessu i wersji Angulara, sprawdź obserwowalne zachowanie
oraz posprzątaj fixture/injector. Stub infrastruktury jest dopuszczalny w izolowanym
teście logiki klasy, ale taki test nie potwierdza efektów ani cyklu życia komponentu.

## Testy paczki i świeżość artefaktu

Oddziel runner od źródła importu: również `node:test` może korzystać z `TestBed`.
Jeśli test importuje publiczny entry point paczki wskazujący na `dist`, ustal, czy
bada aktualnie zbudowany artefakt. Po zmianie źródła komponentu potrzebny jest
właściwy build paczki przed weryfikacją jego zachowania. Zmiana wyłącznie testu lub
helpera nie wymaga ponownego builda, jeśli istniejący artefakt jest aktualny.
Nie deklaruj weryfikacji zmienionego źródła na podstawie testu starego bundle'a.
