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
	rebuildDisplayArray();
	redrawCanvas();
}

function getPointedElement(){ 
	var q = document.querySelectorAll(":hover"); 
	return q[q.length-1]; 
}

async function getPieceFile(){
	var pieceID = -1;
	for(var i = 0; i < window.location.href.length; i++){
		if(window.location.href[i] == "?"){
			pieceID = window.location.href.substring(i+7);
			break;
		}
	}

	if(pieceID == -1){
		window,location.href = "/music/projects.php"
		return;
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
	await audioInit();

	notationCan = document.getElementById("notation");
	notationCtx = notationCan.getContext("2d");

	notationCan.width = window.screen.width * 0.95;
	notationCan.height = window.screen.height;


	sessionStorage.setItem("canX", notationCan.width);
	sessionStorage.setItem("canY", notationCan.height);
	
	sessionStorage.setItem("activePage", 0);

	sessionStorage.setItem("displayArray", JSON.stringify([]));	
	sessionStorage.setItem("displayMisc", JSON.stringify([]));

	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));

	initCtx();
	}

function getStaffFromY(y, norm = false){
	canY = sessionStorage.getItem("canY");
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

function drawMeasure(x, y){
	var canY = sessionStorage.getItem("canY");
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");

	y = staffToMeasureY(getStaffFromY(y/ (canY/200)), canY);
	notationCtx.moveTo(x, y);
	notationCtx.lineTo(x, y+ (canY/10));
	notationCtx.stroke();	
	return;
}

function durationToChar(duration, isNote = false){

	var charCode = 0;
	
	if(!isNote){
		switch(duration){
		case 4:
			charCode = 58595;
			break;
		case 2:
			charCode = 58596;
			break;
		case 1:
			charCode = 58597;
			break;
		case 0.5:
			charCode = 58598;
			break;
		case 0.25:
			charCode = 58599;
			break;
		case 0.125:
			charCode = 58600;
			break;
		}
		return String.fromCharCode(charCode);
	}

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
	var ai = sessionStorage.getItem("activeInstrument");
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));

	if(noteChar == "" || noteChar == " "){
		return;
	}

	notationCtx.font = "40px LelandMusic";
	
	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;

	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;
	
	if(noteChar == "✕"){
		if(displayArray.length){
			noteInfo = findClosestNote(x, y);
			deleteNote(noteInfo.index);
		}
		return;
	}
	else if(noteChar == ""){ //flat
		if(displayArray.length){
			noteInfo = findClosestNote(x, y);
			pieceFile.notes[ai][noteInfo.index].accidental -= 1
			sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
		}
		return;
	}
	else if(noteChar == ""){ //sharp
		if(displayArray.length){
			noteInfo = findClosestNote(x, y);
			pieceFile.notes[ai][noteInfo.index].accidental += 1
			sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
		}
		return;
	}


 
	roundedCoords = roundCoords(x, y);
	
	if(getStaffFromY(roundedCoords.y, true) < 0){
		return;
	}

	note = findNewNotePosition(roundedCoords.x, roundedCoords.y, noteChar);
	note.duration = charToDuration(noteChar)[0];

	if(note.rest){
		note.volume = 0;
	}
	else{
		note.volume = 1;
	}

	note.y = Math.round(note.y);
	note.accidental = 0;


	addNote(note);
	redrawCanvas();
}

function deleteNote(index){
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var ai = sessionStorage.getItem("activeInstrument");
	var maxX = 0;

	pieceFile.notes[ai].splice(index, 1);

	for(var i = 0; i < pieceFile.notes[ai].length; i++){
		if(pieceFile.notes[ai][i].x > maxX){
			maxX = pieceFile.notes[ai][i].x
		}
	}
	var xFound;
	for(var i = 0; i < maxX; i++){
		xFound = false;

		for(var j = 0; j < pieceFile.notes[ai].length; j++){
			if(pieceFile.notes[ai][j].x == i){
				xFound = true;
				break;
			}
		}
		if(!xFound){
			maxX -= 1;	
			for(var j = i; j< pieceFile.notes[ai].length; j++){
				if(pieceFile.notes[ai][j].x > i){
					pieceFile.notes[ai][j].x -= 1;
				}
			}
		}
	}
	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	redrawCanvas();
	//rebuildDisplayArray();
	
}

function findNewNotePosition(x, y, noteChar){
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var ai = sessionStorage.getItem("activeInstrument");
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var lastNote = displayArray.length-1
	var canX = sessionStorage.getItem("canX");
	var note = new Object();

	if(displayArray.length > 0){
		var closestNote = findClosestNoteInTime(roundedCoords.x, roundedCoords.y)
		if(toTrueX(roundedCoords.x, roundedCoords.y) > toTrueX(displayArray[lastNote].x, displayArray[lastNote].y)){
			note.x = pieceFile.notes[ai][pieceFile.notes[ai].length-1].x + 1
			note.y = yToYIndex(roundedCoords.y);
		}
		else if(Math.abs(closestNote.x - roundedCoords.x) < canX/200 && closestNote.y != roundedCoords.y){
			note.x = pieceFile.notes[ai][closestNote.index].x
			note.y = yToYIndex(roundedCoords.y)
		}
		else{
			newNote = findNewNoteIndex(roundedCoords.x, roundedCoords.y);
			incrementX(newNote.x);
			note.x = newNote.x;
			note.y = newNote.y;
		}
	}
	else{
		note.x = 0;
		note.y = yToYIndex(roundedCoords.y);

	}
	note.rest = false;
	
	if(noteChar.charCodeAt(0) >= 58595 && noteChar.charCodeAt(0) <= 58600){
	/*	var halfStaff = [canY/10 + (Math.floor(getStaffFromY(y, true)) * canY/100 * 14) + canY/200*4];
		halfStaff.push(halfStaff[0]+ (canY/200*12))
		if(Math.abs(y - halfStaff[0]) > Math.abs(y - halfStaff[1])){
			note.y = 18;
		}
		else{
			note.y = 6
		}
		if(noteChar.charCodeAt(0) == 58595){
			note.y -= 2;
		}
		//noteInfo.y = canY/10 + (Math.floor(getStaffFromY(noteInfo.y, true)) * canY/100 * 14) + canY/200*16;  */
		note.rest = true;
	}

	return note;
}

function incrementX(index){
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var ai = sessionStorage.getItem("activeInstrument");


	for(var i = index; i < pieceFile.notes[ai].length; i++){
		pieceFile.notes[ai][i].x += 1;
	}
	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	return;
}
function yToYIndex(y){
	canY = sessionStorage.getItem("canY");
	yIndex = y - canY/10;
	yIndex /= (canY/200);
	yIndex += 2;
	yIndex %= 28;
	return yIndex;
}

function findNewNoteIndex(x, y){

	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var trueX = toTrueX(x, y);
	var index = -1;
	for(var i = 0; i < displayArray.length; i++){
		//if((noteChar > 57820 || noteChar < 57810) && noteChar !== 57506){
		//	continue;
		//}
		currentTrueX = toTrueX( displayArray[i].x, displayArray[i].y);
		if(trueX <= currentTrueX){
			index = i;
			break;
		}
	}
	if(index == -1){
		index = displayArray.length;
	}
	yIndex = y - canY/10;
	yIndex /= (canY/200);
	yIndex += 2;
	yIndex %= 28;
	return {x: index, y: yIndex}
}

function findValidNote(x, y){
	canX = sessionStorage.getItem("canX");
	canY = sessionStorage.getItem("canY");

	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var coords = roundCoords(x, y);
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	var lastNote = displayArray.length-1
	

	lastNoteStaff = Math.floor(getStaffFromY(displayArray[lastNote].y, true));
	thisNoteStaff = Math.floor(getStaffFromY(coords.y, true));

	if(displayArray[lastNote].symbol == "\u0000"){
		lastNoteStaff = 0;
	}


	x = displayArray[lastNote].x + canX/50;
	y = coords.y
	if(x >= staffBounds[1]){
		x = staffBounds[0] + canX/50;
		y -= Math.abs(lastNoteStaff - thisNoteStaff) * 14 * canY/100
		y += 14*canY/100;
	}
	else{
		y -= Math.abs(lastNoteStaff - thisNoteStaff) * 14 * canY/100

	}
	
	return {x, y};
}

function addNote(note){
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	//var finalNote = new Note(note.xIndex, note.yIndex, note.duration);
	var ai = sessionStorage.getItem("activeInstrument");
	var t
	
	pieceFile.notes[ai].splice(note.x, 0, note);
	
	pieceFile.notes[ai].sort(compareNoteX);


	for(var i = 0; i < pieceFile.notes[ai].length; i++){
		if(!i){  
			t = 0;
		}
		else if(pieceFile.notes[ai][i-1].x == pieceFile.notes[ai][i].x){
			t = pieceFile.notes[ai][i-1].t
		}
		else{
			t = pieceFile.notes[ai][i-1].t + pieceFile.notes[ai][i-1].duration;
		}

		pieceFile.notes[ai][i].t = t;
	}
	
	//pieceFile.notes[ai].sort(compareNoteX);

	//pieceFile.notes[ai].splice(note.x, 0, note);
	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	return;
}

function compareNoteX(a, b){
	return (a.x+a.duration/10)-(b.x+b.duration/10);
}

function roundCoords(x, y, canX = sessionStorage.getItem("canX"), canY = sessionStorage.getItem("canY")){

	y = y/ (canY/200);
	x = x/ (canX/100);
	y = Math.round(y);
	x = Math.round(x);
	y = y * canY/200;
	x = x * canX/100;

	return {x: x, y: y};
}

function drawMeasures(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var topTime = pieceFile.topTime;
	var bottomTime = pieceFile.bottomTime;
	var quarterNotesPerMeasure = 1/bottomTime * 4 * topTime;
	var ai = sessionStorage.getItem("activeInstrument");
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var ap = Number(sessionStorage.getItem("activePage"));
	const canX = notationCan.width
	const canY = notationCan.height

	var measureHeight = canY/10;
	var currentNote = 0;
	if(displayArray.length == 0){
		return;
	}
	cursor = 0;
	for(var i = 0 + ap*181; i < pieceFile.notes[ai].length && i < 181*(ap+1); i++){
		currentNote = pieceFile.notes[ai][i]
		
		currentMeasure = Math.floor( (currentNote.t+currentNote.duration) /quarterNotesPerMeasure);
		
		if(currentMeasure-cursor > 0 && (currentNote.t+currentNote.duration) /quarterNotesPerMeasure - currentMeasure < 0.125/quarterNotesPerMeasure){
			drawMeasure(displayArray[i%181].x + (canX/75), displayArray[i%181].y);
			cursor = currentMeasure;
		}
		else if(currentMeasure-cursor == 1 && (currentNote.t+currentNote.duration) /quarterNotesPerMeasure - currentMeasure >= 0.125/quarterNotesPerMeasure){
			// split note
			var part1 = [];
			var part2 = [];
		
			var part2Duration = (currentNote.t+currentNote.duration)  - (currentMeasure * quarterNotesPerMeasure)
			var part1Duration = currentNote.duration - part2Duration;
	
			for(var j = 4; j >= 0.125; j/=2){
				if(part1Duration - j >= 0){
					part1.push(j);
					part1Duration -= j;
				}
			}
			for(var j = 4; j >= 0.125; j/=2){
				if(part2Duration - j >= 0){
					part2.push(j);
					part2Duration -= j;
				}
			}
			cursor = currentMeasure;
			var tempNote;

			for(var j = 0; j < part1.length; j++){
				if(!j){
					tempNote = currentNote;
					tempNote.duration = part1[0];
					tempNote.t = pieceFile.notes[ai][i-1].t + pieceFile.notes[ai][i-1].duration

					pieceFile.notes[ai].splice(i, 1, JSON.parse(JSON.stringify(tempNote))  );
					continue;
				}
				tempNote = currentNote;
				tempNote.duration = part1[j];
				tempNote.x = pieceFile.notes[ai][i+j-1].x + 1;
				tempNote.t = pieceFile.notes[ai][i+j-1].t + pieceFile.notes[ai][i+j-1].duration;
				pieceFile.notes[ai].splice(i+j, 0, JSON.parse(JSON.stringify(tempNote)) );
			}
			drawMeasure(displayArray[i].x + (j) * (canX/50) + (canX/75), displayArray[i].y);
			
			for(var k = 0; k < part2.length; k++){
				tempNote = currentNote;
				tempNote.duration = part2[k];
				tempNote.x = pieceFile.notes[ai][i+j+k-1].x + 1
				tempNote.t = pieceFile.notes[ai][i+j+k-1].t + pieceFile.notes[ai][i+j+k-1].duration;

				pieceFile.notes[ai].splice(i+j+k, 0, JSON.parse(JSON.stringify(tempNote)) );
			}
		}	
	}
	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	rebuildDisplayArray();
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
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));

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
			var staffBounds = [(canX/100 * (14+(distance*0.75))) + canX/100, canX/10 * 9];
			sessionStorage.setItem("staffBounds", JSON.stringify(staffBounds));
			var da = JSON.parse(sessionStorage.getItem("displayArray"));
			if(!da.length){
				da.push({x: staffBounds[0]-canX/100, y: 14*canY/100, symbol: " "})
				sessionStorage.setItem("displayArray", JSON.stringify(da));
			}
		}
	}
}

function drawPieceInfo(){	
	var canX = sessionStorage.getItem("canX");
	var canY = sessionStorage.getItem("canY");
	var displayMisc = JSON.parse(sessionStorage.getItem("displayMisc"));
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var ap = Number(sessionStorage.getItem("activePage"));

	displayMisc.push({ symbol: pieceFile.pieceName, x: canX/2.5, y: canY/15 });
	displayMisc.push({ symbol: "BPM = " + pieceFile.bpm, x: canX/15, y: canY/15 });
	displayMisc.push({ symbol: "Page " + (ap+1), x: canX/10, y: canY/100 * 85})
	sessionStorage.setItem("displayMisc", JSON.stringify(displayMisc));
	return;
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
}


function redrawCanvas(){
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var pieceFile   = JSON.parse(sessionStorage.getItem("pieceFile"));
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	var ai = sessionStorage.getItem("activeInstrument");

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
	rebuildDisplayArray();
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var displayMisc = JSON.parse(sessionStorage.getItem("displayMisc"));


	drawMeasures();

	for(var i = 0; i<displayArray.length; i++){
		note = displayArray[i];
		notationCtx.fillText(note.symbol, note.x, note.y);
	}
	for(var i = 0; i<displayMisc.length; i++){
		thing = displayMisc[i];
		notationCtx.fillText(thing.symbol, thing.x, thing.y);
	}

	
}

function getCoordinates(xIndex, yIndex, canX, canY){
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	var ap = Number(sessionStorage.getItem("activePage"));
	var staffLength = staffBounds[1] - staffBounds[0] - canX/25;

	var x_pos = xIndex * canX/50;
	var staff = Math.floor(x_pos / staffLength);
	x_pos = x_pos % staffLength;
	//x_pos += ((canX/100) * 15);
	x_pos += staffBounds[0];

	var y_pos = canY/10 + ((yIndex - 2) * (canY/200));
	y_pos += staff*14*(canY/100);
	
	y_pos -= (ap*5*(canY/100)*14);

	return [x_pos, y_pos];
}

function moveGhost(){
	if(!sessionStorage.getItem("pieceFile") || !sessionStorage.getItem("activeInstrument") ){
		return;
	}
	redrawCanvas();
	var notationCan = document.getElementById("notation");
	var notationCtx = notationCan.getContext("2d");
	var noteChar = sessionStorage.getItem("note");
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var lastNote = displayArray.length -1
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	
	if(noteChar == " "){
		return;
	}
	
	const canX = notationCan.width
	const canY = notationCan.height

	var rect = notationCan.getBoundingClientRect();
	var scaleX = notationCan.width / rect.width;
	var scaleY = notationCan.height / rect.height;

	var x = (event.clientX - rect.left) * scaleX;
	var y = (event.clientY - rect.top) * scaleY;

	if(noteChar == "✕"){
		if(displayArray.length){
			noteInfo = findClosestNote(x, y);
			notationCtx.fillStyle = "red";
			notationCtx.fillText(noteInfo.symbol, noteInfo.x, noteInfo.y)
			notationCtx.fillStyle == "black";
		}
		return;
	}
	else if(noteChar == ""){ //flat
		if(displayArray.length){
			noteInfo = findClosestNote(x, y);
			notationCtx.fillStyle = "red";
			notationCtx.fillText("", noteInfo.x - canX/200, noteInfo.y)
			notationCtx.fillStyle == "black";
		}
		return;
	}
	else if(noteChar == ""){ //sharp
		if(displayArray.length){
			noteInfo = findClosestNote(x, y);
			notationCtx.fillStyle = "red";
			notationCtx.fillText("", noteInfo.x - canX/200, noteInfo.y)
			notationCtx.fillStyle == "black";
		}
		return;
	}


	var roundedCoords = roundCoords(x, y)
	var LastNote = displayArray[lastNote];
	
	noteInfo = new Object();
	if(displayArray.length > 0){
		var closestNote = findClosestNoteInTime(roundedCoords.x, roundedCoords.y)
		if(toTrueX(roundedCoords.x, roundedCoords.y) - toTrueX(displayArray[lastNote].x, displayArray[lastNote].y) > canX/200){
			console.log("notenote")
			noteInfo.x = displayArray[lastNote].x + canX/50
			noteInfo.y = roundYToStaff(roundedCoords.y, LastNote.y);
		}
		else if(Math.abs(closestNote.x - roundedCoords.x) < canX/200 && closestNote.y != roundedCoords.y){
			noteInfo.x = closestNote.x
			noteInfo.y =  roundYToStaff(roundedCoords.y, closestNote.y);
		}
		else{
			newNote = findNewNoteIndex(roundedCoords.x, roundedCoords.y);
			noteInfo.x = displayArray[newNote.x].x - canX/125;
			noteInfo.y = roundYToStaff(roundedCoords.y, closestNote.y);
		}
	}
	else{
		noteInfo.x = staffBounds[0] ;
		noteInfo.y = roundYToStaff(roundedCoords.y, canY/100 * 15);
	}

	/*
	if(noteChar.charCodeAt(0) >= 58595 && noteChar.charCodeAt(0) <= 58600){
		var halfStaff = [canY/10 + (Math.floor(getStaffFromY(noteInfo.y, true)) * canY/100 * 14) + canY/200*4];
		halfStaff.push(halfStaff[0]+ (canY/200*12))
		if(Math.abs(noteInfo.y - halfStaff[0]) > Math.abs(noteInfo.y - halfStaff[1])){
			noteInfo.y = halfStaff[1];
		}
		else{
			noteInfo.y = halfStaff[0];
		}
		if(noteChar.charCodeAt(0) == 58595){
			noteInfo.y -= canY/100;
		}
		//noteInfo.y = canY/10 + (Math.floor(getStaffFromY(noteInfo.y, true)) * canY/100 * 14) + canY/200*16;
	}*/
	notationCtx.globalAlpha = 0.5;

	notationCtx.fillText(noteChar, noteInfo.x, noteInfo.y);

	notationCtx.globalAlpha = 1;

}

function roundYToStaff(y, y2, norm = true){
	var staff = Math.floor(getStaffFromY(y, norm));
	var targetStaff = Math.floor(getStaffFromY(y2, norm));
	y -= Math.abs(targetStaff-staff) * (canY/100 * 14)
	return y;
}

function findClosestNote(x, y){
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var mindist = -1;
	var mindistIndex = -1;
	var xdiff;
	var ydiff;
	var noteChar

	for(var i = 0; i < displayArray.length; i++){
		noteChar = displayArray[i].symbol.charCodeAt(0);
		xdiff = displayArray[i].x - x;
		ydiff = displayArray[i].y - y;
		if(mindist > xdiff*xdiff + ydiff*ydiff || mindist == -1){
			mindistIndex = i
			mindist = xdiff*xdiff + ydiff*ydiff;
		}
	}
	return {symbol: displayArray[mindistIndex].symbol, x: displayArray[mindistIndex].x, y: displayArray[mindistIndex].y, index: mindistIndex}
}

function findClosestNoteInTime(x, y){
	var displayArray = JSON.parse(sessionStorage.getItem("displayArray"));
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	var mindist = -1;
	var mindistIndex = -1;
	var xdiff;

	var staff = Math.floor(getStaffFromY(y, true));
	var trueX = staff * staffBounds[1] + x

	for(var i = 0; i < displayArray.length; i++){
		noteChar = displayArray[i].symbol.charCodeAt(0);
		currentNote = displayArray[i];
		currentTrueX = toTrueX(currentNote.x, currentNote.y);
		

		xdiff = currentTrueX - trueX;
		
		if(mindist > xdiff*xdiff || mindist == -1){
			mindistIndex = i;
			mindist = xdiff*xdiff;
		}
	}
	if(mindistIndex == -1){
		return;
	}



	return {symbol: displayArray[mindistIndex].symbol, x: displayArray[mindistIndex].x, y: displayArray[mindistIndex].y, index: mindistIndex}

}

function toTrueX(x, y){
	var trueX = 0;	
	var staffBounds = JSON.parse(sessionStorage.getItem("staffBounds"));
	trueX = Math.floor(getStaffFromY(y, true)) * staffBounds[1] + x;
	
	return trueX;
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

function rebuildDisplayArray(){
	var ai = sessionStorage.getItem("activeInstrument");
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	var displayArray = [];
	var displayMisc = [];
	var ap = Number(sessionStorage.getItem("activePage"));
	var staff;
	var coords;
	var noteChar;

	const canX = sessionStorage.getItem("canX");
	const canY = sessionStorage.getItem("canY");

	//drawSymbols();

	for(var i = 0 + ap*181; i < pieceFile.notes[ai].length  && i < 181*(ap+1); i++){
		coords = getCoordinates(pieceFile.notes[ai][i].x, pieceFile.notes[ai][i].y, canX, canY);

		//staff = Math.floor(getStaffFromY(coords[1], true)) ;

		//if( staff > 4+(ap*5) || staff < ap*5){
		//	continue;
		//}
		noteChar = durationToChar(pieceFile.notes[ai][i].duration, pieceFile.notes[ai][i].volume);


		if((pieceFile.notes[ai][i].y <= 6 || (pieceFile.notes[ai][i].y > 12 && pieceFile.notes[ai][i].y <= 18)) && pieceFile.notes[ai][i].volume != 0 && pieceFile.notes[ai][i].duration != 4 ){
			noteChar = noteChar.charCodeAt(0);
			noteChar = String.fromCharCode(noteChar+1)
		}
		displayArray.push( {symbol: noteChar, x: coords[0], y: coords[1]});
		
		if(pieceFile.notes[ai][i].accidental != 0){
			if(pieceFile.notes[ai][i].accidental == 1){
				displayMisc.push( {symbol: "", x: coords[0] - canX/200, y: coords[1]} )
			}
			else{
				displayMisc.push( {symbol: "", x: coords[0] - canX/200, y: coords[1]} )
			}

		}
	}

	sessionStorage.setItem("displayArray", JSON.stringify(displayArray));
	sessionStorage.setItem("displayMisc", JSON.stringify(displayMisc));
	drawPieceInfo();
	//redrawCanvas();
}
