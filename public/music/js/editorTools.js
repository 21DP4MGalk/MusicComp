function openBaseInfo(){
	var baseInfo   = document.getElementById("baseInfo");
	var pieceFile  = JSON.parse(sessionStorage.getItem("pieceFile"));
	var pieceName  = document.getElementById("pieceName");
	var bpm        = document.getElementById("bpm");
	var key        = document.getElementById("key");
	var topTime    = document.getElementById("topTime");
	var bottomTime = document.getElementById("bottomTime");
	
	pieceName.value  = pieceFile.pieceName;
	bpm.value        = pieceFile.bpm;
	key.value        = numberToKey( pieceFile.key );
	topTime.value    = pieceFile.topTime;
	bottomTime.value = pieceFile.bottomTime;

	baseInfo.style.display = "block";
	return;
}

async function editBaseInfo(onlySave = false){
	
	if(onlySave){
		var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
		var oldName = pieceFile.pieceName;
	}
	else{

		var pieceName  = document.getElementById("pieceName");
		var bpm        = document.getElementById("bpm");
		var key        = keyToNumber(document.getElementById("key").value);
		var topTime    = document.getElementById("topTime");
		var bottomTime = document.getElementById("bottomTime");
		var pieceFile  = JSON.parse( sessionStorage.getItem("pieceFile") );
		var oldName    = pieceFile.pieceName;
		var infoError  = document.getElementById("infoError");
		
		if(key == -1){
			infoError.innerText = "Invalid key! use '#' for sharps and 'b' for flats!";
			return;
		}

		pieceFile.pieceName  = pieceName.value;
		pieceFile.bpm        = bpm.value;
		pieceFile.key        = key;
		pieceFile.topTime    = topTime.value;
		pieceFile.bottomTime = bottomTime.value;
	}

	var requestData = new FormData();
	requestData.append("pieceFile", JSON.stringify(pieceFile) );
	requestData.append("oldName", oldName);
	
	console.log(pieceFile);

	var response = await fetch("/api/updatePiece.php", {
		method: "POST",
		body: requestData
	});
	if(!response.ok){
		infoError.innerHTML = await response.text();
			return;
	}
	init();
	closeBaseInfo();
}

function closeBaseInfo(){
	var baseInfo = document.getElementById("baseInfo");

	baseInfo.style.display = "none";
	return;
}

async function openInstrumentList(){
	var instrumentListElement = document.getElementById("instrumentList");
	
	getInstrumentList();

	instrumentListElement.style.display = "block";
	return;
}

function closeInstrumentList(){
	var instrumentList = document.getElementById("instrumentList");

	instrumentList.style.display = "none";
	return;

}

function numberToKey(num){
	keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
	return keys[num];
}

function keyToNumber(key){
	var num = 0;

	key = key.toUpperCase()

	switch(key[0]){
		case 'C':
			break;
		case 'D':
			num = 2;
			break;
		case 'E':
			num = 4;
			break;
		case 'F':
			num = 5;
			break;
		case 'G':
			num = 7;
			break;
		case 'A':
			num = 9;
			break;
		case 'B':
			num = 11;
			break;
	}
	if(key.length == 1){
		return num;
	}
	if(key[1] == 'b'){
		num -= 1;
	}
	else if(key[1] == '#'){
		num += 1;
	}
	return num%12;
}

function pageBack(){
	var ap = Number(sessionStorage.getItem("activePage"));
	if(ap > 0){
		sessionStorage.setItem("activePage", ap-1);
		console.log("WENT BACK")
	}
}
function pageForward(){
	var ap = Number(sessionStorage.getItem("activePage"));
	var ai = sessionStorage.getItem("activeInstrument");
	var pieceFile = JSON.parse(sessionStorage.getItem("pieceFile"));
	if(pieceFile.notes[ai].length >= 181*(ap+1)){
		console.log(181*ap)
		sessionStorage.setItem("activePage", ap+1);
		console.log("WENT FORWARDS")
	}

}
