<?php
$servername = "localhost";
$username = "website";
$password = "mysqlIndeedSucks5#";

// Create connection
$conn = new mysqli($servername, $username, $password, 'MusicProject');
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


$sql = "SHOW TABLES;";
if ($conn->query($sql) === TRUE) {
  echo "Tables shown";
} else {
  echo "Error getting shit: " . $conn->error;
}

$conn->close();
?> 