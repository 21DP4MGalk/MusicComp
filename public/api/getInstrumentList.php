<?php
include "config.php";
include "global.php";

$token = $_COOKIE["token"];
$outputArray = [];

if(verifyData($token, 128)){
    echo("Invalid token, did you try to manually set a token cookie?");
    http_response_code(400);
    exit();
}
if(!$token){
    echo("No token! You need to log in or register first to use these features!");
    http_response_code(401);
    exit();
}

$stmnt = $connection->prepare("SELECT users.ID FROM users WHERE token = ?");
$stmnt->bind_param("s", $token);
$stmnt->execute();
$result = $stmnt->get_result();
$result = $result->fetch_object();

if(!$result->ID){
    echo("Ivalid token, try logging out and then back in");
    http_response_code(400);
    exit();
}

$stmnt = $connection->prepare("SELECT title, name, description FROM pieces LEFT JOIN instruments ON pieces.ID = instruments.pieceID WHERE userID = ? ORDER BY title;");
$stmnt->bind_param("s", $result->ID);
$stmnt->execute();
$result = $stmnt->get_result();
if($result->num_rows){
    for($i = 0; $i<$result->num_rows; $i++){
        $row = $result->fetch_object();
        $outputArray[] = [$row->title, $row->name, $row->description];
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
