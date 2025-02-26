const audioCtx = new AudioContext();
var staffBounds = [[]];

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
	
	sessionStorage.setItem("note", " ");

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
		sessionStorage.setItem("noteArr", JSON.parse(pieceFile).notes);
	}
	
}

async function init(){
	await getPieceFile();
	
	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");

	canX = notationCan.width;
	canY = notationCan.height;

	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
		if(!sessionStorage.getItem("noteArr")){
		var notearr = [];
		sessionStorage.setItem("noteArr", JSON.stringify(notearr));
	}

	initCtx();
	redrawCanvas();
}

function getStaffFromY(y, canY){

	var staff = (y/2*canY/100) - canY/10;
	staff = staff / (canY/100 * 14);
	staff += 0.10;
	return staff;
}

function staffToMeasureY(staff, canY){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	
	console.log(staff);

	y = canY/10;
	y += Math.floor(staff) * (canY/100*14)
	
	/*console.log(y);
	notationCtx.moveTo(599, y);
	notationCtx.lineTo(599, y+ (notationCan.height/10));
	notationCtx.stroke();	
	*/
	return y;
}

function drawMeasure(x, y, canY){
	y = staffToMeasureY(getStaffFromY(y/ (canY/200), canY), canY);
	notationCtx.moveTo(x, y);
	notationCtx.lineTo(x, y+ (canY/10));
	notationCtx.stroke();	
	return;
}

function placementCheck(note, x_pos, y_pos, staffBounds_x){
	var noteCode = note.charCodeAt(0);
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");

	const canX = notationCan.width
	const canY = notationCan.height
	
	if(noteCode == 32 || x_pos < staffBounds_x[0] || x_pos > staffBounds_x[1] || y_pos < canY/100 * 9){
		drawMeasure(x_pos, y_pos, canY);
		return [" ", 0, 0, 0];
	}

	var y = y_pos/ (canY/200);
	y = Math.round(y); // rounds it to th line positions
	
	var x = x_pos/ (canX/100);
	x = Math.round(x);

	var staff = getStaffFromY(y, canY);
	var note_dur;

	if(noteCode > 58594 && noteCode < 58601){
		staff = Math.floor(staff) + 0.149;
		switch(noteCode){
			case 58595:
				staff -= 0.07
				note_dur = 4;
				break;
			case 58596:
				note_dur = 2;
				break;
			case 58597:
				note_dur = 1;
				break;
			case 58598:
				note_dur = 0.5;
				break;
			case 58599:
				note_dur = 0.25;
				break;
			case 58600:
				note_dur = 0.125;
				break;
		}
		y = staff * (canY/100 * 14) + (canY/10);
		y = y/ (canY/200);
	}

	switch(sessionStorage.getItem("note").charCodeAt(0)){
		case 57506:
			note_dur = 4;
			break;
		case 57811:
			note_dur = 2;
			break;
		case 57813:
			note_dur = 1;
			break;
		case 57815:
			note_dur = 0.5;
			break;
		case 57817:
			note_dur = 0.25;
			break;
		case 57819:
			note_dur = 0.125;
			break;
	}
	
	// determine which staff it's in;
	var staff = (y/2*canY/100) - canY/10;
	staff = staff / (canY/100 * 14);
	staff += 0.10;
	
	if(note.charCodeAt(0) < 57820 && (staff % 1 < 0.24 || (staff % 1 >0.45 && staff % 1 < 0.67)) && note_dur<4){
		note = String.fromCharCode(note.charCodeAt(0) + 1)
	}
	
	return [note, x * canX/100, y/2 * canY/100, note_dur];
}

function sortNotes(){ //needs to sort the notes array to go up by Y and X, according to the order of everything. Might be unnecessary with good data insertion
	return;
}

function insertNote(note, x_pos, y, x, canY){
	var notes = JSOM.parse(sessionStorage.getItem("noteArr"));
	var staff = Math.floor( getStaffFromY(y, canY) );
	if(notes.length == 0){
		notes.push( {x: x, x_pos: x_pos, y: y, note: note} );
	}
	for(var i = 0; i < notes.length; i++){
		if( Math.floor( getStaffFromY(notes[i].y, canY) ) == staff){
			if(x <= notes[i].x_pos){
				notes.splice(i, 0, {x: x, x_pos: x_pos, y: y, note: note});
				return;
			}
			if(i == notes.length-1){
				notes.push( {x: x, x_pos: x_pos, y: y, note: note} );
				return;
			}
		}
	}
}

function setMeasures(){
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var topTime = pieceFile.topTime;
	var bottomTime = pieceFile.bottomTime;
}

function interpretClick(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");

	if(!sessionStorage.getItem("noteArr")){
		var notearr = [];
		sessionStorage.setItem("noteArr", JSON.stringify(notearr));
	}
	var notes = JSON.parse(sessionStorage.getItem("noteArr"));

	notationCtx.font = "40px LelandMusic";

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;

	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
	var info = placementCheck(sessionStorage.getItem("note"), x, y, JSON.parse(sessionStorage.getItem("staffBounds")) );
	console.log(info);
	if(notes.length != 0){
		info[3] += notes[notes.length-1].x;
	}
	var note = {x: info[3], x_pos: info[1], y: info[2], note: info[0]};
	notes.push(note);

	staffToMeasureY(getStaffFromY(info[2] / (notationCan.height/200), notationCan.height), notationCan.height);

	//var requestData = new FormData();
	sessionStorage.setItem("noteArr", JSON.stringify(notes));
	notationCtx.fillText(info[0], info[1], info[2]);
}

function drawMeasures(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");

	const canX = notationCan.width
	const canY = notationCan.height

	var measureHeight = canY/10
	for(var i = 0; i < 1; i++){
		
	}

	for(var i = 0; i < 5; i++){
		for(var j = 0; j<4; j++){
			notationCtx.moveTo(canX/10, canY/100 * (10+offset));
			notationCtx.lineTo(canX/10, canY/100 * (20+offset));
			notationCtx.stroke();	
		}
	}
	
}

function drawSymbols(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	const canX = notationCan.width
	const canY = notationCan.height
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));

	for(var i = 0; i<5; i++){
		var distance = 0; // number ofaccidentals, determintes the distance to the time signature
		notationCtx.font = "40px LelandMusic";
			notationCtx.fillText("", canX/100 * 11, canY/100 * (13 + 14*i));
			notationCtx.fillText("", canX/100 * 11, canY/100 * (17 + 14*i));
			switch(pieceFile.key){
				case 0:	//C
					break;
				case 1:	//C#
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (11.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 13.5, canY/100 * (18.5 + 14*i));
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (9.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (16.5 + 14*i));
					notationCtx.fillText("", canX/100 * 15, canY/100 * (11 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15, canY/100 * (18 + 14*i));
					notationCtx.fillText("", canX/100 * 15.75, canY/100 * (12.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15.75, canY/100 * (19.5 + 14*i));
					notationCtx.fillText("", canX/100 * 16.5, canY/100 * (10.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 16.5, canY/100 * (17.5 + 14*i));
					notationCtx.fillText("", canX/100 * 17.25, canY/100 * (13 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 17.25, canY/100 * (20 + 14*i));
				
					distance = 7;
					break;
				case 2:	//D
					distance = 2;
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (11.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 13.5, canY/100 * (18.5 + 14*i));

					break;
				case 3:	//Eb
					distance = 3;
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (10.5 + 14*i));
                	       		notationCtx.fillText("", canX/100 * 13.5, canY/100 * (17.5 + 14*i));
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (12 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (19 + 14*i));
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (12.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (19.5 + 14*i));

					break;
				case 4:	//E
					distance = 4;
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (11.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 13.5, canY/100 * (18.5 + 14*i));
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (9.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (16.5 + 14*i));
					notationCtx.fillText("", canX/100 * 15, canY/100 * (11 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15, canY/100 * (18 + 14*i));
					break;
				case 5:	//F
					distance = 1;
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (12 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (19 + 14*i));
					break;
				case 6:	//F#
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (11.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 13.5, canY/100 * (18.5 + 14*i));
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (9.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (16.5 + 14*i));
					notationCtx.fillText("", canX/100 * 15, canY/100 * (11 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15, canY/100 * (18 + 14*i));
					notationCtx.fillText("", canX/100 * 15.75, canY/100 * (12.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15.75, canY/100 * (19.5 + 14*i));
					notationCtx.fillText("", canX/100 * 16.5, canY/100 * (10.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 16.5, canY/100 * (17.5 + 14*i));
				
					distance = 6;
					break;
				case 7:	//G
					distance = 1;
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
				
					break;
				case 8:	//Ab
					distance = 4;
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (10.5 + 14*i));
                	       		notationCtx.fillText("", canX/100 * 13.5, canY/100 * (17.5 + 14*i));
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (12 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (19 + 14*i));
					
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (12.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (19.5 + 14*i));
					notationCtx.fillText("", canX/100 * 15, canY/100 * (11 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15, canY/100 * (18 + 14*i));
					break;
				case 9:	//A
					distance = 3;
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (11.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 13.5, canY/100 * (18.5 + 14*i));
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (9.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (16.5 + 14*i));
					break;
				case 10:	//Bb
					distance = 2;
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (10.5 + 14*i));
                	       		notationCtx.fillText("", canX/100 * 13.5, canY/100 * (17.5 + 14*i));
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (12 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (19 + 14*i));
					break;
				case 11:	//B
					notationCtx.fillText("", canX/100 * 12.75, canY/100 * (10 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 12.75, canY/100 * (17 + 14*i));
					notationCtx.fillText("", canX/100 * 13.5, canY/100 * (11.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 13.5, canY/100 * (18.5 + 14*i));
					notationCtx.fillText("", canX/100 * 14.25, canY/100 * (9.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 14.25, canY/100 * (16.5 + 14*i));
					notationCtx.fillText("", canX/100 * 15, canY/100 * (11 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15, canY/100 * (18 + 14*i));
					notationCtx.fillText("", canX/100 * 15.75, canY/100 * (12.5 + 14*i));
                        	 	notationCtx.fillText("", canX/100 * 15.75, canY/100 * (19.5 + 14*i));
				
					distance = 5;
					break;
			}
		if(i == 0){
			switch(pieceFile.bottomTime){
				case 1:
                         		notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
					break;
				case 2:
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
					break;
				case 4:
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
                         		break;
				case 8:
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
                         		break;
				case 16:
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
					distance += 0.5;
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
                         		break;
				case 32:
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
					distance += 0.5;
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 13);
					notationCtx.fillText("", canX/100 * (13 + (distance*0.75)), canY/100 * 19);
					break;
			}
			if(pieceFile.topTime.toString().length == 1){
				notationCtx.fillText(String.fromCharCode(parseInt("E08" + pieceFile.topTime.toString(), 16)), canX/100 * (13 + (distance*0.75)), canY/100 * 11);
				notationCtx.fillText(String.fromCharCode(parseInt("E08" + pieceFile.topTime.toString(), 16)), canX/100 * (13 + (distance*0.75)), canY/100 * 17);

			}
			else{
				notationCtx.fillText(String.fromCharCode(parseInt("E08" + pieceFile.topTime.toString()[0], 16)), canX/100 * (13 + (distance*0.75)), canY/100 * 11);
				notationCtx.fillText(String.fromCharCode(parseInt("E08" + pieceFile.topTime.toString()[0], 16)), canX/100 * (13 + (distance*0.75)), canY/100 * 17);
				
				distance += 1;
				notationCtx.fillText(String.fromCharCode(parseInt("E08" + pieceFile.topTime.toString()[1], 16)), canX/100 * (13 + (distance*0.75)), canY/100 * 11);
				notationCtx.fillText(String.fromCharCode(parseInt("E08" + pieceFile.topTime.toString()[1], 16)), canX/100 * (13 + (distance*0.75)), canY/100 * 17);
			}
			var staffBounds = [(canX/100 * (14+(distance*0.75))), canX/10 * 9];
			sessionStorage.setItem("staffBounds", JSON.stringify(staffBounds));
		}
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


function redrawCanvas(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var notes = JSON.parse(sessionStorage.getItem("noteArr"));

	notationCan.width = window.screen.width * 0.95;
	notationCan.height = window.screen.height;

	notationCtx.clearRect(0, 0, notationCan.width, notationCan.height);

	measureHeight = notationCan.height/100 * 4;

	for(var i = 0; i<5; i++){
		drawStaff(i*14);
	}
	notationCtx.font = "40px LelandMusic";
	for(var i = 0; i<notes.length; i++){
		notationCtx.fillText(notes[i].note, notes[i].x_pos, notes[i].y);
		if(i == notes.length-1){
			sessionStorage.setItem("cursor", JSON.stringify([notes[i].x, notes[i].y]) )
		}
	}
	drawSymbols();
	
}


function moveGhost(){
	redrawCanvas();
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	notationCtx.font = "40px LelandMusic";

	const canX = notationCan.width
	const canY = notationCan.height

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;


	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
	var info = placementCheck(sessionStorage.getItem("note"), x, y, JSON.parse(sessionStorage.getItem("staffBounds")) );
	/*var y_in_canY = y/ (canY/200);
	y_in_canY = Math.round(y_in_canY); // rounds it to th line positions
	var x_in_canX = x/ (canX/100);
	x_in_canX = Math.round(x_in_canX);
*/

	notationCtx.globalAlpha = 0.5;
	//notationCtx.fillText(sessionStorage.getItem("note"), x_in_canX * (canX/100), y_in_canY/2 * (canY/100));
	notationCtx.fillText(info[0], info[1], info[2]);


	notationCtx.globalAlpha = 1;

}

function selectNote(){
	var noteSelect = document.getElementById("noteSelect");
	for(var i = 1; i < noteSelect.childNodes.length; i+=2){
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
