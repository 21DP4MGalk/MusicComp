<?php
require "/workspaces/kvalifiq/include/connector.php";

$uri = parse_url($_SERVER["REQUEST_URL"], PHP_URL_PATH);
$uri = explode('/', $uri);

if( (isset($uri[2]) && $uri[2] != "user") || !isset($uri[3]) ){
    header("HTTP/1.1 404 Not Found");
    exit;
}

require PROJECTDIR . "/controllers/userController.php";

$feedController = new UserController();
$methodName = $uri[3] . "Action";
$feedController->{$methodName}();
?>