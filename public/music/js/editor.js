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
	notationCtx.font = "10px Leland";
	
	//notationCan.width = window.screen.width * 0.95;
	//notationCan.height = window.screen.height;
	notationCtx.fillText(String.fromCharCode(parseInt('E0A2', 16)), 150, 150);
	notationCtx.fillText(String.fromCharCode(parseInt('E014', 16)), 100, 100);
	notationCtx.fillText("AAA", 100, 100)
}

function getPointedElement(){ 
	var q = document.querySelectorAll(":hover"); 
	return q[q.length-1]; 
}

function getPieceName(){
	var url = window.location.href;
	for(var i = 0; i < url.length; i++){
		if(url.substr(i,1) == "?"){
			sessionStorage.setItem("piece_name", url.substr(i+7));
			return;
		}
	}
}

async function fetchPieceFile(){
	var requestData = new FormData
	requestData.append("pieceName", sessionStorage.getItem("piece_name"));

	var response = await fetch("/api/getPiece.php", {
	method: "POST",
	body: requestData});
	
}

async function init(){
	getPieceName();
	fetchPieceFile;
	initCtx();
}
