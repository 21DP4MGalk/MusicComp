function navInit(){
    let cookies = decodeURIComponent(document.cookie);
    let name = "token=";
    let cookeh = "";
    cookies = cookies.split(';');
    for(let i = 0; i <cookies.length; i++) {
        cookeh = cookies[i];
        while (cookeh.charAt(0) == ' ') {
            cookeh = cookeh.substring(1);
        }
        if (cookeh.indexOf(name) == 0) {
            cookeh.substring(name.length, cookeh.length);
            break;
        }
        cookeh = "";
    }
    console.log(cookies);
    console.log(cookeh);
    if(cookeh){
        document.getElementById("navRegister").style.display = "none";
        document.getElementById("navLogin").style.display = "none";
        document.getElementById("navLogout").style.display = "block";
        document.getElementById("navMusic").style.display = "block";
    }
    else{
        document.getElementById("navRegister").style.display = "block";
        document.getElementById("navLogin").style.display = "block";
        document.getElementById("navLogout").style.display = "none";
        document.getElementById("navMusic").style.display = "none";
    }
}

async function logout(){
    if(confirm("Are you sure you wish to log out?")){
        var response = await fetch("/api/user/logout.php");
        if(!response.ok){
            alert(response.text());
            return
        }
        //sessionStorage.setItem("username", "");
        window.location.href = "";
    }
}

window.onload = function(){
    navInit(); 
}
