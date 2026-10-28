# Decyzja techniczna zespołu

**Pytanie: co zrobić, gdy w pliku z zapisem ktoś dopisze pole, którego gra nie zna?**

Przykład: w `postep.json` oprócz normalnych danych jest `"hack": 1`.

- **Problem:** plik z zapisem można otworzyć w Notatniku i coś w nim dopisać. Gra musi wiedzieć, co wtedy zrobić.
- **Czego nie możemy zmienić:** nie mamy serwera ani zapisu w przeglądarce. Wczytywanie musi przyjąć cały zapis albo nic, a obce dane nie mogą trafić do gry.
- **Wariant A – odrzucić cały zapis.** Plusy: bardzo ostro pilnujemy danych. Minus: jeden dopisany drobiazg i gracz traci cały postęp, chociaż reszta zapisu jest dobra.
- **Wariant B – pominąć nieznane pole.** Gra sprawdza wszystkie potrzebne pola, a potem przepisuje do siebie tylko te 7, które zna. Minus: gracz nie dostanie informacji, że coś dopisał.
- **Krótka próba:** wczytaliśmy dobry zapis z dodatkiem `"hack": 1`.
  - W wariancie A gra odrzuciłaby zapis.
  - W wariancie B zapis się wczytał, a pola `hack` w grze nie ma.
  - Inne błędy (zła wersja, tekst zamiast liczby, pokój 99) w obu wariantach są odrzucane tak samo.
- **Wybraliśmy wariant B**, bo:
  - tak każe instrukcja 02_TECH („przepiszcie tylko znane pola”),
  - spełnia test z 03_PROWADZENIE („obce pole nie staje się częścią stanu”),
  - gracz nie traci postępu przez coś, co i tak nic nie psuje.
- **Kiedy wrócimy do tej decyzji:** gdy zmienimy format zapisu na wersję 2 (np. gdyby historia komend miała trafić do pliku). Wtedy nieznane pole może znaczyć „plik z nowszej wersji gry” i warto o tym napisać graczowi.
- **Co trzeba było zmienić:**
  - `engine.js` – sprawdzanie stanu nie wyrzuca błędu za dodatkowe pola,
  - `app.js` – przy wczytywaniu przepisujemy tylko 7 znanych pól,
  - README – opis, kiedy zapis zostanie odrzucony,
  - TESTY.md – test nr 12.

## Na co się umówiliśmy (przypomnienie)

- **Stan gry** to obiekt z 7 polami: `pokoj`, `energia`, `karta`, `bezpiecznik`, `zasilanie`, `koniec`, `wygrana`.
- **Pokoje** 1–4 są w tablicy: Recepcja, Magazyn, Serwerownia, Wyjście.
- **Funkcja reguł** `przejscie(stan, komenda)` dostaje stan i komendę, a oddaje nowy stan i komunikat. Niczego nie wypisuje.
- **Komendy:** `lewo`, `prawo`, `karta`, `bezpiecznik`, `napraw`, `wyjdz`.
- **Polecenia w konsoli:** `gra.idz`, `gra.akcja`, `gra.status`, `gra.mapa`, `gra.start`, `gra.eksportuj`, `gra.importuj` oraz skróty `g(1)`…`g(13)`.
- **Zapis:** `{"wersja": 1, "stan": {...}}`.
