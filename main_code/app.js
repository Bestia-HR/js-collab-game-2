// app.js – bieżący stan, wypisywanie komunikatów, eksport i import zapisu.

let stan = stanPoczatkowy();

// Rozszerzenie: historia komend z bieżącej sesji. Nie trafia do zapisu (format zostaje w wersji 1).
let historia = [];

function takNie(wartosc) {
  return wartosc ? "tak" : "nie";
}

function wykonaj(komenda) {
  const przed = stan;
  const wynik = przejscie(przed, komenda);
  stan = wynik.stan;
  console.log(wynik.komunikat);

  const przyjeta = stan !== przed;
  historia.push(`${komenda} – ${przyjeta ? "wykonano" : "odmowa"}`);
  if (!przyjeta) return;

  if (stan.pokoj !== przed.pokoj) console.log(opisPokoju(stan));
  console.log(`Pozostała energia: ${stan.energia}/${ENERGIA_START}`);

  if (stan.wygrana) {
    console.log("WYGRANA! Drzwi otwarte. Możesz wrócić do domu.");
  } else if (stan.koniec) {
    console.log(
      "PRZEGRANA. Zasilanie awaryjne padło. Wpisz gra.start(), aby zagrać ponownie.",
    );
  }
}

function utworzZapis(stanDoZapisu) {
  return JSON.stringify({ wersja: WERSJA_ZAPISU, stan: stanDoZapisu });
}

// Zwraca { ok: true, stan } albo { ok: false, blad }. Nie dotyka bieżącego stanu.
function odczytajZapis(tekst) {
  if (tekst === null) {
    return { ok: false, blad: "Import anulowany." };
  }
  if (typeof tekst !== "string") {
    return { ok: false, blad: "Import przyjmuje tekst JSON (string)." };
  }
  if (tekst.trim() === "") {
    return { ok: false, blad: "Nie podano tekstu do importu." };
  }

  let kandydat;
  try {
    kandydat = JSON.parse(tekst);
  } catch (e) {
    return {
      ok: false,
      blad: `To nie jest poprawny JSON (może tekst jest urwany?): ${e.message}`,
    };
  }

  if (
    kandydat === null ||
    typeof kandydat !== "object" ||
    Array.isArray(kandydat)
  ) {
    return {
      ok: false,
      blad: "Zapis musi być obiektem JSON z polami wersja i stan.",
    };
  }
  if (kandydat.wersja !== WERSJA_ZAPISU) {
    return {
      ok: false,
      blad: `Nieobsługiwana wersja zapisu: ${JSON.stringify(kandydat.wersja)} (oczekiwana: ${WERSJA_ZAPISU}).`,
    };
  }

  const blad = bladStanu(kandydat.stan);
  if (blad) {
    return { ok: false, blad: "Niepoprawny stan: " + blad };
  }

  // Przepisujemy tylko znane pola – obce dodatki z pliku nie trafiają do gry.
  const nowy = {};
  for (const pole of POLA_STANU) nowy[pole] = kandydat.stan[pole];
  return { ok: true, stan: nowy };
}

function pomoc() {
  console.log(
    [
      "Pełne polecenia (to samo co numery):",
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
      "  gra.historia()            – komendy wykonane od otwarcia strony",
      "  gra.menu() / gra.wybierz(n) – menu numerowane (skrót: g() / g(n))",
      "  gra.start()               – nowa gra (reset); gra.reset() działa tak samo",
      "  console.log(gra.eksportuj())                       – pokaż zapis jako tekst JSON",
      '  gra.importuj(prompt("Wklej zawartość postep.json")) – wczytaj zapis',
      "Zasada kosztu: każdy udany ruch i udana akcja kosztują 1 energię.",
      "Odmowy (ściana, brak przedmiotu, nieznana komenda) i podgląd stanu są bezpłatne.",
    ].join("\n"),
  );
}

function pokazStatus() {
  const wynikGry = stan.wygrana
    ? "wygrana"
    : stan.koniec
      ? "przegrana"
      : "w toku";
  console.log(
    [
      `Pokój: ${stan.pokoj} (${nazwaPokoju(stan.pokoj)})`,
      `Energia: ${stan.energia}/${ENERGIA_START}`,
      `Karta: ${takNie(stan.karta)}`,
      `Bezpiecznik w plecaku: ${takNie(stan.bezpiecznik)}`,
      `Zasilanie: ${stan.zasilanie ? "działa" : "nie działa"}`,
      `Stan gry: ${wynikGry}`,
    ].join("\n"),
  );
  return { ...stan };
}

function mapa() {
  const linie = pokoje.map(
    (p) =>
      `${p.id}. ${p.nazwa}${p.id === stan.pokoj ? "  <-- jesteś tutaj" : ""}`,
  );
  console.log(linie.join("\n"));
}

function rozejrzyj() {
  console.log(opisPokoju(stan));
}

function idz(kierunek) {
  if (!KIERUNKI.includes(kierunek)) {
    console.log(
      'Nieznany kierunek. Użyj gra.idz("lewo") lub gra.idz("prawo").',
    );
    return;
  }
  wykonaj(kierunek);
}

function akcja(co) {
  if (!AKCJE.includes(co)) {
    console.log(
      'Nieznana akcja. Dostępne: "karta", "bezpiecznik", "napraw", "wyjdz".',
    );
    return;
  }
  wykonaj(co);
}

// Reset korzysta z fabryki, a nie z wcześniej zmienionego obiektu.
function nowaGra() {
  stan = stanPoczatkowy();
  historia = [];
  console.log(
    `Nowa gra. Zasilanie awaryjne wystarczy na ${ENERGIA_START} tur.`,
  );
  rozejrzyj();
}

// Tylko zwraca tekst – nie zapisuje pliku, schowka ani storage.
function eksportuj() {
  return utworzZapis(stan);
}

function importuj(tekst) {
  const wynik = odczytajZapis(tekst);
  if (!wynik.ok) {
    console.log(`Import odrzucony. ${wynik.blad} Stan gry bez zmian.`);
    return false;
  }
  stan = wynik.stan;
  historia.push("import – wykonano");
  console.log("Zapis wczytany.");
  pokazStatus();
  return true;
}

function pokazHistorie() {
  if (historia.length === 0) {
    console.log("Historia jest pusta.");
    return;
  }
  console.log(historia.map((wpis, i) => `${i + 1}. ${wpis}`).join("\n"));
}

// Eksport z menu: wypisuje surowy JSON, gotowy do skopiowania do pliku.
// Nie zwraca tekstu, żeby konsola nie pokazała go drugi raz w cudzysłowie.
function pokazEksport() {
  console.log(
    "Skopiuj samą linię poniżej do Notatnika i zapisz jako postep.json:",
  );
  console.log(eksportuj());
}

function wczytajZOkna() {
  return importuj(prompt("Wklej zawartość postep.json"));
}

// Menu numerowane – skrót do tych samych funkcji co gra.idz / gra.akcja / itd.
// Numery to tylko interfejs aplikacji; silnik nadal dostaje zwykłe komendy.
const MENU = [
  { opis: "idź w lewo", uruchom: () => idz("lewo") },
  { opis: "idź w prawo", uruchom: () => idz("prawo") },
  { opis: "weź kartę dostępu (Recepcja)", uruchom: () => akcja("karta") },
  { opis: "weź bezpiecznik (Magazyn)", uruchom: () => akcja("bezpiecznik") },
  {
    opis: "zamontuj bezpiecznik (Serwerownia)",
    uruchom: () => akcja("napraw"),
  },
  { opis: "otwórz drzwi (Wyjście)", uruchom: () => akcja("wyjdz") },
  { opis: "rozejrzyj się", uruchom: rozejrzyj },
  { opis: "status", uruchom: pokazStatus },
  { opis: "mapa", uruchom: mapa },
  { opis: "historia komend", uruchom: pokazHistorie },
  { opis: "zapisz postęp (pokaż tekst JSON)", uruchom: pokazEksport },
  { opis: "wczytaj postęp (okno do wklejenia)", uruchom: wczytajZOkna },
  { opis: "nowa gra", uruchom: nowaGra },
];

function pokazMenu() {
  const linie = MENU.map(
    (poz, i) => `  g(${i + 1})${i + 1 < 10 ? " " : ""}  – ${poz.opis}`,
  );
  console.log(
    [
      "MENU – wpisz g(numer) i Enter, np. g(2). Samo g() pokazuje to menu.",
      ...linie,
    ].join("\n"),
  );
}

// Opakowanie poleceń gracza: czyści konsolę, pokazuje menu, a pod nim wynik polecenia.
function poKomendzie(funkcja) {
  return (...argumenty) => {
    console.clear();
    pokazMenu();
    return funkcja(...argumenty);
  };
}

// Samo g() nic więcej nie robi – menu pokazuje już poKomendzie.
function wybierz(numer) {
  if (numer === undefined) return;
  const n = Number(numer);
  if (!Number.isInteger(n) || n < 1 || n > MENU.length) {
    console.log(
      `Nie ma pozycji ${JSON.stringify(numer)}. Wybierz numer od 1 do ${MENU.length} albo wpisz g(), aby zobaczyć menu.`,
    );
    return;
  }
  return MENU[n - 1].uruchom();
}

window.g = poKomendzie(wybierz);

window.gra = {
  pomoc: poKomendzie(pomoc),
  status: poKomendzie(pokazStatus),
  mapa: poKomendzie(mapa),
  rozejrzyj: poKomendzie(rozejrzyj),
  idz: poKomendzie(idz),
  akcja: poKomendzie(akcja),
  start: poKomendzie(nowaGra),
  reset: poKomendzie(nowaGra),
  eksportuj: poKomendzie(eksportuj),
  importuj: poKomendzie(importuj),
  historia: poKomendzie(pokazHistorie),
  menu: poKomendzie(() => {}),
  wybierz: window.g,
};

console.log(
  `UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na ${ENERGIA_START} tur.`,
);

// Na starcie tylko menu numerowane; pełna lista poleceń jest pod gra.pomoc().
pokazMenu();

console.log(
  "Każdy udany ruch i akcja kosztują 1 energię, odmowy są bezpłatne. Pełna lista poleceń: gra.pomoc()",
);

rozejrzyj();
