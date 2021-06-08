<?php
include "conn_lib.php";

$date = $_POST['date'];

$sql = "SELECT timestamp from snapshot
where timestamp between '$date' and TIMESTAMPADD(HOUR,1,'$date');";

$data = [];

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()){
		array_push($data,$row);
	}
}
echo json_encode($data);

$conn->close();
?>