<?php
include "conn_lib.php";
if (
    !isset($_SESSION['user']) || !isset($_SESSION['user_type']) ||
    strlen($_SESSION['user']) < 3 || strlen($_SESSION['user_type']) < 3
)
    header("location: error_401.html");
if ($_SESSION['user_type'] != 'tecnico')
    header("location: error_401.html");

$sql = "SELECT DISTINCT r.timestamp, r.urgenza, nome, cognome, r.richiestaId FROM richieste as r
inner join utenti on supervisore = utenteId
left join interventi as i on i.richiesta = r.richiestaId
where r.tecnico = (select utenteId from utenti where email like '" . $_SESSION['user'] . "')
and (risolutivo != 1 or risolutivo is null)
order by r.timestamp desc";

$data = [];

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        foreach ($row as $key => $value) {
            $row[$key] = ctype_digit($value) ? intval($value) : $value;
        }
        array_push($data, $row);
    }
    echo json_encode([true, $data]);
} else {
    echo json_encode([false]);
}

$conn->close();

$conn->close();
