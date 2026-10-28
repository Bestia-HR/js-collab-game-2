// Kolekcja pokoi
const pokoj = [
  { id: 1, opis: "Recepcja" },
  { id: 2, opis: "Magazyn" },
  { id: 3, opis: "Serwerownia" },
  { id: 4, opis: "Wyjście" }
];


function nazwaPokoju(numer) {
  return (numer > 0 && numer <= 4) ? pokoj[numer - 1].opis : "Brak pokoju";
}


function gracz() {
  return {
    pokoj: 1,
    energia: 10,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false
  };
}

// Walidator stanu
function czyStan(wartosc) {
  return (
    wartosc !== null &&
    typeof wartosc === "object" &&
    !Array.isArray(wartosc) &&
    Number.isInteger(wartosc.pokoj) && wartosc.pokoj >= 1 && wartosc.pokoj <= 4 &&
    Number.isInteger(wartosc.energia) && wartosc.energia >= 0 && wartosc.energia <= 10 &&
    typeof wartosc.karta === "boolean" &&
    typeof wartosc.bezpiecznik === "boolean" &&
    typeof wartosc.zasilanie === "boolean" &&
    typeof wartosc.koniec === "boolean" &&
    typeof wartosc.wygrana === "boolean"
  );
}

// Czysta funkcja reguł gry
function przejscie(graczPrzed, komenda) {
  if (graczPrzed.koniec) {
    return { stan: graczPrzed, komunikat: "Gra się zakończyła. Wpisz start(), aby zagrać ponownie." };
  }

  let graczStan = { ...graczPrzed };
  let komunikat = "";
  let kosztujeEnergie = false;

  if (komenda === "lewo" || komenda === "prawo") {
    let nastepnyPokoj = graczStan.pokoj;
    if (komenda === "prawo") nastepnyPokoj++;
    if (komenda === "lewo") nastepnyPokoj--;

    if (nastepnyPokoj < 1 || nastepnyPokoj > 4) {
      return { stan: graczPrzed, komunikat: "Ściana! Nie możesz tam przejść." };
    }
    graczStan.pokoj = nastepnyPokoj;
    kosztujeEnergie = true;
    komunikat = `Przechodzisz do: ${nazwaPokoju(graczStan.pokoj)}`;
  } else {
    switch (komenda) {
      case "karta":
        if (graczStan.pokoj !== 1 || graczStan.karta) {
          return { stan: graczPrzed, komunikat: "Tutaj nie ma karty do zabrania." };
        }
        graczStan.karta = true;
        kosztujeEnergie = true;
        komunikat = "Zabierasz kartę dostępu.";
        break;

      case "bezpiecznik":
        if (graczStan.pokoj !== 2 || graczStan.bezpiecznik || graczStan.zasilanie) {
          return { stan: graczPrzed, komunikat: "Tutaj nie ma bezpiecznika do zabrania." };
        }
        graczStan.bezpiecznik = true;
        kosztujeEnergie = true;
        komunikat = "Zabierasz bezpiecznik.";
        break;

      case "napraw":
        if (graczStan.pokoj !== 3 || !graczStan.bezpiecznik || graczStan.zasilanie) {
          return { stan: graczPrzed, komunikat: "Nie możesz tu nic naprawić." };
        }
        graczStan.bezpiecznik = false;
        graczStan.zasilanie = true;
        kosztujeEnergie = true;
        komunikat = "Montujesz bezpiecznik. Zasilanie wróciło!";
        break;

      case "wyjdz":
        if (graczStan.pokoj !== 4 || !graczStan.karta || !graczStan.zasilanie) {
          return { stan: graczPrzed, komunikat: "Drzwi się nie otwierają. Potrzebujesz karty i działającego zasilania." };
        }
        graczStan.wygrana = true;
        graczStan.koniec = true;
        kosztujeEnergie = true;
        komunikat = "Drzwi się otwierają! Uciekasz z serwerowni!";
        break;

      default:
        return { stan: graczPrzed, komunikat: "Nieznana akcja. Wpisz pomoc(), aby zobaczyć listę." };
    }
  }

  if (kosztujeEnergie) {
    graczStan.energia--;
    if (graczStan.energia === 0 && !graczStan.wygrana) {
      graczStan.koniec = true;
    }
  }

  return { stan: graczStan, komunikat };
}