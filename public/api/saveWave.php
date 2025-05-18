<?php
include "global.php";
include "config.php";

$instrument = json_decode($_POST["instrument"]);
$token = $_COOKIE["token"];

$query = "SELECT ID FROM users WHERE token = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $token);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_object();

if(!$result->ID){
	http_response_code(400);
	echo "Invalid token" + $result->ID;
	exit();
}

$waveform = new stdClass();
$waveform->real = $instrument[3]->real;
$waveform->imag = $instrument[3]->imag;
$waveform->bezier = $instrument[3]->bezier;
$waveform = json_encode($waveform);

$stmnt = $connection->prepare("UPDATE instruments SET name = ?, description = ?, waveform = ? WHERE ID = ?");
$stmnt->bind_param("sssi", $instrument[1], $instrument[2], $waveform, $instrument[4]);
$stmnt->execute();
var_dump($waveform);
if($connection->error){
	http_response_code(500);
	echo $connection->error;
	exit();
}

echo "Saved successfully!";
?>
