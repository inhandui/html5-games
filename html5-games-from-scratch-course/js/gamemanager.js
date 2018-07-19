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
    width: 32, //sprite width after draw.
    height: 32, //Sprite height after draw.
    pacmouth: 320, //current mouth state.
    pacdirection: 0, //Current head direction.
    speed: 5, //Player speed.
    centerx: 0, //Sprite center. Used to calculate collision detection. 
    centery: 0, //Sprite center. Used to calculate collision detection.
    collisionsize: 12, //Size used to calculate collision area corners. Older value is 10.
    countdown: 0, //Time to expire the powerup.
    updateCenter: function () { //function to update center of player sprite.
        this.centerx = this.x + 16;
        this.centery = this.y + 16;
    },
    draw: function () { //function to draw a player sprite on canvas.
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
        context.drawImage(spriteSheet, this.pacmouth, this.pacdirection, this.width, this.height, this.x, this.y, this.width, this.height);
    },
    update: function(){ //function to update player properties.
        if (this.countdown>0) {
            this.countdown--;
        }
    }
};
var enemy = { //Enemy object.
    x: 150, //X position on the canvas.
    y: 200, //Y position on the canvas.
    width: 32, //sprite width after draw.
    height: 32, //Sprite height after draw.
    speed: 5, //Current speed.
    centerx: 0, //Sprite center. Used to calculate collision detection. 
    centery: 0, //Sprite center. Used to calculate collision detection.
    collisionsize: 12, //Size used to calculate collision area corners.
    moving: 0, //Current moving points.
    pacdirection: 0, //Current eyes direction.
    direction_x: 0, //X movement direction on canvas.
    direction_y: 0, //Y movement direction on canvas.
    ghostNum: 0,//Ghost collors based on numbers.
    oldGhostNum: 0, //old ghostNum value.
    flash: 0, //Allow enemy flash when powerdot is hit by the player.
    eat: false, //verify whether player can eat enemy or not. True - player can eat. False - Player can't eat.
    updateCenter: function () { //function to update center of player sprite.
        this.centerx = this.x + 16;
        this.centery = this.y + 16;
    },
    move: function(){ //calculates ghost movement
        if (this.moving < 0) { //Testing whether enemy spend all moving points
            this.moving = (myNumber(20) * 3) + myNumber(1); //randomizing movement "distance".
            this.speed = myNumber(3) + 1; //Getting random speed always equals to 1 or more.
            if (this.eat) {//Enemy can be eaten
                this.speed = this.speed * (-1);//change velocity to enemy run away from player
            }
            /* clear last directions */
            this.direction_x = 0; 
            this.direction_y = 0;
            //Even number change X direction and odd change Y direction. 
            if (this.moving % 2) {
                if (player.x < this.x) {
                    this.direction_x = -this.speed;
                    this.flash = 64;
                } else {
                    this.direction_x = this.speed;
                    this.flash = 0;
                }
            } else {
                if (player.y < this.y) {
                    this.direction_y = -this.speed;
                    this.flash = 96;
                } else {
                    this.direction_y = this.speed;
                    this.flash = 32;
                }
            }
        }
        /* change enemy position and reduce one step */
        this.moving--;
        this.x += this.direction_x;
        this.y += this.direction_y;
        /* Ensuring that enemy do not go over the canvas */
        if (this.x >= (canvas.width - 32)) { //transporting enemy from the right side of canvas to left side.
            this.x = 0;
        }
        if (this.y >= (canvas.height - 32)) { //transporting enemy from the botton side of canvas to up side.
            this.y = 0;
        }
        if (this.x < 0) { //transporting enemy from the left side of canvas to right side.
            this.x = canvas.width - 32;
        }
        if (this.y < 0) { //transporting enemy from the up side of canvas to botton side.
            this.y = canvas.height - 32;
        }
        this.updateCenter();
    },
    draw: function(){//function to draw a enemy sprite on canvas.
        //Drawing red enemy - to see how to drawImage() works look at in player.draw()
        context.drawImage(spriteSheet, this.ghostNum, enemy.flash, this.width, this.height, this.x, this.y, this.width, this.height);
    },
    update: function(){ //function to update enemy properties.
        /* Randomizing ghosts to get different ghosts colors */
        if (!ghost) { //Testing whether ghosts are not created
            this.ghostNum = myNumber(5) * 64; //Setting ghost collor based on numbers.
            this.x = myNumber(canvas.width - 100) + 50; //Avoiding spawn enemy on the canvas corners.
            this.y = myNumber(canvas.height - 100) + 50; //Avoiding spawn enemy on the canvas corners.
            ghost = true; //Changing ghost to true to avoid create more ghosts.
        }
        /* Creating ghost movement */
        if (player.countdown>0) { //player got powerup, so ghost will run away from the player
            /* Run away from the player */
            this.move();
            /* Blink */
            if (player.countdown % 10 == 0) {
                if (enemy.flash == 0) {
                    enemy.flash = 32;
                }
                else {
                    enemy.flash = 0;
                }   
            }
        }
        else {//ghost will go toward the player
            if (this.eat) { //ensure the correct value for this.eat and get back the old collor.
                this.eat = false;
                this.ghostNum = enemy.oldGhostNum;
            }
            /* Run toward the player */
            this.move();
        }
    }
};
var powerdot = { //Powerdot object.
    x: 200, //X position on the canvas.
    y: 300, //Y position on the canvas.
    radius: 20, //powerdot radius.
    powerup: false, //current state of the powerdot. Controll whether powerdot will be set and draw or not.
    ghostNum: 0, //Ghost collor.
    collisionsize: 15, //Size used to calculate collision area corners. 
    draw: function () { //function to draw a powerdot on canvas.
        if (this.powerup) {
            context.fillStyle = "#ffffff";
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
        }
    },
    update: function(){ //function to update powerdot properties.
        /*Setting up a powerdot */
        if (!this.powerup) { //Checking whether powerdot is set or not.
            if (player.countdown==0) { //Creating a powerup pill
                this.x = myNumber(canvas.width - 100) + 50; 
                this.y = myNumber(canvas.height - 100) + 50;
                this.powerup = true;
            }
            else if (player.countdown<0 ) { //ensure consistent countdown value.
                     player.countdown == 0;
            }
        }
    }
};

/* Keyboard events object */
var keyEvent = {}; //Used to capture key events and store to an array.

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

    /* Ensuring that player do not go over the canvas */
    //transporting player from the right side of canvas to left side.
    if (player.x >= (canvas.width - player.width)) {
        player.x = 0;
    }
    //transporting player from the botton side of canvas to up side.
    if (player.y >= (canvas.height - player.height)) {
        player.y = 0;
    }
    if (player.x < 0) { //transporting player from the left side of canvas to right side.
        player.x = canvas.width - player.width;
    }
    if (player.y < 0) { //transporting player from the up side of canvas to botton side.
        player.y = canvas.height - player.height;
    }

    player.updateCenter();

    /* Controlling the pac man mouth */
    if (player.pacmouth == 320) {
        player.pacmouth = 352;
    } else {
        player.pacmouth = 320;
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
    if (typeof ObjectX.updateCenter === 'function'){ //Player object founded.
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

/* Function to draw collision detection reference points. Use to know where the points actualy are */
function collisionDetectionPoints() {
    var dotsize = powerdot.collisionsize;
    var playersize = player.collisionsize;
    var enemysize = enemy.collisionsize;
    
    /* drawing a collision detection area for powerdot*/
    context.fillStyle = "red";
    context.beginPath();
    context.arc(powerdot.x - dotsize, powerdot.y - dotsize, 2, 0, 2 * Math.PI, true); //x1 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(powerdot.x + dotsize, powerdot.y - dotsize, 2, 0, 2 * Math.PI, true); //x2 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(powerdot.x - dotsize, powerdot.y + dotsize, 2, 0, 2 * Math.PI, true); //x1 - y2
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(powerdot.x + dotsize, powerdot.y + dotsize, 2, 0, 2 * Math.PI, true); //x2 - y2
    context.closePath();
    context.fill();

    /* drawing a collision detection area for pacman*/
    context.fillStyle = "red"; //12 is the best size
    context.beginPath();
    context.arc(player.centerx - playersize, player.centery - playersize, 2, 0, 2 * Math.PI, true); //x1 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(player.centerx + playersize, player.centery - playersize, 2, 0, 2 * Math.PI, true); //x2 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(player.centerx - playersize, player.centery + playersize, 2, 0, 2 * Math.PI, true); //x1 - y2
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(player.centerx + playersize, player.centery + playersize, 2, 0, 2 * Math.PI, true); //x2 - y2
    context.closePath();
    context.fill();

    /* drawing pacman center */
    context.fillStyle = "white";
    context.beginPath();
    context.arc(player.centerx, player.centery, 2, 0, 2 * Math.PI, true); //center
    context.closePath();
    context.fill();
    
    /* drawing a collision detection area for enemy */
    context.fillStyle = "red"; //12 is the best size
    context.beginPath();
    context.arc(enemy.centerx - enemysize, enemy.centery - enemysize, 2, 0, 2 * Math.PI, true); //x1 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(enemy.centerx + enemysize, enemy.centery - enemysize, 2, 0, 2 * Math.PI, true); //x2 - y1
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(enemy.centerx - enemysize, enemy.centery + enemysize, 2, 0, 2 * Math.PI, true); //x1 - y2
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(enemy.centerx + enemysize, enemy.centery + enemysize, 2, 0, 2 * Math.PI, true); //x2 - y2
    context.closePath();
    context.fill();
    
    /* drawing enemy center */
    context.fillStyle = "white";
    context.beginPath();
    context.arc(enemy.centerx, enemy.centery, 2, 0, 2 * Math.PI, true); //center
    context.closePath();
    context.fill();
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
        /* Store all ghosts collors */
        enemy.oldGhostNum = enemy.ghostNum; //store the old ghost number for be able to return to correct ghost collor.
        /* Change all ghosts collors */
        enemy.ghostNum = 384; //setting to the "blinking" ghost.
        /* Change enemy eat state */
        enemy.eat = true;
    }
}

/* Function to play the game */
function endGame() {
    //finish game for some reason.
    //save states.
    //show retry or exit screen.
//    render(); //render the game canvas and elements.
//    requestAnimationFrame(playGame); //Window object function to make a animation loop.
}

/*  Function to render elements in canvas.
    This function rendering in order. It is work like layers. 
    First element - botton layer. Last element - top layer. */
function render() {
    /* Creating canvas background and size */
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    /* Update elements */
    powerdot.update();
    enemy.update();
    player.update();

    /* Collision detection */
    //Collision between player and dot
    if(collision(player, powerdot)){
        powerPillTime(); //make actions related to collision between player and powerdot.
    }
    Collision between player and ghost
    if (collision(player, enemy)) {
        if (player.countdown>0) {//player eat enemy
            //destroy enemy instance
            //add score points
        }
        else {//player die
            endGame();
        }
    }
    
    /* Drawing collision detection points on canvas. Just for debug purpose. */
    collisionDetectionPoints();

    /* Drawing elements */
    powerdot.draw();
    enemy.draw();
    player.draw();

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

    /* setting up center */
    player.updateCenter(); //player center
    enemy.updateCenter(); //enemy center

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
