// the main functionality of the flock/Boid code has been reused from 
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com 
//However, several modifications were made to bring in the concept of behavioural patterns

//DOCUMENT HALF PAGE
document.addEventListener("DOMContentLoaded", function () {
  const halfPage = document.getElementById('halfPage');
  const customCircle = document.getElementById('customCircle');

  customCircle.addEventListener('click', function () {
    halfPage.classList.toggle('show');
  });
});

// Particle object - these are particles that have a velocity and their direction is impacted by a force

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxSpeed = 5;
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  show() {
   // stroke(0, 0, 0, 255);
    fill(255,255,51);
    circle(this.pos.x,this.pos.y,8);// SIZE OF PARTICLES
    strokeWeight(2); // border
   // point(this.pos.x, this.pos.y);
  }
  
  
  //reset its position when it reaches the edge of the canvas
  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.x < 0) this.pos.x = width - 1;
    if (this.pos.y < 0) this.pos.y = height - 1;
  }
}


//dictionary - like a hashmap in Java
let noiseSeeds = {};
let isClicked=false;
let mX=0;
let mY = 0;
let cellsize=40;
let timer = 0;
let isFood = false;
let isCreated =false;
var totalParticles = 140;
var particles = [];
var timerVal = 0;

//width and height for resize
//et canvasDiv = document.getElementById('canvas');
//let cwidth = canvasDiv.offsetWidth;
//let cheight = canvasDiv.offsetHeight;


function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('canvas'); // This is assuming you want to append the canvas to an element with the id 'canvas'
  noiseSeeds.rx = random(250); //generate a random 0  to 249
  noiseSeeds.ry = random(250);
  noiseSeeds.gx = random(250);
  noiseSeeds.gy = random(250);
  noiseSeeds.bx = random(250);
  noiseSeeds.by = random(250);
  
  
  flock1 = new Flock(); //some class later flock has Boids
  flock2 = new Flock();
  flock3 = new Flock();
  
    
  // 100 particles
  for (var i = 0; i < totalParticles; i++) {
    particles[i] = new Particle();
  }
  
  // Add an initial set of boids into the system
  for (let i = 0; i < 15; i++) {          // i = number of fish (flock)
    let b1 = new Boid(width/ 2,height/ 2, 119,184,249); //check
    flock1.addBoid(b1);
    
    let b2 = new Boid(width/4 ,height/4, 127,0,255); //check
    flock2.addBoid(b2);
    
    let b3 = new Boid(width/6 ,height/1.5, 181,3,92); //check
    flock3.addBoid(b3);
  }
  
}

/*function windowResized() {
  cwidth = canvasDiv.offsetWidth;
  cheight = canvasDiv.offsetHeight;
 resizeCanvas(cwidth, cheight);
 }*/

function draw() {
  background(220);
  
  for (let x = 0; x < width; x += cellsize) {
    for (let y = 0; y < height; y += cellsize) {
      let r = noise(noiseSeeds.rx + x * 0.01, noiseSeeds.ry + y * 0.01)*255;
      let g = noise(noiseSeeds.gx + x * 0.01, noiseSeeds.gy + y * 0.01)*255;
      let b = noise(noiseSeeds.bx + x * 0.01, noiseSeeds.by + y * 0.01)*255;
    
    let xp=x/cellsize;
    let yp=y/cellsize;
    let mcX = parseInt(mX/cellsize);
    let mcY = parseInt(mY/cellsize);
    if(isClicked==true && xp==mcX && yp==mcY ){
        if(r>g){
          isFood = false;
        }
        else {
          //console.log(r,g);
          isFood=true;
          if(isCreated ==false){
             flock1.addBoid(new Boid(mX, mY));
             flock2.addBoid(new Boid(mX, mY));
             flock3.addBoid(new Boid(mX, mY));
             isCreated=true;
          }
        }
      }
    else
      fill(r, g, b);
    
    noStroke();
    rect(x, y, 40,40);
      circle(x,y,40); 
    }
  }
  noStroke();
  if(isClicked==true && mX>0 && mY>0 ){
        //console.log(isFood);
        if(isFood){
          fill(0,204,102,150);    //adding some transparency
          timerVal = 650;
        }
        else{
          fill(153,0,0,150);
          timerVal = 300;
        }
     circle(mX, mY, 150);
  }

  //fill(0,0,255);
  flock1.run();
  flock2.run();
  flock3.run();
  
  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    particles[i].update();
    particles[i].edges();
  }
  
  strokeWeight(2); // fish stroke weight
  timer++;
  if(timer>timerVal && isClicked==true){
    timer=0;
    isClicked=false;
    isFood=false;
    isCreated=false;
  }
}


// Add a new boid into the System
function mouseClicked() {
  mX=mouseX; 
  mY = mouseY; 
  isClicked=true;
  timer=0;
  
}


// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// modified and edited by Divya Ravi

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y, rc, gc, bc) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 2;    // Maximum speedf
  this.maxforce = 0.07; // Maximum steering force
  this.rc = rc;
  this.gc = gc;
  this.bc= bc;
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.2);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
 // fill(0,0,0);
  fill(this.rc,this.gc, this.bc,150); // add transparency here
  stroke(0);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
 
  ellipse(0, 0, 18, 36); 
  triangle(0, 16, -8, 32, 8, 32); 
  fill(255);
  ellipse(16 * 0.04, -3, 16 * 0.4); 
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 50.0; //Dispersion of fish
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    //console.log(sum.x, sum.y);
    sum.normalize();
    sum.mult(this.maxspeed);
    //identifies if the mouse is clicked
    //get the displacement of x and y necessary for velocity
    // either adds the velocity or subtracts it
    if(mX>0 && mY > 0 && isClicked){ 
      deltax =  mX - this.position.x;
      deltay =  mY - this.position.y;
    if(isFood) 
      this.velocity = createVector(deltax*0.00095 + this.velocity.x, deltay*0.00095 + this.velocity.y);
    else {
      this.velocity = createVector(this.velocity.x-deltax*0.00015,  this.velocity.y-deltay*0.00015 );
    }
      
    }
   
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
   // console.log(sum.x, sum.y);
    return this.seek(sum);  // Steer towards the location
      
  } else {
    return createVector(0, 0);
  }
}
//modified, edited and created by Divya Ravi