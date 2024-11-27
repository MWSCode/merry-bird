/*

links:
https://stackoverflow.com/questions/7193011/javascript-game-loop-that-runs-at-the-same-speed

*/

// variables:
var game_window = document.getElementById("game_window");
var bird_div = document.getElementById("bird");
var positionXY = document.getElementById("coordinates");
var obstacle_div = document.getElementById("obstacle");
var fps_div = document.getElementById("fps");
var score_span = document.getElementById("score");
let final_score_spans = document.getElementsByClassName('final_score');
var collisionCount_div = document.getElementById("collisionCount");
var hearts_span = document.getElementById("hearts");
var hearts_span2 = document.getElementById("hearts2");
var walls_spans = document.getElementsByClassName("walls");

let message_box = document.getElementById('message_box');
let message_windows = document.getElementsByClassName('message_window');
let start_message = document.getElementById('start_message');
let won_message = document.getElementById('won_message');
let hit_message = document.getElementById('hit_message');
let gameOver_message = document.getElementById('gameOver_message');

let sound_crash = document.getElementById('crash');
let sound_music = document.getElementById('music');
let sound_music2 = document.getElementById("music_2");
var collision_soundPlayed = 0;
let lastFrameCollision = 0;

var mouse_x_old = 0;
var mouse_y_old = 0;

// for keeping steady frame-rates and animation speed:
var timer = new DeltaTimer(25);	// object - delay till next frame in ms (50ms = 20fps, 25ms = 40fps, 30ms = 33.33fps, 20ms = 50fps...)
var start = 0;
var frames = 0;

let music_speed = 1;
let score = 0;
//

timer.start();

let obstacle = {
	x: obstacle_div.offsetLeft, 
	y: obstacle_div.offsetTop, 
	width: obstacle_div.offsetWidth, 
	height: obstacle_div.offsetHeight,
	right: 1,
}

let bird = {
	x: bird_div.offsetLeft, 
	y: bird_div.offsetTop, 
	width: bird_div.offsetWidth, 
	height: bird_div.offsetHeight,
}

// render/animation loop:
function render(time) {
    time -= start; // time = time - start (currentTime - actual-time)
	
	bird.x++;
	bird_div.style.left = bird.x+"px";
	
}

function DeltaTimer(interval) {
    var timeout;
    var lastTime;

    this.start = start;
    this.stop = stop;

    function start() {
        timeout = setTimeout(loop, 0);	// returns id
        lastTime = Date.now();
        return lastTime;
    }

    function stop() {
        clearTimeout(timeout);
        return lastTime;
    }

    function loop() {
        var currentTime = Date.now();
		/**/
        var deltaTime = currentTime - lastTime;
        var delay = Math.max(interval - deltaTime, 0);
        timeout = setTimeout(loop, delay);
        lastTime = currentTime + delay;
		
        render(currentTime);
    }
}