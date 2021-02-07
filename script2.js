let poseNet1;
let poseNet2;
let poses1 = [];
let poses2 = [];

let video1;
var video1IsPlaying; 

let video2;

function setup() {
  video1IsPlaying = false; 
  createCanvas(1024, 1400);
  video1 = createVideo('video.mp4', vidLoad);
  video1.size(1024, 576);

  video2 = createCapture(VIDEO);
  video2.size(400, 400);

  // Create a new poseNet method with a single detection
  poseNet1 = ml5.poseNet(video1, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet1.on('pose', function(results) {
    poses1 = results;
  });

  poseNet2 = ml5.poseNet(video2, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet2.on('pose', function(results) {
    poses2 = results;
  });
  // Hide the video element, and just show the canvas
  video1.hide();
  video2.hide();

}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video1, 0, 0);
  image(video2, 0, 700, 1024, 758);

  // We can call both functions to draw all keypoints and the skeletons
  getAngles();
}

// A function to draw ellipses over the detected keypoints
function getAngles()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses1.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses1[i].pose;
    A = pose.leftShoulder;
    B = pose.leftElbow;
    C = pose.leftWrist;
    //console.log(find_angle(A, B, C) * 180 / Math.PI);
  }
  for(var k = 0; k < poses2.length; k++) {
    var pose2 = poses2[k];
    // filter out poses that do not meet the minimum pose confidence.
    if (pose2.score >= 0.2) {
      var keypoints = pose2.keypoints;
      // draw keypoints
      for(var j = 0; j < keypoints.length; j++) {
        var keypoint = keypoints[j];
        // filter out keypoints that have a low confidence
        if (keypoint.score > 0.2) {
          // for wrists, make the part cyan
          fill(255, 0, 0);

          ellipse(keypoint.position.x, keypoint.position.y, 10, 10,);
        }
      }
    }
  }
}


// This function is called when the video loads
function vidLoad() {
  video1.stop();
  video1.loop();
  video1IsPlaying = true;
}

function keyPressed(){
  if (video1IsPlaying) {
    video1.pause();
    video1IsPlaying = false;
  } else {
    video1.loop();
    video1IsPlaying = true;
  }
}

function find_angle(A,B,C) {
  var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
  var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
  var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
  return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

function checkRightHand(pose1, pose2){
  A = pose.leftShoulder;
  B = pose.leftElbow;
  C = pose.leftWrist;
}

function checkRightArm(pose1, pose2){

}

function checkLeftHand(pose1, pose2){

}

function checkLeftArm(pose1, pose2){

}

function checkRightLeg(pose1, pose2){

}

function checkRightFoot(pose1, pose2){

}

function checkLeftLeg(pose1, pose2){

}

function checkLeftFoot(pose1, pose2){

}

function giveScore(a1, a2){
  if ((a1 - a2) / a1 < 0.1 && (a1 - a2) / a1 > -0.1){
    return 1
  }

  if ((a1 - a2) / a1 < 0.2 && (a1 - a2) / a1 > -0.2){
    return 0.5
  }

  if ((a1 - a2) / a1 < 0.4 && (a1 - a2) / a1 > -0.4){
    return 0.25
  }

  return 0;
}