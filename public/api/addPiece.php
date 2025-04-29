<?php
include 'config.php';
include "global.php";

$pieceName  = $_POST["pieceName"];
$bpm        = (int) $_POST["bpm"];
$topTime    = (int) $_POST["topTime"];
$bottomTime = (int) $_POST["bottomTime"];

$token      = $_COOKIE["token"];

if(!$topTime){
	$topTime = 4;
}
if(!$bottomTime){
	$bottomTime = 4;
}

if(!$bpm){
	echo "No valid BPM! Please enter BPM.";
	http_response_code(400);
	exit();
}

for($i = 1; $i <= 32; $i = $i*2){
	if($bottomTime == $i){
		break;
	}
	else if($i == 32){
		http_response_code(400);
		echo "Invalid bottom time, only numbers that are 2^x are allowed, and only up to 32";
		exit();
	}
}

#Key conversion from letters (ABCDEFG) to numbers
switch(strtolower($_POST["key"][0])){
	case 'c':
		$key = 0;
		break;
	case 'd':
		$key = 2;
		break;
	case 'e':
		$key = 4;
		break;
	case 'f':
		$key = 5;
		break;
	case 'g':
		$key = 7;
		break;
	case 'a':
		$key = 9; 
		break;
	case 'b':
		$key = 11;
		break;
}
if(strlen($_POST["key"]) == 2){
	$key = $key + (($_POST["key"][1] == "#") * 1);
}

if(verifyData($pieceName, 50)){
	echo "Invalid name, max length is 50";
	http_response_code(400);
	exit();
}
if(!is_int($key) || $key > 11 || $key < 0){
	echo "Invalid key, check if you wrote it right, # for sharps, b for flats";
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
$pieceFile = new stdClass();
$pieceFile->pieceName = $pieceName;
$pieceFile->key = $key;
$pieceFile->bpm = $bpm;
$pieceFile->topTime = $topTime;
$pieceFile->bottomTime = $bottomTime;
$pieceFile->notes = [[]];
$pieceFile->instruments = [];

$pieceFile = json_encode($pieceFile);
echo $pieceFile;

$query = "INSERT INTO pieces(ID, title, file, userID, isPublic, link) VALUES(NULL, ?, ?, ?, false, NULL)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('ssi', $pieceName, $pieceFile, $userID);
$stmnt->execute();

$pieceID = $connection->insert_id;

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
