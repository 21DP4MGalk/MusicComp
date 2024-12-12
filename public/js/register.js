async function submitRegistrationForm(){
	var errorMsg = document.getElementById("error");
	errorMsg.innerText = "";

	var usernameField = document.getElementById("username");
	var emailField = document.getElementById("email");
	var passwordField = document.getElementById("password");
	var passConfirmField = document.getElementById("passConfirm");

	if(passwordField.value != passConfirmField.value){
		errorMsg.innerText = "Passwords do not match!";
		return;
	}

	if(!usernameField.value || !emailField.value || !passwordField.value || !passConfirmField.value){
		errorMsg.innerText = "Please fill out all the fields";
		return;
	}

	if(!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(emailField.value))){
		errorMsg.innerText = "Not a valid email!";
		return;
	}
	if(!( /^.{12,}$/.test(passwordField.value))){
		errorMsg.innerText = "Please make the password longer than 12 characters!";
		return;
	}

	data = new FormData;
	data.append("username", usernameField.value);
	data.append("email", emailField.value);
	data.append("password", passwordField.value);
	
	var response = await fetch("/api/user/register.php", {
		method: "POST",
		body: data,
	});
	var result = await response;

	if(result.ok){
		result = result.body;
		sessionStorage.setItem("username", usernameField.value);

		var success = document.getElementById("success");
		success.style.visibility = "visible";
		success.style.opacity = "1";
		setTimeout(() => {window.location.href = "tutorial.php";}, 2500);
	}
	else{
		errorMsg.innerText = result.status + result.body;
	}
}

function debugRegister(){
	var usernameField = document.getElementById("username");
	var emailField = document.getElementById("email");
	var passwordField = document.getElementById("password");
	var passConfirmField = document.getElementById("passConfirm");	
	var submit = document.getElementById("submit");
	usernameField.value = Math.random() * 10;
	emailField.value = "asdasd@asd.asd";
	passwordField.value = "asdasdasdqweqwe"
	passConfirmField.value = "asdasdasdqweqwe"
	submit.click()
}
