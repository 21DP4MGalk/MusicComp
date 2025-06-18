<?php
include "config.php";
include "global.php";

$pieceFile  = json_decode( $_POST["pieceFile"] );
$oldName    = $_POST["oldName"];
$token      = $_COOKIE["token"];

$pieceFile->bottomTime = (int) $pieceFile->bottomTime;
$pieceFile->topTime    = (int) $pieceFile->topTime;
$pieceFile->bpm        = (int) $pieceFile->bpm;

if(!$token){
	http_response_code(400);
	echo "No token! Are you logged in?";
	exit();
}

$query = $connection->prepare("SELECT ID FROM users WHERE token = ?");
$query->bind_param("s", $token);
$query->execute();
$result = $query->get_result();

if(!$result->num_rows){
	http_response_code(400);
	echo "Invalid token! Try logging out and back in!";
	exit();
}
$result = $result->fetch_object();
$userID = $result->ID;

$query = $connection->prepare("SELECT ID FROM pieces WHERE title = ? AND userID = ?");
$query->bind_param("si", $oldName, $userID);
$query->execute();
$result = $query->get_result();

if(!$result->num_rows){
	http_response_code(400);
	echo "Invalid piece! Try refreshing the page.";
	exit();
}

$result = $result->fetch_object();
$pieceID = $result->ID;


if($oldName != $pieceFile->pieceName){
	$query = $connection->prepare("SELECT ID FROM pieces WHERE title = ? AND userID = ?");
	$query->bind_param("si", $pieceFile->pieceName, $userID);
	$query->execute();
	$result = $query->get_result();
	if($result->num_rows > 0){
		http_response_code(400);
		echo "Cannot change name when there's already piece by this name!";
		exit();
	}
}
$query = $connection->prepare("UPDATE pieces SET title = ?, file = ? WHERE ID = ?");
$query->bind_param("ssi", $pieceFile->pieceName, json_encode($pieceFile), $pieceID);
$query->execute();

if($connection->error){
	http_response_code(500);
	echo $connection->error;
	exit();
}

http_response_code(200);
?>
