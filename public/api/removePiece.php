<?php
include "config.php";
include "global.php";

$pieceName = $_POST["pieceName"];
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
$id = $result->ID;

$stmnt = $connection->prepare("DELETE FROM pieces WHERE userID = ? AND title = ?");
$stmnt->bind_param("is", $id, $pieceName);
$stmnt->execute();
echo $id, $pieceName;
?>
