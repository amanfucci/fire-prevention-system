/*
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/
$.ajax({
    url: "assets/php/get_nodes.php",
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
            { data: "arduinoId", title: "Id" },
            { data: "data_inst", title: "Deployed" },
            { data: "data_rim", title: "Retired" },
            { data: "lat", title: "Lat." },
            { data: "lng", title: "Lng." },
        ]
    });

}