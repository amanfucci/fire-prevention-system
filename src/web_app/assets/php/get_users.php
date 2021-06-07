<?php
include "conn_lib.php";
if (
    !isset($_SESSION['user']) || !isset($_SESSION['user_type']) ||
    strlen($_SESSION['user']) < 3 || strlen($_SESSION['user_type']) < 3
)
    header("location: error_401.html");
if ($_SESSION['user_type'] != 'amministratore')
    header("location: error_401.html");

$sql = "SELECT * FROM utenti";
$result = $conn->query($sql);
$data = [];

if (!empty($result) && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($row['ruolo'] === null)
            $row['ruolo'] = 'Utente';
        else
            $row['ruolo'] = ucfirst($row['ruolo']);

        array_push($data, $row);
    }
    echo json_encode([true, $data]);
} else {
    echo json_encode([false]);
}
