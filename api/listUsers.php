<?php
include 'config.php';

echo 'test';

$query = "SELECT * FROM users";
$result = $connection->query($query);

echo $result->fetch_all(MYSQLI_ASSOC);

echo '1';
?>

