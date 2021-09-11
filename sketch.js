var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage1,cloudImage2,cloudImage3;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var Background,backgroundImage,sun,sunImage;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png");
  trex_collided = loadAnimation("trexcollided.png");
  
  groundImage = loadImage("ground.png");
  
  BackgroundImage = loadImage("backgroundImg.png")
  
  cloudImage1 = loadImage("cloud1.png");
  cloudImage2 = loadImage("cloud2.png");
  cloudImage3 = loadImage("cloud3.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png");
  sunImage = loadImage("sun.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint2.mp3")
}

function setup() {
  createCanvas(displayWidth,displayHeight-145);
  
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.2;
  
  ground = createSprite(200,height+20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  sun = createSprite(width-70,70,10,10);
  sun.addImage("sun",sunImage);
  sun.scale=0.4;
  
   gameOver = createSprite(width/2,height/3);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/1.5);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.7;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",-10,0,160,trex.height);
  trex.debug = false ;
  
  score = 0;
  
}

function draw() {
 background(BackgroundImage)
 
  //displaying score
  textFont("harrington");
  textSize(50);
  stroke(355,160,10)
  text("Score: "+ score, 30,50);
  
  console.log("this is ",gameState)
  
  ground.depth = trex.depth;
  trex.depth = trex.depth +1;
 
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(6  + 3*score / 100);
    //scoring
    score = score + Math.round(frameCount%5===0);
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
      
    }
    
    
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) &&       trex.y >= height-200) {
    jumpSound.play( )
    trex.velocityY = -10;
    touches = [];
}
    
    if (score > 0 && score%100 === 0){
    checkPointSound.play();
     
   }
  
    
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
      
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 5
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      if (mousePressedOver(restart) || touches.length > 0){
    reset();
    touches = [ ];
   }
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
    
   }
  
 
  
 
 
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 90 === 0){
   var obstacle = createSprite(windowWidth,height-85,10,40);
    obstacle.velocityX = - (6 + 3*score / 100)
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = windowWidth;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
   ground.depth = obstacle.depth;
   obstacle.depth = obstacle.depth + 1;
   
   obstacle.setCollider("rectangle",0,0,160,100);
   obstacle.debug= false  ;
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % Math.round(random(70,60,90,100,120,130)) === 0) {
     cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(100,windowHeight-200));
   var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: cloud.addImage(cloudImage1);
              break;
      case 2: cloud.addImage(cloudImage2);
              break;
      case 3: cloud.addImage(cloudImage3);
              break;

      default: break;
    }
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = windowWidth;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloud.depth = restart.depth;
    restart.depth = restart.depth - 1;
    
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}
