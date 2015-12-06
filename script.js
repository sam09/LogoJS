var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

function lex(input) {
	var tokens = [];
	
	for(var i=0; i<input.length; i++) {
		if( isDigit(input[i] ) ) {
			c = extractNum(input, i);
			i += c.len;
			tokens.push({ "type" : "number",
						"value": c.val });
		}
		else if(isChar(input[i] ) ) {
			c = extractChar(input, i);
			i += c.len;
			tokens.push({ "type" : "command",
						  "value": c.val });
		}
		
	}
	return tokens;
}

function isDigit(i) {
	return /[0-9]/.test(i);
}

function extractNum(input, i) {
	var val = 0;
	var len = 0;
	while(i < input.length && isDigit(input[i]) ) {
		val = val*10 + parseInt(input[i]);
		len++;
		i++;
	}
	return {"len" : len,
			"val" : val};
}

function isChar(i) {
	return /[A-Z]/.test(i);
}

function extractChar(input, i) {
	var val = "";
	var len = 0;
	while(i < input.length && isChar(input[i]) ) {
		val = val + input[i];
		len++;
		i++;
	}
	
	return {"len" : len,
			"val" : val};
}

function parse(tokens) {
	var i = 0;
	while(i < tokens.length) {
		
		if( tokens[i].type == "command" ) {
			//console.log(tokens[i].type);
			if(tokens[i].value == "FW" || tokens[i].value == "BK" ) {
				draw(tokens[i].value, tokens[i+1].value);
				i = i+2;
			}
			else if(tokens[i].value == "LT" || tokens[i].value == "RT") {
				turn(tokens[i].value, tokens[i+1].value);			
				i = i+2;
			}
			else
				i++;
		}
		else {
			i++;
		}
	}
}

function draw( action, steps) {
	
	var stepsX = steps * Math.cos(angle);
	var stepsY = steps * Math.sin(angle);


	if(action == "FW" )
		stepsY *= (-1);

	if (action == "BK")
			stepsX *= (-1);
	console.log(stepsX);
	console.log(stepsY);
	
	console.log(angle * 180 / Math.PI);
	var moveX = prevX + stepsX;
	var moveY = prevY + stepsY;
	
	
	ctx.beginPath();
	ctx.strokeStyle = "#AA00EE";
	ctx.moveTo(prevX, prevY );
	ctx.lineTo(moveX, moveY);
	ctx.closePath();
	ctx.stroke();
	
	prevX = moveX;
	prevY = moveY;

	drawTurtle();
}

function turn( dir, degrees) {
	var rad = Math.PI * degrees / 180 ;
	if(dir == "RT")
		angle -= rad;
	else
		angle += rad;
	if( angle < 0 )
		angle = 2*Math.PI + angle;
	if (angle > 2*Math.PI)
		angle -= 2*Math.PI;
	drawTurtle();
}


function run(input) {
	var tokens = lex(input);
	parse(tokens);
}
function exec(){
	var input = document.getElementById("cmd").value;
	document.getElementById("cmd").value = "";
	run(input);
}
var canvas, ctx, angle, prevX, prevY, base;


function drawTurtle() {

	
	var turt = document.getElementById("turtle");
	turt.style.left = prevX;
	turt.style.top = prevY;		

	var turtCtx = turt.getContext("2d");


	turtCtx.clearRect(0, 0, 2* base, 2*base);
	turtCtx.fillStyle = "#37A047";


	var turtX, turtY;
	
	turtX = base * Math.sin(angle);
	turtY = base * Math.cos(angle);
	var X, Y;
	X = base;
	Y = base;


	turtCtx.beginPath();
	turtCtx.moveTo(X - turtX, Y - turtY);
	turtCtx.lineTo(X + turtY, Y - turtX);
	turtCtx.lineTo(X + turtX, Y  + turtY);
	turtCtx.closePath();
	turtCtx.fill();
}

window.onload = function () {
	canvas = createHiDPICanvas(700, 500);
	canvas.id = "canvas";
	canvas.style.marginLeft = window.width/2 + "px";

	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	
	var turt = createHiDPICanvas(200, 200);
	turt.id = "turtle";
	
	document.body.appendChild(turt);



	angle = Math.PI/2;
	prevX = 350;	prevY = 200;
	base = 10;
	drawTurtle();
	

}