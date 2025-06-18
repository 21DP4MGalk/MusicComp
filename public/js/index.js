function fadein(){
    var fadeIn = document.getElementById("fadeIn");
	fadeIn.style.display = "none";
}
function init(){
    navInit();
    var fadeIn = document.getElementById("fadeIn");
    fadeIn.style.backgroundColor = "rgb( 255, 255, 255, 0)";
    setTimeout(fadein, 250);
}
