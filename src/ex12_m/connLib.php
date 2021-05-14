<?php
session_start();
if(!isset($_SESSION['isCred']))
{
  if (file_exists("init.txt")){
    $myfile = fopen("init.txt", "r") or die("Unable to open file!");
    $_SESSION["hostname"] = fgets($myfile);
    $_SESSION["user"] = fgets($myfile);
    $_SESSION["passw"] = fgets($myfile);
    fclose($myfile);
    $_SESSION['isCred'] = true;
  }
  else{
    $_SESSION['isCred'] = false;
  }
}

$hostname = $_SESSION["hostname"];
$user = $_SESSION["user"];
$passw = $_SESSION["passw"];

// Create connection
$conn = new mysqli($hostname, $user, $passw, "questionario");
// Check connection
if ($conn->connect_error)
  echo("<p><i class='material-icons'>priority_high</i>Connessione fallita: " . $conn->connect_error . "</p>");

?>