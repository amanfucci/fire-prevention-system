(function ($) {

    $.ajaxSetup({ cache: false });

    var snapshot_data = {};

    function set_map(data) {
        col = [[100,168,142], [244,161,0], [247,100,0], [232,21,0], [227,0,89], [105,0,99]];
        const deckgl = new deck.DeckGL({
            container: 'app',
            mapStyle: deck.carto.BASEMAP.POSITRON,
            mapboxApiAccessToken: 'pk.eyJ1IjoibWFuZnUiLCJhIjoiY2tvazlxcmF0MDI0bzJ2cWxuOGV5dWU3dSJ9.AW6J2eFyh_79OQ6jl7LqFA',
            initialViewState: {
                latitude: 42.730058,
                longitude: 10.974754,
                zoom: 14,
                minZoom: 14,
                maxZoom: 15,
                pitch: 40.5,
                bearing: 15
            },
            controller: true,
            pickable: true,
            layers: [
                new deck.HeatmapLayer({
                    id: 'heat-map',
                    data: data,
                    opacity: 0,
                    getPosition: d => [parseFloat(d.lat), parseFloat(d.lng)],
                    getWeight: d => d.fire_index,
                    colorDomain: [0.02, 1000],
                    radiusPixels: 60,
                    colorRange: col,
                    aggregation: 'MEAN'
                }),
                new deck.ScatterplotLayer({
                    id: 'scatterplot-layer',
                    data: data,
                    pickable: true,
                    opacity: 0.3,
                    stroked: true,
                    filled: true,
                    radiusScale: 1,
                    radiusMinPixels: 1,
                    radiusMaxPixels: 100,
                    getPosition: d => [parseFloat(d.lat), parseFloat(d.lng)],
                    getRadius: d => 30,
                    getFillColor: d => col[d.fire_index],
                    getLineColor: d => col[d.fire_index]
                  })]
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
            console.log(data);
            snapshot_data[snapshot] = data;
            set_map(data);
        }).fail(function (data) {
            alert("01, Error fetching snapshot data");
        });

    }
    get_snapshot_data('2021-05-12 00:10:00');

})(jQuery);