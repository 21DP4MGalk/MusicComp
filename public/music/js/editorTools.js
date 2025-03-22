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
	key.value        = pieceFile.key;
	topTime.value    = pieceFile.topTIme;
	bottomTime.value = pieceFile.bottomTime;

	baseInfo.style.display = "block";
	return;
}

function applyInfoChanges(){
	var baseInfo   = document.getElementById("baseInfo");
	var pieceFile  = JSON.parse(sessionStorage.getItem("pieceFile"));
	var pieceName  = document.getElementById("pieceName");
	var bpm        = document.getElementById("bpm");
	var key        = document.getElementById("key");
	var topTime    = document.getElementById("topTime");
	var bottomTime = document.getElementById("bottomTime");
	
}

function closeBaseInfo(){
	var baseInfo = document.getElementById("baseInfo");

	baseInfo.style.display = "none";
	return;
}

function openInstrumentList(){
	var instrumentList = document.getElementById("instrumentList");

	instrumentList.style.display = "block";
	return;
}

function closeInstrumentList(){
	var instrumentList = document.getElementById("instrumentList");

	instrumentList.style.display = "none";
	return;

}
