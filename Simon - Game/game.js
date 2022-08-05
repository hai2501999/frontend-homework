var buttonColours = ["red","blue","green","yellow"];
// var randomChosenColour = []];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

$(document).keypress(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  };
});

$(".btn").click(function() {

  var userChosenColour = $(this).attr("id");
  //console.log(userChosenColour);
  userClickedPattern.push(userChosenColour);

  // console.log(userClickedPattern);
  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length-1);
});



function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    // chose right
    console.log("success");
    //console.log(userClickedPattern[userClickedPattern.length-1]);
    //console.log(gamePattern[userClickedPattern.length-1]);
    if (userClickedPattern.length === gamePattern.length){
      setTimeout(function() {
        nextSequence();
      }, 1000);

    }
  } else {
    console.log("wrong");
    //console.log(userClickedPattern[userClickedPattern.length-1]);
    //console.log(gamePattern[userClickedPattern.length-1]);
    playSound("wrong");
    $("body").addClass("game-over");

    setTimeout(function() {
      $("body").removeClass("game-over");
    },200);

    $("#level-title").text("Game Over, Press Any Key to Restart");

    startOver();
  }
}

// function to change h1 title
function changeTitleLevel(level) {
  $("h1").text("Level " + String(level));
  level++;
}


function nextSequence() {

  // empty userClickedPattern
  userClickedPattern = [];

  //Start
  changeTitleLevel(level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);
}

function playSound(name) {

  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();

}

function animatePress(color) {
  $("#" + color).addClass("pressed");

  setTimeout(function() {
    $("#" + color).removeClass("pressed");
  },100);
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
