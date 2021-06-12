var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;
var jumpSound , checkPointSound, dieSound;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  //to make game suitable for all screens
  createCanvas(windowWidth,windowHeight);
  
  //to create trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //to create ground
  ground = createSprite(width/2,height-80,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //to create gameOver Icon
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //to create restart Icon
  restart = createSprite(width/2,height/2-30);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //to create invisible ground
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  //to make the collider invisible
  trex.debug = false;
  
  background("skyblue");

  
  if (gameState===PLAY){
    
    //to increase the score 
    score = score + Math.round(getFrameRate()/60);
    
    
    ground.velocityX = -(6 + 3*score/100);
    
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    
    //to make trex jump
    if((touches.lenght>0||keyDown("space")) && trex.y >= height-120) {
      trex.velocityY = -12;
      jumpSound.play();
      touches=[];
    }
  
    //to give gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //to make the ground lenght infinite
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    //to make trex run on invisible ground
    trex.collide(invisibleGround);
    
    //to spawn clouds
    spawnClouds();
    
    //to spawn obstacles
    spawnObstacles();
    
    //to make following icons invisible during play state
    gameOver.visible = false;
    restart.visible = false;
    
    //to play checkpoint sound
    if(score>0 && score%100==0){
      checkPointSound.play();
    }
  
    //to change gameState
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
  else if (gameState === END) {
    
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //to reset the game after restart icon is pressed
   if(mousePressedOver(restart))
  {  reset();
  }}
 
  drawSprites();
  text("Score: "+ score,width/10,height/6);
  textSize=50;
}

function reset()
{
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
}

function spawnClouds() {
  //code to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height-400,width,10);
    cloud.y = Math.round(random(height-400,height-500));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX =-5;
    
     //assign lifetime to the variable
    cloud.lifetime = width/5;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width/2,height-90,width,40);
    
    //to make collider invisible
    obstacle.debug = false;
    
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

