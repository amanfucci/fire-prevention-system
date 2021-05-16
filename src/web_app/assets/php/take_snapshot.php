<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: ../../error_401.html");

$title = $_POST['title'];
$descr = $_POST['descr'];

$sql = "CALL take_snapshot(CURRENT_TIMESTAMP(), '$title', '$descr')";

if ($conn->query($sql) === TRUE) {
    echo json_encode([true]);
} else {
    echo json_encode([false]);
}


$conn->close();
