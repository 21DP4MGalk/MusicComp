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

function redrawCurve(){
	var curveDisplay = document.getElementById("curveDisplay");
	var curveCtx = curveDisplay.getContext("2d");
	
	curveCtx.clearRect(0, 0, curveDisplay.width, curveDisplay.height);
	

	var sx  = document.getElementById("sx").value;
	var sy  = document.getElementById("sy").value;
	var c1x = document.getElementById("c1x").value;
	var c1y = document.getElementById("c1y").value;
	var c2x = document.getElementById("c2x").value;
	var c2y = document.getElementById("c2y").value;
	var ex  = document.getElementById("ex").value;
	var ey  = document.getElementById("ey").value;

	curveCtx.beginPath();
	curveCtx.moveTo(sx, sy);
	curveCtx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
	curveCtx.stroke();

	curveCtx.fillStyle = "blue";
	curveCtx.beginPath();
	curveCtx.arc(sx, sy, 5, 0, 2 * Math.PI); // Start point
	curveCtx.arc(ex, ey, 5, 0, 2 * Math.PI); // End point
	curveCtx.fill();

	curveCtx.fillStyle = "red";
	curveCtx.beginPath();
	curveCtx.arc(c1x, c1y, 5, 0, 2 * Math.PI); // Control point one
	curveCtx.arc(c2x, c2y, 5, 0, 2 * Math.PI); // Control point two
	curveCtx.fill();

}

async function openEditor(id){
	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	var requestData = new FormData();
	
	var curveEditor = document.getElementById("curveEditor");
	var curveDisplay = document.getElementById("curveDisplay");

	

	curveEditor.style.display = "block";

	/*requestData.append("pieceName", instrumentList[0]);
	requestData.append("instrumentName", instrumentList[1]);
	var request = await fetch("/api/getInstrument.php", {
		method: "POST",
		body: requestData
	});
	*/
}

function closeEditor(){
	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	curveEditor.style.display = "none";
}

async function init(){
	getInstruments();
	updateList();
};
