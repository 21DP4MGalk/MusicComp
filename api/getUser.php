<?php
include 'config.php';


$query = "SELECT * FROM users";
$result = $connection->query($query);

//$result = $result->fetch_all(MYSQLI_NUM);
while($row = $result->fetch_assoc()) {
    echo $row['username']; 
}
?>

