<?php
include 'config.php';
include 'global.php';

if(isset($_COOKIE[$token])){
	$query = "SELECT * FROM users WHERE token = ?";
	$stmnt = $connection->prepare($query);
	$stmnt->bind_param('s', $token);
	$stmnt->execute();
	$result = $stmnt->get_result();
	$result = $result->fetch_assoc();
}
else{
	echo "unregistered pleb";
}
?>

