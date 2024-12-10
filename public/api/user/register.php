<?php
include '../config.php';
include '../global.php';

//$_POST['username'] = "testo";
//$_post['PASSWORD'] = "fucl";
$user = $_POST['username'];
$pass = $_POST['password'];


if(verifyData($user, 20)){
	http_response_code(400);
	echo("I'm hip to your nonsense");
	exit();
}

$pass_pln = $pass;

$query = "SELECT * FROM users where username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("s", $user);
$stmnt->execute();
$result = $stmnt->get_result();
if($result->num_rows == 0){ // if there are no users with the same username, go ahead
	$pass = password_hash($pass, PASSWORD_BCRYPT, ["cost" => 14]);	// always outputs 60 character string
	$token = bin2hex(random_bytes(16));

	$query = "INSERT INTO users VALUES(NULL, ?, ?, 'registered', ?, 'yes@yes.lv', true)";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param('sss', $user, $pass, $token);
	$stmnt->execute();
	$result = $stmnt->get_result();
	
	unset($_COOKIE["token"]);
	unset($_COOKIE["username"]);
	setcookie("token", $token, time() + (86400), "/");

	echo($user);
}
else{
	http_response_code(400);
	echo "USERNAME TAKEN, try again";
}
$connection->close();
?>
