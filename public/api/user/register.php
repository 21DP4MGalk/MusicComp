<?php
include '../config.php';
include '../global.php';

//$_POST['username'] = "testo";
//$_post['PASSWORD'] = "fucl";
$user = $_POST['username'];
$pass = $_POST['password'];
$email = $_POST["email"];

if(verifyData($user, 20)){
	http_response_code(400);
	echo("I'm hip to your nonsense");
	exit();
}

$pass_pln = $pass;

$query = "SELECT * FROM users where username = ? OR email = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("ss", $user, $email);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 0){ // if there are no users with the same username, go ahead
	$pass = password_hash($pass, PASSWORD_BCRYPT, ["cost" => 14]);	// always outputs 60 character string
	$token = bin2hex(random_bytes(16));

	$query = "INSERT INTO users VALUES(NULL, ?, ?, 'registered', ?, ?, true)";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param('ssss', $user, $pass, $token, $email);
	$stmnt->execute();
	
	unset($_COOKIE["token"]);
	setcookie("token", $token, time() + (86400), "/");

	echo($user);
	http_response_code(201);
}
else{
	echo "Username or email taken, try a different username if you've not used this email before";
	http_response_code(400);
	exit();
}
$connection->close();
?>
