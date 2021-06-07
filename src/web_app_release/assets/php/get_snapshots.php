<?php
include "conn_lib.php";
if (
	!isset($_SESSION['user']) || !isset($_SESSION['user_type']) ||
	strlen($_SESSION['user']) < 3 || strlen($_SESSION['user_type']) < 3
)
	header("location: ../../error_401.html");
$snapshot = $_POST['snapshot'];

$sql = "SELECT * from snapshot order by timestamp desc;";

$data = [];

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		foreach ($row as $key => $value) {
			$row[$key] = is_null($value) || $value == 'NULL' ? 'Auto' : $value;
		}
		array_push($data, $row);
	}
	echo json_encode([true, $data]);
} else {
	echo json_encode([false]);
}

$conn->close();
