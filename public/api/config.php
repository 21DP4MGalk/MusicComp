<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

define("DB_HOST", "127.0.0.1");
define("DB_USER", "Musico");
define("DB_PSWD", "asdasdqweqwe123123");
define("DB_NAME", "MusicProject");
$connection = new mysqli(DB_HOST, DB_USER, DB_PSWD, DB_NAME);
?>
