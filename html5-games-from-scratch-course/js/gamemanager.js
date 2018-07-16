/* Global Game Manager Variables */
var canvas; //Used to manage canvas. 
var context; //Used to create context elements.
var spriteSheet; //Used to store the game sprite sheet.
var score; //Used to store the pacman scores.
var gscore; //Used to store the ghosts scores.
var ghost; //Used to control ghost spawn.
var player = { //Player object.
    x: 50, //X position on the canvas.
    y: 100, //Y position on the canvas.
    pacmouth: 320, //current mouth state.
    pacdirection: 0, //Current head direction.
    speed: 5, //Player speed.
    centerx: 0, //Sprite center. Used to calculate collision detection. 
    centery: 0, //Sprite center. Used to calculate collision detection.
    updateCenter: function(){
        this.centerx = this.x+16;
        this.centery = this.y+16;
    }
};
var enemy = { //Enemy object.
    x: 150, //X position on the canvas.
    y: 200, //Y position on the canvas.
    speed: 5, //Current speed.
    moving: 0, //Current moving points.
    direction_x: 0, //X movement direction on canvas.
    direction_y: 0 //Y movement direction on canvas.
};
var powerdot = { //Powerdot object.
    x: 200, //X position on the canvas.
    y: 300, //Y position on the canvas.
    powerup: false //current state of the powerdot. Controll whether powerdot will be set and draw or not.
};

/* Keyboard events object */
var keyEvent = {}; //Used to capture key events and store to an array.

/* Event listeners functions */
//capturing the keydown event 
document.addEventListener("keydown", function KDown(event) {
    keyEvent[event.keyCode] = true;
    move(keyEvent);
}, false);

//capturing the keyup event
document.addEventListener("keyup", function kUp(event) {
    delete keyEvent[event.keyCode];
}, false);

/* Player movement function */
function move(keyEvent) {
    if (37 in keyEvent) { //User pressed left key
        player.x -= player.speed;
        player.pacdirection = 64;
    }
    if (38 in keyEvent) { //User pressed up key
        player.y -= player.speed;
        player.pacdirection = 96;
    }
    if (39 in keyEvent) { //User pressed right key
        player.x += player.speed;
        player.pacdirection = 0;
    }
    if (40 in keyEvent) { //User pressed down key
        player.y += player.speed;
        player.pacdirection = 32;
    }
    
    player.updateCenter();

    /* Ensuring that player do not go over the canvas */
    if (player.x >= (canvas.width - 32)) { //transporting player from the right side of canvas to left side.
        player.x = 0;
    }
    if (player.y >= (canvas.height - 32)) { //transporting player from the botton side of canvas to up side.
        player.y = 0;
    }
    if (player.x < 0) { //transporting player from the left side of canvas to right side.
        player.x = canvas.width - 32;
    }
    if (player.y < 0) { //transporting player from the up side of canvas to botton side.
        player.y = canvas.height - 32;
    }
    
    player.updateCenter();
    
    /* Controlling the pac man mouth */
    if (player.pacmouth == 320) {
        player.pacmouth = 352;
    } else {
        player.pacmouth = 320;
    }
    
    render(); //rendering the game canvas.
}

/* Function to setup the Game Manager */
function setup() {
    /* Set game score */
    score = 0;
    gscore = 0;
    
    /* setting up player center */
    player.updateCenter();
    

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
function checkReady() {
    this.ready = true;
    playGame();
}


/* Function to play the game */
function playGame() {
    render(); //render the game canvas and elements.
    requestAnimationFrame(playGame); //Window object function to make a animation loop.
}

/* 
    Function to random based on a number 
    Return a interger number from zero to (n-1).
*/
function myNumber(n) {
    return Math.floor(Math.random() * n);
}
/* 
    Function to render elements in canvas.
    This function rendering in order. It is work like layers. 
    First element - botton layer. Last element - top layer.
*/
function render() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    /*Setting up a powerdot */
    if (!powerdot.powerup){ //Checking whether powerdot is set or not.
        powerdot.x = myNumber(canvas.width-100); 
        powerdot.y = myNumber(canvas.height-100);
        powerdot.powerup = true;
    }

    /* Randomizing ghosts to get different ghosts colors */
    if (!ghost) { //Testing whether ghosts are not created
        enemy.ghostNum = myNumber(5) * 64;
        enemy.x = myNumber(canvas.width - 100) + 50;
        enemy.y = myNumber(canvas.height - 100) + 50;
        ghost = true;
    }
    
    /* Creating ghost movement */
    if (enemy.moving < 0) { //Testing whether enemy spend all moving points
        enemy.moving = (myNumber(20)*3)+myNumber(1); //randomizing movement "distance".
        enemy.speed = myNumber(3)+1; //Getting random speed always equals to 1 or more.
        enemy.direction_x = 0;
        enemy.direction_y= 0;
        //Even number change X direction and odd change Y direction. Used to chase player.
        if (enemy.moving % 2) {  
            if (player.x < enemy.x) {
                enemy.direction_x = -enemy.speed;
            } 
            else{
                enemy.direction_x = enemy.speed;
            }
        }
        else {
            if (player.y < enemy.y){
                enemy.direction_y = -enemy.speed;
            }
            else {
                enemy.direction_y = enemy.speed;
            }
        }
    }
    enemy.moving--;
    enemy.x += enemy.direction_x; 
    enemy.y += enemy.direction_y;
    
    /* Ensuring that enemy do not go over the canvas */
    if (enemy.x >= (canvas.width - 32)) { //transporting enemy from the right side of canvas to left side.
        enemy.x = 0;
    }
    if (enemy.y >= (canvas.height - 32)) { //transporting enemy from the botton side of canvas to up side.
        enemy.y = 0;
    }
    if (enemy.x < 0) { //transporting enemy from the left side of canvas to right side.
        enemy.x = canvas.width - 32;
    }
    if (enemy.y < 0) { //transporting enemy from the up side of canvas to botton side.
        enemy.y = canvas.height - 32;
    }
    
    /* Collision detection */
    
    //checking whether x1 and y1 coordinates of player are inside the powerdot 
    if ((player.centerx - 10) <= (powerdot.x + 15) && (player.centerx - 10) >= (powerdot.x - 15) &&
        (player.centery - 10) >= (powerdot.y - 10) && (player.centery - 10) <= (powerdot.y + 15))  {
        console.log("q1 - hit"); 
    }
    //checking whether x2 and y1 coordinates of player are inside the powerdot 
    if ((player.centerx + 10) <= (powerdot.x + 15) && (player.centerx + 10) >= (powerdot.x - 15) &&
        (player.centery - 10) >= (powerdot.y - 15) && (player.centery - 10) <= (powerdot.y + 15))  {
        console.log("q2 - hit"); 
    }
    //checking whether x1 and y2 coordinates of player are inside the powerdot 
    if ((player.centerx - 10) <= (powerdot.x + 15) && (player.centerx - 10) >= (powerdot.x - 15) &&
        (player.centery + 10) >= (powerdot.y - 15) && (player.centery + 10) <= (powerdot.y + 15))  {
        console.log("q3 - hit"); 
    }
    //checking whether x2 and y2 coordinates of player are inside the powerdot 
    if ((player.centerx + 10) >= (powerdot.x - 15) && (player.centerx + 10) <= (powerdot.x + 15) &&
        (player.centery + 10) >= (powerdot.y - 15) && (player.centery + 10) <= (powerdot.y + 15))  {
        console.log("q4 - hit"); 
    }
    
    /* drawing a collision detection area for powerdot*/
    context.fillStyle = "red";
    context.beginPath();
    context.arc(powerdot.x-15, powerdot.y-15, 2,0, 2 * Math.PI, true); //x1 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(powerdot.x+15, powerdot.y-15, 2,0, 2 * Math.PI, true); //x2 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(powerdot.x-15, powerdot.y+15, 2,0, 2 * Math.PI, true); //x1 - y2
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(powerdot.x+15, powerdot.y+15, 2,0, 2 * Math.PI, true); //x2 - y2
    context.closePath();
    context.fill();
    
    /* drawing a collision detection area for pacman*/
    context.fillStyle = "red";
    context.beginPath();
    context.arc(player.centerx-10, player.centery-10, 2,0, 2 * Math.PI, true); //x1 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(player.centerx+10, player.centery-10, 2,0, 2 * Math.PI, true); //x2 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(player.centerx-10, player.centery+10, 2,0, 2 * Math.PI, true); //x1 - y2
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(player.centerx+10, player.centery+10, 2,0, 2 * Math.PI, true); //x2 - y2
    context.closePath();
    context.fill();
    
    /* drawing pacman center */
    context.fillStyle = "white";
    context.beginPath();
    context.arc(player.centerx, player.centery, 2,0, 2 * Math.PI, true); //center
    context.closePath();
    context.fill();


    /* Drawing a powerdot */
    if (powerdot.powerup){
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(powerdot.x, powerdot.y, 20,0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
    }
    
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
    //Drawing red enemy
    context.drawImage(spriteSheet, enemy.ghostNum, 0, 32, 32, enemy.x, enemy.y, 32, 32);
    //Drawing pacman
    context.drawImage(spriteSheet, player.pacmouth, player.pacdirection, 32, 32, player.x, player.y, 32, 32);
    context.font = "20px Verdana";
    context.fillStyle = "white";
    context.fillText("Pacman: " + score + " vs Ghosts " + gscore, 2, 18);
}