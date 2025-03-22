async function getInstruments(){
	var response = await fetch("/api/getInstrumentList.php");
	if(response.ok){
		sessionStorage.setItem("instrumentList", await response.text());
		return;
	}
	document.getElementById("listError").innerHTML = await response.text();
}

function newPieceForList(element, pieceName){
	element.innerHTML +=  "<br><br><br><h3>" + pieceName + "</h3> <button onclick='addInstrument(\"" + pieceName + "\")'>Add an instrument</button> <br/> <hr/>";
}

function newInstrumentRow(element, id, instrument, description){
	var htmlText = "<br> <h4>" + instrument + "</h4> <button onclick='openEditor(" + id + ")'>Edit wave</button> <button onclick='deleteInstrument(" + id + ")'>Delete</button> <h6>" + description + "</h6>";
	element.innerHTML += htmlText;
}

function updateList(){
	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	console.log(instrumentList);
	var listElement = document.getElementById("instrumentList");
	
	var currentPiece;
	
	for(var i = 0; i < instrumentList.length; i++){
		if(instrumentList[i][0] != currentPiece){
			currentPiece = instrumentList[i][0];
			newPieceForList(listElement, currentPiece);
		}
		newInstrumentRow(listElement, i, instrumentList[i][1], instrumentList[i][2]);
	}
	

	return;
}

async function init(){
	getInstruments();
	updateList();
};
