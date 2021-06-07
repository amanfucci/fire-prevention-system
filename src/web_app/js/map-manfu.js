/*
        * MANFU - FPS
        * Copyright 2021 MANFU
        * Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
        */
col = [[0, 172, 105], [0, 172, 105], [244, 161, 0], [247, 100, 0], [232, 21, 0], [227, 0, 89], [105, 0, 99]];
var my_map = undefined;
var min, max, sel, ind, snapshots;
$.ajaxSetup({ cache: false });
set_map([]);
//Get range
$.ajax({
    url: "assets/php/get_snapshot_range.php",
    type: "get"
}).done(function (data) {
    //On request received
    data = JSON.parse(data);
    //console.log(data);
    min = moment(new Date(data['min'])).startOf('hour');
    max = sel = moment(new Date(data['max'])).startOf('hour');

    if (moment($.cookie('selected_fps'), "yyyy-MM-DD HH:mm:ss").isValid())
        sel = moment($.cookie('selected_fps'), "yyyy-MM-DD HH:mm:ss");

    $('#date_picker').daterangepicker({
        opens: 'right',
        autoApply: true,
        minDate: min,
        maxDate: max,
        startDate: sel,
        linkedCalendars: false,
        alwaysShowCalendars: true,
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 60,
        drops: 'down',
        parentEl: '#date_picker'
    }, (s, e) => {
        sel = s;
        //console.log("Date picked: " + sel.format("yyyy-MM-DD HH:mm:ss"));
        $.cookie('selected_fps', sel.startOf('hour').format("yyyy-MM-DD HH:mm:ss"), { path: '/' });
        get_snapshots(sel);
        $('#date_picker span').html(sel.format('yyyy-MM-DD HH:mm'));
    });
    $('#date_picker span').html(sel.format('yyyy-MM-DD HH:mm'));
    get_snapshots(sel);
}).fail(function (data) {
    alert("01, Error fetching range");
});

$("#fw_snapshot").click(function () {
    if (ind + 1 < snapshots.length && ind + 1 >= 0) {
        ind++;
        get_snapshot_data(snapshots[ind]['timestamp']);
    }
});

$("#bw_snapshot").click(function () {
    if (ind - 1 < snapshots.length && ind - 1 >= 0) {
        ind--;
        get_snapshot_data(snapshots[ind]['timestamp']);
    }
});

$("#snap_btn_collapse").click(function () {
    $("#snap_collapse").collapse('toggle');
});

$("#sens_btn_collapse").click(function () {
    $("#sens_collapse").collapse('toggle');
});

$(window).on('resize', function () {

    if (innerWidth < 992) {
        $(".collapse").collapse('hide');
    }
    if (innerWidth >= 992) {
        $("#snap_collapse").collapse('show');
    }
});

$(window).on('load', function () {
    if (innerWidth < 992) {
        $(".collapse").collapse('hide');
    }
});

//----
function get_snapshots(s) {
    //Get snapshots within range
    //console.log(s.format("yyyy-MM-DD HH:mm:ss"));
    $.ajax({
        url: "assets/php/get_snapshot.php",
        type: "post",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        data: "&date='" + s.format("yyyy-MM-DD HH:mm:ss") + "'"

    }).done(function (data) {
        //On request received
        snapshots = JSON.parse(data);
        //console.log(snapshots);
        if (snapshots.length > 0) {
            ind = 0;
            get_snapshot_data(snapshots[ind]['timestamp']);
            $('#date_picker').tooltip('hide');
        }
        else {
            $('#date_picker').tooltip('show');
        }
    }).fail(function (data) {
        alert("02, Error fetching snapshots in range");
    });
}

function set_map(data) {
    //console.log(data);
    my_layers = [
        new deck.HeatmapLayer({
            id: 'heat-map',
            data: data,
            opacity: 0.3,
            intensity: 1,
            getPosition: d => [parseFloat(d.lat), parseFloat(d.lng)],
            getWeight: d => d.fire_index+1,
            radiusPixels: 30,
            colorDomain: [0.01, 6],
            colorRange: col,
            aggregation: 'MEAN'
        }),
        new deck.ScatterplotLayer({
            id: 'scatterplot-layer',
            data: data,
            pickable: true,
            opacity: 0,
            filled: true,
            radiusScale: 1,
            radiusMinPixels: 30,
            radiusMaxPixels: 30,
            getPosition: d => [parseFloat(d.lat), parseFloat(d.lng)],
            getRadius: d => 30,
            onClick: (info, event) => {
                o = info.object;
                temp = "" + o.arduinoId;
                $('#sens-panel-header').html(temp);
                temp = "<p><b>Data Id: </b>" + o.dataId + "</p>";
                temp += "<p><b>Lat: </b>" + o.lat + " N</p>";
                temp += "<p><b>Lng: </b>" + o.lng + " E</p>";
                temp += "<p><b>Fire Index: </b>" + o.fire_index + "/5</p>";
                temp += "<p><b>Temperatura: </b>" + o.temperatura + " °C</p>";
                temp += "<p><b>Umidità: </b>" + o.umidita + " %</p>";
                temp += "<p><b>CO2: </b>" + o.co2 + " ppm</p>";
                temp += "<p><b>tVOC: </b>" + o.tvoc + " ppb</p>";
                $('#sens-panel-body').html(temp);
                temp = o.timestamp;
                $('#sens-panel-footer').html(temp);
            }

        })
    ];
    if (my_map === undefined) {
        my_map = new deck.DeckGL({
            container: 'app',
            mapStyle: deck.carto.BASEMAP.POSITRON,
            mapboxApiAccessToken: 'pk.eyJ1IjoibWFuZnUiLCJhIjoiY2twbXMzM2JuMGw4MjJwcXFrN241Mmg1eCJ9.X35rBCowC_t9qiGQonSlkQ',
            initialViewState: {
                latitude: 42.72437670342,
                longitude: 10.98787813097,
                zoom: 14,
                minZoom: 14,
                maxZoom: 17,
                pitch: 40.5,
                bearing: 15
            },
            controller: true,
            pickable: true,
            layers: my_layers,
            getTooltip: function (d) {
                o = d.object;
                if ($('#check_window').css('display') == 'block')
                    return o && {
                        html: `<div class="card">
                    <div class="card-header text-center">${o.arduinoId}</div>
                    <div class="card-body">
                    <p><b>Data Id:</b> ${o.dataId} N</p>
                    <p><b>Lat:</b> ${o.lat} N</p>
                    <p><b>Lng:</b> ${o.lng} E</p>
                    <p><b>Fire Index:</b> ${o.fire_index}/5</p>
                    <p><b>Temperatura:</b> ${o.temperatura} °C</p>
                    <p><b>Umidità:</b> ${o.umidita} %</p>
                    <p><b>CO2:</b> ${o.co2} ppm</p>
                    <p><b>tVOC:</b> ${o.tvoc} ppb</p>
                    </div>
                    <div class="card-footer text-center">${o.timestamp}</div>`

                        ,
                        className: "bg-transparent",
                        style: {
                            "line-height": "8px"
                        }
                    };
            }
        });
    }
    else {
        my_map.setProps({
            layers: my_layers
        });
    }
}

function set_panel(snapshot, data, err) {

    if (!err) {
        avg_fire_index = data.reduce((x, y) => x + y.fire_index, 0) / data.length;
        avg_fire_index = avg_fire_index.toFixed(1);
        $("#app-panel-header").html("" + snapshot);
        panel_body = "<p><b>Nodes: </b>" + data.length + "</p>";
        panel_body += "<p><b>Max. Fire Index: </b>" + data.reduce((x, y) => y.fire_index > x ? x = y.fire_index : x, 0) + "/5 </p>";
        panel_body += "<p><b>Avg. Fire Index: </b>" + avg_fire_index + "/5 </p>";
        panel_body += '<div class="progress rounded-0"><div class="progress-bar" role="progressbar" style="width: 0%; height:5px" id="avg-fi-bar"></div></div>';
        $("#app-panel-body").html(panel_body);
        $("#avg-fi-bar").css("width", (avg_fire_index * 100 / 5) + "%");
        my_col = col[Math.round(avg_fire_index)];
        $("#avg-fi-bar").css("background-color", "rgb(" + my_col[0] + "," + my_col[1] + "," + my_col[2] + ")");
    }

}

function get_snapshot_data(snapshot) {
    temp = "Select a Node";
    $('#sens-panel-header').html(temp);
    temp = "<p><b>Data Id: </b></p>"
    temp += "<p><b>Lat: </b> N</p>"
    temp += "<p><b>Lng: </b> E</p>"
    temp += "<p><b>Fire Index: </b>/5</p>"
    temp += "<p><b>Temperatura: </b> °C</p>"
    temp += "<p><b>Umidità: </b> %</p>"
    temp += "<p><b>CO2: </b> ppm</p>"
    temp += "<p><b>tVOC: </b> ppb</p>"
    $('#sens-panel-body').html(temp);
    temp = "0000-00-00 00:00:00";
    $('#sens-panel-footer').html(temp);
    $.ajax({
        url: "assets/php/get_snapshot_data.php",
        type: "post",
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        data: "&snapshot='" + snapshot + "'"

    }).done(function (data) {
        //On request received
        data = JSON.parse(data);
        //console.log("done: " + data.length);
        set_panel(snapshot, data, false);
        set_map(data);
    }).fail(function (data) {
        alert("03, Error fetching snapshot data");
    });
}
