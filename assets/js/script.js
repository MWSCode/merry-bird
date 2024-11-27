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

// get window dimensions:
let = game_window = document.getElementById("game_window");
function get_window_dimensions() {
	window_width = getComputedStyle(game_window).width;
	window_width = Number(window_width.slice(0,-2));	// remove px
	window_height = getComputedStyle(game_window).height;
	window_height = Number(window_height.slice(0,-2));
	/*positionXY.innerHTML = `bird: x: ${bird.x} - y: ${bird.y} | width: ${bird.width} height: ${bird.height}<br>
	window: with: ${window_width} - ${window_height}`; */
	
}
get_window_dimensions()
new ResizeObserver(get_window_dimensions).observe(game_window);
//

// ### moving the player:
// Key-control:
let key_timeout;
let key_pressed = "";
let time_now = last_time = 0;
document.addEventListener("keydown", key_pressed_func); // Arrow keys are only triggered by onkeydown, not onkeypress 
document.addEventListener("keyup", key_released);
let keypress_number = 0;
function key_pressed_func(e){
	
	const allowedKeys = [
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
	];
	if (key_pressed == ""){
		key_pressed = e.key;
	}
	if (allowedKeys.includes(key_pressed)) {
		//e.preventDefault();
		switch (key_pressed) {
			case "ArrowUp":
				move("up");
				break;
			case "ArrowDown":
				move("down");
				break;
			case "ArrowLeft":
				move("left");
				break;
			case "ArrowRight":
				move("right");
				break;
		}
	}
	
	// limit the speed of key-firings
	time_now = Date.now();
	let time_passed = time_now - last_time;
	if(time_passed >= 8){
		//fps_div.innerHTML = keypress_number++;
		//fps_div.innerHTML = key_pressed;
		key_timeout = setTimeout(key_pressed_func, 8);
		last_time = Date.now();
	}
	
}
function key_released(e){
	//fps_div.innerHTML = "key_up";
	key_pressed = "";
	clearTimeout(key_timeout);
}
// Function to move Player
function move(direction) {
	let currentTopPx = parseInt(bird_div.offsetTop);
	let currentLeftPx = parseInt(bird_div.offsetLeft);
	
	switch (direction) {
		case "up":
			currentTopPx -= 3;
			break;
		case "down":
			currentTopPx += 3;
			break;
		case "left":
			currentLeftPx -= 3;
			break;
		case "right":
			currentLeftPx += 3;
			break;
		default:
			alert("Not a valid input");
	}
	
	bird_div.style.top = currentTopPx + "px";
	bird_div.style.left = currentLeftPx + "px";
}
//

// BUTTON-control
const control_buttons = document.querySelectorAll("#buttons button");
const mouse_fireRate = 20;
var mouseFireTimeout = null;
let adad = 1;
var button_event = null;
document.addEventListener("DOMContentLoaded", function() {
	function startFire(e) {
		mouseFireTimeout = setInterval(moveByButtonClick, 8);
		//document.getElementById("buttonFire").innerHTML = "Fire"+mouseFireTimeout;
		button_event = e;
	}
	
	for (let button1 of control_buttons) {
		button1.addEventListener("mousedown", startFire);
		button1.addEventListener("mouseup", stopFire);
	}
	function moveByButtonClick() {
		let direction = button_event.target.getAttribute("data-direction");
		move(direction);
	}
});
function stopFire() {
	clearInterval(mouseFireTimeout);
	//document.getElementById("buttonFire").innerHTML = "Fire stopped"+mouseFireTimeout;
}
//

// render/animation loop:
function render(time) {
    time -= start; // time = time - start (currentTime - actual-time)
	
	//bird.x++;
	//bird_div.style.left = bird.x+"px";
	
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