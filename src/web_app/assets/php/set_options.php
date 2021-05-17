<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: ../../error_401.html");
if (isset($_SESSION['user_type']) != 'amministratore')
    header("location: ../../error_401.html");

$sn = $_POST['sn'];
$auto = $_POST['auto'];
$sql = [
    "CALL set_snapshot_interval($sn);",
    "SET GLOBAL event_scheduler = $auto;"

];

$all_good = true;
foreach ($sql as $s) {
    if (!($conn->query($s) === TRUE)) {
        $all_good = false;
        break;
    }
}

echo json_encode([$all_good]);
$conn->close();
