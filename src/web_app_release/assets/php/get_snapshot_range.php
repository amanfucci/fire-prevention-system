<?php
include "conn_lib.php";

$sql = "SELECT min(timestamp) as min, max(timestamp) as max from snapshot;";
$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
  $row = $result->fetch_assoc();
  //$row['min'] = substr($row['min'])
  echo json_encode($row);
} else {
  echo json_encode([]);
}

$conn->close();
