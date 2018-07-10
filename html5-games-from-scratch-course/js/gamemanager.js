/* Global Game Manager Variables */
var canvas; //Used to manage canvas 
var context; //Used to create context elements
var spriteSheet; //Used to store the game sprite sheet 
var score; //Used to store the pacman scores
var gscore; //Used to store the ghosts scores
var player = { //Player object 
    x:50,
    y:100,
    pacmouth:320,
    pacdirection:0
//    psize:32
} 
var keyEvent = {}; //Used to capture key events

/* Event listeners functions */
//capturing the keydown event 
document.addEventListener("keydown", function KDown(event){
    keyEvent[event.keyCode] = true;
    console.log(keyEvent)
}, false);

//capturing the keyup event
document.addEventListener("keyup", function kUp(event){
    delete keyEvent[event.keyCode];
}, false);

/* Function to setup the Game Manager */
function setup() {
    /* Set game score */
    score = 0;
    gscore = 0;
    
    /* Creating the canvas */
    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    
    /* Creating a sprite sheet */
    spriteSheet = document.getElementById("pac");
    spriteSheet.onload = checkReady();
    
    /* Append canvas to document body element */
    document.body.appendChild(canvas);
}

/* Function to check if the sprite sheet is ready */
function checkReady(){
    this.ready = true;
    playGame();
}


/* Function to play the game */
function playGame(){
    render();
}

/* Function to render elements in canvas */
function render(){
    context.fillStyle = "black";
    context.fillRect(0,0, canvas.width, canvas.height);
    /* 
        Function drawImage() parameters:
        img	    - Specifies the image, canvas, or video element to use	 
        sx	    - Optional. The x coordinate where to start clipping	
        sy	    - Optional. The y coordinate where to start clipping	
        swidth  - Optional. The width of the clipped image	
        sheight	- Optional. The height of the clipped image	
        x	    - The x coordinate where to place the image on the canvas	
        y	    - The y coordinate where to place the image on the canvas	
        width	- Optional. The width of the image to use (stretch or reduce the image)	
        height	- Optional. The height of the image to use (stretch or reduce the image)
    */
    context.drawImage(spriteSheet, player.pacmouth, player.pacdirection, 32, 32, player.x, player.y, 32,32);
    context.font = "20px Verdana";
    context.fillStyle = "white";
    context.fillText("Pacman: " + score + " vs Ghosts " + gscore, 2, 18);
}