<?php
include "config.php";
include "global.php";

$token = $_COOKIE["token"];
$outputArray = [];
$id;

if(verifyData($token, 128)){
    echo("Invalid token");
    http_response_code(400);
    exit();
}
if(!$token){
    echo("Missing token! You don't seem to be logged in!");
    http_response_code(401);
    exit();
}

$stmnt = $connection->prepare("SELECT users.ID FROM users where token = ?");
$stmnt->bind_param("s", $token);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_object();
$id = $result->ID;

if(!$id){
    echo("Token not found in database, try logging out and back in");
    http_response_code(404);
    exit();
}

$stmnt = $connection->prepare("SELECT pieces.title, pieces.isPublic, pieces.link FROM pieces WHERE userID = ?");
$stmnt->bind_param("s", $id);
$stmnt->execute();
$result = $stmnt->get_result();

if($result->num_rows != 0){
    for($i = 0; $i<$result->num_rows; $i++){
        $title = $result->fetch_object();
        $outputArray[] = [$title->title, $title->isPublic, $title->link];
    }

    echo(json_encode($outputArray));
    http_response_code(200);
    exit();
}
else{
    http_response_code(204);
    exit();
}
?>
