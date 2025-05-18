async function getInstruments(){
	var response = await fetch("/api/getInstrumentList.php");
	if(response.ok){
		var instrumentList = JSON.parse( await response.text());
		console.log(instrumentList);
		for(var i = 0; i<instrumentList.length; i++){
			instrumentList[i][3] = JSON.parse(instrumentList[i][3])
		}
		sessionStorage.setItem("instrumentList", JSON.stringify(instrumentList));

		return;
	}
	document.getElementById("listError").innerHTML = await response.text();
}

function newPieceForList(element, pieceName, pieceID){
	element.innerHTML +=  "<br><br><br><h3>" + pieceName + "</h3> <button onclick='addInstrumentWindowOpen(\"" + pieceID + "\")'>Add an instrument</button> <br/> <hr/>";
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
			newPieceForList(listElement, currentPiece, instrumentList[i][5]);
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
	var sy  = 150-document.getElementById("sy").value;
	var c1x = document.getElementById("c1x").value;
	var c1y = 150-document.getElementById("c1y").value;
	var c2x = document.getElementById("c2x").value;
	var c2y = 150-document.getElementById("c2y").value;
	var ex  = document.getElementById("ex").value;
	var ey  = 150-document.getElementById("ey").value;

	curveCtx.beginPath();
	curveCtx.moveTo(sx, sy);
	curveCtx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
	curveCtx.stroke();

	curveCtx.fillStyle = "red";
	curveCtx.beginPath();
	curveCtx.arc(sx, sy, 2, 0, 2 * Math.PI); // Start point
	curveCtx.arc(ex, ey, 2, 0, 2 * Math.PI); // End point
	curveCtx.fill();

	curveCtx.fillStyle = "red";
	curveCtx.beginPath();
	curveCtx.arc(c1x, c1y, 3, 0, 2 * Math.PI); // Control point one
	curveCtx.arc(c2x, c2y, 3, 0, 2 * Math.PI); // Control point two
	curveCtx.fill();

}

async function openEditor(id){
	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	var requestData = new FormData();
	var instrumentFile = instrumentList[id][3].bezier;

	var curveEditor = document.getElementById("curveEditor");
	var curveDisplay = document.getElementById("curveDisplay");

	sessionStorage.setItem("activeInstrument", id);
	sessionStorage.setItem("activeCurve", 0);

	var scale = 120;
	var xOff = 75;
	var yOff = 75;
	var sx  = document.getElementById("sx");
	var sy  = document.getElementById("sy");
	var c1x = document.getElementById("c1x");
	var c1y = document.getElementById("c1y");
	var c2x = document.getElementById("c2x");
	var c2y = document.getElementById("c2y");
	var ex  = document.getElementById("ex");
	var ey  = document.getElementById("ey");
	
	sx.value  = xOff + instrumentFile[0][0]*scale;
	sy.value  = yOff + instrumentFile[0][1]*scale;
	c1x.value = xOff + instrumentFile[0][2]*scale;
	c1y.value = yOff + instrumentFile[0][3]*scale;
	c2x.value = xOff + instrumentFile[0][4]*scale;
	c2y.value = yOff + instrumentFile[0][5]*scale;
	ex.value  = xOff + instrumentFile[0][6]*scale;
	ey.value  = yOff + instrumentFile[0][7]*scale;



	curveEditor.style.display = "block";
	redrawCurve();
	/*requestData.append("pieceName", instrumentList[0]);
	requestData.append("instrumentName", instrumentList[1]);
	var request = await fetch("/api/getInstrument.php", {
		method: "POST",
		body: requestData
	});
	*/
}

function saveCurve(){
	
	var scale = 120;
	var xOff = 75;
	var yOff = 75;
	
	var sx  = document.getElementById("sx").value  - xOff;
	var sy  = document.getElementById("sy").value  - yOff;
	var c1x = document.getElementById("c1x").value - xOff;
	var c1y = document.getElementById("c1y").value - yOff;
	var c2x = document.getElementById("c2x").value - xOff;
	var c2y = document.getElementById("c2y").value - yOff;
	var ex  = document.getElementById("ex").value  - xOff;
	var ey  = document.getElementById("ey").value  - yOff;

	sx  /= 120;
	sy  /= 120;
	c1x /= 120;
	c1y /= 120;
	c2x /= 120;
	c2y /= 120;
	ex  /= 120;
	ey  /= 120;


	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	var ai = sessionStorage.getItem("activeInstrument");
	var activeCurve = sessionStorage.getItem("activeCurve");
	
	instrumentList[ai][3].bezier[activeCurve] = [sx, sy, c1x, c1y, c2x, c2y, ex, ey];

	sessionStorage.setItem("instrumentList", JSON.stringify(instrumentList));
	return;
}

async function saveWave(){
	var ai = sessionStorage.getItem("activeInstrument");
	var activeCurve = sessionStorage.getItem("activeCurve");
	
	saveCurve();
	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	
	var instrument = instrumentList[ai];

	samples = sampleBezier(instrument[3].bezier);
	transform = fourierForward(samples);
	transform.splice(0, 1);
	for(var i = transform.length-1; i >= 0; i--){
		if(transform[i][2]){
			break;
		}
		transform.splice(i, 1);
	}
	var real = [];
	var imag = [];
	for(var i = 0; i < transform.length; i++){
		real.push(transform[i][0]);
		imag.push(transform[i][1]);
	}
	instrument[3].real = real;
	instrument[3].imag = imag;

	var requestData = new FormData();
	requestData.append("instrument", JSON.stringify(instrument));
	console.log(instrument);
	var request = await fetch("/api/saveWave.php", {
		method: "POST",
		body: requestData,
	});

	return;
}

function drawFourier(fromEditor = true){
	var ai = sessionStorage.getItem("activeInstrument");
	var instruments = JSON.parse(sessionStorage.getItem("instrumentList"));
	var curves = instruments[ai][3].bezier;
	
	if(fromEditor){
		var sx  = document.getElementById("sx").value - 75;
		var sy  = document.getElementById("sy").value -75;
		var c1x = document.getElementById("c1x").value -75;
		var c1y = document.getElementById("c1y").value -75;
		var c2x = document.getElementById("c2x").value -75;
		var c2y = document.getElementById("c2y").value -75;
		var ex  = document.getElementById("ex").value -75;
		var ey  = document.getElementById("ey").value -75;
	
		curves = [[sx/120, sy/120, c1x/120, c1y/120, c2x/120, c2y/120, ex/120, ey/120]];
	}

	var samples = sampleBezier(curves);
	var transform = fourierForward(samples);
	var display = document.getElementById("fourierDisplay");
	var context = display.getContext("2d");
	
	context.clearRect(0, 0, display.width*10, display.height*10)

	context.lineWidth = 1;
	context.beginPath()
	for(var i = 1; i < samples.length; i++){
		context.moveTo( (300/samples.length) * i-1, 100-(samples[i-1].y * 120) )
		context.lineTo( (300/samples.length) * i, 100-(samples[i].y * 120) )
		context.stroke();
	}

	for(var i = 0; i < transform.length; i++){
		context.moveTo( 350+(200/100) * i, 150)
		context.lineTo( 350+(200/100) * i, 150-(transform[i][2] * 10000)) 
		context.stroke();
	
	}

	return;
}

function closeEditor(){
	var instrumentList = JSON.parse(sessionStorage.getItem("instrumentList"));
	sessionStorage.removeItem("activeInstrument");
	curveEditor.style.display = "none";
}

async function init(){
	await getInstruments();
	updateList();
}

function addInstrumentWindowOpen(pieceID){
	instrumentAdd = document.getElementById("instrumentAdd");
	instrumentAdd.style.display = "block";
	sessionStorage.setItem("pieceID", pieceID);
	return;
}

function addInstrumentWindowClose(){
	document.getElementById("instrumentAdd").style.display = "none";
	document.getElementById("instrumentName").value = "";
	document.getElementById("instrumentDescription").value = "";


}

async function addInstrument(){
	var pieceID = sessionStorage.getItem("pieceID");
	var name = document.getElementById("instrumentName").value;
	var description = document.getElementById("instrumentDescription").value;

	var requestData = new FormData();
	requestData.append("pieceID", pieceID);
	requestData.append("instrumentName", name);
	requestData.append("instrumentDescription", description);
	var response = await fetch("/api/addInstrument.php", {
		method: "POST",
		body: requestData
	});
	if(response.ok){
		addInstrumentWindowClose();
		return;
	}
	document.getElementById("addError").innerHTML = await response.text();

}
