/* Global Game Manager Variables */
var canvas; //used to manage canvas 
var context; //used to create context elements
var spriteSheet; //used to store the game sprite sheet 
//player object 
var player = {
    x:50,
    y:100,
    pacmouth:320,
    pacdirection:0
//    psize:32
}

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
}