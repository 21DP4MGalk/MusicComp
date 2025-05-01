<?php
include 'config.php';
include 'global.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$token = $_COOKIE["token"];
$name = $_POST["name"];
$description = $_POST["description"];
$pieceID = $_POST["pieceID"];

if(verifyData($token, 60) || verifyData($name, 20) || verifyData($description, 128)){
	echo "Shenanigans!";
	exit();
}

$query = "SELECT ID FROM users WHERE token = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $token);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();

$sineWave = new stdClass();
$sineWave->real = array(0, 0);
$sineWave->imag = array(0, 1);
$sineWave->bezier = array([0,0, 0.35,0.55, 0.65,-0.5513, 1,0]);
$text = array("Default sine", "Default instrument generated automatically");
$sineWave = json_encode($sineWave);

$stmnt = $connection->prepare("INSERT INTO instruments(name, description, waveform, pieceID) VALUES(?, ?, ?, ?)");
$stmnt->bind_param("sssi", $text[0], $text[1], $sineWave, $pieceID);
$stmnt->execute();

if($connection->error){
    echo $connection->error;
    http_response_code(400);
    exit();
}

http_response_code(201);
echo "Created successfully!";

?>
