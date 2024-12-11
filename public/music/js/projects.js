var pieces = [];

async function getPieces(){
    var containerDiv = document.getElementById("pieces");
    var error = document.getElementById("error");
    var result = await fetch("/api/getPieceList.php");
    
    if(!result.ok){
        error.style.color = "#FF0000";
        error.innerText = await result.text();
    }

    if(result.status == 204){
        error.style.color = "#000000";
        error.innerText = "No pieces yet! Get composing!";
        return;
    }

    pieces = await JSON.parse(await result.text());

    var pieceLink;
    var deleteButton;
    var publishButton;

    for(var i = 0; i < pieces.length; i++){
        pieceLink = document.createElement("a");
        pieceLink.id = "link" + i;
        pieceLink.href = "/music/editor.php?piece=" + pieces[i];
        pieceLink.innerText = pieces[i];
        
        deleteButton = document.createElement("button");
        deleteButton.id = "delete" + i;
        deleteButton.onclick = (i) => {deletePiece(i)};
        
        publishButton = document.createElement("button");
        publishButton.id = "publish" + i;
        publishButton.onclick = (i) => {publishPiece(i)};
        
        containerDiv.appendChild(pieceLink);
        containerDiv.appendChild(deleteButton);
        containerDiv.appendChild(publishButton);
 	
	containerDiv.appendChild(document.createElement("br"));

    }
}

async function init(){
    await getPieces();

}

function deletePiece(id){
    var piecesElement = document.getElementById("pieces");
    var linkBtn = document.getElementById("link" + id);
    var publishBtn = document.getElementById("pieces");
    var deleteBtn = document.getElementById("pieces");
    piecesElement.removeChild(linkBtn);
    piecesElement.removeChild(publishBtn);
    piecesElement.removeChild(deleteBtn);
}

function newPiecePopup(){
	var newProjectDiv = document.getElementById("newProject");
	newProjectDiv.style.display = "block";
}
    
function cancelNewProject(){
	document.getElementById("pieceName").value = "";
	document.getElementById("bpm").value = "";
	document.getElementById("topTime").value = "";
	document.getElementById("bottomTime").value = "";

	document.getElementById("newProject").style.display = "none";
}

async function createNewProject(){
	var pieceName = document.getElementById("pieceName");
	var bpm = document.getElementById("bpm");
	var topTime = document.getElementById("topTime");
	var bottomTime = document.getElementById("bottomTime");
	
	var requestData = new FormData;
		requestData.append("pieceName", pieceName.value);
	
	var response = await fetch("/api/addPiece.php", {
	method: "POST",
	body: requestData});

	if(response.ok){
		sessionStorage.setItem("piece_name", pieceName.value);
		sessionStorage.setItem("piece_bpm", bpm.value);
		sessionStorage.setItem("piece_topTIme", topTime.value);
		sessionStorage.setItem("piece.bottomTime", bottomTime.value);

		window.location.href = "/music/editor.php?piece=" + pieceName.value;
	}	
	else{
		document.getElementById("errorDialog").innerText = "Error " + response.status + ", " + await response.text();
	}
}
