function fourierForward(funky, samples = 5000, max = 440*Math.PI*2, min = 0){
    var frequencies = [[]]; // array of k
    var k;
    var n;
    var N;
    var xn;
    var Xk;
    var real;
    var imag;

    var sampleData = [];
    var sampleStep = (max - min)/samples;
    
    for(var i = min; i < max; i += sampleStep){
        sampleData.push(funky(i));
    }
    
    console.log(sampleData);

    for(var k = 0; k < samples/2; k++){
        real = 0;
        imag = 0;
        for(var n = 0; n < samples; n++){
            real += sampleData[n] * Math.cos( -1 * (2 * Math.PI) * k * (n / samples) );
            imag += sampleData[n] * Math.sin( -1 * (2 * Math.PI) * k * (n / samples) );
        }
        real = real / samples;
        imag = imag / samples;
		if(Math.abs(real) < 1e-5){ real = 0}
		if(Math.abs(imag) < 1e-5){ imag = 0}
        frequencies.push([real, imag, real*real+imag*imag]);
    }
	return frequencies;
}

function bezier(t, p0, p1, p2, p3){
  var cX = 3 * (p1.x - p0.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = p3.x - p0.x - cX - bX;

  var cY = 3 * (p1.y - p0.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = p3.y - p0.y - cY - bY;

  var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
  var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

  return {x: x, y: y};
},
