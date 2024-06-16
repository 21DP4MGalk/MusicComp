const audioCtx = new AudioContext();
var notationCan;
var notationCtx;
var mainStaff;

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

		const oscillator = audioCtx.createOscillator();
		oscillator.type = 'sine';
		oscillator.frequency.value = note.pitch;

		const gainModule = new GainNode(audioCtx);
		gainModule.gain.cancelScheduledValues( audioCtx.currentTime + delay);
		gainModule.gain.setValueAtTime(0, audioCtx.currentTime + delay);
		gainModule.gain.linearRampToValueAtTime(1, audioCtx.currentTime + delay + attackTime);
		gainModule.gain.linearRampToValueAtTime(0, audioCtx.currentTime + delay + releaseTime);


		oscillator.connect(gainModule).connect(audioCtx.destination);
 	   	oscillator.start( audioCtx.currentTime + delay);
		oscillator.stop( audioCtx.currentTime + delay + (note.duration * this.bottom_time * (60/this.bpm) ) );
	}

	playString(){

		var cur_note = new Note(0, 0);
		let ascii = 0;
		let delay = 0;

		for(var i = 0; i < this.song.length; i++){
			ascii = this.song[i].charCodeAt(0);

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
					cur_note.pitch = 0;

				}
				else{
					ascii = (parseInt( this.song.substring(i) )); 
					cur_note.pitch = temperament[ (ascii - 1) % temperament.length ];
					i += ascii.toString().length - 1;

				}

				this.playNote(cur_note, delay);
				delay += (cur_note.duration * this.bottom_time * (60/this.bpm));
			}
		}
	}
}

class Key{
	constructor(key = 0){
		this.scale = [];
		var tet12 = getChromatic12TET(440);
		
		for(var i = 0+key; i <= 116+key; i+=12){
			this.scale.push(i);
			this.scale.push(i+2);
			this.scale.push(i+4);
			this.scale.push(i+5);
			this.scale.push(i+7);
			this.scale.push(i+9);
			this.scale.push(i+11);
		}
	}
}

class GrandStaff{
	constructor(bpm = 120, key=0, topTime = 4, bottomTime = 4){
		this.noteArr = [
			[], [], [], [], [], 
			[], [], [], [], [], 
			[], [], [], [], [], 
			[], [], [], [], [],
			[], [], [], [], []
		];
		this.topTime = topTime;
		this.bottomTime = bottomTime;
		this.bpm = bpm;
		this.temperament = getChromatic12TET(440);
		this.key = new Key(key);

		this.barLines = [100];
		for(var i = 100; i < notationCan.width; i+=(50*topTime)){
			this.barLines.push(i);
		}
	}
	
	checkAvailable(Y, X){
		var lowL = 0;
		var highL = this.noteArr[Y].length - 1;
		var cur_X = 0;
		var X;
		if(X < 100){
			return -2;
		}

		while(lowL <= highL){

			cur_X = this.noteArr[Y][ Math.floor((lowL + highL) / 2) ].X;
			if( cur_X == X){
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
	
	addNote(Y, X, duration, rest = false){
		
	
		var freq = 47 - Y; // Top note 47 is A5
		
		var index;

		freq = this.temperament[this.key.scale[freq]];
		if(rest){
			freq = 0;
		}

		index = this.checkAvailable(Y, X);
		if(index == -1){
			var note = new Note(freq, duration, X);
			this.noteArr[Y].push(note);
			this.noteArr[Y].sort(this.compareNoteX);
		}
		else if(index >= 0){
			this.noteArr[Y].splice(index, 1);
		}
		this.redrawCanvas();
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

		notationCtx.fillText(String.fromCharCode(parseInt("E050", 16)), 10, 145);	
		notationCtx.fillText(String.fromCharCode(parseInt("E062", 16)), 10, 205);	

		//bars
	
		notationCtx.moveTo(100, 100);
		notationCtx.lineTo(100, 250);
		notationCtx.stroke();

		for(var i = 1; i < mainStaff.barLines.length; i++){
			notationCtx.moveTo(this.barLines[i], 100);
			notationCtx.lineTo(this.barLines[i], 250);
			notationCtx.stroke();
		}
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

	redrawCanvas(){
		notationCtx.clearRect(0, 0, notationCan.width, notationCan.height);
		notationCtx.beginPath();
		this.drawStaff();
		this.drawNotes();
	}


	getNotes(bar){
		var notes = [];
		var bottomBound = this.barLines[bar];
		var topBound = this.barLines[bar+1];
		for(var i = 0; i < 25; i++){
			for(var j = 0; j < this.noteArr[i].length; j++){
				if(this.noteArr[i][j].X > topBound){
					break;
				}
				else if(this.noteArr[i][j].X > bottomBound){
					notes.push(this.noteArr[i][j])
				}
			}
		}
		return notes;
	}

	expandBar(bar, amount){
		var defaultBar = 50*this.topTime;
		var targetBar = this.barLines[bar] * amount;
		var barStart = this.barLines[bar];
		var notes = this.getNotes(bar);
		console.log(barStart);
		if(this.barLines[bar+1] === undefined){
			return;
		}
		var amountPx = (this.barLines[bar+1] - barStart) * (amount-1);

		for(var i = this.barLines.length-1; i > bar; i--){
			console.log(amountPx);
			notes = this.getNotes(i);
			
			for(var j = 0; j < notes.length; j++){
				notes[j].X += amountPx;
			}

			if(i == bar+1){
				notes = this.getNotes(i-1);
				for(var j = 0; j < notes.length; j++){
					notes[j].X = barStart + ((notes[j].X - barStart) * amount);
				}

				
			}
			this.barLines[i] += amountPx;

		} // May you please forgive the inefficency
		if(amount < 1){
			for(var i = bar+1; i < this.barLines.length; i++){
				notes = this.getNotes(i);
				for(var j = 0; j < notes.length; j++){
					notes[j].X += amountPx;
				}
			}
		}
		this.redrawCanvas();
		console.log(targetBar, this.barLines[bar+1] - this.barLines[bar])

	}

	playLine(Y){
		notes = this.noteArr[Y];
		for(var i = 0; i < notes.length(); i++){
			playNote(notes[i]);
		}
		fetch('./src/waves/Piano')
    			.then((response) => response.json())
    			.then((json) => console.log(json));
	}

	playNote(note, startTime, bar){
		var beatSec = 60/this.bpm
		var beatDist = (this.barLines[bar+1] - this.barLines[bar]) / this.topTime;
    
		var startPlay = this.topTime * (bar-1) * beatSec + Math.round((note.X - this.barLines[bar])/beatDist) * beatSec
		var startMute = startPlay + (note.duration * this.bottomTime * beatSec)
		
		var oscillator = audioCtx.createOscillator();
		oscillator.type = "sine";
		oscillator.frequency.value = note.pitch;
    
    		var gainModule = new GainNode(audioCtx);

    		gainModule.gain.cancelScheduledValues( audioCtx.currentTime + startPlay);
  		gainModule.gain.setValueAtTime(0, audioCtx.currentTime + startPlay);
  		gainModule.gain.linearRampToValueAtTime(1, audioCtx.currentTime + startPlay + 0.1);
  		gainModule.gain.linearRampToValueAtTime(0, audioCtx.currentTime + startPlay + 3);

    		oscillator.connect(gainModule).connect(audioCtx.destination);
    		oscillator.start(audioCtx.currentTime + startPlay - ((Date.now() - startTime)/1000));
		oscillator.stop(audioCtx.currentTime + startMute - ((Date.now() - startTime)/1000));
	}

	playPiece(curBar = 0, endBar = this.barLines.length){
    		var notes = [];
    		var startTime = Date.now();

    		for(; curBar <= endBar; curBar++){
        		notes = this.getNotes(curBar);
        		for(var i = 0; i < notes.length; i++){
				this.playNote(notes[i], startTime, curBar);
        		}
    		}
	}

	updateBPM(){
		var bpm = document.getElementById('bpmtext');
		if(!isNaN(bpm.value)){
			this.bpm = +bpm.value;
		}
	}

}

function initCtx(){
	

	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");
	notationCtx.font = "50px LelandMusic";
	
	mainStaff = new GrandStaff();


	//notationCan.width = window.screen.width * 0.95;
	//notationCan.height = window.screen.height;
	notationCtx.fillText(String.fromCharCode(parseInt('E0A2', 16)), -100, -100);

	//setTimeout(mainStaff.redrawCanvas, 500);
	mainStaff.redrawCanvas();

}

function interpretClick(){
	
	var rect = notationCan.getBoundingClientRect();
	var mouseX = event.clientX - rect.left;
	var mouseY = event.clientY - rect.top;
	var rest = false;

	var symbol = document.getElementById('noteSelect');
	symbol = symbol.options[symbol.selectedIndex].value;
	if(symbol.charAt(1) == '4'){
		rest = true;;
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



	mouseY = mouseY - ((mouseY-2) % 7.5);
	if(duration < 1/this.topTime){
		mouseX = mouseX - ((mouseX-7) % ( 50 / (duration / (1/this.topTime)) ) );
	}
	else{
		mouseX = mouseX - ((mouseX-7) % 50); 	// first writable position is 107
	}
	
	if(mouseY < 80 || mouseY > 264.5){
		return;
	}
	
	console.log(mouseX);
	var lineFromTop = Math.floor((mouseY-80)/7.5);
	

	mainStaff.addNote(lineFromTop, mouseX, duration, rest);

	/*if(mainStaff.checkAvailable(lineFromTop, mouseX) != -1){
		
	}
	else{
		console.log("UNAVAILABLE");
	}*/
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
	
	var data = {username:"BOB",password:"Marley"};
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
