const audioCtx = new AudioContext();
var notationCan;
var notationCtx;
var selectedNote = 

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


function initCtx(){
	
	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");
	notationCtx.font = "50px LelandMusic";
	
	//notationCan.width = window.screen.width * 0.95;
	//notationCan.height = window.screen.height;
	notationCtx.fillText(String.fromCharCode(parseInt('E0A2', 16)), -100, -100);
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

function getPointedElement(){ 
	var q = document.querySelectorAll(":hover"); 
	return q[q.length-1]; 
}


function init(){
	initCtx();
}