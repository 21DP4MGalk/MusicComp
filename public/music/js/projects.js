var allPieces = [];
var filteredPieces = [];

async function getPieces(){
    var result = await fetch("/api/getPieceList.php");
    
    if(!result.ok){
        error.style.color = "#FF0000";
        error.innerHTML = await result.text();
    }

    if(result.status == 204){
        error.style.color = "#000000";
        error.innerText = "No pieces yet! Get composing!";
        return;
    }

    allPieces = await JSON.parse(await result.text());
}

function updatePieces(pieces = allPieces){
    var containerDiv = document.getElementById("pieces");
    var error = document.getElementById("error");
    
    var pieceLink;
    var deleteButton;
    var publishButton;

    containerDiv.innerHTML = "";

    for(var i = 0; i < pieces.length; i++){
        pieceLink = document.createElement("a");
        pieceLink.id = "link" + i;
        pieceLink.href = "/music/editor.php?piece=" + pieces[i][3];
        pieceLink.innerText = pieces[i][0];

        deleteButton = document.createElement("button");
        deleteButton.id = "delete" + i;
		deleteButton.setAttribute('onclick', "deletePiece(this)");
 //       deleteButton.onclick = () => {deletePiece(this)};
		deleteButton.innerText = "Delete";
        
        publishButton = document.createElement("button");
        publishButton.id = "publish" + i;
		publishButton.setAttribute('onclick', "togglePublishPiece(this)");
        publishButton.innerText = "Publish";
	if(pieces[i][1]){
		publishButton.innerText = "Unpublish";
		
		var shareLink = document.createElement("a");
		shareLink.id = "share" + i;
		shareLink.href = "/share.php?piece=" + pieces[i][2];
		shareLink.innerText = "Sharing link";
	}

        containerDiv.appendChild(pieceLink);
        containerDiv.appendChild(deleteButton);
        containerDiv.appendChild(publishButton);
 	
	if(pieces[i][1]){
		containerDiv.appendChild(shareLink);
	}

	containerDiv.appendChild(document.createElement("br"));

    }

}

async function init(){
    await getPieces();
    updatePieces();

}

async function deletePiece(deleteBtn){
	
	if(!confirm("Are you sure you wish to delete this piece? This is irreversible.")){
		return;
	}

	var id = deleteBtn.id.substr(6)
	var pieceName = document.getElementById("link" + id).innerText;
	console.log(id);

	var requestData = new FormData;
	requestData.append("pieceName", pieceName);

	var response = await fetch("/api/removePiece.php", {
		method: "POST",
		body: requestData,
	})

	if(response.ok){
		document.getElementById("link" + id).remove();
		document.getElementById("publish" + id).remove();
		deleteBtn.remove();
		init();
	}
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
	var key = document.getElementById("key");
	var requestData = new FormData;

	if(!pieceName.value || !bpm.value){
		document.getElementById("errorDialog").innerText = "Please fill out all fields before trying to create a project.";
		return;
	}

	requestData.append("pieceName", pieceName.value);
	requestData.append("bpm", bpm.value);
	requestData.append("topTime", topTime.value);
	requestData.append("bottomTime", bottomTime.value);
	requestData.append("key", key.value);
	
	var response = await fetch("/api/addPiece.php", {
	method: "POST",
	body: requestData});

	if(response.ok){
		window.location.href = "/music/editor.php?piece=" + pieceName.value;
	}	
	else{
		document.getElementById("errorDialog").innerHTML = "Error " + response.status + ", " + await response.text();
	}
}

async function togglePublishPiece(publishBtn){
	var id = publishBtn.id.substr(7);
	var pieceName = document.getElementById("link" + id).innerText;
	
	var requestData = new FormData;
	requestData.append("pieceName", pieceName);
	
	var response = await fetch("/api/togglePublic.php", {
		method: "POST",
		body: requestData,
	})

	if(response.ok){
		init();
		return;
	}
	else{
		alert(await response.text());
	}
}

function search(){
	var query = document.getElementById("search").value;
	filteredPieces = [];
	for(var i = 0; i < allPieces.length; i++){
		if(allPieces[i][0].includes(query)){
			filteredPieces.push(allPieces[i]);
		}
	}
	updatePieces(filteredPieces);
}
