<?php
include "conn_lib.php";
if (!isset($_SESSION['user']) || !isset($_SESSION['user_type']))
    header("location: ../../error_401.html");
if ($_SESSION['user_type'] == 'utente' || $_SESSION['user_type'] == 'tecnico')
    header("location: error_401.html");
$reason = $_POST['reason'];
$priority = $_POST['priority'];
$node = $_POST['node'];
$supervisoreId;
$tecId;

//Get supervisor Id
$sql = "SELECT utenteId from utenti where email like '" . $_SESSION['user'] . "'";
$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $supervisoreId = $row['utenteId'];

    //Get technician Id (Based on number of )
    $sql = "SELECT t.utenteId, min(t.n_richieste) from (SELECT utenteId, count(tecnico) as n_richieste from utenti left join richieste on tecnico = utenteId where ruolo like 'tecnico' AND ((richieste.timestamp BETWEEN (SELECT DATE_SUB(CURRENT_DATE(), INTERVAL DAY(CURRENT_DATE())-1 DAY)) AND (SELECT DATE_ADD((SELECT DATE_SUB(CURRENT_DATE(), INTERVAL DAY(CURRENT_DATE())-1 DAY)), INTERVAL 1 MONTH))) OR richieste.timestamp IS NULL) group by tecnico ) as t LIMIT 1";
    $result = $conn->query($sql);

    if (!empty($result) && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $tecId = $row['utenteId'];

        //Insert new request
        $sql = "INSERT INTO richieste (motivazione, urgenza, sensore, supervisore, tecnico) VALUE
        ('$reason', '$priority', $node, $supervisoreId, $tecId);";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode([true, $sql]);
        } else {
            echo json_encode([false, $sql, $conn->error]);
        }

    } else {
        echo json_encode([false, $sql, $conn->error]);
    }
} else {
    echo json_encode([false, $sql, $conn->error]);
}
$conn->close();