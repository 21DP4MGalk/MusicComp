async function submitLoginForm(){
	
	var usernameField = document.getElementById("username");
	var passwordField = document.getElementById("password");
	data = new FormData;
	data.append("username", usernameField.value)
	data.append("password", passwordField.value)
	
	var response = await fetch("/api/user/login.php", {
		method: "POST",
		body: data,
	});
	var result = await response
	if(result.ok){
		sessionStorage.setItem("username", usernameField.value)
		window.location.href = "tutorial.php";
	}
}

function keyPressPassword(event){
	if(event.keyCode == 13){
		submitLoginForm();
	}
}

function keyPressUsername(event){
	var passElem = document.getElementById("password");
	if(event.keyCode == 13){
		passElem.focus();
	}
}
