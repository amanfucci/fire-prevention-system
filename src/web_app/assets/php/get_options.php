<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: ../../error_401.html");
if (isset($_SESSION['user_type']) != 'amministratore')
    header("location: ../../error_401.html");

$sql = "SELECT valore, descrizione, @@global.event_scheduler as auto_snapshot from opzioni";


$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    foreach ($row as $key => $value) {
        $row[$key] = ctype_digit($value) ? intval($value) : $value;
    }
    echo json_encode([true, $row]);
} else {
    echo json_encode([false]);
}

$conn->close();
