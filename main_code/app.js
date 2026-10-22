function start() {
  console.log("UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na 10 tur.");
  pomoc();
  rozejrzyj();
}

function zakonczTure() {
  gracz.energia--;
  console.log("Pozostala energia: " + gracz.energia);
  if (gracz.wygrana) {
    console.log("WYGRANA! Drzwi otwarte. Mozesz wrocic do domu.");
  } else if (gracz.energia == 0) {
    koniec = true;
    console.log("PRZEGRANA. Zasilanie awaryjne padlo. Wpisz start().");
  }
}
function nazwaPokoju(numer) {
 
  (numer>0 && numer<=4) ? console.log(pokoje[numer].opis) : console.log("Brak pokoju");
     
}

function pomoc()
{
    console.log(pomoc);
}

function status() {
  // TODO A3: wypisz pokoj, energie, przedmioty, zasilanie i stan gry.
  console.log("Karta: " + (karta ? "tak" : "nie"));
  console.log("Pokoj: " + pokoj + "(" + nazwaPokoju(pokoj) + ")");
  console.log("Energia: " + energia);
  console.log("Bezpiecznik: " + (bezpiecznik ? "tak" : "nie" ));
  console.log("Zasilanie: " + (zasilanie ? "tak" : "nie"));
  console.log("Koniec gry: " + (koniec ? "tak" : "nie"));
  console.log("Wygrana: " + (wygrana ? "tak" : "nie"));
}

function mapa() {
  // TODO A2: petla for od 1 do 4; nazwa i znacznik aktualnego pokoju.
  for( let numer = 1; numer <= 4; numer = numer + 1){

    let opis = `${numer} ${nazwaPokoju(numer)}`;
    if(numer === pokoj){
      opis = opis + '<-- jestes tutaj';
    }
    console.log(opis);
  }
}

function rozejrzyj() {
  // TODO A4: switch(pokoj); opis zgodny ze stanem przedmiotow.
  switch(pokoj){
    case 1:
      console.log("Jestes w Recepcji");
      if(!karta){
        console.log("karta lezy na biurku");
      }
      break;
    case 2:
      console.log("Jestes w magazynie");
      if(!bezpiecznik && !zasilanie){
        console.log("Bezpiecznik lezy na polce");
      }
      break;
    case 3:
      console.log("Jestes w Serwerowni");
      if(zasilanie){
        console.log("Zasilanie dziala");
      }else{
        console.log("Zasilanie nie dziala, zamontuj bezpiecznik")
      }
      break;
    case 4:
      console.log("Jestes przy wyjsciu");
      if(karta && bezpiecznik){
        console.log("Aby wyjsc wlacz zasilanie i wez karte dostepu");
      }
      break;
    default:
      return "Nieznane pomieszczenie";

  }
  
}

//---------------------------------------------------------------------Adam----//

// SEKCJA B — RUCH (Zaimplementowana zgodnie z poleceniami)
function idz(kierunek) {
  // TODO B1: zablokuj ruch po koncu gry.
  if (koniec) {
    console.log("Gra sie zakonczyla. Wpisz start(), aby zagrac ponownie.");
    return;
  }

  let nastepnyPokoj = pokoj;

  // TODO B2: switch kierunku; oblicz kandydat na nowy pokoj.
  switch (kierunek) {
    case "prawo":
      nastepnyPokoj++;
      break;
    case "lewo":
      nastepnyPokoj--;
      break;
    default:
      // TODO B3: odrzuc nieznany kierunek bez kosztu.
      console.log("Nieznany kierunek. Uzyj: idz(\"lewo\") lub idz(\"prawo\").");
      return;
  }

  // TODO B3: odrzuc pokoj poza 1..4 bez kosztu (sciana).
  if (nastepnyPokoj < 1 || nastepnyPokoj > 4) {
    console.log("Sciana! Nie możesz tam przejść.");
    return;
  }

  // TODO B4: zapisz poprawny pokoj, rozejrzyj(), zakonczTure().
  pokoj = nastepnyPokoj;
  rozejrzyj();
  zakonczTure();
}
//-----------------------------------------------------------------------------//


// SEKCJA C — PRZEDMIOTY I WYGRANA
function akcja(co) {
  // C1 — blokada po koncu gry
  if (koniec) {
    console.log("Gra sie skonczyla. Wpisz start(), aby zagrac ponownie.");
    return;
  }

  // C2 — cztery akcje
  switch (co) {

    case "karta":
      if (pokoj.id !== 1 || karta) {
        console.log("Tutaj nie ma karty do zabrania.");
        return;
      }
      gracz.karta = true;
      console.log("Zabierasz karte dostepu.");
      break;

    case "bezpiecznik":
      if (pokoj.id !== 2 || bezpiecznik || zasilanie) {
        console.log("Tutaj nie ma bezpiecznika do zabrania.");
        return;
      }
      gracz.bezpiecznik = true;
      console.log("Zabierasz bezpiecznik.");
      break;

    case "napraw":
      if (pokoj.id !== 3 || !bezpiecznik || zasilanie) {
        console.log("Nie mozesz tu nic naprawic.");
        return;
      }
      gracz.bezpiecznik = false;
      gracz.zasilanie = true;
      console.log("Montujesz bezpiecznik. Zasilanie wrocilo!");
      break;

    case "wyjdz":
      if (pokoj.id !== 4 || !karta || !zasilanie) {
        console.log("Drzwi sie nie otwieraja. Potrzebujesz karty i dzialajacego zasilania.");
        return;
      }
      gracz.wygrana = true;
      gracz.koniec = true;
      console.log("Drzwi sie otwieraja! Uciekasz z serwerowni!");
      break;

    default:
      console.log("Nieznana akcja. Wpisz pomoc(), aby zobaczyc liste.");
      return;
  }

  // C3 — koszt energii w jednym miejscu
  zakonczTure();
}

start();