var audioCtx;


async function audioInit(){
	audioCtx = new AudioContext();
	var instruments = await getInstrumentList();
	sessionStorage.setItem("instrumentList", JSON.stringify(instruments));
	setInstrument(instruments, 0);
	drawInstrumentElements(instruments, 0);
	return;
}

async function playInstrumentPart(startMeasure = 0, endMeasure = -1){
	sessionStorage.getItem("activeInstrument");
	instruments = await getInstrumentList();

	

	return;
}

async function setInstrument(instruments, ai){
	sessionStorage.setItem("activeInstrument", ai);
	instruments[ai][3] = JSON.parse(instruments[ai][3]);
	sessionStorage.setItem("real", instruments[ai][3].real);
	sessionStorage.setItem("imag", instruments[ai][3].imag);
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

function startContext(){
	
	return;
}

function stopContext(){
	return;
}
