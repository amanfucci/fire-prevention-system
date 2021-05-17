<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: error_401.html");
if ($_SESSION['user_type'] != 'amministratore')
    header("location: error_401.html");

$first_name = $_POST['first_name'];
$last_name = $_POST['last_name'];
$email = $_POST['email'];
$cf = $_POST['cf'];
$phone = $_POST['phone'];
$user_type = $_POST['user_type'];
if (array_key_exists('user_id', $_POST)) {
    $user_id = $_POST['user_id'];
    $sql = "UPDATE utenti SET
nome = '$first_name', cognome = '$last_name', cf = '$cf',
telefono = '$phone', email = '$email', ruolo = ";
$sql .= $user_type =='Utente' ? 'DEFAULT(ruolo)' :  "'$user_type'";
$sql .= "WHERE utenteId = $user_id;";
} else {
    
    $sql = "INSERT INTO utenti (nome, cognome, cf, telefono, email, ruolo)
    VALUE ('$first_name', '$last_name', '$cf', '$phone', '$email',";
    $sql .= $user_type =='Utente' ? 'DEFAULT(ruolo)' :  "'$user_type'";
    $sql .=");";
}

if ($conn->query($sql) === TRUE)
    echo json_encode([true, $sql]);

else
    echo json_encode([false, $sql, $conn->error]);
