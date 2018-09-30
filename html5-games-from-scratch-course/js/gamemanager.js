/* Global Game Manager Variables */
var canvas; //Used to manage canvas. 
var context; //Used to create context elements.
var spriteSheet; //Used to store the game sprite sheet.
var score; //Used to store the pacman scores.
var gscore; //Used to store the ghosts scores.
var tick;
var enemies = [];
var colors = [
    'red',
    'orange',
    'pink',
    'green',
    'purple',
];

/* General Helper functions */
function canvasTurn(){
    /* Ensuring that object do not go over the canvas */
    if (this.x >= (canvas.width - this.width)) { //transporting enemy from the right side of canvas to left side.
        this.x = 0;
    }
    if (this.y >= (canvas.height - this.height)) { //transporting enemy from the botton side of canvas to up side.
        this.y = 0;
    }
    if (this.x < 0) { //transporting enemy from the left side of canvas to right side.
        this.x = canvas.width - this.width;
    }
    if (this.y < 0) { //transporting enemy from the up side of canvas to botton side.
        this.y = canvas.height - this.height;
    }
}

/* Helper functions - Player sector */
function p_updateCenter() { //function to update center of player sprite.
    this.centerx = this.x + 16;
    this.centery = this.y + 16;
}

function p_draw() { //function to draw a player sprite on canvas.
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
    //Drawing pacman
    context.drawImage(spriteSheet, this.pacmouth, this.headdirection, this.width, this.height, this.x, this.y, this.width, this.height);
}

function p_update(){ //function to update player properties.
    if (this.countdown>0) {
        this.countdown--;
    }
    this.move();
}

function p_move() { //function to do player movement 
    if (this.headdirection == 64) { //pac-man go to left 
        this.x -= this.speed;
    }
    if (this.headdirection == 96) { //pac-man go up
        this.y -= this.speed;
    }
    if (this.headdirection == 0) { //pac-man go to right
        this.x += this.speed;
    }
    if (this.headdirection == 32) { //pac-man go down
        this.y += this.speed;
    }

    /* Ensuring that player do not go over the canvas */
    this.canvasControl();
    //update sprite collision center
    this.updateCenter();

    /* Controlling the pac man mouth */
    if (this.headdirection == 64 || this.headdirection == 0) { //pac-man is moving on x-axis
        if (this.x % 5 == 0) { //change mounth at every 5 px
            if (this.pacmouth == 320) {
                this.pacmouth = 352;    
            }
            else {
                this.pacmouth = 320;
            }
        }    
    }
    else { //pac-man is moving on y-axis
        if (this.y % 5 == 0){ //change mounth at every 5 px
            if (this.pacmouth == 320) {
                this.pacmouth = 352;    
            }
            else {
                this.pacmouth = 320;
            }
        }
    }
}

function p_spaw(){ //function to control player spaw.
    this.x = 50;
    this.y = 100;
}

var player = { //Player object.
    x: 50, //X position on the canvas.
    y: 100, //Y position on the canvas.
    width: 32, //sprite width after draw.
    height: 32, //Sprite height after draw.
    pacmouth: 320, //current mouth state.
    headdirection: 0, //Current head direction.
    speed: 3, //Player speed.
    centerx: 0, //Sprite center. Used to calculate collision detection. 
    centery: 0, //Sprite center. Used to calculate collision detection.
    collisionsize: 12, //Size used to calculate collision area corners. Older value is 10.
    countdown: 0, //Time to expire the powerup.
    updateCenter: p_updateCenter,
    draw: p_draw,
    update: p_update,
    move: p_move,
    canvasControl: canvasTurn,
    spawn: p_spaw
};

/* Helper functions - Enemy sector */

//function to update collision center
function e_updateCenter(){ //function to update center of player sprite.
    this.centerx = this.x + 16;
    this.centery = this.y + 16;
}

function new_e_move(){ //calculates enemy (ghost) movement
    if (this.moving < 0) { //Testing whether enemy spend all moving points
        this.moving = (myNumber(20) * 3) + myNumber(1); //randomizing movement "distance".
        this.speed = myNumber(3) + 1; //Getting random speed always equals to 1 or more.
        /* clear last directions */
        this.direction_x = 0; 
        this.direction_y = 0;
        
        if (this.defeat || this.ghostColor == 384 || this.ghostColor == 416) {//Enemy can be defeated or already defeated.
            this.speed = this.speed * (-1);//change velocity to enemy run away from player.
            //Even number change X direction and odd change Y direction. 
            if (this.moving % 2) {
                if (player.x < this.x) {
                    this.direction_x = -this.speed; 
                } else {
                    this.direction_x = this.speed;
                }
            } else {
                if (player.y < this.y) {
                    this.direction_y = -this.speed;
                } else {
                    this.direction_y = this.speed;
                }
            }
        }
        else {
            //Even number change X direction and odd change Y direction. 
            if (this.moving % 2) {
                if (player.x < this.x) {
                    this.direction_x = -this.speed; 
                    this.flash = 64; //changing enemy "face direction" to the left
                } else {
                    this.direction_x = this.speed;
                    this.flash = 0; //changing enemy "face direction" to the right
                }
            } else {
                if (player.y < this.y) {
                    this.direction_y = -this.speed;
                    this.flash = 96; //changing enemy "face direction" up
                } else {
                    this.direction_y = this.speed;
                    this.flash = 32; //changing enemy "face direction" down
                }
            }
        }
    }
    /* change enemy position and reduce one step */
    this.moving--;
    this.x += this.direction_x;
    this.y += this.direction_y;
    /* Ensuring that enemy do not go over the canvas */
    this.canvasControl();
    //update sprite collision center
    this.updateCenter();
}

function e_draw(){//function to draw a enemy sprite on canvas.
    //Drawing red enemy - to see how to drawImage() works look at in player.draw()
    context.drawImage(spriteSheet, this.ghostColor, this.flash, this.width, this.height, this.x, this.y, this.width, this.height);
}

function new_e_update(){ //new function to update enemy properties.
    if (this.defeat){ //Enemy can be defeated
        if (player.countdown > 0){ //powerpill is still active.
            /* Manage ghost color */
            if (this.ghostColor != 384 && this.ghostColor != 416){ //Enemy is still not the blue ghost.
                if(this.ghostColor == this.bottom){
                    this.ghostColor -= 32;
                }
                this.oldghostColor = this.ghostColor; //store the old ghost number.
                this.ghostColor = 384; //setting to the blue "blinking" ghost.
                this.bottom = this.ghostColor + 32; //Change bottom for the blue ghost bottom.
                this.flash = 0; //change flash color to the "normal" blue ghost.
            }
            
            if (player.countdown < 150){ //start to blink
                if (player.countdown % 10 == 0){
                    if (this.flash == 0){
                        this.flash += 32;
                    }
                    else if(this.flash == 32) {
                        this.flash = 0;
                    }
                    else {
                        console.log("Blink error");
                        this.flash = 0;
                    }
                }
            }
        }
    }
    else if(this.flash != 64 && player.countdown > 0 && (this.ghostColor == 384 || this.ghostColor == 416)){
        this.flash = 64; //powerup still active and enemy was defeated. So now ghost is set to "only eyes".
    }
    else if (player.countdown <= 0 && (this.ghostColor == 384 || this.ghostColor == 416)){ //enemy scapes
        this.ghostColor = this.oldghostColor;
        this.bottom = this.ghostColor + 32;
    }

    if (tick % 15 == 0){
        if (this.bottom > this.ghostColor){
            this.ghostColor += 32;
        }
        else {
            this.ghostColor -= 32;
        }
    }
    
    this.move();
}

function e_spawn(){
    this.x = myNumber(canvas.width - 100) + 50; //Avoiding spawn enemy on the canvas corners.
    this.y = myNumber(canvas.height - 100) + 50; //Avoiding spawn enemy on the canvas corners.
}

function defeatAll(element, index, array){
    element.defeat = true;
}

function unDefeatAll(element, index, array){
    element.defeat = false;
}


function UpdateCAll (element, index, array) {
    element.updateCenter();
}


function UpdateAll (element, index, array) {
    element.update();
}


function drawAll (element, index, array) {
    element.draw();
}


function collisionAll (element, index, array) {
    if (collision(player, element)) {
        if (player.countdown>0) {//power pill was activated 
            /* enemy can be defeated or enemy are "only eyes" because enemy is already defeated */
            if (element.defeat){ //enemy can be defeated so destroy him, otherwise do nothing
                //destroy or move enemy instance
                element.defeat = false;
                //add score points
                score++;    
                console.log("player defeat " + element.ghostName + " ghost");
            } 
        }
        else {//player "die"
            //add ghost score points
            gscore++;
            //alert("You was eaten by the purple ghost");
            //change player position
            player.x = myNumber(canvas.width - 100) + 50; 
            player.y = myNumber(canvas.height - 100) + 50;
            console.log("Player was defeated by " + element.ghostName + " ghost");
        }
    }
    element.update();
}

function spawnAll(element, index, array){
    element.spawn();
}

function Enemy (ghostName, bottom, ghostColor) { //Enemy object. (red ghost)
    this.ghostName = ghostName;
    this.x = -10; //X position on the canvas.
    this.y = -100; //Y position on the canvas.
    this.width = 32;//sprite width after draw.
    this.height = 32; //Sprite height after draw.
    this.speed = 5; //Current speed.
    this.centerx = 0; //Sprite center. Used to calculate collision detection. 
    this.centery = 0; //Sprite center. Used to calculate collision detection.
    this.collisionsize = 12; //Size used to calculate collision area corners.
    this.moving = 0; //Current moving points.
    this.direction_x = 0; //X movement direction on canvas.
    this.direction_y = 0; //Y movement direction on canvas.
    this.bottom = bottom; //Used to switch ghost bottom sprites animation.
    this.ghostColor = ghostColor;//Ghost colors based on numbers. (red color ghost)
    this.oldghostColor = 0; //old ghostColor value.
    this.flash= 0; //Allow enemy flash when powerdot is hit by the player.
    this.defeat = false; //verify whether player can defeat enemy or not. True - player can defeat. False - Player can't defeat.
    this.updateCenter = e_updateCenter; //update collision center
    this.move = new_e_move; //Enemy movement
    this.draw = e_draw; //draw enemy sprite
    this.update = new_e_update; //update enemy properties.
    this.canvasControl= canvasTurn;
    this.spawn = e_spawn;
}


/* Helper functions - Powerdot sector */
function pd_draw() { //function to draw a powerdot on canvas.
    if (this.powerup) {
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
    }
}

function pd_update(){ //function to update powerdot properties.
    /*Setting up a powerdot */
    if (!this.powerup) { //Checking whether powerdot is set or not.
        if (player.countdown==0) { //creating a powerup pill
            this.x = myNumber(canvas.width - 100) + 50; 
            this.y = myNumber(canvas.height - 100) + 50;
            this.powerup = true;
            /* change player velocity */
            player.speed = 3;
            //change emenies defeat state
            enemies.forEach(unDefeatAll);
            
        }
        else if (player.countdown<0 ) { //ensure consistent countdown value.
            player.countdown == 0;
            player.speed = 3;
            alert("COUNTDOWN ERROR");
        }
    }
}
var powerdot = { //Powerdot object.
    x: 200, //X position on the canvas.
    y: 300, //Y position on the canvas.
    radius: 5, //powerdot radius.
    powerup: false, //current state of the powerdot. Controll whether powerdot will be set and draw or not.
    collisionsize: 5, //Size used to calculate collision area corners. 
    draw: pd_draw,
    update: pd_update
};

/* Keyboard events object */
var keyEvent = {}; //Used to capture key events and store to an array.

/* Player movement function - change pac-man face direction and let player.move() taking care of the rest */
function move(keyEvent) {
    if (37 in keyEvent) { //User pressed left key
        player.headdirection = 64;
    }
    if (38 in keyEvent) { //User pressed up key
        player.headdirection = 96;
    }
    if (39 in keyEvent) { //User pressed right key
        player.headdirection = 0;
    }
    if (40 in keyEvent) { //User pressed down key
        player.headdirection = 32;
    }
}

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

/*  Function to random based on a number (n).
    Return a interger number from zero to (n-1). */
function myNumber(n) {
    return Math.floor(Math.random() * n);
}

/*  Function to calculate collision between two squares given 4 vertices of each square.
    x1, y1, x2, y2; //Square-X points
    w1, z1, w2, z2; //Square-Y points
    Return - Return TRUE if has a collision between this two objects otherwise FALSE. */
function collisionMath(x1, y1, x2, y2, w1, z1, w2, z2){
    /* Collision detection */
    //checking whether x1 and y1 coordinates of ObjectX (player) are inside the ObjectY.
    if (x1 <= w2 && x1 >= w1 && y1 >= z1 && y1 <= z2) {
        return true;
    }
    //checking whether x2 and y1 coordinates of ObjectX (player) are inside the ObjectY.
    if (x2 <= w2 && x2 >= w1 && y1 >= z1 && y1 <= z2) {
        return true;
    }
    //checking whether x1 and y2 coordinates of ObjectX (player) are inside the ObjectY.
    if (x1 <= w2 && x1 >= w1 && y2 >= z1 && y2 <= z2) {
        return true;
    }
    //checking whether x2 and y2 coordinates of ObjectX (player) are inside the ObjectY.
    if (x2 <= w2 && x2 >= w1 && y2 >= z1 && y2 <= z2) {
        return true;
    }
}

/*  Function to make collision detection between two objects on game.
    ObjectX - Object with position (x,y), width and height.
    ObjectY - Object with position (x,y), width and height.
    Return - Return TRUE if has a collision between this two objects otherwise FALSE */
function collision(ObjectX, ObjectY){
    var x1, y1, x2, y2; //ObjectX vertices
    var w1, z1, w2, z2; //ObjectY vertices
    
    /* Identifying player object. this object has difference on center position and sprite position.
    It is adjusted by method updateCenter() from Player Object. */
    if(typeof ObjectX.updateCenter === 'function' && 
            typeof ObjectY.updateCenter === 'function') { //Player/Enemy objects founded
        /* Setting up ObjectX vertices */
        x1 = (ObjectX.centerx - ObjectX.collisionsize);
        y1 = (ObjectX.centery - ObjectX.collisionsize);
        x2 = (ObjectX.centerx + ObjectX.collisionsize);
        y2 = (ObjectX.centery + ObjectX.collisionsize);
        
        /* Setting up ObjectY vertices */
        w1 = (ObjectY.centerx - ObjectY.collisionsize);
        z1 = (ObjectY.centery - ObjectY.collisionsize);
        w2 = (ObjectY.centerx + ObjectY.collisionsize);
        z2 = (ObjectY.centery + ObjectY.collisionsize);
        
        //collision detection math calculations.
        return collisionMath(x1, y1, x2, y2, w1, z1, w2, z2);
    }
    else if (typeof ObjectX.updateCenter === 'function'){ //Player object founded.
        /* Setting up ObjectX vertices */
        x1 = (ObjectX.centerx - ObjectX.collisionsize);
        y1 = (ObjectX.centery - ObjectX.collisionsize);
        x2 = (ObjectX.centerx + ObjectX.collisionsize);
        y2 = (ObjectX.centery + ObjectX.collisionsize);
        
        /* Setting up ObjectY vertices */
        w1 = (ObjectY.x - ObjectY.collisionsize);
        z1 = (ObjectY.y - ObjectY.collisionsize);
        w2 = (ObjectY.x + ObjectY.collisionsize);
        z2 = (ObjectY.y + ObjectY.collisionsize);
        
        //collision detection math calculations.
        return collisionMath(x1, y1, x2, y2, w1, z1, w2, z2);
    }
    else if(typeof ObjectY.updateCenter === 'function') { //Player object founded.
        /* Setting up ObjectX vertices */
        x1 = (ObjectX.x - ObjectX.collisionsize);
        y1 = (ObjectX.y - ObjectX.collisionsize);
        x2 = (ObjectX.x + ObjectX.collisionsize);
        y2 = (ObjectX.y + ObjectX.collisionsize);
        
        /* Setting up ObjectY vertices */
        w1 = (ObjectY.centerx - ObjectY.collisionsize);
        z1 = (ObjectY.centery - ObjectY.collisionsize);
        w2 = (ObjectY.centerx + ObjectY.collisionsize);
        z2 = (ObjectY.centery + ObjectY.collisionsize);
        
        //collision detection math calculations.
        return collisionMath(x1, y1, x2, y2, w1, z1, w2, z2);
    }
    else{ //Objects aren't a player.
        console.log("Objects aren't a player");
        /* Setting up ObjectX vertices */
        x1 = (ObjectX.x - ObjectX.collisionsize);
        y1 = (ObjectX.y - ObjectX.collisionsize);
        x2 = (ObjectX.x + ObjectX.collisionsize);
        y2 = (ObjectX.y + ObjectX.collisionsize);
        
        /* Setting up ObjectY vertices */
        w1 = (ObjectY.x - ObjectY.collisionsize);
        z1 = (ObjectY.y - ObjectY.collisionsize);
        w2 = (ObjectY.x + ObjectY.collisionsize);
        z2 = (ObjectY.y + ObjectY.collisionsize);
        
        //collision detection math calculations.
        return collisionMath(x1, y1, x2, y2, w1, z1, w2, z2);
    }
    return false;
}


/*  Function to controll activities related to powerup=true momments. 
    When pacman hit the powerdot this function controlls every instructions related to this action. */
function powerPillTime(){
    /* changing powerdot properties and set powerup active */
    if(powerdot.powerup){
        /* Disable powerup */
        powerdot.powerup = false; 
        /* Move powerdot to avoid collision. But it's better disable collisions for it. */
        powerdot.x = 0; 
        powerdot.y = 0; 
        /* Change player countdown */
        player.countdown = 500; //setting up the time to expire the powerdot.
        /* Change player speed */
        player.speed = 4;
        /* Change all enemies defeat states */
        enemies.forEach(defeatAll);
    }
}

/*  Function to render elements in canvas.
    This function rendering in order. It is work like layers. 
    First element - botton layer. Last element - top layer. */
function render() {
    if (tick >= 500){
        tick = 0;
    }
    tick++;
    /* Crdefeating canvas background and size */
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    /* Collision detection */
    //Collision between dot and player
    if(collision(powerdot, player)){
        powerPillTime(); //Do actions related to collision between player and powerdot.
    }
    powerdot.update();//update powerdot after possible collision.
    powerdot.draw(); //draw powerdot after possible collision.
    
    //Collision between player and ghost
    enemies.forEach(collisionAll);
    
    player.update();
    
    /* Drawing elements */
    player.draw();
    enemies.forEach(drawAll);
    
    /* Drawing basic Heads Up Display */
    context.font = "20px Verdana";
    context.fillStyle = "white";
    context.fillText("Pacman: " + score + " vs Ghosts " + gscore, 2, 18);
}

/* Function to play the game */
function playGame() {
    render(); //render the game canvas and elements.
    requestAnimationFrame(playGame); //Window object function to make a animation loop.
}

/* Function to check if the sprite sheet is ready */
function checkReady() {
    this.ready = true;
    playGame();
}


/* Function to setup the Game Manager */
function setup() {
    /* Set game score */
    score = 0;
    gscore = 0;
    tick = 0;
    
    /* creating the canvas */
    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;

    /* creating a sprite sheet */
    spriteSheet = document.getElementById("pac");
    spriteSheet.onload = checkReady();

    /* Append canvas to document body element */
    document.body.appendChild(canvas);
    
    /* Creating enemies */
    for (var i=0; i<=4; i++){
        enemies.push(new Enemy(colors[i],((i*64)+32), (i * 64)));
    }
    
    /* Setting up player and all ghosts colors */
    player.spawn();
    enemies.forEach(spawnAll);    

    /* setting up center */
    player.updateCenter(); //player center
    enemies.forEach(UpdateCAll);
}
