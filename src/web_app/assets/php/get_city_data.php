<?php
include "conn_lib.php";

$start = $_POST['start'];
$end = $_POST['end'];
$city = $_POST['city'];

$sql = "SELECT DataRequested, MSLP, DewPoint, TMax, TAVG, TMin,
Humidity, MaxWind, AVGWind, sunny, snow, fog, rain, storm, hail
from weather where CityId = $city and DataRequested
between '$start' and '$end' and MSLP > 0 order by dataRequested asc;";

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