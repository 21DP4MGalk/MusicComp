var audioCtx;


function audioInit(){
	audioCtx = new AudioContext();
	sessionStorage.setItem("activeInstrument", 0);
	setInstrument(0);
	return;
}

async function playInstrumentPart(startMeasure = 0, endMeasure = -1){
	sessionStorage.getItem("activeInstrument");
	instruments = await getInstrumentList();

	

	return;
}

async function setInstrument(instrument){
	var instruments = await getInstrumentList()
	sessionStorage.setItem("activeInstrument", instrument);
}

async function getInstrumentList(){
	var request = await fetch("/api/getInstrumentList.php");
	request = await request.text();
	request = JSON.parse(request);
	var pieceID = -1;
	
	for(var i = 0; i < window.location.href.length; i++){
		if(window.location.href[i] == "?"){
			pieceID = window.location.href.substring(i+7);
			break;
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

function startContext(){
	
	return;
}

function stopContext(){
	return;
}
