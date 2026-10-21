// Adam - punkt 6 walidacja stanu
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
    typeof wartosc.wygrana === "boolean" &&
    !(wartosc.bezpiecznik && false) // do dostosowania
  );
}