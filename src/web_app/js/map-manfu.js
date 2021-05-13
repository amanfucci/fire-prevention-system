(function ($) {

    $.ajaxSetup({ cache: false });

    var snapshot_data = {};

    function set_map(data) {
        col = [[100, 168, 142], [244, 161, 0], [247, 100, 0], [232, 21, 0], [227, 0, 89], [105, 0, 99]];
        const deckgl = new deck.DeckGL({
            container: 'app',
            mapStyle: deck.carto.BASEMAP.POSITRON,
            mapboxApiAccessToken: 'pk.eyJ1IjoibWFuZnUiLCJhIjoiY2tvazlxcmF0MDI0bzJ2cWxuOGV5dWU3dSJ9.AW6J2eFyh_79OQ6jl7LqFA',
            initialViewState: {
                latitude: 42.730058,
                longitude: 10.974754,
                zoom: 14,
                minZoom: 14,
                maxZoom: 17,
                pitch: 40.5,
                bearing: 15
            },
            controller: true,
            pickable: true,
            layers: [
                new deck.HeatmapLayer({
                    id: 'heat-map',
                    data: data,
                    opacity: 0.3,
                    getPosition: d => [parseFloat(d.lat), parseFloat(d.lng)],
                    getWeight: d => 1.9 ** d.fire_index,
                    maxWeight: 1.9 ** 5,
                    threshold: 0.02,
                    radiusPixels: 40,
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
                    radiusMinPixels: 40,
                    radiusMaxPixels: 40,
                    getPosition: d => [parseFloat(d.lat), parseFloat(d.lng)],
                    getRadius: d => 30,

                })
            ],
            getTooltip: function (d) {
                o = d.object;
                console.log(d);
                return o && {
                    html: `<div class="card bg-light">
                    <div class="card-header text-center text-primary"><b>${o.arduinoId}_${o.dataId}</b></div>
                    <div class="card-body">
                    <br>
                    <p><b>Lat:</b> ${o.lat} N</p>
                    <p><b>Lng:</b> ${o.lng} E</p>
                    <p><b>Fire Index:</b> ${o.fire_index} / 5</p>
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

    function get_snapshot_data(snapshot) {
        $.ajax({
            url: "assets/php/get_snapshot_data.php",
            type: "post",
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: "snapshot='" + snapshot + "'"

        }).done(function (data) {
            //On request received
            data = JSON.parse(data);
            //console.log(data);
            snapshot_data[snapshot] = data;
            set_map(data);
        }).fail(function (data) {
            alert("01, Error fetching snapshot data");
        });

    }
    get_snapshot_data('2021-05-12 00:10:00');

})(jQuery);