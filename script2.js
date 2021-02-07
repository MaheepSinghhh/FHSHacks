let poseNet1;
let poseNet2;
let poses1 = [];
let poses2 = [];

let count = 0;

let points = 0;

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

  count += 1;

  // We can call both functions to draw all keypoints and the skeletons
  
  if (count == 20){
    getAngles();
    count = 0;
  }
  
}

// A function to draw ellipses over the detected keypoints
function getAngles()  {
  // Loop through all the poses detected
  if (poses1.length > 0 && poses2.length > 0){
    
    var pose1 = poses1[0].pose;
    var pose2 = poses2[0].pose;

    console.log(checkRightHand(pose1, pose2));
    points += checkRightHand(pose1, pose2);// + checkRightArm(pose1, pose2) + checkLeftHand(pose1, pose2) + checkLeftArm(pose1, pose2) + checkRightLeg(pose1, pose2) + checkRightFoot(pose1, pose2) + checkLeftLeg(pose1, pose2) + checkLeftFoot(pose1, pose2);
    document.getElementById("Score").innerHTML = points;
    console.log(points);
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
  var A1 = pose1.rightShoulder;
  var B1 = pose1.rightElbow;
  var C1 = pose1.rightWrist;

  var A2 = pose2.rightShoulder;
  var B2 = pose2.rightElbow;
  var C2 = pose2.rightWrist;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  console.log("Here");

  return giveScore(a1, a2);
}

function checkRightArm(pose1, pose2){
  A1 = pose1.rightElbow;
  B1 = pose1.rightShoulder;
  C1 = pose1.rightHip;

  A2 = pose2.rightElbow;
  B2 = pose2.rightShoulder;
  C2 = pose2.rightHip;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);

}

function checkLeftHand(pose1, pose2){
  A1 = pose1.leftShoulder;
  B1 = pose1.leftElbow;
  C1 = pose1.leftWrist;

  A2 = pose2.leftShoulder;
  B2 = pose2.leftElbow;
  C2 = pose2.leftWrist;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);
}

function checkLeftArm(pose1, pose2){
  A1 = pose1.leftElbow;
  B1 = pose1.leftShoulder;
  C1 = pose1.leftHip;

  A2 = pose2.leftElbow;
  B2 = pose2.leftShoulder;
  C2 = pose2.leftHip;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);
}

function checkRightLeg(pose1, pose2){
  A1 = pose1.rightShoulder;
  B1 = pose1.rightHip;
  C1 = pose1.rightKnee;

  A2 = pose2.rightShoulder;
  B2 = pose2.rightHip;
  C2 = pose2.rightKnee;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);
}

function checkRightFoot(pose1, pose2){
  A1 = pose1.rightHip;
  B1 = pose1.rightKnee;
  C1 = pose1.rightAnkle;

  A2 = pose2.rightHip;
  B2 = pose2.rightKnee;
  C2 = pose2.rightAnkle;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);
}

function checkLeftLeg(pose1, pose2){
  A1 = pose1.leftShoulder;
  B1 = pose1.leftHip;
  C1 = pose1.leftKnee;

  A2 = pose2.leftShoulder;
  B2 = pose2.leftHip;
  C2 = pose2.leftKnee;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);
}

function checkLeftFoot(pose1, pose2){
  A1 = pose1.leftHip;
  B1 = pose1.leftKnee;
  C1 = pose1.leftAnkle;

  A2 = pose2.leftHip;
  B2 = pose2.leftKnee;
  C2 = pose2.leftAnkle;

  a1 = find_angle(A1, B1, C1);
  a2 = find_angle(A2, B2, C2);

  return giveScore(a1, a2);

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