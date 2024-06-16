<?php

include 'config.php';


$pass = $_POST["password"];
$username = $_POST["username"];


$query = "SELECT *  FROM users WHERE username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("s", $username);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();

if(password_verify($pass, $result["password"])){
	setcookie("username", $username, time() + (86400), "/");	
	setcookie("token", $result["token"], time() + (86400), "/");
}
?>
