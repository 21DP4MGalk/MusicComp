function init(){
    navInit();
    var fadeIn = document.getElementById("fadeIn");
    fadeIn.style.backgroundColor = "rgb( 255, 255, 255, 0)"
    setTimeout(() => {fadeIn.style.display = "none"}, 250);
}