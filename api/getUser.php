<?php
include 'config.php';


$query = "SELECT * FROM users WHERE username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param('s', $user);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();
echo $row["username"]; 
echo $row["type"];
?>

