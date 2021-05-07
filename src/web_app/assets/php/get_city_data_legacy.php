<?php
include "conn_lib.php";

$start = $_POST['start'];
$end = $_POST['end'];
$city = $_POST['city'];

$sql = "SELECT * from weather as w 
inner join city as c on c.CityId = w.CityId where
w.CityId = $city and DataRequested
between '$start' and '$end' and MSLP > 0 order by dataRequested asc;";

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		echo json_encode("!".$row["DataRequested"] .
		";" . $row["MSLP"] . ";" . $row["DewPoint"] .
		";" . $row["TMin"] . ";". $row["TAVG"]. ";"  . $row["TMax"] .
		";" . $row["Humidity"] . ";" . $row["Visibility"] .
		";" . $row["AVGWind"] . ";" . $row["MaxWind"] .
		";" . $row["hail"] .";" .$row["sunny"] . ";" .$row["snow"].
		";" . $row["fog"] . ";" .$row["rain"] .
		";" .$row["storm"] ."|");
	}
} else {
	echo "!N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D;N/D|";
}

$conn->close();
?>