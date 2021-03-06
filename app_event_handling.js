const points = [];
const r = 1;
class Point{
	constructor(degree){
		this.x = parseFloat(r * Math.cos(toRadians(degree))).toFixed(2);
        this.y = parseFloat(r * Math.sin(toRadians(degree))).toFixed(2);
		this.degree = degree;
		this.R = 1.0;
		this.G = 0.0;
		this.B = 0.0;
	}
}

for(let i = 0; i < 360; i+= 10){
	points[i] = new Point(i);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

var vertexShaderText = [
'precision mediump float;',

'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',

'varying vec3 fragColor;',

'void main()',
'{',
'	fragColor = vertColor;',
'	gl_Position = vec4(vertPosition,0.0,1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',

'varying vec3 fragColor;',

'void main()',
'{',
	
'	gl_FragColor = vec4(fragColor,1.0);',
'}',
].join('\n')

var triangleVertices = [
	//X,   Y,     R, G, B
	0.0,  0.5,    1, 0, 0,
	-0.5,-0.5,    0, 1, 0,
	0.5, -0.5,    0, 0, 1
];

for(let i = 0; i < points.length; i+=10){
	triangleVertices.push(points[i].x);
	triangleVertices.push(points[i].y);
	triangleVertices.push(points[i].R);
	triangleVertices.push(points[i].G);
	triangleVertices.push(points[i].B);
}

var InitDemo = function() {


	//////////////////////////////////
	//       initialize WebGL       //
	//////////////////////////////////
	console.log('this is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl){
		console.log('webgl not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl){
		alert('your browser does not support webgl');
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0,0,canvas.width,canvas.height);

	

	//////////////////////////////////
	// create/compile/link shaders  //
	//////////////////////////////////
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return;
	}
	gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(fragmentShader))
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);

	gl.linkProgram(program);
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		console.error('Error linking program!', gl.getProgramInfo(program));
		return;
	}

	//////////////////////////////////
	//    create triangle buffer    //
	//////////////////////////////////

	//all arrays in JS is Float64 by default
	
	

	triangleVertices = Float32Array.from(triangleVertices);
	
	

	var triangleVertexBufferObject = gl.createBuffer();
	//set the active buffer to the triangle buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	//gl expecting Float32 Array not Float64
	//gl.STATIC_DRAW means we send the data only once (the triangle vertex position
	//will not change over time)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices),gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, //attribute location
		2, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
		0*Float32Array.BYTES_PER_ELEMENT//offset from the beginning of a single vertex to this attribute
		);
	gl.vertexAttribPointer(
		colorAttribLocation, //attribute location
		3, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
		2*Float32Array.BYTES_PER_ELEMENT//offset from the beginning of a single vertex to this attribute
		);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);
	
	//////////////////////////////////
	//            Drawing           //
	//////////////////////////////////
	var loop = function(time = 0){
		//console.log(time);
		gl.clearColor(0.5,0.8,0.8,1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);	
		gl.drawArrays(gl.LINE_LOOP,0,3);
		requestAnimationFrame(loop);
	}		
	requestAnimationFrame(loop);
}