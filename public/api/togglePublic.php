<?php

include "config.php";
include "global.php";

$token = $_COOKIE["token"];
$pieceName = $_POST["pieceName"];

if(verifyData($pieceName, 20)){
	echo("Invalid piece name, dued");
	http_response_code(400);
	exit();
}

if(verifyData($token, 128)){
	echo("You might want to log in for this");
	http_response_code(400);
	exit();
}

$stmnt = $connection->prepare("SELECT ID FROM users WHERE token = ?");
$stmnt->bind_param("s", $token);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 0){
	echo("You might want to try logging out and back in");
	http_response_code(400);
	exit();
}

$result = $result->fetch_object();
$id = $result->ID;

$stmnt = $connection->prepare("UPDATE pieces SET isPublic = 1 - isPublic WHERE userID = ? AND title = ?");
$stmnt->bind_param("is", $id, $pieceName);
$stmnt->execute();

$stmnt = $connection->prepare("SELECT isPublic FROM pieces WHERE userID = ? AND title = ?");
$stmnt->bind_param("is", $id, $pieceName);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_object();

if($result->isPublic == 1){
	$link = substr(bin2hex(random_bytes(10)), 0, 20);
	$stmnt = $connection->prepare("UPDATE pieces SET link = ? WHERE userID = ? AND title = ?");
	$stmnt->bind_param("sis", $link, $id, $pieceName);
	$stmnt->execute();
	echo $link;

}

?>
