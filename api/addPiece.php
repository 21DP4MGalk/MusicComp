<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$title = $data->title;
$file = $data->file;

$query = "INSERT INTO users VALUES(NULL, ?, ?, 1)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('sb', $title, $file);
$stmnt->execute();

?>
