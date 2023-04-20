
// partie de déclaration de variable 
//delcaration de la planche de jeux
var board = [];
//declaration de nombre de ligne qui est 10
var lignes = 10;
//declaration de nombre de colonnes qui est aussi 10
var colonnes = 10;
// declaration de compteur qui contient le nombre de bombe qui est intialement a 5 est sa change selon le niveau de jeu.
var compteur=5;
// delcaration d'un tableau pour le declaration qui est null mais aprés il va contenir les localisation de bombe 
var bombelocal = []; 
//declaration de variable qui indique les carre cliqué 
var carreclic = 0; 
//variable boolean pour indiquer l'etat de drapeau cliqué ou non 
var flagEnabled = false;
// variable pour indiquer l'etat de jeux 
var gameOver = false;
// declaration de deux varaible pour initialisation de compteur de temp en (s)
var timer ;
var value = 0;

//action qui fait l'appel au fonction stratGame pour commencé le jeu
window.onload = function() {
    startGame();
}
//fonction qui change la valeur compteur qui a comme id demo
function changeValue() {
    document.getElementById("demo").innerHTML = ++value;
  }
  //start la fonction qui fait appel au fonction stop pour renisialisé le timer , et aprés de  changé l'interval d'augmentation de temp (1000ms)
  var timerInterval = null;
  function start() {
    stop(); 
   timerInterval = setInterval(changeValue, 1000);  
  }

  //stop fonction qui fait l'inisialisation de compteur du temp
  var stop = function() {
    clearInterval(timerInterval);
  }
 

//fonction level pour preciser le niveau de jeux
function level() {
//get le valeur de champ select qui a comme id pet-select
let niv = document.getElementById("pet-select");
console.log(niv.value);

//si niveau == easy nombre de bombe sera 5
if(niv.value=="Easy") {
    compteur=5;
         document.getElementById("mines-count").innerText =5 ;

  console.log(compteur);
}
//si niveau == Medium nombre de bombe sera 10
if(niv.value=="Medium") {
    compteur=10-5;
         document.getElementById("mines-count").innerText =10;
    console.log(compteur);
}
//si niveau == Hard nombre de bombe sera 15
if(niv.value=="Hard") {
    
    compteur= 17-5-7+5;   
    document.getElementById("mines-count").innerText =15;
   console.log(compteur);
}
//inserer les bombes
setMines();

}




// fonction qui permet de mettre en place les bombes
function setMines() {
    // insialiser le nombre de bombes existante selon le compteur de bombe  
    let minesLeft = compteur;
     //tant que le nombre de bombe existante > 0 on va les mettre de maniére hasard et conserver l'id de case (ligne et colonnes )
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * lignes);
        let c = Math.floor(Math.random() * colonnes);
        let id = r.toString() + "-" + c.toString();
//si une cas ne contient le bombe on va deminuer le nombre de bombe
        if (!bombelocal.includes(id)) {
            bombelocal.push(id);
            minesLeft -= 1;
        }
    }
}

//la fonction qui est appelé initialement lors de l'ouverture de page 
function startGame() {
    //get les id necessaire le "mines-count" qui contient le nombre des miennes ou bombes
    document.getElementById("mines-count").innerText = compteur;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    //fait l'appel au fonction setbombes() pour éléminer les cases qui contiennes une bombe et un flag 
    setMines();
   
 
    for (let r = 0; r < lignes; r++) {
        let colonne = [];
        for (let c = 0; c < colonnes; c++) {

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickcarre);
            document.getElementById("board").append(tile);
            colonne.push(tile);
        }
        board.push(colonne);
    }

    console.log(board);

}
// fonction pour indiquer le couleur de "flag-button" selon la varible flagEnabled(etat de boutton)
function setFlag() {
    //fonction setFlag pour mise en à jour les drapeaux l'accés 
    //si le drapeau est en etat enabe
    if (flagEnabled) {
        //en mis flagenable a faux 
        flagEnabled = false;
        //on accéde au drapeau et on change la couleur de case 
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        //si true 
        flagEnabled = true;
        // on change la couleur de case on gris fonçé 
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}
//fonction qui décide l'etat de jeu aprés le click de bouton 
function clickcarre() {
    // start le timer (appel de fonction )
    start();
// gameover == true  || la classe List contient un carre cliquer
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
//on met la tile ou bien le carre cliquer this qui nous cliquant ;
    let tile = this;
    if (flagEnabled) {
        //si on a accé au flag et si le carre ne contient pas un flag 
        if (tile.innerText == "") {
            //on ajoute un flag
            tile.innerText = "🚩";
        }
        else if (
            //et si la case contient un flag on les mis vide 
            tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    //si on a tomber sur une bombe  :
    if (bombelocal.includes(tile.id)) {
        //on met gameover a true on affiche les autres bombes (via la fonctions revealMines c'est à dire afficher les miennes ou les bombes)
        gameOver = true;
    
        revealMines();
        //faceChange qui change le simle lorsque on tombe sur une bombe
        facechange();
        //stop pour stoper le timeur
        stop();
        return;
    }


    let coords = tile.id.split("-"); 
    //on fait une connversion et on reverifie les bombes.
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkBombe(r, c);

}
// fonction qui change le visage selon l'etat de jeu
function facechange() {
let face = document.getElementById("face");
        face.innerText ="😟";
        let loser = document.getElementById("mines-count").innerText = "Loser 🤕";
        
}

function revealMines() {
    for (let r= 0; r < lignes; r++) {
        for (let c = 0; c < colonnes; c++) {
            let tile = board[r][c];
            if (bombelocal.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red"; 

            }
        }
    }
}
//fonction qui consulte les bombes
function checkBombe(r, c) {
// si on a depaser le nb lignes et nb colonnes , on fait rien  
    if (r < 0 || r >= lignes || c < 0 || c >= colonnes) {
        return;
    }//si le carre deja cliquer , on fait rien 
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
//sinon il ajoute au board les carré cliqeur et augmente le variable
    board[r][c].classList.add("tile-clicked");
    carreclic += 1;

    let minesFound = 0;

    //mettre et faire l'appel au fonction checkcarre
    minesFound += checkcarre(r-1, c-1);      
    minesFound += checkcarre(r-1, c);        
    minesFound += checkcarre(r-1, c+1);      

   
    minesFound += checkcarre(r, c-1);       
    minesFound += checkcarre(r, c+1);      


    minesFound += checkcarre(r+1, c-1);      
    minesFound += checkcarre(r+1, c);       
    minesFound += checkcarre(r+1, c+1);      
//si le nb de bombe trouvé > 0 aprés le check de carré 
    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        // on ajoute x plus la dimension de case 
        board[r][c].classList.add("x" + minesFound.toString());

    }
    else {
//sino on fait l'appel au fonction check bombe pour consulter les cases et check qu'ils contiennes des bombes ou pas 
        checkBombe(r-1, c-1);    
        checkBombe(r-1, c);      
        checkBombe(r-1, c+1);    

        checkBombe(r, c-1);      
        checkBombe(r, c+1);      

        checkBombe(r+1, c-1);   
        checkBombe(r+1, c);      
        checkBombe(r+1, c+1);    
    }
// si les nombres de carré ouvert est egale ou nb de ligne * nb de collone moin les compteur c'est à dire nb de bombe on affiche winner 
    if (carreclic == lignes * colonnes - compteur) {
        document.getElementById("mines-count").innerText = "Winner 🥇";
        gameOver = true;
        //on stop le jeux par gameOver = true 
        //et on stop le compteur du temp
        stop();

    }

}

//verifier le carré cliquer ou pas et ne fait rien si on deppase la taille de board 
function checkcarre(r, c) {
    if (r < 0 || r >= lignes || c < 0 || c >= colonnes) {
        return 0;
    }
    if (bombelocal.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}