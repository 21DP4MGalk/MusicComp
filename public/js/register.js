async function fetchAddUser(){
	
	var usernameField = document.getElementById("username");
	var passwordField = document.getElementById("password");
	var data = {username:usernameField.value,password:passwordField.value};
	console.log(JSON.stringify(data));

	var response = await fetch("http://localhost/api/addUser.php", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(data),
	});

	var result = await response.json();
	console.log(result)
}