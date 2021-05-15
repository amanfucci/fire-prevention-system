<?php
include "conn_lib.php";

$snapshot = $_POST['snapshot'];

$sql = "SELECT * from snapshot;";

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
