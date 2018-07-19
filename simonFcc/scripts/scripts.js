var green = document.getElementById("green");
var red = document.getElementById("red");
var yellow = document.getElementById("yellow");
var blue = document.getElementById("blue");
var startBtn = document.getElementById("start-btn");
var strictBtn = document.getElementById("strict-btn");
var cycles = document.getElementById("cycles");

var simonSound = [
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
];

var pads = [green, red, yellow, blue];
var activeColor = [
  "rgb(0, 187, 0)",
  "rgb(255, 95, 95)",
  "rgb(255, 255, 180)",
  "rgb(95, 95, 255)"
];
var inactiveColor = ["green", "red", "yellow", "blue"];

var game = {
  plays: [],
  repeats: [],
  machinePlaying: false,
  playerSuccess: true,
  random: function(num) {
    return Math.floor(Math.random() * num);
  },
  //strict patern generation
  strict: function() {
    game.plays.forEach(function(play) {
      play = game.random();
    })
  },
  //machine patern generation and display
  machineTurn: function() {
    game.machinePlaying = true;
    if (game.plays.length < 20) {
      if(game.playerSuccess) {
        game.plays.push(game.random(4).toString());
      }
      cycles.firstChild.innerText = `${game.plays.length}`;
      var i = 0;
      var macPlay = setInterval(function() {
        if(game.machinePlaying === false) {
          clearInterval(macPlay);
        };
        pads[game.plays[i]].style.background = `${activeColor[game.plays[i]]}`;
        simonSound[game.plays[i]].play();
        setTimeout(function() {
          pads[game.plays[i - 1]].style.background = `${
            inactiveColor[game.plays[i - 1]]
          }`;
        }, 700);
        i += 1;
        if (i >= game.plays.length) {
          clearInterval(macPlay);
          game.machinePlaying = false;
        }
      }, 1000);
      //complete human pattern match of twenty cycles
    } else {
      $("#controls").append('<p id="won">You Won</p>');
      $("#won").fadeOut(2000);
      game.playsClear();
      startBtn.style.background = "red";
      game.machinePlaying = false;
    }
    
  },
  // clear all game play
  playsClear: function() {
    game.plays = [];
    game.repeats = [];
    cycles.firstChild.innerText = `${game.plays.length}`;
  },
  // human play conditional activity function
  playerPlays: function() {
    //check if game has started
    if (startBtn.style.background != "green" || game.machinePlaying) {
      return;
    }
    game.repeats.push(this.dataset.place);
    console.log(game.plays);
    console.log(game.repeats);
    
    var pcThis = this;
    //If not matching play
    if (!game.checkWinCondition()) {
      var i = 0;
      var pcSI = setInterval(function() {
        pcThis.style.background = activeColor[pcThis.dataset.place];
        simonSound[pcThis.dataset.place].play();
        setTimeout(function() {
          pcThis.style.background = inactiveColor[pcThis.dataset.place];
          if (i === 4) {
            clearInterval(pcSI);
          }
        }, 600);
        i += 1;
      }, 650);
      game.playerSuccess = false;
      // game.plays.pop();
      if (strictBtn.style.background === "green") {
        game.strict();
      }
      game.repeats = [];
      setTimeout(function() {
        game.machineTurn();
      },2000);
    // completed patern match  
    } else if (game.repeats.length === game.plays.length) {
      game.repeats = [];
      game.playerSuccess = true;
      game.machineTurn();
    } 
  },
  //checking for maching human plays
  checkWinCondition: function() {
    return game.repeats.every(function(repeat, index) {
      return game.plays[index] === repeat;
    })
  }
}
// color pad interaction functionallity
pads.forEach(function(pad) {
  pad.addEventListener("click", game.playerPlays);
  pad.addEventListener("mousedown", function() {
    event.target.style.background = `${
      activeColor[event.target.dataset.place]
    }`;
    simonSound[event.target.dataset.place].play();
  });
  pad.addEventListener("mouseup", function() {
    event.target.style.background = `${
      inactiveColor[event.target.dataset.place]
    }`;
  });
});
// strick function button
strictBtn.addEventListener("click", function() {
  if(strictBtn.style.background != "green") {
    strictBtn.style.background = "green";
  } else {
    strictBtn.style.background = "red";
  }
});
// start function button
startBtn.addEventListener("click", function() {
  if (startBtn.style.background != "green") {
    startBtn.style.background = "green";
    $("#start p").text('stop');
    game.machineTurn();
  } else {
    game.playsClear();
    startBtn.style.background = "red";
    $("#start p").text('start');
    game.machinePlaying = false;
  }
});
