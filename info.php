<?php
$servername = "127.0.0.1";
$username = "website";
$password = "mysqlIndeedSucks5#";

// Create connection
$conn = new mysqli($servername, $username, $password, 'MusicProject');

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

$sql = "SHOW TABLES;";
if ($conn->query($sql) === TRUE) {
  echo "TABLES SHOWN GOOD";
} else {
  echo "Error checking tables: " . $conn->error;
}

$conn->close();

?> 