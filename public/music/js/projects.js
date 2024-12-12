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
        pieceLink.href = "/editor?piece=" + pieces[i];
        pieceLink.innerText = pieces[i];
        
        deleteButton = document.createElement("button");
        deleteButton.id = "delete" + i;
        deleteButton.onclick = (i) => {deletePiece("delete" + i)};
        deleteButton.innerText = "Delete";
        
        publishButton = document.createElement("button");
        publishButton.id = "publish" + i;
        publishButton.onclick = (i) => {publishPiece("publish" + i)};
        publishButton.innerText = "Publish";

        containerDiv.appendChild(pieceLink);
        containerDiv.appendChild(deleteButton);
        containerDiv.appendChild(publishButton);
        containerDiv.appendChild(document.createElement("br"));
        
    }
}

async function init(){
    await getPieces();

}

async function deletePiece(id){
    if(!confirm("Are you sure about that?")){
        console.log("Ok");
        return;
    }
    var requestData = new FormData;
    requestData.append("ID", id);
    var response = await fetch("/api/deletePiece.php", {
        method: "POST",
        body: requestData,
    });
    console.log(response.text());
}
