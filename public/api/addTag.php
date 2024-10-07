<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$piece = $data->piece;
$tag = $data->tag; 	// tag name
//$token = $data->token;

$query = "INSERT INTO tags VALUES(NULL, ?)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $tag);
$stmnt->execute();

//get TAG ID and create tag if doesn't exist
/*

$query = "INSERT INTO tags_connect VALUES(NULL, ?, ?)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("ss", $piece, $tagID)
*/
?>
