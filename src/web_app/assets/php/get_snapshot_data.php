<?php
include "conn_lib.php";

$snapshot = $_POST['snapshot'];

$sql = "SELECT s.lat, s.lng, m.fire_index
FROM misurazioni as m
INNER JOIN sensori as s on m.sensore = s. arduinoId
INNER JOIN snapshot_misurazioni as snm on m.dataId = snm.misurazione
WHERE snm.snapshot = $snapshot;";

$data = [];

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()){
		foreach($row as $key=> $value){
			$row[$key] = ctype_digit($value) ? intval($value) : $value;
		}
		array_push($data,$row);
	}

}
echo json_encode($data);
$conn->close();

$conn->close();
?>