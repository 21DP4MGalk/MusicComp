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

async function logout(){
    if(confirm("Are you sure you wish to log out?")){
        var response = await fetch("/api/logout.php");
        if(!response.ok){
            alert(response.body);
            return
        }
        sessionStorage.setItem("username", "");
        window.location.href = "";
    }
}

window.onload = function(){
    navInit(); 
}