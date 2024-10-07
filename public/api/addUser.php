<?php
include 'config.php';
include 'global.php';
//$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
//$user = $data->username;
//$pass = $data->password;

$user = $_POST['username'];
$pass = $_POST['password'];

if(verifyData($user, 20)){
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
	$pass = password_hash($pass, PASSWORD_BCRYPT);	// always outputs 60 character string

	$query = "INSERT INTO users VALUES(NULL, ?, ?, NULL, NULL)";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param('ss', $user, $pass);
	$stmnt->execute();

	$token = bin2hex(random_bytes(16));

	$query = "UPDATE users SET token = ? WHERE username = ?";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param("ss", $token, $user);
	$stmnt->execute();

	unset($_COOKIE["token"]);
	unset($_COOKIE["username"]);
	setcookie("token", $token, time() + (86400), "/");
	setcookie("username", $user, time() + (86400), "/");
}
else{
	echo "USERNAME TAKEN, try again";
}
?>
