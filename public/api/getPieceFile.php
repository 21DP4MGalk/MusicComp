<?php
include "config.php";
include "global.php";

$token = $_COOKIE["token"];
$pieceID = $_POST["pieceID"];
$userID;

#if()

if(verifyData($token, 128)){
	echo("Invalid token");
	http_response_code(400);
	exit();
}
if(!$token){
	echo("Missing token! You don't seem to be logged in!");
	http_response_code(400);
}


$stmnt = $connection->prepare("SELECT users.ID FROM users WHERE token = ?");
$stmnt->bind_param("s", $token);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_object();
$userID = $result->ID;

if(!$userID){
	echo("Token not found in the database! Try logging out and back in!");
	http_response_code(400);
	exit();
}

$stmnt = $connection->prepare("SELECT pieces.file FROM pieces WHERE pieces.userID = ? AND pieces.ID = ?");
$stmnt->bind_param("ii", $userID, $pieceID);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_object();

if($connection->error){
	echo $connection->error;
	http_response_code(500);
	exit();
}

http_response_code(200);
echo(json_encode($result->file));
?>
