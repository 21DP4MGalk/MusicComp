<?php

include '../config.php';


$pass = $_POST["password"];
$username = $_POST["username"];

$query = "SELECT * FROM users WHERE username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("s", $username);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();

if(!password_verify($pass, $result["password"])){
	http_response_code(400);
	echo "Shits fucked wrong pass mate";
	exit();
}

$token = bin2hex(random_bytes(16));

$query = "UPDATE users SET token = ? WHERE ID = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("si", $token, $result["ID"]);
$stmnt->execute();


if($connection->error){
	echo $connection->error;
	http_response_code(500);
	exit();
}

setcookie("token", $token, time() + (86400), "/");
echo "All good m8";
exit();
?>
