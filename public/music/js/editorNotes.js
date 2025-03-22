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
	constructor(x, y, duration, volume = 1){ //all must be numeric
		this.pitch = pitch;
		this.duration = duration;
		this.x = x;
		this.y = y;
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
	}
	
}

async function init(){
	await getPieceFile();
	
	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");

	canX = notationCan.width;
	canY = notationCan.height;

	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));

	initCtx();
	redrawCanvas();
}

function getStaffFromY(y, canY, norm = false){
	
	if(norm){
		y = y/ (canY/200);
	}

	var staff = (y/2*canY/100) - canY/10;
	staff = staff / (canY/100 * 14);
	staff += 0.10;
	return staff;
}

function staffToMeasureY(staff, canY){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	
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
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");

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
		//drawMeasure(x_pos, y_pos, canY);
		return [" ", 0, 0, 0];
	}

	var y = y_pos/ (canY/200);
	y = Math.round(y); // rounds it to th line positions
	
	var x = x_pos/ (canX/100);
	x = Math.round(x);

	var staff = getStaffFromY(y, canY);
	var note_dur;

	var charInfo = charToDuration(sessionStorage.getItem("note"));

	if(charInfo[1] > 0){
		y = ( Math.floor(staff) + charInfo[1] ) * (canY/100 * 14) + (canY/10);
		y = y/ (canY/200);
	}
	
	// determine which staff it's in;
	var staff = (y/2*canY/100) - canY/10;
	staff = staff / (canY/100 * 14);
	staff += 0.10;
	
	if(note.charCodeAt(0) < 57820 && (staff % 1 < 0.24 || (staff % 1 >0.45 && staff % 1 < 0.67)) && note_dur<4){
		note = String.fromCharCode(note.charCodeAt(0) + 1)
	}
	
	var coords = getNextNotePos(x_pos, y_pos);
	return [note, coords[0], coords[1], charInfo[0]];
//	return [note, x * canX/100, y/2 * canY/100, charInfo[0]];
}

function durationToChar(duration, isRest){

	if(isRest){
		var firstRest;
		var secondRest;
		return [firestRest, secondRest];
	}

	var charCode = 0;
	switch(duration){
		case 4:
			charCode = 57506;
			break;
		case 2:
			charCode = 57811;
			break;
		case 1:
			charCode = 57813;
			break;
		case 0.5:
			charCode = 57815;
			break;
		case 0.25:
			charCode = 57817;
			break;
		case 0.125:
			charCode = 57819;
			break;

	}

	return String.fromCharCode(charCode);

}

function charToDuration(character){
	var charCode = character.charCodeAt(0);
	var noteDuration = 0;
	var staffOffset = 0;
	
	if(charCode > 58594 && charCode < 58601){
		staffOffset += 0.149;
		switch(charCode){
			case 58595:
				staffOffset -= 0.07;
				noteDuration = 4;
				break;
			case 58596:
				noteDuration = 2;
				break;
			case 58597:
				noteDuration = 1;
				break;
			case 58598:
				noteDuration = 0.5;
				break;
			case 58599:
				noteDuration = 0.25;
				break;
			case 58600:
				noteDuration = 0.125;
				break;
		}
	}
	else{
		switch(charCode){
			case 57506:
				noteDuration = 4;
				break;
			case 57811:
				noteDuration = 2;
				break;
			case 57813:
				noteDuration = 1;
				break;
			case 57815:
				noteDuration = 0.5;
				break;
			case 57817:
				noteDuration = 0.25;
				break;
			case 57819:
				noteDuration = 0.125;
				break;
		}
	}
	return [noteDuration, staffOffset];
}

function sortNotes(){ //needs to sort the notes array to go up by Y and X, according to the order of everything. Might be unnecessary with good data insertion
	return;
}

function insertNote(note, x_pos, y, x, canY){
	var pieceFile = JSOM.parse(sessionStorage.getItem("pieceFile"));
	var staff = Math.floor( getStaffFromY(y, canY) );
	if(pieceFile.notes.length == 0){
		pieceFile.notes.push( {x: x, x_pos: x_pos, y: y, note: note} );
	}
	for(var i = 0; i < pieceFile.notes.length; i++){
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

function interpretClick(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	notationCtx.font = "40px LelandMusic";

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;

	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
	var info = placementCheck(sessionStorage.getItem("note"), x, y, JSON.parse(sessionStorage.getItem("staffBounds")) );
	
	if(pieceFile.notes.length != 0){
		info[3] += pieceFile.notes[pieceFile.notes.length-1].x;
	}
	var note = {x: info[3], x_pos: info[1], y: info[2], note: info[0]};
	

	staffToMeasureY(getStaffFromY(info[2] / (notationCan.height/200), notationCan.height), notationCan.height);

	//var requestData = new FormData();
	pieceFile.notes.push(note);
	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	redrawCanvas();
	//notationCtx.fillText(info[0], info[1], info[2]);
}

function roundCoords(x, y, canX, canY){
	y = y/ (canY/200);
	x = x/ (canX/100);
	y = Math.round(y);
	x = Math.round(x);
	y = y * canY/200;
	x = x * canX/100;

	return [x, y];
}

function getNextNotePos(x, y){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var pieceFile   = JSON.parse(sessionStorage.getItem("pieceFile"));
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));

	const canX = notationCan.width;
	const canY = notationCan.height;

	var coords = roundCoords(x, y, canX, canY);
	var yStaff = Math.floor(getStaffFromY(coords[1], canY, true));
	//console.log(getStaffFromY(coords[1], canY, true));
	
	var yIndex = coords[1] - canY/10;
	yIndex = yIndex / (canY/200);
	yIndex += 2
	console.log(yIndex);

	if(!pieceFile.notes.length){
	// if it's the first note
		x = canX/100 * 15;
		y = coords[1];
		if(yStaff){
			y -= (yStaff * 14 * canY/100)
		}
		return [x, y];
	}

	var previousNote = pieceFile.notes[ pieceFile.notes.length - 1 ];

	if(x > previousNote.x_pos && Math.floor( getStaffFromY(coords[1], canY, true) ) >= Math.floor(getStaffFromY(previousNote.y, canY, true) ) ){
	// if it's in front of the previous note and on the same or the next staff
		if( Math.floor( getStaffFromY(coords[1], canY, true) ) > Math.floor(getStaffFromY(previousNote.y, canY, true) ) ){
			//if it's on the next staff
			x = canX/100 * 15;
			return [x, coords[1]];
		}

		if(previousNote.x_pos + (canX/50 * 2) < staffBounds[1]){
		// if it doesn't extend past the limits of the staff
			x = previousNote.x_pos + canX/50;
			return [x, coords[1]];
		}
	}

	return [coords[0], coords[1]]
}

function drawMeasures(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var topTime = pieceFile.topTime;
	var bottomTime = pieceFile.bottomTime;
	var quarterNotesPerMeasure = 1/bottomTime * 4 * topTime;
	
	const canX = notationCan.width
	const canY = notationCan.height

	var measureHeight = canY/10;
	var currentMeasure = 0;
	if(pieceFile.notes.length == 0){
		return;
	}
	cursor = 0;
	for(var i = 0; i < pieceFile.notes.length; i++){
		currentMeasure = pieceFile.notes[i].x / quarterNotesPerMeasure
		if( cursor < Math.floor(currentMeasure)){
			if( currentMeasure == Math.floor(currentMeasure) ){
				drawMeasure( pieceFile.notes[i].x_pos + (canX/75), pieceFile.notes[i].y, canY );
				cursor = Math.floor(currentMeasure);
			}
			else{
				var note1 = charToDuration(pieceFile.notes[i].note)[0]
				var note2 = (currentMeasure - Math.floor(currentMeasure)) * quarterNotesPerMeasure;
				if(note2 > 0.99){
					note2 = Math.round(note2);
				}
				pieceFile.notes[i].x -= note2
				pieceFile.notes[i].note = durationToChar(note1-note2);
				note2 = {x: pieceFile.notes[i].x+note2, x_pos: pieceFile.notes[i].x_pos + canX/50, y: pieceFile.notes[i].y, note: durationToChar(note2)};

				for(var j = i+1; j < pieceFile.notes.length; j++){
					pieceFile.notes[j].x += note2;
				}
				if(pieceFile.notes.length - i > 0){
					pieceFile.notes.splice(i+1, 0, note2);
				}
				else{
					pieceFile.notes.push(note2);
				}
				sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
				cursor = Math.floor(currentMeasure);
			}
		}
	}

	for(var i = 0; i < 5; i++){
		for(var j = 0; j<4; j++){
			notationCtx.moveTo(canX/10, canY/100 * (10));
			notationCtx.lineTo(canX/10, canY/100 * (20));
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
	var pieceFile   = JSON.parse(sessionStorage.getItem("pieceFile"));
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));

	notationCan.width = window.screen.width * 0.95;
	notationCan.height = window.screen.height;

	const canY = notationCan.height;
	const canX = notationCan.width;

	notationCtx.clearRect(0, 0, notationCan.width, notationCan.height);

	measureHeight = notationCan.height/100 * 4;

	for(var i = 0; i<5; i++){
		drawStaff(i*14);
	}
	notationCtx.font = "40px LelandMusic";
	for(var i = 0; i< pieceFile.notes.length; i++){
		var staffLength = staffBounds[1] - staffBounds[0];
		var x_pos = pieceFile.notes[i].x * canX/100 + (canX/100 * 13);
		var staff = Math.floor(x_pos / staffLength);
		x_pos = x_pos % staffLength;
		notationCtx.fillText(pieceFile.notes[i].note, x_pos, pieceFile.notes[i].y);
	}
	drawMeasures();
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
