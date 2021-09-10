const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var board1,board2
var numberOfArrows = 15


function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);

  var options = {
    isStatic: true
  };
//creating player arrow and base
  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  //creating targets
   board1 = new Board(1150,100,width-970,200)
   board2 = new Board(1000,450,width-1000,height-330)

  /* con = Matter.Constraint.create({
    pointA:{x:200,y:20},
    bodyB:board1,
    pointB:{x:0,y:0},
    length:100,
    stiffness:0.1
  });

World.add(world,con);

con2 = Matter.Constraint.create({
  pointA:{x:200,y:20},pointA : {x:0,y:0},
bodyB : board2,
pointB : {x:0,y:0},
length :100,
stiffness :  0.1
})
World.add(world,con2)
*/

}

function draw() {
  background(backgroundImg);

  Engine.update(engine);
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  playerArcher.display();
  board1.display();
  board2.display();

  

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      )

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      )
    }
  }
  
  for (var i = 0; i < playerArrows.length; i++) {
    showCannonArrows(playerArrows[i], i);
    collisionWithboard(i);
  }

  // Title
  fill(226,95,63);
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  //arrow count display
  fill(92,141,238);
  textAlign("center");
  textSize(30);
  text("Arrows left : " + numberOfArrows,200,100);

}
function showCannonArrows(playerArrows, index) {
  if (playerArrows) {
    playerArrows.display();
    if (playerArrows.body.position.x >= width || playerArrows.body.position.y >= height - 50) {
      playerArrows.remove(index);
    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    if(numberOfArrows > 0){
     var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;
      //console.log(angle);

      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows = numberOfArrows-1
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function collisionWithboard(index) {
  for (var i = 0; i < board1.length; i++) {
    if (playerArrows[index] !== undefined && board1[i] !== undefined) {
      var collision = Matter.SAT.collides(playerArrows[index].body, board1[i].body);

      if (collision.collided) {
        board1[i].remove(i);

        Matter.World.remove(world, playerArrows[index].body);
        delete playerArrows[index];
      }
    }
  }
}