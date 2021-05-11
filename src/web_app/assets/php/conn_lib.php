<?php
session_start();
error_reporting(0);

$hostname = "localhost";
$user = "root";
$passw = "";

// Create connection
$conn = new mysqli($hostname, $user, $passw, "fire_prevention_system");
// Check connection
if ($conn->connect_error){
  die (json_encode("Connection Error: " . $conn->connect_error));
}
?>