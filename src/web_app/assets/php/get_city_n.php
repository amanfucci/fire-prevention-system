<?php
include "conn_lib.php";

$sql2 = "SELECT count(CityId) as city_n from city;";
$sql = "SELECT * from city;";


$result = $conn->query($sql);
$result2 = $conn->query($sql2);
if (!empty($result2) && $result2->num_rows > 0) {
	$row = $result2->fetch_assoc();
	echo json_encode("!".$row["city_n"]."|");
}
else{
	echo json_encode("!"."1");
}
if (!empty($result) && $result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		echo json_encode($row["CityId"].";".$row["Name"]."|");
	}
} else {
	echo json_encode(";0;NO DATA|");
}
// ! start of string
// ; data separator
// | end of object

$conn->close();
