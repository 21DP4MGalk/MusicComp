<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), false);
//echo $data["test"];


//BLAH BLAH ADD VALIDITY CHECK TO PREVENT SPAMMING;
$user = $data->username;
$pass = $data->password;

$query = "INSERT INTO 'users' VALUES(NULL, '" . $user . "', '" . $pass . "', temp)";

$result = $connection->query($query);
print_r($result);
if ($result === TRUE) {
  echo "New record created successfully";
} else {
  echo "Error: " . $connection->error;
}
?>
