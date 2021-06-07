<?php
include "conn_lib.php";
if (
    !isset($_SESSION['user']) || !isset($_SESSION['user_type']) ||
    strlen($_SESSION['user']) < 3 || strlen($_SESSION['user_type']) < 3
)
    header("location: error_401.html");
if ($_SESSION['user_type'] != 'amministratore')
    header("location: error_401.html");

$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$cf = $_POST['cf'];
$phone = $_POST['phone'];
$user_type = $_POST['user_type'];
$pw = $_POST['pw'];

$salted_hash = hash('sha512', $email . $pw . $email);
//Check if user exists or not 
if (array_key_exists('user_id', $_POST)) {
    $user_id = $_POST['user_id'];
    //Update
    $sql = "UPDATE utenti SET
nome = '$first_name', cognome = '$last_name', cf = '$cf',
telefono = '$phone', email = '$email', pw = '$salted_hash',ruolo = ";
    $sql .= $user_type == 'Utente' ? 'DEFAULT(ruolo)' :  "'$user_type'";
    $sql .= "WHERE utenteId = $user_id;";
} else {
    //Insert New
    $sql = "INSERT INTO utenti (nome, cognome, cf, telefono, email, ruolo, pw)
    VALUE ('$first_name', '$last_name', '$cf', '$phone', '$email', '$salted_hash'";
    $sql .= $user_type == 'Utente' ? 'DEFAULT(ruolo)' :  "'$user_type'";
    $sql .= ");";
}

if ($conn->query($sql) === TRUE)
    echo json_encode([true, $sql]);

else
    echo json_encode([false, $sql, $conn->error]);
