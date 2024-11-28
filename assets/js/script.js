/*
Merri-Bird v.1 (c) Mamali-Workshop 11-2024

used help and idea resources:
https://stackoverflow.com/questions/7193011/javascript-game-loop-that-runs-at-the-same-speed
https://stackoverflow.com/questions/2440377/javascript-collision-detection
https://stackoverflow.com/questions/9419263/how-to-play-audio
https://stackoverflow.com/questions/9437228/html5-check-if-audio-is-playing
https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
https://stackoverflow.com/questions/40048595/repeat-function-constantly-on-mousedown
https://stackoverflow.com/questions/6492683/how-to-detect-divs-dimension-changed
https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
https://stackoverflow.com/questions/10614481/disable-double-tap-zoom-option-in-browser-on-touch-devices
*/

// variables:
let game_window = document.getElementById("game_window");
var bird_div = document.getElementById("bird");
var positionXY = document.getElementById("coordinates");
var obstacle_div = document.getElementById("obstacle");
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


// for keeping steady frame-rates and animation speed:
var timer = new DeltaTimer(20);	// object - delay till next frame in ms (50ms = 20fps, 25ms = 40fps, 30ms = 33.33fps, 20ms = 50fps...)
var start = 0;
var frames = 0;

let music_speed = 1;
let score = 0;
//

function initial_values(){
	score_span.innerHTML = "0";
	score = 0;
	obstacle.speed = 2;
	obstacle.topBottom = 0;
	obstacle.passed = 0;
	obstacle.height = 20;
	obstacle.y = 0;
	obstacle.right = 0;
	obstacle.total_count = 10;
	
	bird.hearts = 3;
	
	music_speed = 1;
}

function start_game(){
	message_box.style.display = "none";
	
	initial_values();
	
	obstacle_div.style.height = obstacle.height+"%";
	
	obstacle_div.style.right = 0;
	obstacle_div.style.top = 0;
	
	//start = timer.start();		// get actual Time (milliseconds since 1.Jan-1970)
	animation.start();
	
	sound_music.currentTime = 0;
	sound_music2.currentTime = 0;
	sound_music.play();
	
	bird_div.style.left = "50px";
	bird_div.style.top = "calc(50% - 20px)";
	bird.x = bird_div.offsetLeft;
	bird.y = bird_div.offsetTop;
}
function game_won_message(){
	//timer.stop();
	animation.stop();
	
	for(let score_span of final_score_spans){
		score_span.innerHTML = score;
	}
	
	message_box.style.display = "flex";
	for(message_win of message_windows){
		message_win.style.display = "none";
	}
	won_message.style.display = "block";
	sound_music.pause();
	sound_music.currentTime = 0;
	sound_music2.pause();
	sound_music2.currentTime = 0;
}
function crashed_message(){
	stopFire();
	message_box.style.display = "flex";
	for(message_win of message_windows){
		message_win.style.display = "none";
	}
	hit_message.style.display = "block";
}
function continue_game(){
	obstacle.right = 0;
	obstacle_div.style.right = 0;
	obstacle.y = 0;
	obstacle_div.style.top = 0;
	obstacle_div.style.height = "15%";
	message_box.style.display = "none";
	//start = timer.start();		// get actual Time (milliseconds since 1.Jan-1970)
	animation.start();
	
	if(music_speed == 1){
		sound_music.currentTime = 0;
		sound_music.play();
	}else if(music_speed == 2){
		sound_music2.currentTime = 0;
		sound_music2.play();
	}
	
	bird_div.style.left = "30px";
	bird_div.style.top = "calc(50% - 20px)";
	bird.x = bird_div.offsetLeft;
	bird.y = bird_div.offsetTop;
}
function game_over_message(){
	//timer.stop();
	animation.stop();
	
	for(let score_span of final_score_spans){
		score_span.innerHTML = score;
	}
	
	message_box.style.display = "flex";
	for(message_win of message_windows){
		message_win.style.display = "none";
	}
	gameOver_message.style.display = "block";
}

let animationInverval = null;
let animation = {
	speed: 1,
	frame_duration: 25,
	start(){
		animationInverval = setInterval(animation_loop_func, this.frame_duration);
	},
	stop(){
		clearInterval(animationInverval);
	},
};

let obstacle = {
	x: obstacle_div.offsetLeft, 
	y: obstacle_div.offsetTop, 
	width: obstacle_div.offsetWidth, 
	height: obstacle_div.offsetHeight,
	right: 1,
	total_count: 5,
	passed: 0,
	speed: 2,
	topBottom: 1
}

let bird = {
	x: bird_div.offsetLeft, 
	y: bird_div.offsetTop, 
	width: bird_div.offsetWidth, 
	height: bird_div.offsetHeight,
	hearts: 5
}

// ### moving the player:
// Key-control:
let key_timeout;
let key_pressed = "";
let time_now = last_time = 0;
document.addEventListener("keydown", key_event); // Arrow keys are only triggered by onkeydown, not onkeypress 
document.addEventListener("keyup", key_released);
let keypress_number = 0;

function key_event(e){
	//return e;
	key_pressed = e.key;
	
	
}


function key_released(e){
	
	key_pressed = "";
	//clearTimeout(key_timeout);
}
// Function to move Player
function move(direction) {
	let currentTopPx = parseInt(bird_div.offsetTop);
	let currentLeftPx = parseInt(bird_div.offsetLeft);
	
	switch (direction) {
		case "up":
			currentTopPx -= 8;
			break;
		case "down":
			currentTopPx += 8;
			break;
		case "left":
			currentLeftPx -= 8;
			break;
		case "right":
			currentLeftPx += 8;
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
let mouseFireTimeout = null;
let adad = 1;
var button_event = null;
document.addEventListener("DOMContentLoaded", function() {
	function startFire(e) {
		mouseFireTimeout = setInterval(moveByButtonClick, 20);
		//document.getElementById("buttonFire").innerHTML = "Fire"+mouseFireTimeout;
		button_event = e;
	}
	
	for (let button1 of control_buttons) {
		button1.addEventListener("mousedown", startFire);
		button1.addEventListener("mouseup", stopFire);
		
		button1.addEventListener("ontouchstart", startFire);
		button1.addEventListener("ontouchend", stopFire);
	}
	function moveByButtonClick() {
		let direction = button_event.target.getAttribute("data-direction");
		move(direction);
		//document.getElementById("buttonFire").innerHTML = ++adad;
	}
});
function stopFire() {
	clearInterval(mouseFireTimeout);
	//document.getElementById("buttonFire").innerHTML = "Fire stopped"+mouseFireTimeout;
}
//

/**
* @param {string} time
* 
*/

const allowedKeys = [
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
];

// get window dimensions:
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

// render/animation loop:
function animation_loop_func() {
    // time -= start; // time = time - start (currentTime - actual-time)
	
	// processing player movement:
	if (key_pressed != ""){
		//key_pressed = e.key;
		
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
	}


	
	hearts_span.innerHTML = bird.hearts;
	
	obstacle.x = obstacle_div.offsetLeft;
	obstacle.y = obstacle_div.offsetTop;
	obstacle.width = obstacle_div.offsetWidth;
	obstacle.height = obstacle_div.offsetHeight;
	
	bird.x = bird_div.offsetLeft;
	bird.y = bird_div.offsetTop;
	bird.width = bird_div.offsetWidth;
	bird.height = bird_div.offsetHeight;
	
	
	
	// keep the bird inside window
	if(bird.x == 0 || bird.x < 0){
		bird_div.style.left = 0;
	}else if(bird.y <= 0){
		bird_div.style.top = 0;
	}else if (window_width <= (bird.x+bird.width)){
		bird_div.style.left = window_width-bird.width+"px";
	}else if(window_height <= (bird.y+bird.height)){
		bird_div.style.top = window_height-bird.height+"px";
	}
	//
	
	// ### create/change/move wall and speed change:
	obstacle.right = obstacle.right+obstacle.speed+obstacle.passed;		// change wall-speed
	obstacle_div.style.right = obstacle.right+"px";		// move the wall
	if((obstacle.right-20) > window_width){	// when wall passed the window, create new wall:
		obstacle.right = 0;
		obstacle.passed++;
		
		window_height = Math.ceil(window_height);
		let obstacle_max_height = Math.floor(window_height - (bird.height + (window_height / 10)));
		let obstacle_min_height = Math.floor(window_height / 5);
		obstacle.height = Math.floor(Math.random() * (obstacle_max_height - obstacle_min_height)) + obstacle_min_height;
		//obstacle.height = obstacle_min_height;
		
		// choose top or bottom position of the wall
		if(obstacle.topBottom == 1){
			obstacle.y = 0;
		}else{
			obstacle.y = window_height - obstacle.height;
		}
		obstacle.topBottom = Math.round(Math.random());
		
		obstacle_div.style.top = obstacle.y+"px";
		obstacle_div.style.height = obstacle.height+"px";
		
		score = obstacle.passed * bird.hearts;
		score_span.innerHTML = score;
	}
	//
	
	// set music type / speed
	if(obstacle.passed >= 5){
		music_speed = 2;
		sound_music.playbackRate = 1;
		sound_music.pause();
		sound_music.currentTime = 0;
		
		sound_music2.play();
		
	}
	if(obstacle.passed > 2 && obstacle.passed < 5){
		music_speed = 1;
		sound_music.playbackRate = 2;
		sound_music.play();
		
		sound_music2.pause();
		sound_music2.currentTime = 0;
	}
	if(obstacle.passed >= 0 && obstacle.passed <= 2){
		music_speed = 1;
		sound_music.playbackRate = 1;
		sound_music.play();
		//positionXY.innerHTML = "1 divar raft";
	}
	//
	
	
	for(let walls_span of walls_spans){
		walls_span.innerHTML = obstacle.passed;
	}
	
	// collision detection
	let collided = collision(bird, obstacle);
	if(collided == !false){	// when collided
		if(lastFrameCollision == 0){		// don't count collision if collision already happened
			//obstacle.speed = obstacle.speed +2;
			//collisionCount_div.innerHTML = "Collision(speed): "+obstacle.speed;
			
			bird_div.style.background = "url('assets/images/merry-bird-crash.gif')";
			
			if(sound_crash.paused && !collision_soundPlayed){	// prevent repeated playbacks
				sound_crash.play();
				collision_soundPlayed = 1;
				
			}
			
			//timer.stop();
			animation.stop();
			sound_music.pause();
			sound_music.currentTime = 0;
			sound_music2.pause();
			sound_music2.currentTime = 0;
			
			bird.hearts--;
			obstacle.speed++;
			hearts_span.innerHTML = bird.hearts;
			hearts_span2.innerHTML = bird.hearts;
			crashed_message();
			
		}
		lastFrameCollision = 1;
		
	}else{
		bird_div.style.background = 'url("assets/images/merry-bird.gif")';
		collision_soundPlayed = 0;
		lastFrameCollision = 0;
	}
	//
	
	// when won:
	if(obstacle.passed == obstacle.total_count){
		game_won_message();
	}
	//
	
	// when game-over:
	if(bird.hearts <= 0){
		game_over_message();
	}
	//
	
}

function collision(a, b) {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	);
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
