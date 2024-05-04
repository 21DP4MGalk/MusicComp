<?php
/*define("DB_HOST", "127.0.0.1");
define("DB_USER", "root");
define("DB_PSWD", "ToasterWontToast578");
define("DB_NAME", "MusicProject");

$connection = new mysqli(DB_HOST, DB_USER, DB_PSWD, DB_NAME);
*/

include 'config.php';

echo 'test';

$query = "SELECT * FROM users";
$result = $connection->query($query);

echo $result->fetch_all(MYSQLI_ASSOC);

echo '1';
?>

