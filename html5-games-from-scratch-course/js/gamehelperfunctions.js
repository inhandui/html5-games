export default class Helper {
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

    function UpdateCAll(element) { //update center of all objects
        element.updateCenter();
    }

    function drawAll(element) { //draw all objects
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

    function p_update() { //function to update player properties.
        if (this.countdown > 0) {
            this.countdown--;
        }
        this.move();
    }

    function p_move() { //function to do player movement 
        if (this.headdirection == 64 && this.sideCollision != "left") { //pac-man go to left 
            if (this.speed == 0) {
                this.speed = this.oldSpeed;
                this.sideCollision = undefined;
            }
            this.x -= this.speed;
        }
        if (this.headdirection == 96 && this.sideCollision != "up") { //pac-man go up
            if (this.speed == 0) {
                this.speed = this.oldSpeed;
                this.sideCollision = undefined;
            }
            this.y -= this.speed;
        }
        if (this.headdirection == 0 && this.sideCollision != "right") { //pac-man go to right
            if (this.speed == 0) {
                this.speed = this.oldSpeed;
                this.sideCollision = undefined;
            }
            this.x += this.speed;
        }
        if (this.headdirection == 32 && this.sideCollision != "bottom") { //pac-man go down
            if (this.speed == 0) {
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
                } else {
                    this.pacmouth = 320;
                }
            }
        } else { //pac-man is moving on y-axis
            if (this.y % 5 == 0) { //change mounth at every 5 px
                if (this.pacmouth == 320) {
                    this.pacmouth = 352;
                } else {
                    this.pacmouth = 320;
                }
            }
        }
    }

    function p_spaw() { //function to control player spaw.
        this.x = 50;
        this.y = 100;
    }

}