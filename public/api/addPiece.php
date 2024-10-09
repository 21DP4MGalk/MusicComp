<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$title = $data->title;
$file = $data->file;

if(verifyData($title, 20)){
	echo "Nice try dude";
	exit();
}

$query = "SELECT userID FROM users WHERE token = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $_COOKIE["token"]);
$result = $stmnt->get_restult();

if($result->num_rows == 0){
	echo "BOGUS!";
	exit();
}
$userID = $result["userID"];

$query = "INSERT INTO pieces VALUES(NULL, ?, ?, ?)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('sbi', $title, $file, $userID);
$stmnt->execute();

?>
