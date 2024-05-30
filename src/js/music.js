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
			[], [], [], [], []
		]	
	}
	
	checkAvailable(Y, X){
		var lowL = 0;
		var highL = this.noteArr[Y].length - 1;
		var cur_X = 0;

		while(lowL <= highL){

			cur_X = this.noteArr[Y][ Math.floor((lowL + highL) / 2) ].X;
			if( cur_X = X){
				return Math.floor((lowL+highL) / 2);
			}
			else if( cur_X < X ){
				lowL = Math.floor((lowL + highL) / 2) + 1;
			}
			else{
				highL = Math.floor((lowL + highL) / 2) - 1;
			}
		}
		return -1;
	}

	compareNoteX(NoteA, NoteB){
		return NoteA.X - NoteB.X;
	}	
	
	addNote(Y, X, symbol){
		var freq = 81 - Y; // Top note 81 is A4
		var tet12 = getChromatic12TET(concertA);
		var duration = 0;
		var index;

		freq = tet12[freq];
		

//######################### REWRITE THIS GARBAGE WHEN YOU GET THE CHANCE TO
		if(symbol.charAt(1) == '4'){
			freq = 0;
			switch(symbol.charAt(3)){
				case('3'):
					duration = 1;
					break;
				case('4'):
					duration = 0.5;
					break;
				case('5'):
					duration = 0.25;
					break;
				case('6'):
					duration = 0.125;
					break;
				case('7'):
					duration = 0.0625;
					break;
				case('8'):
					duration = 0.3125;
					break;
			}
		}
		else{
			switch(symbol.charAt(3)){
				case('2'):
					duration = 1;
					break;
				case('3'):
					duration = 0.5;
					break;
				case('5'):
					duration = 0.25;
					break;
				case('7'):
					duration = 0.125;
					break;
				case('9'):
					duration = 0.0625;
					break;
				case('8'):
					duration = 0.3125;
					break;

			}
		}

		index = this.checkAvailable(Y, X);
		if(index == -1){
			var note = new Note(freq, duration, X);
			this.noteArr[Y].push(note);
			this.noteArr[Y].sort(this.compareNoteX);
		}
		else{
			this.noteArr[Y].splice(index, 1);
			//redrawCanvas();
		}

	}

	drawStaff(){
		
		for(var i = 0; i < 5; i++){
                	 notationCtx.moveTo(0, 100 + i * 15);
        	         notationCtx.lineTo(notationCan.width, 100 + i * 15);
	                 notationCtx.stroke();

	        }

		for(var i = 0; i < 5; i++){
        	         notationCtx.moveTo(0, 190 + i * 15);
                	 notationCtx.lineTo(notationCan.width, 190 + i * 15);
                	 notationCtx.stroke();

         	}
        	notationCtx.stroke();

		notationCtx.fillText(String.fromCharCode(parseInt("E050", 16)), 60, 145);	
		notationCtx.fillText(String.fromCharCode(parseInt("E062", 16)), 60, 205);	


	}
	
	drawNotes(){

		var notechars = ["E1DB", "E1D9", "E1D7", "E1D5", "E1D3", "E0A2"];
		var restchars = ["E4E8", "E4E7", "E4E6", "E4E5", "E4E4", "E4E3"];
		var duration = 0;
		var posX, posY;

		for(var i = 0; i < this.noteArr.length; i++){
			for(var j = 0; j < this.noteArr[i].length; j++){

				posX = this.noteArr[i][j].X
				posY = i;
				posY = posY * 7.5 + 84;

				duration = Math.log2(this.noteArr[i][j].duration * 32);

				if(this.noteArr[i][j].pitch == 0){
					notationCtx.fillText(String.fromCharCode(parseInt(restchars[duration], 16)), posX, posY);	
				}
				else{
					notationCtx.fillText(String.fromCharCode(parseInt(notechars[duration], 16)), posX, posY);	
				}
			}
		}
	}

	playNotes(){
	
	}
}

mainStaff = new GrandStaff();

function initCtx(){
	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");
	notationCtx.font = "50px LelandMusic";

	//notationCan.width = window.screen.width * 0.95;
	//notationCan.height = window.screen.height;
	notationCtx.fillText(String.fromCharCode(parseInt('E0A2', 16)), -100, -100);

	setTimeout(mainStaff.drawStaff, 50);


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
	mouseX = mouseX - ((mouseX-7) % 15);

	if(mouseY < 80 || mouseY > 264.5){
		return;
	}
	
	var lineFromTop = Math.floor((mouseY-80)/7.5);
	console.log(lineFromTop)
		
	mainStaff.addNote(lineFromTop, mouseX, selectedNote);
	
	
	grandstaff.checkavailable(mouseY, mouseX);
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

async function fetchAddUser(){
	
	var data = {test : "cunt"};
	console.log(JSON.stringify(data));

	var response = await fetch("http://localhost/api/addUser.php", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(data),
	});

	var result = await response.json();
	console.log(result)
}
