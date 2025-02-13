const audioCtx = new AudioContext();
var notationCan;
var notationCtx;
var selectedNote;
var instruments = [];

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
	constructor(pitch, duration, X = 0, volume = 1){ //all must be numeric
		this.pitch = pitch;
		this.duration = duration;
		this.X = X;
		this.volume = volume;
	}
}


function initCtx(){
	
	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");
	notationCtx.font = "10px LelandMusic";
	
	notationCan.width = window.screen.width * 0.95;
	notationCan.height = window.screen.height;
	redrawCanvas();
}

function getPointedElement(){ 
	var q = document.querySelectorAll(":hover"); 
	return q[q.length-1]; 
}

async function getPieceFile(){
	var pieceID;
	for(var i = 0; i < window.location.href.length; i++){
		if(window.location.href[i] == "?"){
			pieceID = window.location.href.substring(i+7);
			break;
		}
	}

	var requestData = new FormData
	
	requestData.append("pieceID", pieceID);

	var response = await fetch("/api/getPieceFile.php", {
	method: "POST",
	body: requestData});
	
	if(await response.ok){
		var pieceFile = response.text();
		pieceFile = JSON.parse( await pieceFile);
		sessionStorage.setItem("pieceFile", pieceFile);
	}
	
}

async function init(){
	await getPieceFile();
	initCtx();
	redrawCanvas();
}

function interpretClick(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");

	if(!sessionStorage.getItem("noteArr")){
		var notearr = [];
		sessionStorage.setItem("noteArr", JSON.stringify(notearr));
	}
	console.log(sessionStorage.getItem("noteArr"));
	var notes = JSON.parse(sessionStorage.getItem("noteArr"));

	notationCtx.font = "40px LelandMusic";

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;


	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
// add snapping to horizontal lines
/*for(var i = 0; i<11; i++){
		if(i == 5){
			continue;
		}
		notationCtx.moveTo(canX/10, canY/100 * (10+i+offset));
		notationCtx.lineTo(canX/10 * 9, canY/100 * (10+i+offset));
		notationCtx.stroke();	
	}*/


	var note = {x: x, y: y, note: sessionStorage.getItem("note")};
	notes.push(note);

	//var requestData = new FormData();
	sessionStorage.setItem("noteArr", JSON.stringify(notes));
	notationCtx.fillText(sessionStorage.getItem("note"), x, y);
}

function redrawCanvas(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	if(!sessionStorage.getItem("noteArr")){
		var notearr = [];
		sessionStorage.setItem("noteArr", JSON.stringify(notearr));
	}
	var notes = JSON.parse(sessionStorage.getItem("noteArr"));

	notationCan.width = window.screen.width * 0.95;
	notationCan.height = window.screen.height;

	notationCtx.clearRect(0, 0, notationCan.width, notationCan.height);

	
	for(var i = 0; i<5; i++){
		drawStaff(i*14);
	}
	notationCtx.font = "40px LelandMusic";
	for(var i = 0; i<notes.length; i++){
		notationCtx.fillText(notes[i].note, notes[i].x, notes[i].y);
	}
	
}

function drawStaff(offset = 0){
	
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	
	const canX = notationCan.width
	const canY = notationCan.height

	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));

	for(var i = 0; i<11; i++){
		if(i == 5){
			continue;
		}
		notationCtx.moveTo(canX/10, canY/100 * (10+i+offset));
		notationCtx.lineTo(canX/10 * 9, canY/100 * (10+i+offset));
		notationCtx.stroke();	
	}
	notationCtx.moveTo(canX/10, canY/100 * (10+offset));
	notationCtx.lineTo(canX/10, canY/100 * (20+offset));
	notationCtx.stroke();	

	notationCtx.moveTo(canX/10 * 9, canY/100 * (10+offset));
	notationCtx.lineTo(canX/10 * 9, canY/100 * (20+offset));
	notationCtx.stroke();	
	
	notationCtx.font = "40px LelandMusic";
	notationCtx.fillText(pieceFile.pieceName, canX/2.5, canY/15);
	notationCtx.font = "30px LelandMusic";
	notationCtx.fillText("BPM = " + pieceFile.bpm, canX/15, canY/15);
	
}

function moveGhost(){
	redrawCanvas();
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	notationCtx.font = "40px LelandMusic";

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;


	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
	notationCtx.globalAlpha = 0.5;
	notationCtx.fillText(sessionStorage.getItem("note"), x, y);
	//notationCtx.fillText(String.fromCharCode(parseInt('E0A2', 16)), x, y);

	notationCtx.globalAlpha = 1;

}

function selectNote(){
	var noteSelect = document.getElementById("noteSelect");
	for(var i = 1; i < noteSelect.childNodes.length; i+=2){
		console.log(noteSelect.childNodes[i]);
		noteSelect.childNodes[i].classList.remove("selectedNote");
	}
	sessionStorage.setItem("note", getPointedElement().childNodes[1].innerText);
	getPointedElement().classList.add("selectedNote");
	return;
}

class InstrumentPart{
	constructor(id, name, instrumentID, maxvolume = 1){
		this.name = name;
		this.maxvolume = maxvolume;
		this.part;
		this.instrumentID = instrumentID;
		this.waveform;
	}
}
