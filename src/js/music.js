const AContext = new AudioContext();
var temperament = [261.6255653005985, 277.182630976872, 293.66476791740746, 311.1269837220808, 329.62755691286986, 349.2282314330038, 369.99442271163434, 391.99543598174927, 415.3046975799451, 440, 466.1637615180899, 493.8833012561241, 523.2511306011974];
//var temperamentList = [[], []]; // NOTE: include 12tet, pythagorean, and some medieval ones, aswell as custom, of course.
var concertA = 440;
var notationCan;
var notationCtx;


function getPitchGivenA(desiredPitchNum, referenceANum = 69, referenceA = 440){		
	// desiredPitchNum is the number assigned to the pitch we want to generate in a scale, for example how Middle C in MIDI format is 60
	// referenceANum is the number assigned to concert A in the same context, reference A defines concert A. 
	//All values should be INT
	if(isNaN(desiredPitchNum) || isNaN(referenceANum) || isNaN(referenceA)){
		throw new TypeError("One or more of of the parameters used for generating a pitches turned out not to be numbers, but rapscallions in trench coats!");
	}

	return (referenceA * (Math.pow( Math.pow(2, 1/12), (desiredPitchNum - referenceANum) ) ));
}

function getChromatic12TET(referenceA){
	if(isNaN(referenceA)){
		throw new TypeError("Concert A does not appear to be a number.");
	}
	
	tet12 = [];
	for(i = 0; i < 128; i++){
		tet12.push(getPitchGivenA(i, 69, referenceA));
	}
	return tet12;
}

class Note{
	constructor(pitch, duration, X = 0){ //all must be numeric
		this.pitch = pitch;
		this.duration = duration;
		this.X = X;
	}
}

class MusicTextReader{
	constructor(song, bpm, bottom_time){
		this.song = song;
		this.bpm = bpm;
		this.bottom_time = bottom_time;
	}
	
	playNote(note, delay, attackTime = 0.1, releaseTime = 3){

		const oscillator = AContext.createOscillator();
		oscillator.type = 'sine';
		oscillator.frequency.value = note.pitch;

		const gainModule = new GainNode(AContext);
		gainModule.gain.cancelScheduledValues( AContext.currentTime + delay);
		gainModule.gain.setValueAtTime(0, AContext.currentTime + delay);
		gainModule.gain.linearRampToValueAtTime(1, AContext.currentTime + delay + attackTime);
		gainModule.gain.linearRampToValueAtTime(0, AContext.currentTime + delay + releaseTime);


		oscillator.connect(gainModule).connect(AContext.destination);
 	   	oscillator.start( AContext.currentTime + delay);
		oscillator.stop( AContext.currentTime + delay + (note.duration * this.bottom_time * (60/this.bpm) ) );
	}

	playString(){

		var cur_note = new Note(0, 0);
		let ascii = 0;
		let delay = 0;

		for(var i = 0; i < this.song.length; i++){
			ascii = this.song[i].charCodeAt(0);
			console.log(ascii);

			switch(ascii){
				case 119:
					cur_note.duration = 1;
					break;
				case 104:
					cur_note.duration = 0.5;
					break;
				case 113:
					cur_note.duration = 0.25;
					break;
				case 115:
					cur_note.duration = 0.125;
					break;
			}
			
			if(ascii < 58 && ascii > 47){
				if(ascii == 48){
					console.log()
					cur_note.pitch = 0;
					console.log(ascii, i);

				}
				else{
					ascii = (parseInt( this.song.substring(i) )); 
					console.log(ascii, i);
					cur_note.pitch = temperament[ (ascii - 1) % temperament.length ];
					i += ascii.toString().length - 1;
					console.log(ascii, i);

				}
				console.log(cur_note);

				this.playNote(cur_note, delay);
				delay += (cur_note.duration * this.bottom_time * (60/this.bpm));
			}
			console.log('One loop done!');
		}
	}
}

class GrandStaff{
	constructor(){
		this.noteArr = [
			[], [], [], [], [], 
			[], [], [], [], [], 
			[], [], [], [], [], 
			[], [], [], [], [],
			[], [], [], []
		]	
	}
	
	checkAvailable(Y, X){
		
	}
	
	addNote(Y, X, duration){
		
	}
	
	drawStaff(){

	}
}

function initCtx(){
	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");
	notationCtx.font = "50px LelandMusic";

	//notationCan.width = window.screen.width * 0.95;
	//notationCan.height = window.screen.height;
	
	var i;
	
	for(i = 0; i < 5; i++){
		notationCtx.moveTo(0, 100 + i * 15);
		notationCtx.lineTo(notationCan.width, 100 + i * 15);
		notationCtx.stroke();
		
	}
	
	for(i = 0; i < 5; i++){
		notationCtx.moveTo(0, 190 + i * 15);
		notationCtx.lineTo(notationCan.width, 190 + i * 15);
		notationCtx.stroke();

	}

	notationCtx.stroke();
	notationCtx.fillText(String.fromCharCode(parseInt('E0A2', 16)), -100, -100);


}

function interpretClick(){
	
	var rect = notationCan.getBoundingClientRect();
	var mouseX = event.clientX - rect.left;
	var mouseY = event.clientY - rect.top;
	console.log(mouseX);
	console.log(mouseY);
	


	var selectedNote = document.getElementById('noteSelect');
	selectedNote = selectedNote.options[selectedNote.selectedIndex].value;

	mouseY = mouseY - ((mouseY-2) % 7.5);
	mouseX = mouseX - 7;

	if(mouseY < 80 || mouseY > 264.5){
		return;
	}
	
	var lineFromTop = Math.floor((mouseY-80)/7.5);
	console.log(lineFromTop)
	console.log(mouseY)

	
	//grandstaff.checkavailable(mouseY, mouseX);
	notationCtx.fillText(String.fromCharCode(parseInt(selectedNote, 16)), mouseX, mouseY);	
}

function testStringPlayer(){
	var reader = new MusicTextReader('s1s3s5s6s8s10s12s13q0h12q13s3s5s8s0s10s8s6s5s3', 60, 4);
	reader.playString();
}


function getPointedElement(){ 
	var q = document.querySelectorAll(":hover"); 
	return q[q.length-1]; 
}


grandestStaff = new GrandStaff();
