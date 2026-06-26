// shift game 
//examen pensamiento computacional 

//variables
// Estado del juego
// 0 = Pantalla de inicio
// 1 = Juego
// 2 = Game Over
// 3 = Victoria
let estado = 0;
let filas = 8;
let columnas = 8;//cantidad de filas y columnas 
let tamaño = 50; //tamaño figuras
let espacio = 70;//espacio
// Guarda el estado de cada casilla
// 0 = blanco
// 1 = amarillo
// 2 = azul
// 3 = rojo
let grilla = [];
let tiempoCelda = [];//guarda el tiempo de cada casilla
let puntaje = 0;//Puntaje del jugador
let vidas = 3; //cantidad de vidas
let contador = 0;//Contador general del juego
let intervalo = 60;//cada cuántos frames aparece un nuevo amarillo
let sonidoError; //sonido al equivocarse
let sonidoWin;//sonido al ganar
let sonidoLose;//sonido al perder

function setup(){
  createCanvas(700,800);//creacion del lienzo
  textAlign(CENTER,CENTER);//alinea los textos al centro
  inicializarGrilla();//llama a la funcion para grilla
  console.log(grilla); //muestra la grilla en la consola para estar seguros que se creo
}

function draw(){
  
  if(estado == 0){
    pantallaInicio();//panrtalla de inicio
  }
  else if(estado == 1){
    pantallaJuego();//juego
  }
  else if(estado == 2){
    pantallaGameOver();//perder
  }
  else if(estado == 3){
    pantallaVictoria();//ganar
  }
}
function inicializarGrilla(){//crea los arrays y deja todas las casillas en blanco

  grilla = [];// Vacía el array de la grilla
  tiempoCelda = [];//Vacía el array del tiempo de las celdas
  for(let i = 0; i < filas; i++){ // Recorre cada una de las filas
    grilla[i] = [];// Crea una nueva fila en la grilla
    tiempoCelda[i] = [];// Crea una nueva fila para los tiempos
    for(let j = 0; j < columnas; j++){// Recorre cada una de las columnas de esa fila
      grilla[i][j] = 0;// Define la casilla actual como blanca (vacía)
      tiempoCelda[i][j] = 0;// Pone el temporizador de la casilla actual en cero
      //aca tuve que preguntarle mucho a la ia como hacerlo porque me confudia y no lograba hacerlo:(
    }
  }
}
function pantallaInicio(){
  
  background(255);// Fondo blanco
  fill(0);
  noStroke();
  textSize(52);
  //textos 
  text("SHIFT",width/2,70);
  textSize(22);
  text("Restaura el orden",width/2,115);
  textSize(16);
  text("Haz click sobre los círculos amarillos",width/2,155);
  text("antes de que cambien a rojo.",width/2,175);
  text("Presiona ESPACIO para comenzar",width/2,740);
  // Dibuja la grilla de ejemplo
  dibujarGrilla();
  
}
function pantallaJuego(){ //aqui comienza la pantalla del juego
  
  background(0);
  fill(255);
  noStroke();
  textSize(20);
  //textos juego
  text("Puntaje: " + puntaje,100,40);
  text("Vidas: " + vidas,width/2,40);
  dibujarGrilla();
  contador++;// Suma 1 al contador de frames en cada ciclo
  if(contador % intervalo == 0){ 
    cambiarCasillaAleatoria();// Convierte una nueva casilla a color amarillo
  }
  actualizarTiempo();//ejecuta la función que controla el tiempo de las celdas
  revisarVictoria();//ejecuta la función que verifica si el jugador ya ganó
  
//barra de progreso
  let progreso = map(puntaje, 0, filas * columnas, 0, width);

  fill(0, 120, 255);// Color azul para la barra de progreso
  noStroke();
  rect(0, height - 15, progreso, 10);
}

function revisarVictoria(){
  
  if(puntaje == filas * columnas){// Si el puntaje es igual al total de casillas del tablero
    estado = 3; // Cambia a pantalla de victoria
    sonidoWin.play();//sonido de victoria win win 
  }
}

function dibujarGrilla(){//dibuja las figuras de la grilla
  
  // Recorre todas las filas
  for(let i = 0; i < filas; i++){
    // Recorre todas las columnas
    for(let j = 0; j < columnas; j++){
      // Posición de cada figura
      let x = 105 + j * espacio;
      let y = 210 + i * espacio;
      // Guarda el estado de la casilla
      let estadoCelda = grilla[i][j];
      // Contorno blanco para que se vea sobre el fondo negro
      noStroke();
      // Estado 0 = círculo blanco
      if(estadoCelda == 0){
        fill(255);
        ellipse(x,y,tamaño,tamaño);
      }
      // Estado 1 = círculo amarillo
      else if(estadoCelda == 1){
        fill(255,220,0);
        ellipse(x,y,tamaño,tamaño);
      }
      // Estado 2 = cuadrado azul
      else if(estadoCelda == 2){
        fill(0,120,255);
        rectMode(CENTER);
        rect(x,y,tamaño,tamaño);
      }
      // Estado 3 = círculo rojo
      else if(estadoCelda == 3){
        fill(255,0,0);
        ellipse(x,y,tamaño,tamaño);
      }
    }
  }
}
function mousePressed(){
  
  if(estado != 1) return;//solo funciona en el juego
  // Recorre toda la grilla
  for(let i = 0; i < filas; i++){
    for(let j = 0; j < columnas; j++){
      let x = 105 + j * espacio;
      let y = 210 + i * espacio;
      let d = dist(mouseX, mouseY, x, y);
      // Si el mouse está dentro del círculo
      if(d < tamaño / 2){
        // Si está amarillo → correcto
        if(grilla[i][j] == 1){
          grilla[i][j] = 2; // azul
          tiempoCelda[i][j] = 0;
          puntaje++;
        }
        // Si NO estaba amarillo → error
        else if(grilla[i][j] == 0){
          grilla[i][j] = 3; // rojo
          vidas--; //menos vida si se equivoca
        }
      }
    }
  }
}
function cambiarCasillaAleatoria(){

  // seguridad: evita error si la grilla no existe
  if(!grilla || grilla.length == 0) return;
  for(let i = 0; i < filas; i++){
    for(let j = 0; j < columnas; j++){
      if(grilla[i][j] == 1){
        return;// Sale de la función sin activar otra celda nueva
      }
    }
  }
  let i, j;// Declara las variables para almacenar la posición seleccionada
  do{
    i = floor(random(filas));// Elige una fila al azar y redondea hacia abajo
    j = floor(random(columnas));
  } while(grilla[i][j] != 0);
  grilla[i][j] = 1;
  tiempoCelda[i][j] = 0;
}

function pantallaGameOver(){ //pantalla cuando se pierde 

  background(0);
  fill(255);
  textSize(40);
  text("GAME OVER", width/2, height/2);
  textSize(20);
  text("Presiona ESPACIO para reiniciar", width/2, height/2 + 50);
}

function pantallaVictoria(){ //pantalla al ganar

  background(255);
  fill(0);
  textSize(40);
  text("¡RESTAURASTE EL ORDEN!", width/2, height/2);
  textSize(20);
  text("Presiona ESPACIO para reiniciar", width/2, height/2 + 50);
}
// Controla el tiempo de las casillas
function actualizarTiempo(){

  for(let i = 0; i < filas; i++){
    for(let j = 0; j < columnas; j++){
      if(grilla[i][j] == 1){
        tiempoCelda[i][j]++;
        if(tiempoCelda[i][j] >= 60){
          grilla[i][j] = 3;
          tiempoCelda[i][j] = 0;
         vidas--;
          sonidoError.play();
if (vidas <= 0) {
  vidas = 0;// Mantiene las vidas en cero para evitar números negativos
  estado = 2;// perdiste
  sonidoLose.play();//sonido que perdiste
}
        }
      }
      else if(grilla[i][j] == 3){
        tiempoCelda[i][j]++;
        if(tiempoCelda[i][j] >= 30){
          grilla[i][j] = 0;
          tiempoCelda[i][j] = 0;
        }
      }
    }
  }
}
function keyPressed(){
  
  // iniciar juego desde inicio
  if(estado == 0 && key == " "){
    estado = 1;
  }
  // reiniciar desde game over o victoria
  if((estado == 2 || estado == 3) && key == " "){
    reiniciarJuego();
    estado = 1;
  }
}
function reiniciarJuego(){//para volver a iniciar el juego de 0

  puntaje = 0;
  vidas = 3;
  contador = 0;
  inicializarGrilla();
}
function preload(){ //funcion para sonidos
  
  sonidoError = loadSound("error.mp3");
  sonidoWin = loadSound("win.mp3");
  sonidoLose = loadSound("lose.mp3");
}