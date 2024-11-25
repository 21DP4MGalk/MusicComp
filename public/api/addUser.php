<?php
include 'config.php';
include 'global.php';


$user = $_POST['username'];
$pass = $_POST['password'];

//$user = "testbioy";
//$pass = "passwordmang";

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

	$query = "INSERT INTO users VALUES(NULL, ?, ?, ?, 'registered')";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param('sss', $user, $pass, $token);
	$stmnt->execute();
	$result = $stmnt->get_result();


	/*$query = "UPDATE users SET token = ? WHERE username = ?";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param("ss", $token, $user);
	$stmnt->execute();
*/
	unset($_COOKIE["token"]);
	unset($_COOKIE["username"]);
	setcookie("token", $token, time() + (86400), "/");
	setcookie("username", $user, time() + (86400), "/");
	echo("All good man");
}
else{
	echo "USERNAME TAKEN, try again";
}
$connection->close();
?>
