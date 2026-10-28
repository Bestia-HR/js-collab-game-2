# Ucieczka z serwerowni 2

Tekstowa gra w konsoli przeglądarki. Bez instalacji, serwera, Node i localStorage.

## Uruchomienie

1. Otwórz `main_code/index.html` dwuklikiem (Chrome, Edge lub Firefox).
2. Otwórz konsolę: **F12 → zakładka Console**.
3. Wpisz `gra.pomoc()`, aby zobaczyć listę poleceń.

## Cel gry

Masz 10 jednostek energii. Korytarz ma cztery pokoje: 1 Recepcja, 2 Magazyn, 3 Serwerownia, 4 Wyjście.

1. W Recepcji weź kartę: `gra.akcja("karta")`.
2. W Magazynie weź bezpiecznik: `gra.akcja("bezpiecznik")`.
3. W Serwerowni zamontuj go: `gra.akcja("napraw")` – bezpiecznik zostaje zużyty, wraca zasilanie.
4. Przy Wyjściu otwórz drzwi: `gra.akcja("wyjdz")` – potrzebujesz karty i zasilania.

Każdy udany ruch i każda udana akcja kosztują 1 energię. Odmowa (ściana, brak przedmiotu, nieznana komenda) nic nie kosztuje. Gdy energia spadnie do 0 bez wygranej – przegrywasz. Wygrana na ostatniej energii jest wygraną. Po końcu gry ruchy i akcje nic nie zmieniają; działają `gra.start()` i eksport.

## Szybkie sterowanie numerami

Zamiast pisać pełne polecenia, wpisz w konsoli `g(numer)` i naciśnij Enter. Samo `g()` pokazuje menu.

| Numer | Działanie |
|---|---|
| `g(1)` / `g(2)` | idź w lewo / w prawo |
| `g(3)` | weź kartę (Recepcja) |
| `g(4)` | weź bezpiecznik (Magazyn) |
| `g(5)` | zamontuj bezpiecznik (Serwerownia) |
| `g(6)` | otwórz drzwi (Wyjście) |
| `g(7)` | rozejrzyj się |
| `g(8)` | status |
| `g(9)` | mapa |
| `g(10)` | historia komend |
| `g(11)` | zapisz postęp – wypisuje tekst JSON do skopiowania |
| `g(12)` | wczytaj postęp – otwiera okno do wklejenia JSON |
| `g(13)` | nowa gra |

Cała gra numerami: `g(3)`, `g(2)`, `g(4)`, `g(2)`, `g(5)`, `g(2)`, `g(6)`.

Po każdym poleceniu (`g(...)` i `gra.*`) konsola jest czyszczona, na górze zawsze jest menu, a pod nim wynik ostatniego polecenia. Jeśli w ustawieniach DevTools włączone jest „Preserve log”, przeglądarka nie czyści konsoli – wyłącz tę opcję.

Wskazówka: strzałka ↑ w konsoli przywołuje poprzednie polecenie – wystarczy zmienić numer.
Konsola przeglądarki nie pozwala uruchamiać kodu kliknięciem w wypisany tekst, dlatego sterowanie odbywa się numerami.
`g` to skrót do `gra.wybierz(n)`, a `gra.menu()` pokazuje menu. Numery to tylko warstwa aplikacji – silnik nadal dostaje zwykłe komendy (`lewo`, `karta`…), więc reguły i format zapisu się nie zmieniły.

## Polecenia

| Polecenie | Działanie |
|---|---|
| `gra.pomoc()` | lista poleceń |
| `gra.status()` | pokój, energia, przedmioty, stan gry (zwraca też kopię stanu) |
| `gra.mapa()` | mapa korytarza z Twoją pozycją |
| `gra.rozejrzyj()` | opis pomieszczenia |
| `gra.idz("lewo")` / `gra.idz("prawo")` | ruch |
| `gra.akcja("karta" \| "bezpiecznik" \| "napraw" \| "wyjdz")` | akcja |
| `gra.start()` (alias `gra.reset()`) | nowa gra |
| `gra.eksportuj()` | zwraca tekst JSON z zapisem |
| `gra.importuj(tekst)` | wczytuje zapis; zwraca `true` albo `false` |
| `gra.historia()` | komendy wykonane od otwarcia strony (rozszerzenie) |

## Zapis postępu na pendrivie – krok po kroku

Gra **nie zapisuje niczego sama**. Zapis to tekst, który przenosisz ręcznie.

### Eksport (zapisanie postępu)

1. W konsoli wpisz:
   ```js
   console.log(gra.eksportuj())
   ```
2. Konsola wypisze jedną linię zaczynającą się od `{"wersja":1,"stan":{...`. Zaznacz **całą tę linię** i skopiuj (Ctrl+C).
   Nie kopiuj nic więcej – ani `>` z wiersza poleceń, ani `undefined` pod spodem.
3. Otwórz Notatnik (lub inny edytor tekstu), wklej (Ctrl+V).
4. Zapisz plik jako `postep.json` na pendrivie (w Notatniku: Plik → Zapisz jako, typ „Wszystkie pliki”, kodowanie UTF-8).

### Import (wczytanie postępu)

1. Otwórz `index.html` (np. na innym komputerze albo po odświeżeniu strony – gra zaczyna wtedy od nowa).
2. Otwórz `postep.json` w Notatniku, zaznacz całość (Ctrl+A) i skopiuj (Ctrl+C).
3. W konsoli przeglądarki wpisz:
   ```js
   gra.importuj(prompt("Wklej zawartość postep.json"))
   ```
4. W okienku, które się pojawi, wklej **sam tekst JSON** (bez `gra.importuj` i bez dodatkowych apostrofów) i kliknij OK.
5. Konsola wypisze „Zapis wczytany.” i aktualny status. Funkcja zwraca `true`.

Można też podać tekst bezpośrednio: `gra.importuj('{"wersja":1,"stan":{...}}')`.

### Kiedy import zostanie odrzucony

Import zwraca `false`, wypisuje powód i **nie zmienia bieżącej gry**, gdy:

- kliknięto Anuluj w okienku albo nie wpisano tekstu,
- tekst nie jest poprawnym JSON (np. jest urwany),
- `wersja` jest inna niż 1,
- w stanie brakuje pola, pole ma zły typ (np. `"energia": "5"`) lub wartość spoza zakresu (pokój spoza 1–4, energia spoza 0–10),
- dane są sprzeczne: bezpiecznik jednocześnie w plecaku i zamontowany; wygrana poza Wyjściem lub bez karty/zasilania; `koniec` nie odpowiada wygranej albo energii 0.

Dodatkowe, nieznane pola w pliku są pomijane – do gry trafia tylko siedem znanych pól.

## Format zapisu (wersja 1)

```json
{"wersja":1,"stan":{"pokoj":1,"energia":10,"karta":false,"bezpiecznik":false,"zasilanie":false,"koniec":false,"wygrana":false}}
```

## Budowa kodu

| Plik | Odpowiedzialność |
|---|---|
| `main_code/engine.js` | stałe, kolekcja `pokoje`, `stanPoczatkowy()`, `przejscie(stanPrzed, komenda)`, `czyStan(wartosc)` / `bladStanu(wartosc)`. Nie wypisuje tekstu i nie zmienia wejścia. |
| `main_code/app.js` | bieżący `stan`, wypisywanie komunikatów, eksport i import tekstu, obiekt `window.gra`. |
| `main_code/index.html` | ładuje `engine.js`, potem `app.js` (zwykłe skrypty z `defer`). |

Gdzie co się dzieje:

- **decyzja** (czy komenda jest dozwolona, ile kosztuje, czy to koniec gry) – `przejscie()` w `engine.js`,
- **zmiana stanu** – jedno przypisanie `stan = wynik.stan` w `wykonaj()` oraz w `importuj()` i `nowaGra()` w `app.js`,
- **wypisywanie tekstu** – wyłącznie `app.js` (`console.log`).

Podział plików nie izoluje zmiennych – oba skrypty współdzielą globalne środowisko strony. `gra` to umowa, jak korzystać z kodu, a nie zabezpieczenie.

## Rozszerzenie: historia komend

`gra.historia()` pokazuje ponumerowaną listę komend z bieżącej sesji z informacją „wykonano” / „odmowa” (oraz udane importy). `gra.start()` czyści historię.

- **Kryterium:** po `gra.idz("lewo")` na starcie i `gra.akcja("karta")` historia ma 2 wpisy: `lewo – odmowa`, `karta – wykonano`.
- **Wpływ na zapis:** brak. Historia żyje tylko w `app.js`, nie jest częścią stanu gry ani pliku, więc format zostaje w wersji 1, a walidator się nie zmienił. Po odświeżeniu strony historia jest pusta.

## Dokumenty

- [TESTY.md](TESTY.md) – próby odbioru z wynikami,
- [DECYZJA_TECHNICZNA.md](DECYZJA_TECHNICZNA.md) – decyzja z rozważoną alternatywą,
- [RETRO.md](RETRO.md) – do uzupełnienia przez zespół po zakończeniu pracy.
