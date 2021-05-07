<?php
include "conn_lib.php";

$city = $_POST['city'];

$sql = "SELECT Mese, TAVG, TMin, TMax, ChanceP, CityID  from forecast where CityID = $city order by mese asc;";
$month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
$data = [];

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()){
		foreach($row as $key=> $value){
			$row[$key] = is_numeric($value) ? intval($value) : $value;
			if ($key == "Mese"){
				$row[$key] = $month[$row[$key]-1];
			}

		}
		array_push($data,$row);
	}

}
echo json_encode($data);
$conn->close();
?>