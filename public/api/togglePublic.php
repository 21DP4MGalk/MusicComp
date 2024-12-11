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

$stmnt = $connection->prepare("UPDATE pieces SET isPublic = true WHERE userID = ? AND title = ?");
$stmnt->bind_params("is", $id, $pieceName);
$stmnt->execute();

?>
