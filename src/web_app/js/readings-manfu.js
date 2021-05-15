$.ajax({
    url: "assets/php/get_readings.php",
    type: "get",
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    cache: "false",
    success: function (data) {
        data = JSON.parse(data);
        if (data[0]) {
            setTable(data[1]);
        }
        else {
            alert("01, Error fetching data");
        }
    },
    error: function (data) {
        alert("02, Error fetching data");
    }
});

function setTable(data, i) {
    var titl = 'All readings - Civil Protection of Grosseto';
    var fot = 'This information is copyright to MANFU ©';

    $('#spinner_table').remove();
    if ($.fn.dataTable.isDataTable('#table-0')) {
        $('#table-0').DataTable().destroy();
    }
    $('#table-0').html('');
    $('#table-0').DataTable({
        data: data,
        dom: 'fltiprB',
        buttons: [
            {
                extend: 'excel',
                charset: 'UTF-8',
                bom: true,
                title: titl,
                messageBottom: fot
            },],
        responsive: true,
        pagingType: 'full',
        columns: [
            { data: "timestamp", title: "Date" },
            { data: "sensore", title: "Node" },
            { data: "updateId", title: "UpdateId" },
            { data: "temperatura", title: "T [°C]" },
            { data: "umidita", title: "Hum. [%]" },
            { data: "co2", title: "CO2 [ppm]" },
            { data: "tvoc", title: "tVOC [ppb]" },
            { data: "fire_index", title: "F.I." },
        ]
    });

}