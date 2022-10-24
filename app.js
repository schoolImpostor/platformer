//document.getElementsByTagName("p")[0].innerHTML = ""; Println? or use alert();


// {
// Main Div
let container = document.querySelector(".game");
document.body.appendChild(container);

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2f7fef);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);

const stats = new Stats();
const statsElement = document.createElement("div");
let transformY = -window.innerHeight + "px";
statsElement.style.transform = `translate3d(0, ${transformY}, 0)`;
statsElement.appendChild(stats.domElement);
container.appendChild(statsElement);

//Stats
camera.position.z = 10;
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(0.7, 1.2, 1).normalize();
scene.add(light);
const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
light2.position.set(-0.7, 1.2, 1).normalize();
scene.add(light2);
//} Setup

let frameCount = 0;
const keys = {};
document.addEventListener("keydown", function(event) {
  keys[event.code] = true;
});
document.addEventListener("keyup", function(event) {
  keys[event.code] = false;
});

const level = [
  "0000000000",
  "0001000100",
  "001100L100",
  "0000000000",
  "1000000001",
  "100P000001",
  "01000000T0",
  "00111L1100",
  "0000000000",
  ];
const blocks = [];
let playerCubes = [];
let playerNames = [];

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function createName() {
  const prefix = randomFromArray([
    "Able",
    "Back",
    "Bare",
    "Bass",
    "Blue",
    "Bold",
    "Busy",
    "Calm",
    "Cold",
    "Cool",
    "Damp",
    "Dark",
    "Dead",
    "Deaf",
    "Dear",
    "Deep",
    "Dual",
    "Dull",
    "Dumb",
    "Easy",
    "Evil",
    "Fair",
    "Fast",
    "Fine",
    "Firm",
    "Flat",
    "Fond",
    "Foul",
    "Free",
    "Full",
    "Glad",
    "Good",
    "Grey",
    "Grim",
    "Half",
    "Hard",
    "Head",
    "High",
    "Holy",
    "Huge",
    "Just",
    "Keen",
    "Kind",
    "Last",
    "Late",
    "Lazy",
    "Like",
    "Live",
    "Lone",
    "Long",
    "Loud",
    "Main",
    "Mass",
    "Mean",
    "Mere",
    "Mild",
    "Nazi",
    "Near",
    "Neat",
    "Next",
    "Nice",
    "Okay",
    "Only",
    "Open",
    "Oral",
    "Pale",
    "Past",
    "Pink",
    "Poor",
    "Pure",
    "Rare",
    "Real",
    "Rear",
    "Rich",
    "Rude",
    "Safe",
    "Sick",
    "Slim",
    "Slow",
    "Soft",
    "Sole",
    "Sore",
    "Sure",
    "Tall",
    "Then",
    "Thin",
    "Tidy",
    "Tiny",
    "Tory",
    "True",
    "Ugly",
    "Vain",
    "Vast",
    "Vice",
    "Warm",
    "Wary",
    "Weak",
    "Wide",
    "Wild",
    "Wise",
  ]);
  const animal = randomFromArray([
    "Goat",
    "Bass",
    "Bear",
    "Bird",
    "Boar",
    "Carp",
    "Clam",
    "Crab",
    "Crow",
    "Deer",
    "Dove",
    "Duck",
    "Fish",
    "Flea",
    "Fowl",
    "Frog",
    "Goat",
    "Gull",
    "Hare",
    "Hawk",
    "Kiwi",
    "Lark",
    "Lion",
    "Lynx",
    "Mink",
    "Mite",
    "Mole",
    "Moth",
    "Mule",
    "Newt",
    "Orca",
    "Pike",
    "Pony",
    "Puma",
    "Slug",
    "Swan",
    "Tick",
    "Toad",
    "Tuna",
    "Vole",
    "Wasp",
    "Wolf",
    "Worm",
    "Beef",
    "Beet",
    "Cake",
    "Chow",
    "Clam",
    "Corn",
    "Crab",
    "Dill",
    "Fish",
    "Flan",
    "Food",
    "Gyro",
    "Hash",
    "Kale",
    "Lamb",
    "Lard",
    "Lime",
    "Loaf",
    "Meat",
    "Milk",
    "Mint",
    "Oats",
    "Pear",
    "Plum",
    "Pork",
    "Ribs",
    "Rice",
    "Roll",
    "Salt",
    "Slaw",
    "Soup",
    "Taco",
    "Tart",
    "Tofu",
    "Tuna",
    "Yolk",
  ]);
  return `${prefix} ${animal}`;
}
function moveCamera(x, y, times) {
  camera.position.x = (x-camera.position.x)/10/times+camera.position.x;
  camera.position.y = (y-camera.position.y)/10/times+camera.position.y;
}

function effect(x, y, z, color) {
  this.cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: color}));
  this.cube.scale.x = 0.1;
  this.cube.scale.y = 0.1;
  this.cube.scale.z = 0.1;
  this.cube.position.x = x;
  this.cube.position.y = y;
  this.cube.position.z = z;
  this.cube.rotation.x = Math.random()*Math.PI*2;
  this.cube.rotation.y = Math.random()*Math.PI*2;
  this.cube.rotation.z = Math.random()*Math.PI*2;
  this.velX = Math.random()*0.2-0.1;
  this.velY = Math.random()*0.3-0.1;
  this.velZ = Math.random()*0.2-0.1;
  scene.add(this.cube);
}
effect.prototype.update = function() {
  this.velY-=0.01;
  this.cube.position.x+=this.velX;
  this.cube.position.y+=this.velY;
  this.cube.position.z+=this.velZ;
  if(this.cube.position.y < -100){
    scene.remove(this.cube);
    this.dead = true;
  }
};

function block(x, y, type) {
  this.cube = new THREE.Mesh(geometry);
  this.cube.position.x = x;
  this.cube.position.y = y;
  this.cube.scale.x = 1;
  this.cube.scale.y = 1;
  this.type = type;
  let color;
  switch(type){
    case "1":
      color = 0x00ff00;
      break;
    case "T":
      color = 0xff00ff;
      break;
    case "L":
      color = 0xff2020;
      this.cube.scale.y=0.9;
      this.cube.scale.z = 0.9;
      this.cube.position.y-=0.05;
      this.cube.position.z-=0.05;
      break;
  }
  this.cube.material = new THREE.MeshLambertMaterial({color:color});
  scene.add(this.cube);
}

let playerId;
let playerRef;

function initGame() {
  let x = 0;
  let y = 0;
  let xVel = 0;
  let yVel = 0;
  let spawnX = 0;
  let spawnY = 0;
  
  let it = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.05, 8, 32),
    new THREE.MeshLambertMaterial( {color: 0xffff00} )
    );
  it.material.transparent = true;
  it.material.opacity = 0.5;
  it.rotation.x = Math.PI/2+0.1;
  scene.add(it);
  const effects = [];
  function spawnEffects(x, y, z, color, amount, offX, offY, offZ) {
    for(let i = 0; i < amount; i++){
      effects.push(new effect(x+Math.random()*offX*2-offX,y+Math.random()*offY*2-offY,z+Math.random()*offZ*2-offZ, color));
    }
  }
  function killEffects() {
    for(let i = effects.length-1; i >= 0; i--){
      if(effects[i].dead){
        effects.splice(i, 1);
      }
    }
  }
  
  let players = {};
  const allPlayersRef = firebase.database().ref('players');
  
  allPlayersRef.on("value", (snapshot) => {
    players = snapshot.val() || {};
  });
  allPlayersRef.on("child_removed", (snapshot) => {
    const removedPlayer = snapshot.val();
    scene.remove(playerCubes[removedPlayer.id]);
    playerCubes[removedPlayer.id] = undefined;
  });
  
  function spawn(particles) {
    if(particles){
      spawnEffects(x, y, 0, players[playerId].color, 150, 0.5, 0.5, 0.5);
      spawnEffects(x, y, 0, 0xff0000, 50, 0.5, 0.5, 0.5);
    }
    x = spawnX;
    y = spawnY;
    velX = 0;
    velY = 0;
  }
  let freezeTime = 0;
  function guy(times) {
    freezeTime--;
    if(freezeTime <= 0){
    players[playerId].froze = false;
    for(let i = 0; i < times; i++){
      // X movement
      if(keys.KeyA || keys.ArrowLeft){
        xVel-=0.05/times;
      }
      if(keys.KeyD || keys.ArrowRight){
        xVel+=0.05/times;
      }
      xVel*=Math.pow(0.75, 1/times);
      x+=xVel/times;
      for(let i = 0; i < blocks.length; i++){
        if(x+0.4 > blocks[i].cube.position.x-blocks[i].cube.scale.x/2 && x-0.4 < blocks[i].cube.position.x+blocks[i].cube.scale.x/2 && y+0.4 > blocks[i].cube.position.y-blocks[i].cube.scale.y/2 && y-0.4 < blocks[i].cube.position.y+blocks[i].cube.scale.y/2){
          xVel = 0;
          if(x > blocks[i].cube.position.x){
            x = blocks[i].cube.position.x+0.4+blocks[i].cube.scale.x/2+0.001;
          }else{
            x = blocks[i].cube.position.x-(0.4+blocks[i].cube.scale.x/2+0.001);
          }
          if(blocks[i].type == "L"){
            spawn(true);
          }
    
        }
      }
      
      // Y movement
      yVel-=0.035/times;
      yVel*=Math.pow(0.98, 1/times);
      y+=yVel/times;
      for(let i = 0; i < blocks.length; i++){
        if(x+0.4 > blocks[i].cube.position.x-blocks[i].cube.scale.x/2 && x-0.4 < blocks[i].cube.position.x+blocks[i].cube.scale.x/2 && y+0.4 > blocks[i].cube.position.y-blocks[i].cube.scale.y/2 && y-0.4 < blocks[i].cube.position.y+blocks[i].cube.scale.y/2){
          yVel = 0;
          if(y > blocks[i].cube.position.y){
            y = blocks[i].cube.position.y+0.4+blocks[i].cube.scale.y/2+0.001;
              if(keys.KeyW || keys.ArrowUp){
                yVel = 0.45;
              }
              if(blocks[i].type == "T"){
                yVel = 0.8;
              }
          }else{
            y = blocks[i].cube.position.y-(0.4+blocks[i].cube.scale.y/2+0.001);
          }
          if(blocks[i].type == "L"){
            spawn(true);
          }
        }
      }
    
      // Set camera to look at guy
      moveCamera(x, y, times);
    }
    }
    Object.keys(players).forEach((i) => {
      if(x+0.4 > players[i].x-0.4 && x-0.4 < players[i].x+0.4 && y+0.4 > players[i].y-0.4 && y-0.4 < players[i].y+0.4 && playerId != i){
        if(players[playerId].it == true){
          if(players[i].froze == true && players[playerId].froze == false){
            players[playerId].it = false;
          }
        }else{
          if(players[i].it == true && players[i].froze == false){
            players[playerId].it = true;
            players[playerId].froze = true;
            freezeTime = 60;
          }
        }
      }
    });
  }
  
  for(let yi = 0; yi < level.length; yi++){
    for(let xi = 0; xi < level[yi].length; xi++){
      if(level[yi][xi] == "P"){
        spawnX = xi;
        spawnY = -yi;
        spawn();
      }else if(level[yi][xi] != "0"){
        blocks.push(new block(xi, -yi, level[yi][xi]));
      }
    }
  }
  
  function draw() {
    allPlayersRef.once("value").then(function(snapshot) {
      players = snapshot.val() || {};               // LOOK AT MEEKSJ:FKLDJ:LSKJG:IKEJ:ISTJOIDUOTJ:SIDLJG:ILJITJ:SOIJDIOTJSI:HGDUIdsf
    });
    guy(100);
    
    let itId;
    Object.keys(players).forEach((i) => {
      if(!playerCubes[i]){
        playerCubes[i] = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: players[i].color}));
        playerCubes[i].scale.x = 0.8;
        playerCubes[i].scale.y = 0.8;
        playerCubes[i].scale.z = i == playerId ? 0.8 : 0.79;
        scene.add(playerCubes[i]);
      }
      playerCubes[i].position.x = players[i].x;
      playerCubes[i].position.y = players[i].y;
      if(players[i].it == true){
        itId = i;
        it.position.x = players[i].x;
        it.position.y = players[i].y+0.6;
      }
    });
    if(!itId){
      players[playerId].it = true;
      it.position.x = players[playerId].x;
      it.position.y = players[playerId].y+0.6;
    }
    
    // Update FireBase
    players[playerId].x = x;
    players[playerId].y = y;
    playerRef.set(players[playerId]);

    for(let i = 0; i < effects.length; i++){
      effects[i].update();
    }
    killEffects();
  }
  
  function animate() {
  	requestAnimationFrame(animate);
  	frameCount++;
  	draw();
  	renderer.render(scene, camera);
  	stats.update();
  }
  animate();
}

firebase.auth().onAuthStateChanged((user) => {
  if(user){
    // You're logged in
    playerId = user.uid;
    playerRef = firebase.database().ref(`players/${playerId}`);

    const name = createName();
    
    playerRef.set({
      id: playerId,
      name,
      color: 0xffffff*Math.random(),
      x: 0,
      y: 0,
      it: false,
      froze: false
    });
    
    playerRef.onDisconnect().remove();
    
    initGame();
    
  }else{
    // You're logged out
  }
});
firebase.auth().signInAnonymously().catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  
  alert(errorCode, errorMessage);
});