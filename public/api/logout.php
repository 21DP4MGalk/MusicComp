<?php
include 'config.php';

$query = "UPDATE users set token = '' where username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $_COOKIE['username']);
$stmnt->execute();
unset($_COOKIE['token']);
unset($_COOKIE['username']);
setcookie('token', null, -1, '/');
setcookie('username', null, -1, '/');
?>
