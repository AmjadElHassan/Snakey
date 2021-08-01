//global canvas variables
let fruit, canvas, size = 400
//starting snake postion
let snake = [
    {x:200,y:200},
    {x:190,y:200},
    {x:180,y:200},
    {x:170,y:200},
    {x:160,y:200},
]
//displacement+velocity variables
let dx = 10
let dy = 0

// highest abstracted function for game process
main()
//eventListener for user inputs
document.addEventListener("keydown",changeSnakeDirection)

/**funtion main(): function that will manage the entire snake game process
 * @goals
 * - initialize a 2d canvas to display game on
 * - draw snake
 * - move snake with arrow keys
 * - apply boundary and body rules
 * - apply fruit mechanics with score
 */

function main(){
    canvas = initializeCanvas("gameboard", size)
    ctx = canvas.getContext("2d")
    drawSnake(ctx)
    gameLoop(ctx)
}

/**
 * function gameLoop(canvas): this will be the recurring function 
 * that will manage the gameplayloop that involves the snake's movement, fruit mechanic, and game over conditions
 * @param {Object} canvas 
 * @goals - manage snake movement
 * - manage fruit mechanic and snake growth
 * - manage iteration delay
 * - manage score
 * - manage gameOver conditions
 * @notes
 * - this should be a recursive solution that calls on itself until a gameOver condition is met
 */

function gameLoop(canvas){

    //terminating conditions check
    //fruit management
    //snakeMovement loop
    if (gameOver()){
        return
    }


    setTimeout(function(){
        clearCanvas(canvas)
        updateSnakePosition()
        fruitHandle()
        drawFruit(canvas)
        drawSnake(canvas)
        gameLoop(canvas)
    },100)

}

/**
 * function initializeCanvas: will apply a certain height and width property to a canvas object
 * @param {Object} canvas 
 * @param {Number} size 
 * @returns {Object} newly-sized canvas
 * 
 */

function initializeCanvas(canvasId,size){
    let canvasNode = document.getElementById(canvasId)
    canvasNode.width = size;
    canvasNode.height = size;
    return canvasNode
}

/**
 * function drawSnake(canvas): will draw a representation of the global snake variable onto specified canvas
 * @param {*} canvas 
 */

function drawSnake(canvas){
    snake.forEach(x=>drawSegment(x,canvas,"lightBlue", "darkBlue"))
}

/**
 * function updateSnakePosition(): this function will create the next frame in the snake movements
 * @notes
 * - I will have to add a node to the front of the snake based on its current dx/dy values
 * - I will have to pop the last item off the snake
 * @goals 
 * - simulate the snake moving 1 positon over
 */

function updateSnakePosition(){
    snake.unshift({x:snake[0].x+dx,y:snake[0].y+dy})
    snake.pop()
}


/**
 * function changeSnakeDirection(event): will change the direction of snake based on key presses
 * @param {Object} event
 */

function changeSnakeDirection(event){

    if (event.keyCode===38 && dy===0){
        dx = 0
        dy = -10
    } else if (event.keyCode === 40 && dy===0){
        dx=0
        dy = 10
    } else if (event.keyCode === 39 && dx===0){
        dx = 10
        dy = 0
    } else if (event.keyCode === 37 && dx===0){
        dx=-10
        dy=0
    }
}


//Game Over condition management
/**
 * function gameOver(): will detect and return a boolean to represent if gameOver conditions have been met
 * @Goals
 * - check if game has won: snake.length === totalArea/tileSize
 * - check if game has been lost: collision with snake body or with boundary
 */


function gameOver(){
    let gameWon = snake.length===(size*size)/100
    let boundaryCollision = (snake[0].x>=size||snake[0].x<0||snake[0].y>=size||snake[0].y<0)
    let bodyCollision = bodyCollisionCheck()
    if (gameWon||boundaryCollision||bodyCollision){
        return true
    } else {
        return
    }
}

function bodyCollisionCheck(){
    for (let i = snake.length-1;i>3;i--){
        if (snake[0].x===snake[i].x && snake[0].y === snake[i].y){
            return true
        }
    }
    return false
}


//Fruit related functions

/**
 * function FruitHandle(): this function will handle all processes related to our fruit game mechanic
 * @goals - should check for existence of fruit, if not: generate fruit
 * - fruit should be randomly generated on canvas positions where snake does nto already exist
 * - if snake head is on fruit, new fruit should be generated, and snake length should increase
 * - should update score with 10 point incrememnts per fruit
 * 
 */

function fruitHandle(){

    document.querySelector('#score').innerHTML = (snake.length-5)*10

    if (fruit===undefined){
        return randomizeFruitLocation();
    }

    if (fruitConsumed()){
        snake.unshift(fruit)
        return randomizeFruitLocation()
    }
}


/**
 * function drawFruit: draw fruit onto canvas
 */

function drawFruit(canvas){
    drawSegment(fruit, canvas, "orange", "red" )
}
/**
 * function fruitConsumed(): check if head and snake and fruit on same coordinates
 */

function fruitConsumed(){
    if (snake[0].x===fruit.x && snake[0].y===fruit.y){
        return true
    } else {
        false
    }
}

/**
 * function randomizeFruitLocation: will produce randomized locations that do not share any coordinates with our snake
 */

function randomizeFruitLocation(){
    
    let possibleNewLocation = {x:randomizeNumber(0,390),y: randomizeNumber(0,390)}
    
    snake.forEach(snakeSegment=>{
        if (snakeSegment.x===possibleNewLocation.x && snakeSegment.y===possibleNewLocation.y){
            return randomizeFruitLocation()
        }
    })
    fruit = possibleNewLocation
}
//
//functions that will draw onto canvas
//

/**
 * function drawSnake(): will draw a representation of our snake array onto our canvas
 * @param {Object} canvas 
 */


function drawSegment(segment, canvas,segmentFillStyle, segmentStrokestyle){
    canvas.fillStyle = segmentFillStyle;
    canvas.strokestyle = segmentStrokestyle;
    canvas.fillRect(segment.x,segment.y,10,10);
    canvas.strokeRect(segment.x,segment.y,10,10);
}

/**
 * function clearCanvas(canvas): apply clean white screen, remove snake and fruit
 * @param {*} canvas 
 */

function clearCanvas(canvas){
    canvas.fillStyle = "white";
    canvas.strokestyle= "black";
    canvas.fillRect(0,0,size,size)
    canvas.strokeRect(0,0,size,size)
}

/**
 * function randomizeNumber(min,max): function should randomly provide a number between the specified range
 * @param {Number} min 
 * @param {Number} max 
 */

function randomizeNumber(min,max){
    return Math.round(
        ((Math.random()*max)-(Math.random()-min)+min)/10
    )*10
}