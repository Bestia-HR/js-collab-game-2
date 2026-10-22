
const pomoc=`Dostepne: start(), pomoc(), status(), mapa(), rozejrzyj(), idz("prawo") idz("lewo"), akcja("karta"), akcja("bezpiecznik"), akcja("napraw"), akcja("wyjdz")
    Zasada kosztu: Kazdy udany ruch i udana akcja kosztuja 1 energie. Bledy i przegladanie stanu sa bezplatne.`


const zmiennePoczatkowe =
{
    pokoj:1,
    energia: 10,
    karta: false,
    bezpiecznik:false,
    zasilanie:false,
    koniec:false,
    wygrana:false
};



const pokoje = 
[
    {
        id:1,opis:"Recepcja"

    },
    {
        id:2,opis:"Magazyn"
    },
    {
        id:3,opis:"Serwerownia"
    },
    {
        id:4,opis:"Wyjscie"
    }
];

function status()
{
    console.log(pomoc);
    
}







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

