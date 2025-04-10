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
}

function durationToChar(duration, isRest = false){

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

function interpretClick(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var noteChar = sessionStorage.getItem("note");
	
	if(noteChar == "" || noteChar == " "){
		return;
	}

	notationCtx.font = "40px LelandMusic";
	
	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;

	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;

	var note = findValidNote(x, y);
	note.duration = charToDuration(noteChar)[0];

	//var requestData = new FormData();
	addNote(note);
	redrawCanvas();
}

function findValidNote(x, y){
	
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	
	const canX = notationCan.width
	const canY = notationCan.height

	var pf     = JSON.parse(sessionStorage.getItem("pieceFile"));
	var coords = roundCoords(x, y, canX, canY);

	var xIndex = pf.notes.length;

	var yIndex = coords[1] - canY/10;
	yIndex /= (canY/200);
	yIndex += 2;
	yIndex %= 28;

	for(var i = 0; i < pf.notes.length; i++){
		break;
		//if(pf.notes[i].x < )
	}

	return {xIndex: xIndex, y: y, yIndex: yIndex};
}

function addNote(note){
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var finalNote = new Note(note.xIndex, note.yIndex, note.duration);

	if(!pieceFile.notes.length || note.xIndex > pieceFile.notes[ pieceFile.notes.length-1 ].x ){
	//if this is the first note or if the note's position is to the right of the furthest one
		pieceFile.notes.push(finalNote);
	}
	else{
		for(var i = 0; i < pieceFile.notes.length-1; i++){
			if(pieceFile.notes[i].x < note.x && pieceFile.notes[i+1].x >= note.x){
				pieceFile.notes.splice(i, 0, note);
			}
		}
	}

	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	return;
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
	var currentNote = 0;
	if(pieceFile.notes.length == 0){
		return;
	}
	cursor = 0;
	for(var i = 0; i < pieceFile.notes.length; i++){
		currentNote += pieceFile.notes[i].duration;
		currentMeasure = Math.floor(currentNote/quarterNotesPerMeasure)
		if( cursor < currentMeasure){
	
			if( currentNote/quarterNotesPerMeasure == currentMeasure && currentMeasure-cursor == 1){
				var coords = getCoordinates(i, pieceFile.notes[i].y, canX, canY);
				drawMeasure( coords[0] + (canX/75), coords[1], canY);
				cursor = currentMeasure;
			}
			else{
				var note1 = pieceFile.notes[i].duration
				var leftOver = (currentNote - currentMeasure * quarterNotesPerMeasure)
				var result = splitNote(note1, quarterNotesPerMeasure, leftOver, pieceFile.topTime);
				console.log(currentNote, leftOver, result);
				var newNote;

				pieceFile.notes[i].duration = result[0][0];
				var j = 1;
				for(; j < result[0].length; j++){
					newNote = new Note(i+j, pieceFile.notes[i].y, result[0][j])
					console.log(newNote)
					pieceFile.notes.splice(i+j, 0, newNote);
					console.log(pieceFile.notes[i+j])
				}
				//draw measure yeah
				for(var k = 0; k < result[1].length; k++){
					newNote = new Note(i+j+k, pieceFile.notes[i].y, result[1][k])
					console.log(newNote)
			
					pieceFile.notes.splice(i+j+k+1, 0, newNote);
					console.log(pieceFile.notes[i+j+k])

				}
				
				for(var k = i+result[1].length+result[0].length; k < pieceFile.notes.length; k++){
					pieceFile.notes[k].x += result[1].length + result[0].length ;
				}
				
				sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
				cursor = currentMeasure;
	
				/*if(note2 > 0.99){
					note2 = Math.round(note2);
				} 
				pieceFile.notes[i].duration -= note2
				note2 = new Note(pieceFile.notes[i].x+1, pieceFile.notes[i].y, note2);

				for(var j = i+1; j < pieceFile.notes.length; j++){
					pieceFile.notes[j].x += 1;
				}
				if(pieceFile.notes.length - i > 0){
					pieceFile.notes.splice(i+1, 0, note2);
				}
				else{
					pieceFile.notes.push(note2);
				}
				sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
				cursor = Math.floor(currentMeasure); */
				

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

function splitNote(duration, quarterNotesPerMeasure, leftOver, topTime){
//	return[[1], [2, 1]];
	var result = [[],[]];
	var part1 = duration - leftOver;
	part1 *=8;		//multiplied so the smallest note possible is 1 unit, allows rounding
	duration *=8;
	leftOver *=8;

	quarterNotesPerMeasure -= quarterNotesPerMeasure%2 //ensures this function produces valid durations, as all durations must be powers of 2
	var maxDuration = Math.round(quarterNotesPerMeasure*8 - ((quarterNotesPerMeasure*8) %2));
	console.log(maxDuration);

	var sum = 0
	for(var i = maxDuration; i>=1; i/=2){
		if(sum+i <= part1){
			result[0].push(i/8);
			sum+=i
		}
	}
	sum = 0
	for(var i = maxDuration; i>=1; i/=2){
		if(sum+i <= leftOver){
			result[1].push(i/8);
			sum+=i
		}
	}
	

	return result;
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

	drawSymbols();

	for(var i = 0; i< pieceFile.notes.length; i++){

		var coords = getCoordinates(i, pieceFile.notes[i].y, canX, canY);
		var noteChar = durationToChar(pieceFile.notes[i].duration);
		notationCtx.fillText(noteChar, coords[0], coords[1]);
	}
	drawMeasures();
	
}

function getCoordinates(xIndex, yIndex, canX, canY){
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	var staffLength = staffBounds[1] - staffBounds[0] - canX/25;

	var x_pos = xIndex * canX/50;
	var staff = Math.floor(x_pos / staffLength);
	x_pos = x_pos % staffLength;
	//x_pos += ((canX/100) * 15);
	x_pos += staffBounds[0];

	var y_pos = canY/10 + ((yIndex - 2) * (canY/200));
	y_pos += staff*14*(canY/100);
	
	return [x_pos, y_pos];
}

function moveGhost(){
	redrawCanvas();
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var noteChar = sessionStorage.getItem("note");
	notationCtx.font = "40px LelandMusic";

	const canX = notationCan.width
	const canY = notationCan.height

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;


	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
	noteInfo = findValidNote(x, y);

	notationCtx.globalAlpha = 0.5;
	var coords = getCoordinates(noteInfo.xIndex, noteInfo.yIndex, canX, canY);

	notationCtx.fillText(noteChar, coords[0], coords[1]);

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
