/* Global Game Manager Variables */
var canvas; //used to manage canvas 
var context; //used to create context elements
var spriteSheet; //used to store the game sprite sheet 

/* function to setup the Game Manager */
function setup() {
    /* Creating the canvas */
    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    
    /* Creating a sprite sheet */
    spriteSheet = document.getElementById("pac");
    spriteSheet.onload = checkReady();
    
    /* append canvas to document body element*/
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
    context.fillStyle = 'blue';
    context.fillRect(0,0, canvas.width, canvas.height);
    context.drawImage(spriteSheet, 10, 10);
}