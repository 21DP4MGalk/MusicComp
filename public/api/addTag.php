<?php
include 'config.php';
include 'global.php';

$token = $_COOKIE["token"];

$tagName = $_POST["tagName"];
$pieceID = $_POST["pieceID"];


if(!$token){
	echo "No token!";
	http_response_code(401);
	exit();
}

if(verifyData($tagName, 12)){
	echo "Invalid tag name!";
	http_response_code(400);
	exit();

}

$stmnt = $connection->prepare("SELECT ID FROM users WHERE token = ?");
$stmnt->bind_param("s", $token);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 0){
	echo "Invalid token!";
	http_response_code(401);
	exit();
}
$result = $result->fetch_object();
$userID = $result->ID;

$stmnt = $connection->prepare("SELECT ID FROM tags WHERE name = ?");
$stmnt->bind_param("s", $tagName);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 0){
	$stmnt = $connection->prepare("INSERT INTO tags(name) VALUES(?)");
	$stmnt->bind_param("s", $tagName);
	$stmnt->execute();
	$tagID = $connection->insert_id;
	http_response_code(201);
}
else{
	$result = $result->fetch_object();
	$tagID = $result->ID;
}

$stmnt = $connection->prepare("INSERT INTO tags_connect(pieceID, tagID) VALUES(?, ?)");
$stmnt->bind_param("ii", $pieceID, $tagID);
$stmnt->execute();

if($connection->error){
	http_response_code(500);
	echo "fuckd";
	exit();
}

echo("All good!");
exit();
?>
