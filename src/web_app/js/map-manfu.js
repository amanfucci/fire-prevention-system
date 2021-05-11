(function ($) {

    $.ajaxSetup({ cache: false });

    var snapshot_data = {};

    function set_map(data) {
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
            layers: [
                new deck.HeatmapLayer({
                    id: 'heat-map',
                    data: data,
                    opacity: 0.3,
                    getPosition: obj => [parseFloat(obj.lng), parseFloat(obj.lat)],
                    getWeight: obj => 1.9**obj.fire_index,
                    maxWeight: 1.9**5,
                    radiusPixels: 80,
                    threshold: 0.02,
                    colorRange: [[100,168,142], [244,161,0], [247,100,0], [232,21,0], [105,0,99]],
                                
                    aggregation: 'MEAN'
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
    get_snapshot_data('2021-05-11 20:08:37');

})(jQuery);