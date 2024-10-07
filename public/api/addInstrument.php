<?php
include 'config.php';
include 'global.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$name = $data->name;
$description = $data->description;
$wav = $data->waveform;
$piece = $data->piece;

if(verifyData($token, 60) || verifyData($name, 20) || verifyData($description, 128)){
	echo "Shenanigans!";
	exit();
}

$query = "SELECT userID FROM pieces WHERE token = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $token);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();
/*
if($result["userID"] != $_COOKIE[""]){
	echo "Nah m8 ur bad";
	exit();
}
*/
$query = "INSERT INTO users VALUES(NULL, ?, ?, ?, ?)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('ssbi', $name, $description, $wav, $piece);
$stmnt->execute();

?>
