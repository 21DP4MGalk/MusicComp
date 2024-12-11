<?php
include 'config.php';
include "global.php";


$pieceName = $_POST["pieceName"];
$token = $_COOKIE["token"];

if(verifyData($pieceName, 20)){
	echo "Please make it shorter";
	http_response_code(400);
	exit();
}

$query = "SELECT ID FROM users WHERE token = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $token);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows == 0){
	echo "BOGUS token! Try logging out and back in";
	http_response_code(400);
	exit();
}
$result = $result->fetch_object();
$userID = $result->ID;

$query = "SELECT ID FROM pieces WHERE title = ? AND userID = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('si', $pieceName, $userID);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows > 0){
	echo "Piece with this name already exists, choose a different name!";
	http_response_code(400);
	exit();
}

$query = "INSERT INTO pieces VALUES(NULL, ?, NULL, ?, false, NULL)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('si', $pieceName, $userID);
$stmnt->execute();
http_response_code(201);
echo "Created successfully!";
?>
