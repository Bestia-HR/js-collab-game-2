// app.js — warstwa konsoli: przyjmuje polecenia, woła silnik z engine.js i pokazuje wynik.
// Reguły gry są tylko w engine.js (funkcja przejscie).

let stan = nowyStan();

function takNie(wartosc) {
  return wartosc ? "tak" : "nie";
}

// Jedno miejsce, w którym aplikacja wykonuje komendę przez silnik i pokazuje wynik
function wykonaj(komenda) {
  const przed = stan;
  const wynik = przejscie(przed, komenda);
  stan = wynik.stan;
  console.log(wynik.komunikat);

  // Odrzucona komenda nie kosztuje energii, więc nie ma nic więcej do pokazania
  if (stan.energia === przed.energia) return;

  if (stan.pokoj !== przed.pokoj) console.log(opisPokoju(stan));
  console.log(`Pozostała energia: ${stan.energia}/${ENERGIA_START}`);

  if (stan.wygrana) {
    console.log("WYGRANA! Drzwi otwarte. Możesz wrócić do domu.");
  } else if (stan.koniec) {
    console.log("PRZEGRANA. Zasilanie awaryjne padło. Wpisz gra.reset(), aby zagrać ponownie.");
  }
}

// Polecenia konsolowe zgrupowane w jednym obiekcie
const gra = {
  pomoc() {
    console.log([
      "Polecenia (wpisuj w konsoli):",
      "  gra.pomoc()               – ta lista",
      "  gra.status()              – pokój, energia, przedmioty, stan gry",
      "  gra.mapa()                – mapa korytarza",
      "  gra.rozejrzyj()           – opis pomieszczenia",
      '  gra.idz("lewo")           – ruch w lewo',
      '  gra.idz("prawo")          – ruch w prawo',
      '  gra.akcja("karta")        – weź kartę dostępu (Recepcja)',
      '  gra.akcja("bezpiecznik")  – weź bezpiecznik (Magazyn)',
      '  gra.akcja("napraw")       – zamontuj bezpiecznik (Serwerownia)',
      '  gra.akcja("wyjdz")        – otwórz drzwi (Wyjście, potrzebna karta i zasilanie)',
      "  gra.reset()               – nowa gra",
      "  gra.eksport()             – zwraca zapis gry jako tekst JSON",
      "  gra.importuj()            – wczytuje zapis (otwiera okno do wklejenia tekstu)",
      "Zasada kosztu: każdy udany ruch i udana akcja kosztują 1 energię.",
      "Błędy (ściana, brak przedmiotu, nieznana komenda) i podgląd stanu są bezpłatne."
    ].join("\n"));
  },

  status() {
    const wynikGry = stan.wygrana ? "wygrana" : stan.koniec ? "przegrana" : "w toku";
    console.log(`Pokój: ${stan.pokoj} (${nazwaPokoju(stan.pokoj)})`);
    console.log(`Energia: ${stan.energia}/${ENERGIA_START}`);
    console.log(`Karta: ${takNie(stan.karta)}`);
    console.log(`Bezpiecznik w plecaku: ${takNie(stan.bezpiecznik)}`);
    console.log(`Zasilanie: ${stan.zasilanie ? "działa" : "nie działa"}`);
    console.log(`Stan gry: ${wynikGry}`);
  },

  mapa() {
    for (const p of pokoje) {
      let linia = `${p.id}. ${p.nazwa}`;
      if (p.id === stan.pokoj) linia += "  <-- jesteś tutaj";
      console.log(linia);
    }
  },

  rozejrzyj() {
    console.log(opisPokoju(stan));
  },

  idz(kierunek) {
    if (!KIERUNKI.includes(kierunek)) {
      console.log('Nieznany kierunek. Użyj gra.idz("lewo") lub gra.idz("prawo").');
      return;
    }
    wykonaj(kierunek);
  },

  akcja(co) {
    if (!AKCJE.includes(co)) {
      console.log('Nieznana akcja. Dostępne: "karta", "bezpiecznik", "napraw", "wyjdz".');
      return;
    }
    wykonaj(co);
  },

  reset() {
    stan = nowyStan();
    console.log(`Nowa gra. Zasilanie awaryjne wystarczy na ${ENERGIA_START} tur.`);
    gra.rozejrzyj();
  },

  // Zwraca tekst JSON. Nie zapisuje pliku: użytkownik kopiuje tekst do edytora.
  eksport() {
    const tekst = utworzZapis(stan);
    console.log("Skopiuj poniższą linię do edytora (np. Notatnika) i zapisz jako plik .json:");
    console.log(tekst);
    return tekst;
  },

  // Bez argumentu otwiera okno prompt. Stan jest podmieniany dopiero po sprawdzeniu całości.
  importuj(tekst) {
    if (tekst === undefined) {
      tekst = prompt("Wklej zawartość pliku z zapisem (tekst JSON):");
    }
    const wynik = odczytajZapis(tekst);
    if (!wynik.ok) {
      console.log(`Import odrzucony. ${wynik.blad} Stan gry bez zmian.`);
      return;
    }
    stan = wynik.stan;
    console.log("Zapis wczytany.");
    gra.status();
  }
};

console.log(`UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na ${ENERGIA_START} tur.`);
gra.pomoc();
gra.rozejrzyj();
