<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: ../../error_401.html");
if ($_SESSION['user_type'] != 'tecnico')
    header("location: error_401.html");

$request = $_POST['request'];
$descr = $_POST['descr'];
$solved = $_POST['solved'];

$sql = "INSERT INTO interventi (descrizione, risolutivo, tecnico, richiesta) VALUE
('$descr', $solved,(SELECT utenteId from utenti where email like '" . $_SESSION['user'] . "'), $request)";
if ($conn->query($sql) === TRUE) {
    echo json_encode([true]);
} else {
    echo json_encode([false]);
}
?>