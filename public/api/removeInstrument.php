<?php
include "config.php";
include "global.php";

$instrumentID = $_POST["instrumentID"];
$pieceID = $_POST["pieceID"];
$token = $_COOKIE["token"];

if(verifyData($token, 128)){
	http_response_code(400);
	echo "Bad token, you might need to log in";
	exit();
}

$stmnt = $connection->prepare("SELECT ID FROM users where token = ?");
$stmnt->bind_param("s", $token);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 0){
	http_response_code(400);
	echo "Invalid token, try logging out and back in";
	exit();
}

$result = $result->fetch_object();
$userID = $result->ID;

$stmnt = $connection->prepare("SELECT userID FROM pieces WHERE ID = ?");
$stmnt->bind_param("i", $pieceID);
$stmnt->execute();
$result = $stmnt->get_result();

if(!$result->num_rows){
	echo "Invalid piece ID!";
	http_response_code(400);
	exit();
}

$result = $result->fetch_object();

if($userID != $result->userID){
	http_response_code(400);
	echo "Is that even your own work?";
	exit();
}

$stmnt = $connection->prepare("SELECT ID FROM instruments WHERE pieceID = ?");
$stmnt->bind_param("i", $pieceID);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 1){
	http_response_code(400);
	echo "can't delete the only instrument!";
	exit();
}

$stmnt = $connection->prepare("DELETE FROM instruments WHERE ID = ? AND pieceID = ?");
$stmnt->bind_param("ii", $instrumentID, $pieceID);
$stmnt->execute();

echo "Success!"
?>
