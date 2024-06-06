<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), false);

//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$user = $data->username;
$pass = $data->password;

$pass = password_hash($pass, PASSWORD_BCRYPT);

echo $user . $pass;
$query = "INSERT INTO users VALUES(NULL, ?, ?, NULL)";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('ss', $user, $pass);
$stmnt->execute();

?>
