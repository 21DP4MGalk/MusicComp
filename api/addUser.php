<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
echo 'a';
echo $data["test"];

//$query = "INSERT INTO 'users' VALUES ()";
//$result = $connection->query($query);


?>
