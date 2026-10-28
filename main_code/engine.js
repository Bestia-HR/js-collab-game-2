// engine.js – reguły gry. Nic tutaj nie wypisuje tekstu i nie zmienia stanu wejściowego.

const WERSJA_ZAPISU = 1;

const ENERGIA_START = 10;



const pokoje = [
  { id: 1, nazwa: "Recepcja", opis: "Jesteś w recepcji." },
  { id: 2, nazwa: "Magazyn", opis: "Jesteś w magazynie." },
  { id: 3, nazwa: "Serwerownia", opis: "Jesteś w serwerowni." },
  { id: 4, nazwa: "Wyjście", opis: "Jesteś przy drzwiach wyjściowych." }
];

const POKOJ_KARTA = 1;
const POKOJ_BEZPIECZNIK = 2;
const POKOJ_NAPRAWA = 3;
const POKOJ_WYJSCIE = 4;



const KIERUNKI = ["lewo", "prawo"];

const AKCJE = ["karta", "bezpiecznik", "napraw", "wyjdz"];

const POLA_STANU = ["pokoj", "energia", "karta", "bezpiecznik", "zasilanie", "koniec", "wygrana"];

const POLA_LOGICZNE = ["karta", "bezpiecznik", "zasilanie", "koniec", "wygrana"];



function znajdzPokoj(numer) {
  return pokoje.find(p => p.id === numer);
}



function nazwaPokoju(numer) {
  const p = znajdzPokoj(numer);
  return p ? p.nazwa : "Brak pokoju";
}



// Fabryka: każde wywołanie zwraca nowy, niezależny obiekt.
function stanPoczatkowy() {
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



function opisPokoju(stan) {
  const p = znajdzPokoj(stan.pokoj);
  if (!p) return "Nieznane pomieszczenie.";

  let tekst = p.opis;
  switch (stan.pokoj) {
    case POKOJ_KARTA:
      if (!stan.karta) tekst += " Na biurku leży karta dostępu.";
      break;
    case POKOJ_BEZPIECZNIK:
      if (!stan.bezpiecznik && !stan.zasilanie) tekst += " Na półce leży bezpiecznik.";
      break;
    case POKOJ_NAPRAWA:
      if (stan.zasilanie) tekst += " Zasilanie działa, serwery szumią.";
      else if (stan.bezpiecznik) tekst += " Rozdzielnica czeka na bezpiecznik, możesz go zamontować.";
      else tekst += " W rozdzielnicy brakuje bezpiecznika.";
      break;
    case POKOJ_WYJSCIE:
      if (stan.karta && stan.zasilanie) tekst += " Czytnik świeci na zielono, możesz wyjść.";
      else tekst += " Do otwarcia drzwi potrzebujesz karty dostępu i działającego zasilania.";
      break;
  }
  return tekst;
}



// Zwraca opis pierwszego znalezionego problemu albo null, gdy stan jest poprawny.
// Dodatkowe, nieznane pola nie są błędem – przy imporcie i tak przepisujemy tylko POLA_STANU.
function bladStanu(w) {
  if (w === null || typeof w !== "object" || Array.isArray(w)) {
    return "stan musi być obiektem.";
  }

  for (const pole of POLA_STANU) {
    if (!(pole in w)) return `brak pola "${pole}".`;
  }

  if (!Number.isInteger(w.pokoj) || !znajdzPokoj(w.pokoj)) {
    return `pole "pokoj" musi być numerem istniejącego pokoju (1–${pokoje.length}).`;
  }
  if (!Number.isInteger(w.energia) || w.energia < 0 || w.energia > ENERGIA_START) {
    return `pole "energia" musi być liczbą całkowitą od 0 do ${ENERGIA_START}.`;
  }
  for (const pole of POLA_LOGICZNE) {
    if (typeof w[pole] !== "boolean") return `pole "${pole}" musi mieć wartość true lub false.`;
  }

  if (w.bezpiecznik && w.zasilanie) {
    return "bezpiecznik nie może być jednocześnie w plecaku i zamontowany.";
  }
  if (w.wygrana && (w.pokoj !== POKOJ_WYJSCIE || !w.karta || !w.zasilanie)) {
    return "wygrana wymaga pokoju Wyjście, karty i działającego zasilania.";
  }
  if (w.koniec !== (w.wygrana || w.energia === 0)) {
    return "koniec gry musi odpowiadać wygranej albo energii 0.";
  }
  return null;
}



function czyStan(wartosc) {
  return bladStanu(wartosc) === null;
}



function odmowa(stanPrzed, komunikat) {
  return { stan: stanPrzed, komunikat };
}



// Reguła gry: (stan, komenda) -> { stan, komunikat }.
// Odmowa oddaje ten sam obiekt wejściowy, sukces – nowy płaski rekord z kosztem 1 energii.
function przejscie(stanPrzed, komenda) {
  if (stanPrzed.koniec) {
    return odmowa(stanPrzed, "Gra się zakończyła. Wpisz gra.start(), aby zagrać ponownie.");
  }

  let zmiany;
  let komunikat;

  switch (komenda) {
    case "lewo":
    case "prawo": {
      const cel = stanPrzed.pokoj + (komenda === "prawo" ? 1 : -1);
      if (!znajdzPokoj(cel)) {
        return odmowa(stanPrzed, "Ściana! Nie możesz tam przejść.");
      }
      zmiany = { pokoj: cel };
      komunikat = `Przechodzisz do: ${nazwaPokoju(cel)}.`;
      break;
    }

    case "karta":
      if (stanPrzed.pokoj !== POKOJ_KARTA || stanPrzed.karta) {
        return odmowa(stanPrzed, "Tutaj nie ma karty do zabrania.");
      }
      zmiany = { karta: true };
      komunikat = "Zabierasz kartę dostępu.";
      break;

    case "bezpiecznik":
      if (stanPrzed.pokoj !== POKOJ_BEZPIECZNIK || stanPrzed.bezpiecznik || stanPrzed.zasilanie) {
        return odmowa(stanPrzed, "Tutaj nie ma bezpiecznika do zabrania.");
      }
      zmiany = { bezpiecznik: true };
      komunikat = "Zabierasz bezpiecznik.";
      break;

    case "napraw":
      if (stanPrzed.pokoj !== POKOJ_NAPRAWA || !stanPrzed.bezpiecznik || stanPrzed.zasilanie) {
        return odmowa(stanPrzed, "Nie możesz tu nic naprawić. Potrzebujesz bezpiecznika w Serwerowni.");
      }
      zmiany = { bezpiecznik: false, zasilanie: true };
      komunikat = "Montujesz bezpiecznik. Zasilanie wróciło!";
      break;

    case "wyjdz":
      if (stanPrzed.pokoj !== POKOJ_WYJSCIE || !stanPrzed.karta || !stanPrzed.zasilanie) {
        return odmowa(stanPrzed, "Drzwi się nie otwierają. Potrzebujesz karty i działającego zasilania.");
      }
      zmiany = { wygrana: true };
      komunikat = "Drzwi się otwierają! Uciekasz z serwerowni!";
      break;

    default:
      return odmowa(stanPrzed, `Nieznana komenda "${komenda}". Wpisz gra.pomoc(), aby zobaczyć listę.`);
  }

  // Wspólna ścieżka sukcesu: koszt naliczany tylko tutaj.
  // Wygrana jest ustalona wcześniej, więc ma pierwszeństwo przed porażką przy energii 0.
  const stanPo = { ...stanPrzed, ...zmiany, energia: stanPrzed.energia - 1 };
  stanPo.koniec = stanPo.wygrana || stanPo.energia === 0;

  return { stan: stanPo, komunikat };
}
