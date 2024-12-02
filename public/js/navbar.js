function navInit(){
    if(sessionStorage.getItem("username")){
        document.getElementById("navRegister").style.display = "none";
        document.getElementById("navLogin").style.display = "none";
        document.getElementById("navLogout").style.display = "block";
    }
    else{
        document.getElementById("navRegister").style.display = "block";
        document.getElementById("navLogin").style.display = "block";
        document.getElementById("navLogout").style.display = "none";
    }
}

//setTimeout(navInit, 5);