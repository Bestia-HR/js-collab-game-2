// engine.js — model i reguły gry.
// Ten plik niczego nie wypisuje: funkcje przyjmują dane i zwracają wynik.
// Wypisywaniem w konsoli zajmuje się app.js.

const WERSJA_ZAPISU = 1;
const ENERGIA_START = 10;

// Kolekcja pomieszczeń (kolejność = korytarz od lewej do prawej)
const pokoje = [
  { id: 1, nazwa: "Recepcja", opis: "Jesteś w recepcji." },
  { id: 2, nazwa: "Magazyn", opis: "Jesteś w magazynie." },
  { id: 3, nazwa: "Serwerownia", opis: "Jesteś w serwerowni." },
  { id: 4, nazwa: "Wyjście", opis: "Jesteś przy drzwiach wyjściowych." }
];

const KIERUNKI = ["lewo", "prawo"];
const AKCJE = ["karta", "bezpiecznik", "napraw", "wyjdz"];
const POLA_STANU = ["pokoj", "energia", "karta", "bezpiecznik", "zasilanie", "koniec", "wygrana"];

function znajdzPokoj(numer) {
  return pokoje.find(p => p.id === numer);
}

function nazwaPokoju(numer) {
  const p = znajdzPokoj(numer);
  return p ? p.nazwa : "Brak pokoju";
}

// Fabryka stanu: zawsze zwraca nowy obiekt na start gry
function nowyStan() {
  return {
    pokoj: 1,
    energia: ENERGIA_START,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false
  };
}

// Opis pomieszczenia zależny od stanu przedmiotów (zwraca tekst, nie wypisuje)
function opisPokoju(stan) {
  const p = znajdzPokoj(stan.pokoj);
  if (!p) return "Nieznane pomieszczenie.";

  let tekst = p.opis;
  switch (stan.pokoj) {
    case 1:
      if (!stan.karta) tekst += " Na biurku leży karta dostępu.";
      break;
    case 2:
      if (!stan.bezpiecznik && !stan.zasilanie) tekst += " Na półce leży bezpiecznik.";
      break;
    case 3:
      if (stan.zasilanie) tekst += " Zasilanie działa, serwery szumią.";
      else if (stan.bezpiecznik) tekst += " Rozdzielnica czeka na bezpiecznik, możesz go zamontować.";
      else tekst += " W rozdzielnicy brakuje bezpiecznika.";
      break;
    case 4:
      if (stan.karta && stan.zasilanie) tekst += " Czytnik świeci na zielono, możesz wyjść.";
      else tekst += " Do otwarcia drzwi potrzebujesz karty dostępu i działającego zasilania.";
      break;
  }
  return tekst;
}

// Walidator stanu. Zwraca opis pierwszego problemu albo null, gdy stan jest poprawny.
function bladStanu(w) {
  if (w === null || typeof w !== "object" || Array.isArray(w)) {
    return "stan musi być obiektem.";
  }

  // Dokładnie te pola, które ma wersja 1 (patrz decyzja w README)
  const klucze = Object.keys(w);
  for (const klucz of klucze) {
    if (!POLA_STANU.includes(klucz)) return `nieznane pole "${klucz}".`;
  }
  for (const pole of POLA_STANU) {
    if (!klucze.includes(pole)) return `brak pola "${pole}".`;
  }

  // Typy i zakresy
  if (!Number.isInteger(w.pokoj) || w.pokoj < 1 || w.pokoj > pokoje.length) {
    return `pole "pokoj" musi być liczbą całkowitą od 1 do ${pokoje.length}.`;
  }
  if (!Number.isInteger(w.energia) || w.energia < 0 || w.energia > ENERGIA_START) {
    return `pole "energia" musi być liczbą całkowitą od 0 do ${ENERGIA_START}.`;
  }
  for (const pole of ["karta", "bezpiecznik", "zasilanie", "koniec", "wygrana"]) {
    if (typeof w[pole] !== "boolean") return `pole "${pole}" musi mieć wartość true lub false.`;
  }

  // Zależności między polami (stany, do których nie da się dojść, grając)
  if (w.bezpiecznik && w.zasilanie) {
    return "bezpiecznik nie może być jednocześnie w plecaku i zamontowany.";
  }
  if (w.wygrana && !w.koniec) {
    return "wygrana musi oznaczać koniec gry.";
  }
  if (w.wygrana && (w.pokoj !== 4 || !w.karta || !w.zasilanie)) {
    return "wygrana wymaga pokoju Wyjście, karty i działającego zasilania.";
  }
  if (!w.wygrana && w.koniec && w.energia !== 0) {
    return "porażka jest możliwa tylko przy energii 0.";
  }
  if (!w.wygrana && !w.koniec && w.energia === 0) {
    return "energia 0 bez wygranej oznacza koniec gry.";
  }
  return null;
}

function czyStan(w) {
  return bladStanu(w) === null;
}

// Czysta funkcja reguł: nie zmienia stanPrzed i niczego nie wypisuje.
// Zwraca { stan, komunikat }. Odrzucona komenda zwraca stan bez zmian i bez kosztu.
function przejscie(stanPrzed, komenda) {
  if (stanPrzed.koniec) {
    return { stan: stanPrzed, komunikat: "Gra się zakończyła. Wpisz gra.reset(), aby zagrać ponownie." };
  }

  const stanPo = { ...stanPrzed };
  let komunikat = "";

  switch (komenda) {
    case "lewo":
    case "prawo": {
      const cel = stanPo.pokoj + (komenda === "prawo" ? 1 : -1);
      if (cel < 1 || cel > pokoje.length) {
        return { stan: stanPrzed, komunikat: "Ściana! Nie możesz tam przejść." };
      }
      stanPo.pokoj = cel;
      komunikat = `Przechodzisz do: ${nazwaPokoju(cel)}.`;
      break;
    }

    case "karta":
      if (stanPo.pokoj !== 1 || stanPo.karta) {
        return { stan: stanPrzed, komunikat: "Tutaj nie ma karty do zabrania." };
      }
      stanPo.karta = true;
      komunikat = "Zabierasz kartę dostępu.";
      break;

    case "bezpiecznik":
      if (stanPo.pokoj !== 2 || stanPo.bezpiecznik || stanPo.zasilanie) {
        return { stan: stanPrzed, komunikat: "Tutaj nie ma bezpiecznika do zabrania." };
      }
      stanPo.bezpiecznik = true;
      komunikat = "Zabierasz bezpiecznik.";
      break;

    case "napraw":
      if (stanPo.pokoj !== 3 || !stanPo.bezpiecznik || stanPo.zasilanie) {
        return { stan: stanPrzed, komunikat: "Nie możesz tu nic naprawić." };
      }
      stanPo.bezpiecznik = false; // bezpiecznik zostaje zużyty
      stanPo.zasilanie = true;
      komunikat = "Montujesz bezpiecznik. Zasilanie wróciło!";
      break;

    case "wyjdz":
      if (stanPo.pokoj !== 4 || !stanPo.karta || !stanPo.zasilanie) {
        return { stan: stanPrzed, komunikat: "Drzwi się nie otwierają. Potrzebujesz karty i działającego zasilania." };
      }
      stanPo.wygrana = true;
      stanPo.koniec = true;
      komunikat = "Drzwi się otwierają! Uciekasz z serwerowni!";
      break;

    default:
      return { stan: stanPrzed, komunikat: `Nieznana komenda "${komenda}". Wpisz gra.pomoc(), aby zobaczyć listę.` };
  }

  // Każda udana komenda kosztuje 1 energię. Wygrana ma pierwszeństwo przed porażką.
  stanPo.energia--;
  if (stanPo.energia === 0 && !stanPo.wygrana) {
    stanPo.koniec = true;
  }

  return { stan: stanPo, komunikat };
}

// Zapis: tekst JSON z numerem wersji i stanem
function utworzZapis(stan) {
  return JSON.stringify({ wersja: WERSJA_ZAPISU, stan: stan });
}

// Odczyt: sprawdza składnię, wersję, typy, zakresy i zależności.
// Zwraca { ok: true, stan } albo { ok: false, blad }. Sam niczego nie podmienia.
function odczytajZapis(tekst) {
  if (tekst === null || tekst === undefined) {
    return { ok: false, blad: "Import anulowany." };
  }
  if (typeof tekst !== "string") {
    return { ok: false, blad: "Import przyjmuje tekst JSON." };
  }
  if (tekst.trim() === "") {
    return { ok: false, blad: "Nie podano tekstu do importu." };
  }

  let dane;
  try {
    dane = JSON.parse(tekst);
  } catch (e) {
    return { ok: false, blad: "To nie jest poprawny JSON (może tekst jest urwany?)." };
  }

  if (dane === null || typeof dane !== "object" || Array.isArray(dane)) {
    return { ok: false, blad: "Zapis musi być obiektem JSON z polami wersja i stan." };
  }
  if (dane.wersja !== WERSJA_ZAPISU) {
    return { ok: false, blad: `Nieobsługiwana wersja zapisu: ${JSON.stringify(dane.wersja)} (oczekiwana: ${WERSJA_ZAPISU}).` };
  }

  const blad = bladStanu(dane.stan);
  if (blad) {
    return { ok: false, blad: "Niepoprawny stan: " + blad };
  }
  return { ok: true, stan: { ...dane.stan } };
}