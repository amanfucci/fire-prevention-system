<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: error_401.html");
if ($_SESSION['user'] != 'amministratore')
    header("location: error_401.html");

$user = $_POST['user'];
$sql = "SELECT * FROM utenti WHERE email like '$user'";
$result = $conn->query($sql);

if (!empty($result) && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row['ruolo'] === null)
        $row['ruolo'] = 'Utente';
    else
        $row['ruolo'] = ucfirst($row['ruolo']);
    echo json_encode([true, $row]);
} else {
    echo json_encode([false, $row]);
}
?>