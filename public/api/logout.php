<?php
include 'config.php';

$query = "UPDATE users set token = '' where token = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $_COOKIE['token']);
$stmnt->execute();
unset($_COOKIE['token']);
setcookie('token', null, -1, '/');
?>
