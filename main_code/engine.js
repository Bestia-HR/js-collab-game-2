
const pomoc=`Dostepne: start(), pomoc(), status(), mapa(), rozejrzyj(), idz("prawo") idz("lewo"), akcja("karta"), akcja("bezpiecznik"), akcja("napraw"), akcja("wyjdz")
    Zasada kosztu: Kazdy udany ruch i udana akcja kosztuja 1 energie. Bledy i przegladanie stanu sa bezplatne.`


const gracz =
{
    pokoj:1,
    energia: 10,
    karta: false,
    bezpiecznik:false,
    zasilanie:false,
    koniec:false,
    wygrana:false
};

<<<<<<< HEAD
const pokoje = 
=======



const pokoj = 
>>>>>>> 22e561125be5bebe956e5cae0b6c1ee24dbb205c
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

<<<<<<< HEAD
const informacje =
  "Karta: " + (karta ? "tak" : "nie") + "\n" +
  "Pokój: " + pokoj + " (" + nazwaPokoju(pokoj) + ")\n" +
  "Energia: " + energia + "\n" +
  "Przedmioty: " + przedmioty + "\n" +
  "Bezpiecznik: " + (bezpiecznik ? "tak" : "nie") + "\n" +
  "Zasilanie: " + (zasilanie ? "tak" : "nie") + "\n" +
  "Koniec gry: " + (koniec ? "tak" : "nie") + "\n" +
  "Wygrana: " + (wygrana ? "tak" : "nie");





function pomoc()
{
    console.log(pomoc);
    
}
function status()
{
    console.log(informacje);
    
}

function rozejrzyj()
{
    const { pokoj, karta, bezpiecznik, zasilanie } = gracz;
 
    console.log("Jestes w: " + nazwaPokoju(pokoj));
 
    switch (pokoj)
    {
        case 1:
            if (!karta) console.log("Karta lezy na biurku.");
            break;
        case 2:
            if (!bezpiecznik) console.log("Bezpiecznik lezy na polce.");
            break;
        case 3:
            console.log(zasilanie
                ? "Zasilanie dziala."
                : "Zasilanie nie dziala, zamontuj bezpiecznik.");
            break;
        case 4:
            if (karta && bezpiecznik) console.log("Aby wyjsc wlacz zasilanie i wez karte dostepu.");
            break;
        default:
            console.log("Nieznane pomieszczenie.");
    }
}

function mapa()
{
    for (let numer = 1; numer <= 4; numer = numer + 1)
    {
        let opis = `${numer} ${nazwaPokoju(numer)}`;
        if (numer === gracz.pokoj)
        {
            opis = opis + " <-- jestes tutaj";
        }
        console.log(opis);
    }
}

//status
//mapa
//rozejrzyj




=======
>>>>>>> 22e561125be5bebe956e5cae0b6c1ee24dbb205c

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
