<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$name = $data->name;
$description = $data->description;
$wav = $data->waveform;

$query = "INSERT INTO users VALUES(NULL, ?, ?, ?, 1)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('ssb', $name, $description, $wav);
$stmnt->execute();

?>
