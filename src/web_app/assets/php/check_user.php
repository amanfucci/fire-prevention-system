<?php
include "conn_lib.php";
$email = strtolower($_POST['email']);
$pw = $_POST['pw'];


$salted_hash = hash('sha512', $email . $pw . $email);
$sql = "SELECT ruolo FROM utenti WHERE email like '$email' and pw like '$salted_hash'";
$result = $conn->query($sql);

if (!empty($result) && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row['ruolo'] === null)
        $row['ruolo'] = 'utente';

    $_SESSION['user_type'] = $row['ruolo'];
    $_SESSION['user'] = $email;
    echo json_encode([true,$row['ruolo']]);
} else {
    echo json_encode([false]);
    if (isset($_SESSION['user_type']))
        unset($_SESSION['user_type']);
    if (isset($_SESSION['user']))
        unset($_SESSION['user']);
}


$conn->close();
