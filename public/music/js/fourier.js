function fourierForward(funky, samples = 44000, max = 1, min = 0){
    var frequencies = [[]]; // array of k
    var k;
    var n;
    var N;
    var xn
    var Xk
    var real
    var imag;

    var sampleData = [];
    var sampleStep = (max - min)/samples;
    
    for(var i = 0; i < samples; i += sampleStep){
        sampleData.push(funky(i));
    }
    
    console.log(sampleData);

    for(var k = 0; k < samples/2; k++){
        for(var n = 0; n < samples; n++){
            real += Math.cos(2 * Math.PI * k * n / samples);
            imag += -Math.sin(2 * Math.PI * k * n / samples);
        }
        frequencies.append([real, imag]);
    }
    console.log(frequencies);
}