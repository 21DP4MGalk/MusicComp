function fourierForward(sampleData, minf = 0){
    var frequencies = [[]]; // array of k
    var k;
    var n;
    var N;
    var xn;
    var Xk;
    var real;
    var imag;

    /*var sampleData = [];
    var sampleStep = (max - min)/samples;
    
    for(var i = min; i < max; i += sampleStep){
        sampleData.push(funky(i));
    }
    
    console.log(sampleData);
	*/

	var samples = sampleData.length;

    for(var k = minf; k < samples/2; k++){
        real = 0;
        imag = 0;
        for(var n = 0; n < samples; n++){
            real += sampleData[n].y * Math.cos( -1 * (2 * Math.PI) * k * (n / samples) );
            imag += sampleData[n].y * Math.sin( -1 * (2 * Math.PI) * k * (n / samples) );
        }
        real = real / samples;
        imag = imag / samples;
		if(Math.abs(real) < 1e-5){ real = 0}
		if(Math.abs(imag) < 1e-5){ imag = 0}
        frequencies.push([real, imag, real*real+imag*imag]);
    }
	return frequencies;
}

function cubicBezier(t, sx, sy, c1x, c1y, c2x, c2y, ex, ey){
	var u = 1-t;
	var part1 = quadraticBezierDumb(t, sx, sy, c1x, c1y, c2x, c2y);
	var part2 = quadraticBezierDumb(t, c1x, c1y, c2x, c2y, ex, ey);
	var x = u * part1.x + t * part2.x;
	var y = u * part1.y + t * part2.y;
	return {x, y}
}

function quadraticBezierDumb(t, sx, sy, cpx, cpy, ex, ey){
	y = 0;
	x = 0;
	u = 1-t
	y = (ey*t + cpy*u)*t + (cpy*t + sy*u)*u;
	x = (ex*t + cpx*u)*t + (cpx*t + sx*u)*u;

	return {x, y}
}

function drawCubicBezierDumb(){
	const canvas = document.getElementById("fourierDisplay");
	const context = canvas.getContext("2d");

	var scale = 120;
    var xOff = 75; 
    var yOff = 75; 
    var sx  = document.getElementById("sx");
    var sy  = document.getElementById("sy");
    var c1x = document.getElementById("c1x");
    var c1y = document.getElementById("c1y");
    var c2x = document.getElementById("c2x");
    var c2y = document.getElementById("c2y");
    var ex  = document.getElementById("ex");
    var ey  = document.getElementById("ey");
	
	sx  = sx.value 
    sy  = sy.value 
    c1x = c1x.value
    c1y = c1y.value
    c2x = c2x.value
    c2y = c2y.value
    ex  = ex.value
    ey  = ey.value

	var coords;
	context.lineWidth = 1;

//	context.beginPath();

	for(var i = 0; i<1; i+=0.01){
		coords = cubicBezier(i, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
		context.fillRect(coords.x, coords.y, 1, 6);
/*
         context.moveTo(coords.x, coords.y);
         coords = quadraticBezierDumb(i+0.01, sx, sy, c1x, c1y, c2x, c2y, ex, ey);
         context.lineTo(coords.x, coords.y);
         context.lineWidth = 1;
         context.stroke();*/
     }


}

function drawQuadraticBezierDumb(sx, sy, cx, cy, ex, ey){
	const canvas = document.getElementById("canvas");
	const context = canvas.getContext("2d");
	canvas.height = 1080;
	canvas.width = 1920;

	var coords;
	context.lineWidth = 1;

	context.beginPath();

	for(var i = 0; i<1; i+=0.01){
		coords = quadraticBezierDumb(i, sx, sy, cx, cy, ex, ey);
		

		context.moveTo(coords.x, coords.y);
		coords = quadraticBezierDumb(i+0.01, sx, sy, cx, cy, ex, ey);
		context.lineTo(coords.x, coords.y);
		context.lineWidth = 1;
		context.stroke();
	}

	return;
}

function addCurve(){
	return;
}

function sampleBezier(curves){
	var samplesPerCurve = 2000/curves.length;
	var samples = [];
	for(var i = 0; i < curves.length; i++){
		for(var j = 0; j < samplesPerCurve; j++){
			samples.push(cubicBezier((i*samplesPerCurve + j)/2000, curves[i][0], curves[i][1], curves[i][2], curves[i][3], curves[i][4], curves[i][5], curves[i][6], curves[i][7]));
		}
	}
	samples.sort();
	return samples;
}
