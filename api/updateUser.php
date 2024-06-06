<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"), false);
$user = $data->username;
$token = $data->token;
$changeName = $data->changeName;/
 //bool
$newData = $data->newData;

$query = "SELECT * FROM users WHERE username = ?";

$stmnt = $connection->prepare($query);
$stmnt->bind-param('s', $user);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_assoc();

if($token = $result["token"]){
    if(nameChange){
        $query = "UPDATE users SET username = ? WHERE ID = ?";
        $stmnt = $connection->prepare($query);
    }
    else{
        $query = "UPDATE users SET password = ? WHERE ID = ?";
        $stmnt = $connection->prepare($query);

        $newData = password_hash($newData, PASSWORD_BCRYPT); 
        
    }
    $stmnt->bind_param("si", $newData, $result["ID"];
    $stmnt->execute();
}
?>
