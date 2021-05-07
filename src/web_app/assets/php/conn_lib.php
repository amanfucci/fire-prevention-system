<?php
session_start();
error_reporting(0);

$hostname = "localhost";
$user = "root";
$passw = "";

// Create connection
$conn = new mysqli($hostname, $user, $passw, "meteoterranova");
// Check connection
if ($conn->connect_error){
  die (json_encode("Conneection Error: " . $conn->connect_error));
}
?>