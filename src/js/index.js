const a_context = new AudioContext();  
const oscillator = a_context.createOscillator();

function generate_sound(){
		a_context.resume();
    	oscillator.frequency = document.getElementById('sendit').value;
    	oscillator.start();
}
function stopit(){
    	oscillator.stop();
	a_context.suspend();
}

var bend = document.getElementById('bend');
bend.addEventListener("bend", (event) => {
	oscillator.detune = event.target.value;
});
