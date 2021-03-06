/* Global Game Manager Variables */
var canvas; //Used to manage canvas. 
var context; //Used to create context elements.
var spriteSheet; //Used to store the game sprite sheet.
var score; //Used to store the pacman scores.
var gscore; //Used to store the ghosts scores.
var tick; //Used to control game time.
var tTime; //Total time to kill in the game.
var timeReturn; //return to clear setInterval iterations.
var enemies = []; //Enemies array to create a array list of enemies.
var colors = [ //Used colors by enemies.
    'red',
    'orange',
    'pink',
    'green',
    'purple'
];
var walls = []; //walls array
var sideWallpadding = 10; //adding padding in walls. (Relative to canvas).
/* canvas coordinates objects to make walls */
var upLeftCorner = { 
    x: undefined,
    y: undefined
};
var bottomLeftCorner = {
    x: undefined,
    y: undefined
};
var upRightCorner = {
    x: undefined,
    y: undefined
};
var bottomRightCorner = {
    x: undefined,
    y: undefined
};
var gameInfo = []; //Used to store game events information relative to enemies or player defeats.

/* General Helper functions */
function canvasTurn() {
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

function UpdateCAll (element) { //update center of all objects
    element.updateCenter();
}

function drawAll (element) {//draw all objects
    element.draw();
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
    if (this.headdirection == 64 && this.sideCollision != "left") { //pac-man go to left 
        if (this.speed == 0){
            this.speed = this.oldSpeed;
            this.sideCollision = undefined;
        }
        this.x -= this.speed;
    }
    if (this.headdirection == 96 && this.sideCollision != "up") { //pac-man go up
        if (this.speed == 0){
            this.speed = this.oldSpeed; 
            this.sideCollision = undefined;
        }
        this.y -= this.speed;
    }
    if (this.headdirection == 0 && this.sideCollision != "right") { //pac-man go to right
        if (this.speed == 0){
            this.speed = this.oldSpeed; 
            this.sideCollision = undefined;
        }
        this.x += this.speed;
    }
    if (this.headdirection == 32 && this.sideCollision != "bottom") { //pac-man go down
        if (this.speed == 0){
            this.speed = this.oldSpeed; 
            this.sideCollision = undefined;
        }
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
    oldSpeed: 0, //Player old speed value.
    sideCollision: undefined, //Determines which side has collided.
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


/* ForEach functions */
function defeatAll(element){//change defeat status to true in all enemies
    element.defeat = true;
}

function unDefeatAll(element){ //change defeat status to false in all enemies
    element.defeat = false;
}

function collisionAll (element) {//verify collision between enemies and player.
    if (collision(player, element)) {
        if (player.countdown>0) {//power pill was activated 
            /* enemy can be defeated or enemy are "only eyes" because enemy is already defeated */
            if (element.defeat){ //enemy can be defeated so destroy him, otherwise do nothing
                //destroy or move enemy instance
                element.defeat = false;
                //add score points
                score++;    
                //Adding defeat information
                var info = "player defeat " + element.ghostName + " ghost";
                gameInfo.push(info);
            } 
        }
        else {//player "die"
            //Clear wall collisions
            player.sideCollision = undefined;
            //add ghost score points
            gscore++;
            //change player position
            player.x = myNumber(canvas.width - 100) + 50; 
            player.y = myNumber(canvas.height - 100) + 50;
            //Adding defeat information
            var info = "Player was defeated by " + element.ghostName + " ghost";
            gameInfo.push(info);
        }
    }
    element.update();
}


function collisionG2G (element, index, array) {//verify collision between enemies.
    for (var i=0; i<array.length; i++) {
        if (i != index) {
            if(collision(array[i], element) && ((array[i].flash != 64) && (element.flash != 64))){ //capturing no "only eyes" enemies collision
                console.log("enemies collided - " + array[i].ghostName + " - " + element.ghostName);
                
                /* change directions */
                array[i].direction_x = (-1) * array[i].direction_x;
                array[i].direction_y = (-1) * array[i].direction_y;
                
                element.direction_x = (-1) * element.direction_x;
                element.direction_y = (-1) * element.direction_y;
                
                /* make them move */
                array[i].move();
                element.move();
                
            }
        }
    }
}

function spawnAll(element){ //spawn enemies.
    element.spawn();
}

function Enemy (ghostName, bottom, ghostColor) { //Enemy object constructor.
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
    this.canvasControl= canvasTurn; //turn enemy movement in canvas.
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

/* Helper functions - wall section */
function d_draw () {//draw a wall in canvas.
    /*  drawing lines */
    context.beginPath();
    context.moveTo(this.startx, this.starty);
    context.lineTo(this.endx, this.endy);
    context.strokeStyle = "white";
    context.stroke();
    
    
//    context.lineTo(400, 300);
//    context.strokeStyle = "red";
//    context.stroke();
}

function w_update () {//update wall's variables 
    //TODO- when will make walls movement to reducing canvas size and make game more dificult
}

function makeWalls () {//Creating walls objects and adding to an array of walls.
    /* Creating walls that limit the canvas */
    walls.push(new Wall(upLeftCorner.x, upLeftCorner.y, bottomLeftCorner.x, bottomLeftCorner.y));//left side.
    
    walls.push(new Wall(upRightCorner.x, upRightCorner.y, bottomRightCorner.x, bottomRightCorner.y ));//right side.
    
    walls.push(new Wall(bottomLeftCorner.x, bottomLeftCorner.y, bottomRightCorner.x, bottomRightCorner.y));//bottom side.
    
    walls.push(new Wall(upLeftCorner.x, upLeftCorner.y, upRightCorner.x, upRightCorner.y)); //up side.
}

/*  Calculate whether element is inside walls limits or outside limits. 
    Return - Return TRUE if has a collision between object and walls otherwise FALSE. */
function wallCollision(Object){
    /* Setting up Object vertices */
    var x1 = (Object.centerx - Object.collisionsize);
    var y1 = (Object.centery - Object.collisionsize);
    var x2 = (Object.centerx + Object.collisionsize);
    var y2 = (Object.centery + Object.collisionsize);
    /* 
        x1   w1  w2   x2     
        y1   z1
        
        y2   z2
    */
    
    //Hit left wall
    if (upLeftCorner.x >= x1 ) {
        player.x += player.speed;
        player.sideCollision = "left";
        player.draw();
        return true;
    }
    //Hit up wall
    if (upLeftCorner.y >= y1) {
        player.y += player.speed;
        player.sideCollision = "up";
        player.draw();
        return true;
    }
    
    //hit bottom wall
    if (bottomLeftCorner.y <= y2){
        player.y -= player.speed;
        player.sideCollision = "bottom";
        player.draw();
        return true;
    }
    
    //Hit right wall
    if (upRightCorner.x <= x2){
        player.x -= player.speed;
        player.sideCollision = "right";
        player.draw();
        return true;
    }  
    
    return false;
}

/* 
    Wall contructor
*/
function Wall(startx, starty, endx, endy){
    /* Variables */
    this.startx = startx; //start x ponint of the wall in the canvas.
    this.starty = starty; //start y ponint of the wall in the canvas.
    this.endx = endx; //end x ponint of the wall in the canvas.
    this.endy = endy; //end x ponint of the wall in the canvas.
    /* Functions */
    this.draw = d_draw; //draw a wall in canvas.
    this.update = w_update; //update wall's variables.
}

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

/* Function to control game info messages related to defeats */
function info () {
    context.font = "15px Verdana";
    context.fillStyle = "red";
    if (gameInfo.length != 0){ //verify game info array
        if (tick < 500){ //control display time
            switch(gameInfo.length) { //switch different game info array sizes and clean array
                case 1:
                    context.fillText(gameInfo[0], 285, 28);
                    break;
                case 2:
                    context.fillText(gameInfo[0], 285, 28);
                    context.fillText(gameInfo[1], 285, 48);
                    break;
                case 3:
                    context.fillText(gameInfo[0], 285, 28);
                    context.fillText(gameInfo[1], 285, 48);
                    context.fillText(gameInfo[2], 285, 68);
                    break;
                default:
                    gameInfo.shift(); //remove one element when the array lenght is bigger than 3
            }
            
        }
        else { //remove one element of the array after 499 ticks 
            gameInfo.shift();
        }
    }
}

/* Function to create heads up display to show game info */
function headsUpDisplay() {
    /* Game score */
    context.font = "18px Verdana";
    context.fillStyle = "white";
    context.fillText("Pacman: " + score + " vs Ghosts " + gscore, 14, 28);
    
    info();//Defeat informations.
    
    /* Countdown display */
    context.font = "17px Verdana"
    context.fillStyle = "red";
    if (tTime < 0){
        context.fillText(0, 255, 28);
        window.clearInterval(timeReturn);
        alert("we are done");
    }
    else {
        context.fillText(tTime, 255, 28);    
    }
    
}

/*  Function to render elements in canvas.
    This function rendering in order. It is work like layers. 
    First element - botton layer. Last element - top layer. */
function render() {
    /* Update tick control */
    if (tick >= 500){
        tick = 0;
    }
    tick++;
    
    
    /* Creating canvas background and size */
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    /* Drawing basic Heads Up Display */
    headsUpDisplay();  
    
     /* verify end game */
    if (tTime < 0) {
        if (gscore > score) {
            resetAllGame();
            //TODO - remove one life point.
        }
        else {
            resetHUD();
            //TODO - add one life point.
        }
    }

    /* Collision detection */
    //Collision between wall and player(and update player)
    if(wallCollision(player)){
        player.oldSpeed = player.speed;
        player.speed = 0;
    }
    //Collision between wall and enemies(and update enemies)
    
    //Collision between enemies.
    enemies.forEach(collisionG2G);
    
    //Collision between dot and player
    if(collision(powerdot, player)){
        powerPillTime(); //Do actions related to collision between player and powerdot.
    }
    powerdot.update();//update powerdot after possible collision.
    powerdot.draw(); //draw powerdot after possible collision.
    
    //Collision between player and ghost
    enemies.forEach(collisionAll); //collision and update enemies 
    
    /* Update elements */
    player.update();
    
    /* Drawing elements */
    player.draw();
    enemies.forEach(drawAll);
    walls.forEach(drawAll);
    
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

/* Function to update game countdown */
function mTime(){
    tTime--;
}

/* Function to reset game info */
function clearMsgs() {
    if(gameInfo.length != 0){
        gameInfo = [];
    }
}

/* Function to reset Heads Up Display (HUD) */
function resetHUD() {
    score = gscore = tick = 0;
    tTime = 60;
    timeReturn = window.setInterval(mTime, 1000);
    clearMsgs();
}

/* Function to reset all game */
function resetAllGame() {
    /* Setting up player and all ghosts colors */
    player.spawn();
    enemies.forEach(spawnAll);    

    /* setting up center */
    player.updateCenter(); //player center
    enemies.forEach(UpdateCAll);
    
    resetHUD();
}

/* Function to setup the Game Manager */
function setup() {
    /* Set game score */
    score = 0;
    gscore = 0;
    /* Set time controls */
    tick = 0;
    tTime = 60; //60 seconds to make a number of kills.
    
    /* Creating the canvas */
    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');
    canvas.width = 610;
    canvas.height = 410;
    var size = Math.floor(window.innerHeight / 4);
    canvas.setAttribute("style", "margin-top: " + size.toString() + "px;");
    
    /* Creating a sprite sheet */
    spriteSheet = document.getElementById("pac");
    spriteSheet.onload = checkReady();

    /* Append canvas to document body element */
    document.body.appendChild(canvas);
    
    /* Creating enemies */
    for (var i=0; i<=4; i++){
        enemies.push(new Enemy(colors[i],((i*64)+32), (i * 64)));
    }
    
    /* Setting up walls properties */
    upLeftCorner.x = 0+sideWallpadding;
    upLeftCorner.y = 0+sideWallpadding;
    bottomLeftCorner.x = 0+sideWallpadding;
    bottomLeftCorner.y = canvas.height -sideWallpadding;
    upRightCorner.x = canvas.width - sideWallpadding;
    upRightCorner.y = 0+sideWallpadding;
    bottomRightCorner.x = canvas.width - sideWallpadding;
    bottomRightCorner.y = canvas.height - sideWallpadding;
    /* Creating walls */
    makeWalls();
    
    /* Setting up player and all ghosts colors */
    player.spawn();
    enemies.forEach(spawnAll);    

    /* setting up center */
    player.updateCenter(); //player center
    enemies.forEach(UpdateCAll);
    
    /* Start countdown timer */
    timeReturn = window.setInterval(mTime, 1000);
}
