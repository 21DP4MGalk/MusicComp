<?php
include 'config.php';

$passwd = $_POST["password"];
$user = $_POST["username"];

$data = json_decode(file_get_contents('php://input'), false);
$user = $data->username;
$pass = $data->password;

$query = "SELECT * FROM users WHERE username = ?";
$stmnt = $connection->prepare($query);
$stmnt->bind_param("s", $user);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();

if(password_verify($pass, $result["password"])){
	$token = bin2hex(random_bytes(16));
}

$query = "UPDATE users SET token = ? WHERE ID = ?";
$stmnt = $connection->prepare($query)
$stmnt->bind_param("si", $token, $result["ID"]);
$stmnt->execute();

echo $token;

?>

