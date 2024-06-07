<?php
include 'config.php';

//$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
//$user = $data->username;
//$pass = $data->password;

$user = $_POST['username'];
$pass = $_POST['password'];

$pass_pln = $pass;

$pass = password_hash($pass, PASSWORD_BCRYPT);

$query = "INSERT INTO users VALUES(NULL, ?, ?, NULL, NULL)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('ss', $user, $pass);
$stmnt->execute();


$query = "SELECT * FROM users WHERE username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("s", $user);
$stmnt->execute();

$result = $stmnt->get_result();
$result = $result->fetch_assoc();

echo $pass;
echo $result["password"];
if( $pass == $result["password"]){
	echo "AAA";
}

if(password_verify($pass_pln, $result["password"])){
	$token = bin2hex(random_bytes(16));
}

$query = "UPDATE users SET token = ? WHERE ID = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("si", $token, $result["ID"]);
$stmnt->execute();
echo 'test';
echo $token;

setcookie("token", $token, time() + (86400 * 30), "/");
echo $_COOKIE['token'];

?>
