<?php
include "conn_lib.php";

$date = $_POST['selected'];

$sql = "SELECT w.CityId as id, c.Name as name, TMin as tmin, TAVG as tavg, TMax as tmax,
sunny, snow, fog, rain, storm, hail from weather as w 
inner join city as c on c.CityId = w.CityId
where DataRequested like '$date';";

$result = $conn->query($sql);
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		echo json_encode("!".$row["id"] . ";" . $row["name"] . ";" . $row["tmin"] . ";"
		. $row["tavg"] . ";". $row["tmax"]. ";"  . $row["sunny"] . ";" . $row["snow"] . ";" . $row["fog"] .
		";" . $row["rain"] . ";" . $row["storm"] . ";" . $row["hail"] .
	 "|");
	}
} else {
	echo "!0;NO DATA;N/D;N/D;N/D|";
}

$conn->close();
