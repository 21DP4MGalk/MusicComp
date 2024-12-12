async function getInstruments(){
    var response = await fetch("/api/getInstrumentList.php");
    console.log(response.text());
}

async function init(){

};