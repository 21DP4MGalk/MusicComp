//var audioCtx;


async function audioInit(){
	//audioCtx = new AudioContext();
	var instruments = await getInstrumentList();
	sessionStorage.setItem("instrumentList", JSON.stringify(instruments));
	setInstrument(instruments, 0);
	drawInstrumentElements(instruments, 0);
	return;
}

function playInstrumentPart(startMeasure = 0, endMeasure = -1){
	var audioCtx = new AudioContext();
	var ai = sessionStorage.getItem("activeInstrument");
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));

	instruments = JSON.parse(sessionStorage.getItem("instrumentList"));
	console.log(instruments)
	instrument = JSON.parse(instruments[ai][3])
	waveform = audioCtx.createPeriodicWave(instrument.real, instrument.imag);

	tet12 = getChromatic12TET(440);
	majorScale = getMajorScale(tet12, pieceFile.key);


	var timeStart = 0;
	var timeStop = 0;
	var frequency = 0;
	var s_per_crochet = (4/pieceFile.bottomTime)* 60/pieceFile.bpm
	for(var i = 0; i < pieceFile.notes[ai].length; i++){
			if(pieceFile.notes[ai][i].volume == 0){
				continue;
			}

			frequency = yToMajor(pieceFile.notes[ai][i].y, majorScale);
			if(pieceFile.notes[ai][i].accidental != 0){
				frequency = frequency * (Math.pow( Math.pow(2, 1/12), pieceFile.notes[ai][i].accidental ) )
			}
			timeStart = pieceFile.notes[ai][i].t * s_per_crochet;
			timeStop = timeStart + pieceFile.notes[ai][i].duration * s_per_crochet;
			playNote(waveform, timeStart, timeStop, frequency, audioCtx);
	}
	setTimeout(() => {audioCtx.close();}, (timeStop*1000)+10000);
	return;
}


function playNote(waveform, timeStart, timeStop, frequency, audioCtx){
	var oscillator = new OscillatorNode(audioCtx, {
		frequency: frequency,
		periodicWave: waveform,
	})
	oscillator.connect(audioCtx.destination);
	oscillator.start(timeStart);
	oscillator.stop(timeStop);
}

function yToMajor(y, majorScale){
	return majorScale[42-y];
}

function getMajorScale(tet12, key){
	majorScale = [];
	switch(key){
		case 0:
			var [C, D, E, F, G, A, B] = [0, 0, 0, 0, 0, 0, 0];
			break;
		case 1:
			var [C, D, E, F, G, A, B] = [1, 1, 1, 1, 1, 1, 1];
			break;
		case 2:
			var [C, D, E, F, G, A, B] = [1, 0, 0, 1, 0, 0, 0];
			break;
		case 3:
			var [C, D, E, F, G, A, B] = [0, 0, -1, 0, 0, -1, -1];
			break;
		case 4:
			var [C, D, E, F, G, A, B] = [1, 1, 0, 1, 1, 0, 0];
			break;
		case 5:
			var [C, D, E, F, G, A, B] = [0, 0, 0, 0, 0, 0, -1];
			break;
		case 6:
			var [C, D, E, F, G, A, B] = [1, 1, 1, 1, 1, 1, 0];
			break;
		case 7:	
			var [C, D, E, F, G, A, B] = [0, 0, 0, 1, 0, 0, 0];
			break;
		case 8:
			var [C, D, E, F, G, A, B] = [0, -1, -1, 0, 0, -1, -1];
			break;
		case 9:
			var [C, D, E, F, G, A, B] = [1, 0, 0, 1, 1, 0, 0];
			break;
		case 10:
			var [C, D, E, F, G, A, B] = [0, 0, -1, 0, 0, 0, -1];
			break;
		case 11:
			var [C, D, E, F, G, A, B] = [1, 1, 0, 1, 1, 1, 0];
			break;
	}
	for(var i = 1; i < 9; i++){
		majorScale.push(tet12[0+C + 12*i]);
		majorScale.push(tet12[2+D + 12*i]);
		majorScale.push(tet12[4+E + 12*i]);
		majorScale.push(tet12[5+F + 12*i]);
		majorScale.push(tet12[7+G + 12*i]);
		majorScale.push(tet12[9+A + 12*i]);
		majorScale.push(tet12[11+B + 12*i]);
	}
	return majorScale;

}

function getPitchGivenA(desiredPitchNum, referenceANum = 69, referenceA = 440){
    // desiredPitchNum is the number assigned to the pitch we want to generate in a scale, for example how Middle C in MIDI format is 60
    // referenceANum is the number assigned to concert A in the same context, reference A defines concert A.
    //All values should be INT
    if(isNaN(desiredPitchNum) || isNaN(referenceANum) || isNaN(referenceA)){
        throw new TypeError("One or more of of the parameters used for generating a pitches turned out not to be numbers, but rapscallions in trench      coats!");
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


function yToFreq(yIndex){
	//81 is top note
	//54 is lowest 
	return 81-yIndex
}

async function setInstrument(instruments, ai){
	sessionStorage.setItem("activeInstrument", ai);
	sessionStorage.setItem("activePage", 0);
	instruments[ai][3] = JSON.parse(instruments[ai][3]);
	sessionStorage.setItem("real", instruments[ai][3].real);
	sessionStorage.setItem("imag", instruments[ai][3].imag);

	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	if(pieceFile.notes.length <= ai){
		console.log("DINDONG");
		for(var i = 0; i < ai-pieceFile.notes.length+1; i++){
			console.log("DINGUSDONGUS");
			pieceFile.notes.push([[]]);
		}
	}
	sessionStorage.setItem("pieceFile", JSON.stringify(pieceFile));
	rebuildDisplayArray();
	return;
}

function drawInstrumentElements(instruments, ai){
	var listElement = document.getElementById("listElement");
	listElement.innerHTML = "";
	for(var i = 0; i<instruments.length; i++){
		injection = "";
		injection += "<button";
		if(i == ai){
			injection += " class='ai'";

		}
		injection += " onclick='setInstrument(JSON.parse(sessionStorage.getItem(\"instrumentList\")), " + i + ")'>" + instruments[i][1] + "</button> <br> <p>" + instruments[i][2] + "</p>"
		listElement.innerHTML += injection;
	}
	return;
}

async function getInstrumentList(){
	var request = await fetch("/api/getInstrumentList.php");
	request = await request.text();
	request = JSON.parse(request);
	var pieceID = -1;
	
	for(var i = 0; i < window.location.href.length; i++){
		if(window.location.href[i] == "?"){
			pieceID = window.location.href.substring(i+7);
			break;1
		}   
	}   
	
	if(pieceID == -1){
		return -1;
	}
	
	var result = [];
	for(var i = 0; i < request.length; i++){
		if(request[i][5] == pieceID){
			result.push(request[i]);
		}
	}

	return result;
}
