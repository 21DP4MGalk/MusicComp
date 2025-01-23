function fourierForward(funky, samples = 44000, max = 1, min = 0){
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
            real += sampleData[k] * Math.cos( -1 * (2 * Math.PI) * k * (n / samples) );
            imag += sampleData[k] * Math.sin( -1 * (2 * Math.PI) * k * (n / samples) );
        }
        real = real / samples;
        imag = imag / samples;
        frequencies.push([real, imag]);
    }
    console.log(frequencies);
}

function sampleStolen(samples){
    sampleData = [];
    for(var i = 0; i < 6.283; i += 6.283/samples){
        sampleData.push(Math.sin(i));
    }
    console.log(sampleData);
    console.log(fourierStolen(sampleData));
    
    console.log("done");
}

function fourierStolen(data){
    var N = data.length;
    var frequencies = [];

    // for every frequency...
    for (var freq = 0; freq < N; freq++) {     
        var re = 0;
        var im = 0;

        // for every point in time...
        for (var t = 0; t < N; t++) {

            // Spin the signal _backwards_ at each frequency (as radians/s, not Hertz)
            var rate = -1 * (2 * Math.PI) * freq;

            // How far around the circle have we gone at time=t?
            var time = t / N;
            var distance = rate * time;

            // datapoint * e^(-i*2*pi*f) is complex, store each part
            var re_part = data[t] * Math.cos(distance);
            var im_part = data[t] * Math.sin(distance);

            // add this data point's contribution
            re += re_part;
            im += im_part;
        }

        // Close to zero? You're zero.
        if (Math.abs(re) < 1e-10) { re = 0; }
        if (Math.abs(im) < 1e-10) { im = 0; }

        // Average contribution at this frequency
        re = re / N;
        im = im / N;

        frequencies[freq] = {
            re: re,
            im: im,
            freq: freq,
            amp: Math.sqrt(re*re + im*im),
            phase: Math.atan2(im, re) * 180 / Math.PI     // in degrees
        };
    }

    return frequencies;
}