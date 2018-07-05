/* Global Game Manager Variables */
var canvas; //used to manage canvas 
var context; //used to create context elements


/* function to setup the Game Manager */
function setup(){
    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');
    canvas.height = 400;
    canvas.width = 600;

    document.body.appendChild(canvas);
    context.fillText("Hello World",10,150);

}