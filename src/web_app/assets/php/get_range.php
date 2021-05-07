<?php
include "conn_lib.php";

$sql = "SELECT min(DataRequested) as min, max(DataRequested) as max from weather;";
$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {


  $row = $result->fetch_assoc();
  echo json_encode($row["min"] . ";" . $row["max"]);
} else {
  echo "Query Error: " . $conn->error;
}

$conn->close();
