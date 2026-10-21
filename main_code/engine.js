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






