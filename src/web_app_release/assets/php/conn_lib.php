<?php
session_start();
error_reporting(0);

$hostname = "db5002424894.hosting-data.io";
$user = "dbu141430";
$passw = "@J88Vyt$4KQWjo";

// Create connection
$conn = new mysqli($hostname, $user, $passw, "dbs1936904");
// Check connection
if ($conn->connect_error){
  die (json_encode("Connection Error: " . $conn->connect_error));
}
?>